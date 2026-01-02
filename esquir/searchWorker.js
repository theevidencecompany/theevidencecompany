const DB_NAME = "sqg-search-cache";
const STORE_NAME = "indexes";
const DB_VERSION = 2;
const CACHE_VERSION = "v4";
const LATEST_KEY = `combined|${CACHE_VERSION}|latest`;
const PREBUILT_META_URL = "./search_index.meta.json";
const PREBUILT_SINGLE_URL = "./search_index.json";
const MAX_SINGLE_PREBUILT = 200 * 1024 * 1024;

const PREFERRED_KEYS = [
  "preferred_term",
  "preferredTerm",
  "pref_term",
  "descriptor_name",
  "descriptorName",
  "preferred_label",
  "prefLabel",
  "heading",
  "label",
  "term",
  "name",
];

const SYNONYM_KEYS = [
  "synonyms",
  "entry_terms",
  "entryTerms",
  "entry_term",
  "entryTerm",
  "aliases",
  "synonym",
  "syns",
];

const ID_KEYS = [
  "id",
  "identifier",
  "ui",
  "concept_id",
  "conceptId",
  "descriptor_id",
  "mesh_id",
  "mesh_ui",
  "emtree_id",
];

const MESH_MAPPING_KEYS = [
  "mesh_mappings",
  "meshMappings",
  "mesh_mapping",
  "meshMapping",
  "mesh_terms",
  "meshTerms",
  "mesh_term",
  "meshTerm",
  "mesh_headings",
  "meshHeadings",
  "mesh_heading",
  "meshHeading",
  "mesh_ids",
  "meshIds",
  "mesh_id",
  "meshId",
];

const EMTREE_MAPPING_KEYS = [
  "emtree_mappings",
  "emtreeMappings",
  "emtree_mapping",
  "emtreeMapping",
  "emtree_terms",
  "emtreeTerms",
  "emtree_term",
  "emtreeTerm",
  "emtree_ids",
  "emtreeIds",
  "emtree_id",
  "emtreeId",
];

const MAX_PREFIX = 12;
const MAX_BUCKET = 80;
const MAX_SUGGESTIONS = 8;

let nonWordRegex;
try {
  nonWordRegex = /[^\p{L}\p{N}\s]/gu;
} catch (err) {
  nonWordRegex = /[^a-z0-9\s]/g;
}

let indexReady = false;
let searchIndex = null;
let backgroundLoadPromise = null;
const pendingSuggests = [];

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "init") {
    initIndex();
  }
  if (data.type === "suggest") {
    if (!indexReady) {
      pendingSuggests.push(data);
      return;
    }
    handleSuggest(data);
  }
});

async function initIndex() {
  try {
    const cachedLatest = await getCachedIndex(LATEST_KEY);
    if (isValidCache(cachedLatest)) {
      searchIndex = hydrateIndex(cachedLatest);
      finalizeIndex(searchIndex);
      indexReady = true;
      postMessage({ type: "ready", stats: cachedLatest.stats || {}, cached: true });
      flushPending();
    }

    let prebuiltMeta = cachedLatest?.sourceMeta || null;
    if (!indexReady) {
      const prebuiltParts = await tryLoadPrebuiltParts();
      if (prebuiltParts) {
        searchIndex = prebuiltParts.index;
        finalizeIndex(searchIndex);
        indexReady = true;
        prebuiltMeta = prebuiltParts.meta.sourceMeta || null;
        postMessage({ type: "ready", stats: prebuiltParts.meta.stats || {}, cached: true, prebuilt: true });
        flushPending();
        if (prebuiltParts.partial) {
          scheduleBackgroundIndexLoad(prebuiltParts.meta, searchIndex);
        }
      }
    }

    if (!indexReady) {
      const prebuilt = await tryLoadPrebuiltSingle();
      if (isValidCache(prebuilt)) {
        searchIndex = hydrateIndex(prebuilt);
        finalizeIndex(searchIndex);
        indexReady = true;
        prebuiltMeta = prebuilt.sourceMeta || null;
        postMessage({ type: "ready", stats: prebuilt.stats || {}, cached: true, prebuilt: true });
        flushPending();
        setCachedIndex(LATEST_KEY, prebuilt);
      }
    }

    const metaOnly = indexReady && prebuiltMeta;
    postMessage({
      type: "status",
      phase: "fetching",
      message: "Fetching vocabularies",
      background: indexReady,
    });
    let [emtreeRes, meshRes] = await Promise.all([
      fetch("./emtree_merged.json", { cache: "no-cache", method: metaOnly ? "HEAD" : "GET" }),
      fetch("./MeSH_merged.json", { cache: "no-cache", method: metaOnly ? "HEAD" : "GET" }),
    ]);

    const cacheKey = buildCacheKey(emtreeRes, meshRes);
    if (cachedLatest && cachedLatest.cacheKey === cacheKey && indexReady) {
      return;
    }

    if (indexReady && prebuiltMeta && matchesMeta(prebuiltMeta.emtree, emtreeRes) && matchesMeta(prebuiltMeta.mesh, meshRes)) {
      return;
    }

    if (metaOnly) {
      postMessage({
        type: "status",
        phase: "fetching",
        message: "Fetching vocabularies",
        background: indexReady,
      });
      [emtreeRes, meshRes] = await Promise.all([
        fetch("./emtree_merged.json", { cache: "no-cache" }),
        fetch("./MeSH_merged.json", { cache: "no-cache" }),
      ]);
    }

    let cached = await getCachedIndex(cacheKey);
    if (cached && (!cached.terms || cached.terms.length < 100)) {
      cached = null;
    }
    if (cached) {
      searchIndex = hydrateIndex(cached);
      finalizeIndex(searchIndex);
      indexReady = true;
      postMessage({ type: "ready", stats: cached.stats || {}, cached: true });
      flushPending();
      return;
    }

    postMessage({
      type: "status",
      phase: "parsing",
      message: "Parsing vocabularies",
      background: indexReady,
    });
    const [emtreeData, meshData] = await Promise.all([emtreeRes.json(), meshRes.json()]);

    postMessage({
      type: "status",
      phase: "indexing",
      message: "Building search index",
      background: indexReady,
    });
    searchIndex = buildCombinedIndex([
      { source: "emtree", data: emtreeData },
      { source: "mesh", data: meshData },
    ]);
    finalizeIndex(searchIndex);

    const serialized = serializeIndex(searchIndex);
    serialized.cacheKey = cacheKey;
    serialized.sourceMeta = {
      emtree: extractMeta(emtreeRes),
      mesh: extractMeta(meshRes),
    };
    await setCachedIndex(cacheKey, serialized);
    await setCachedIndex(LATEST_KEY, serialized);

    if (!indexReady) {
      indexReady = true;
      postMessage({ type: "ready", stats: serialized.stats || {}, cached: false });
      flushPending();
    }
  } catch (error) {
    postMessage({ type: "error", message: error.message || "Failed to initialize search index." });
  }
}

function flushPending() {
  while (pendingSuggests.length) {
    handleSuggest(pendingSuggests.shift());
  }
}

function handleSuggest({ q, requestId, limit }) {
  const query = (q || "").trim();
  if (!query) {
    postMessage({
      type: "suggestions",
      requestId,
      q,
      sections: { bestMatches: [], didYouMean: [], acronyms: [], closeMatches: [] },
    });
    return;
  }

  const sections = getSuggestions(query, limit || MAX_SUGGESTIONS);
  postMessage({ type: "suggestions", requestId, q, sections });
}

function buildCacheKey(emtreeRes, meshRes) {
  const emTag = emtreeRes.headers.get("Last-Modified") || emtreeRes.headers.get("ETag") || emtreeRes.headers.get("Content-Length") || "emtree";
  const meshTag = meshRes.headers.get("Last-Modified") || meshRes.headers.get("ETag") || meshRes.headers.get("Content-Length") || "mesh";
  return `combined|${CACHE_VERSION}|${emTag}|${meshTag}`;
}

function extractMeta(response) {
  return {
    lastModified: response.headers.get("Last-Modified") || "",
    etag: response.headers.get("ETag") || "",
    size: response.headers.get("Content-Length") || "",
  };
}

function matchesMeta(meta, response) {
  if (!meta) return false;
  const lastModified = response.headers.get("Last-Modified") || "";
  const etag = response.headers.get("ETag") || "";
  const size = response.headers.get("Content-Length") || "";
  if (meta.etag && etag) {
    return meta.etag === etag;
  }
  if (meta.lastModified && lastModified) {
    return meta.lastModified === lastModified;
  }
  if (meta.size && size) {
    return meta.size === size;
  }
  return false;
}

function openCache() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCachedIndex(key) {
  const db = await openCache();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
}

async function setCachedIndex(key, value) {
  const db = await openCache();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

async function fetchJsonSafe(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function tryLoadPrebuiltParts() {
  const meta = await fetchJsonSafe(PREBUILT_META_URL, { cache: "force-cache" });
  if (!meta || !meta.parts) return null;

  postMessage({
    type: "status",
    phase: "prebuilt",
    message: "Loading prebuilt index",
    background: indexReady,
  });

  try {
    const index = await loadPrebuiltCore(meta);
    return { index, meta, partial: true };
  } catch (error) {
    return null;
  }
}

async function tryLoadPrebuiltSingle() {
  try {
    const head = await fetch(PREBUILT_SINGLE_URL, { method: "HEAD", cache: "force-cache" });
    if (!head.ok) return null;
    const size = Number(head.headers.get("Content-Length") || "0");
    if (size && size > MAX_SINGLE_PREBUILT) return null;
  } catch (error) {
    return null;
  }
  return fetchJsonSafe(PREBUILT_SINGLE_URL, { cache: "force-cache" });
}

async function loadPrebuiltParts(meta) {
  const parts = meta.parts || {};
  const index = {
    terms: [],
    normRecords: [],
    entryNorms: [],
    exact: new Map(),
    prefix: new Map(),
    wordPrefix: new Map(),
    acronym: new Map(),
    trigram: new Map(),
    firstLetterMap: new Map(),
  };

  await loadArrayParts(parts.terms, index.terms, "terms");
  await loadArrayParts(parts.normRecords, index.normRecords, "normRecords");
  await loadArrayParts(parts.entryNorms, index.entryNorms, "entryNorms");
  await loadMapParts(parts.exactEntries, index.exact, "exactEntries");
  await loadMapParts(parts.prefixEntries, index.prefix, "prefixEntries");
  await loadMapParts(parts.wordPrefixEntries, index.wordPrefix, "wordPrefixEntries");
  await loadMapParts(parts.acronymEntries, index.acronym, "acronymEntries");
  await loadMapParts(parts.trigramEntries, index.trigram, "trigramEntries");

  buildFirstLetterMap(index);
  return index;
}

async function loadPrebuiltCore(meta) {
  const parts = meta.parts || {};
  const index = {
    terms: [],
    normRecords: [],
    entryNorms: [],
    exact: new Map(),
    prefix: new Map(),
    wordPrefix: new Map(),
    acronym: new Map(),
    trigram: new Map(),
    firstLetterMap: new Map(),
  };

  await loadArrayParts(parts.terms, index.terms, "terms");
  await loadMapParts(parts.exactEntries, index.exact, "exactEntries");
  await loadMapParts(parts.prefixEntries, index.prefix, "prefixEntries");
  await loadMapParts(parts.acronymEntries, index.acronym, "acronymEntries");
  return index;
}

async function loadPrebuiltRemainder(meta, index) {
  const parts = meta.parts || {};
  await loadArrayParts(parts.normRecords, index.normRecords, "normRecords");
  await loadArrayParts(parts.entryNorms, index.entryNorms, "entryNorms");
  await loadMapParts(parts.wordPrefixEntries, index.wordPrefix, "wordPrefixEntries");
  await loadMapParts(parts.trigramEntries, index.trigram, "trigramEntries");
  buildFirstLetterMap(index);
}

function scheduleBackgroundIndexLoad(meta, index) {
  if (backgroundLoadPromise) return;
  backgroundLoadPromise = loadPrebuiltRemainder(meta, index)
    .then(() => {
      finalizeIndex(index);
      const serialized = serializeIndex(index);
      serialized.cacheKey = meta.cacheKey || LATEST_KEY;
      serialized.sourceMeta = meta.sourceMeta || null;
      setCachedIndex(serialized.cacheKey, serialized);
      setCachedIndex(LATEST_KEY, serialized);
    })
    .catch(() => {});
}

async function loadArrayParts(files, target, label) {
  if (!Array.isArray(files) || !files.length) return;
  let loaded = 0;
  const results = await Promise.all(
    files.map((file, idx) =>
      fetchJsonSafe(file, { cache: "force-cache" }).then((chunk) => {
        loaded += 1;
        postMessage({
          type: "status",
          phase: "prebuilt",
          message: `Loading ${label} (${loaded}/${files.length})`,
          background: indexReady,
        });
        return { idx, chunk };
      })
    )
  );
  results.sort((a, b) => a.idx - b.idx);
  results.forEach(({ chunk }) => {
    if (!Array.isArray(chunk)) {
      throw new Error(`Invalid prebuilt chunk for ${label}.`);
    }
    for (let j = 0; j < chunk.length; j += 1) {
      target.push(chunk[j]);
    }
  });
}

async function loadMapParts(files, target, label) {
  if (!Array.isArray(files) || !files.length) return;
  let loaded = 0;
  const results = await Promise.all(
    files.map((file, idx) =>
      fetchJsonSafe(file, { cache: "force-cache" }).then((chunk) => {
        loaded += 1;
        postMessage({
          type: "status",
          phase: "prebuilt",
          message: `Loading ${label} (${loaded}/${files.length})`,
          background: indexReady,
        });
        return { idx, chunk };
      })
    )
  );
  results.sort((a, b) => a.idx - b.idx);
  results.forEach(({ chunk }) => {
    if (!Array.isArray(chunk)) {
      throw new Error(`Invalid prebuilt chunk for ${label}.`);
    }
    chunk.forEach((entry) => {
      if (!Array.isArray(entry) || entry.length < 2) return;
      target.set(entry[0], entry[1]);
    });
  });
}

function isValidCache(cache) {
  return cache && Array.isArray(cache.terms) && cache.terms.length > 100;
}

function normalize(text) {
  if (!text) return "";
  const cleaned = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(nonWordRegex, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned;
}

function makeAcronym(text) {
  if (!text) return "";
  const cleaned = text.replace(nonWordRegex, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getTrigrams(text) {
  const compact = text.replace(/\s+/g, "");
  if (compact.length < 3) return [];
  const set = new Set();
  for (let i = 0; i < compact.length - 2; i += 1) {
    set.add(compact.slice(i, i + 3));
  }
  return Array.from(set);
}

function buildCombinedIndex(sources) {
  const index = {
    terms: [],
    normRecords: [],
    entryNorms: [],
    exact: new Map(),
    prefix: new Map(),
    wordPrefix: new Map(),
    acronym: new Map(),
    trigram: new Map(),
    firstLetterMap: new Map(),
  };

  sources.forEach(({ source, data }) => {
    const records = extractDictionaryRecords(data);
    const seen = new Set();
    records.forEach((record) => {
      const preferred = extractPreferred(record);
      if (!preferred) return;
      const preferredNorm = normalize(preferred);
      if (!preferredNorm) return;

      const dedupeKey = `${source}|${preferredNorm}`;
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);

      const conceptId = extractConceptId(record);
      const synonyms = dedupeSynonyms(preferredNorm, extractSynonyms(record));
      const normSynonyms = dedupeNormalizedSynonyms(synonyms);
      const acronyms = buildAcronymList(preferred, synonyms);
      const meshMappings = source === "emtree" ? extractMeshMappings(record) : [];
      const emtreeMappings = source === "mesh" ? extractEmtreeMappings(record) : [];

      const entryId = index.terms.length;
      index.terms.push({
        id: entryId,
        preferred,
        preferredNorm,
        normPreferred: preferredNorm,
        source,
        conceptId,
        synonyms,
        normSynonyms,
        acronyms,
        meshMappings,
        emtreeMappings,
      });

      index.entryNorms[entryId] = [];

      addNormRecord(index, entryId, preferredNorm, false, preferred);
      synonyms.forEach((synonym) => {
        addNormRecord(index, entryId, normalize(synonym), true, synonym);
      });
    });
  });

  buildFirstLetterMap(index);

  return index;
}

function addNormRecord(index, entryId, norm, isSyn, originalText) {
  if (!norm) return;
  const normIndex = index.normRecords.length;
  index.normRecords.push({ entryId, norm, isSyn });
  index.entryNorms[entryId].push(normIndex);

  const matchRef = { entryId, isSyn };
  addMatch(index.exact, norm, matchRef);
  addPrefixes(index.prefix, norm, matchRef);
  addWordPrefixes(index.wordPrefix, norm, matchRef);

  const acronym = makeAcronym(originalText || norm);
  if (acronym) {
    addMatch(index.acronym, acronym, matchRef);
  }

  if (norm.length >= 5) {
    const trigrams = getTrigrams(norm);
    trigrams.forEach((tri) => {
      const bucket = index.trigram.get(tri) || [];
      if (!bucket.includes(entryId)) {
        bucket.push(entryId);
        index.trigram.set(tri, bucket);
      }
    });
  }
}

function addMatch(map, key, match) {
  if (!key) return;
  const bucket = map.get(key) || [];
  if (bucket.length >= MAX_BUCKET) return;
  if (!bucket.some((item) => item.entryId === match.entryId && item.isSyn === match.isSyn)) {
    bucket.push(match);
  }
  map.set(key, bucket);
}

function addPrefixes(map, norm, match) {
  const max = Math.min(MAX_PREFIX, norm.length);
  for (let i = 1; i <= max; i += 1) {
    addMatch(map, norm.slice(0, i), match);
  }
}

function addWordPrefixes(map, norm, match) {
  const words = norm.split(" ").filter(Boolean);
  words.forEach((word) => {
    const max = Math.min(MAX_PREFIX, word.length);
    for (let i = 1; i <= max; i += 1) {
      addMatch(map, word.slice(0, i), match);
    }
  });
}

function buildFirstLetterMap(index) {
  index.normRecords.forEach((record, idx) => {
    const first = record.norm[0];
    if (!first) return;
    const bucket = index.firstLetterMap.get(first) || [];
    bucket.push(idx);
    index.firstLetterMap.set(first, bucket);
  });
}

function extractDictionaryRecords(data) {
  if (!data || typeof data !== "object") return [];

  const dictionaryKeys = ["dictionary", "terms", "records", "entries", "concepts", "descriptors"];
  for (const key of dictionaryKeys) {
    const value = data[key];
    if (Array.isArray(value)) {
      return value;
    }
    if (value && typeof value === "object") {
      const asArray = asRecordArray(value);
      if (asArray) {
        return asArray;
      }
      const nested = dictionaryKeys
        .map((nestedKey) => value[nestedKey])
        .find((candidate) => Array.isArray(candidate));
      if (nested) {
        return nested;
      }
      const nestedObject = dictionaryKeys
        .map((nestedKey) => value[nestedKey])
        .find((candidate) => candidate && typeof candidate === "object");
      if (nestedObject) {
        const nestedArray = asRecordArray(nestedObject);
        if (nestedArray) {
          return nestedArray;
        }
      }
    }
  }

  const queue = [{ value: data, depth: 0 }];
  let best = { score: 0, arr: [] };

  while (queue.length) {
    const { value, depth } = queue.shift();
    if (depth > 4 || !value) continue;

    if (Array.isArray(value)) {
      if (value.length && typeof value[0] === "object") {
        const score = scoreRecords(value);
        if (score > best.score) {
          best = { score, arr: value };
        }
      }
      continue;
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([key, child]) => {
        if (/hierarchy|tree|parent|child/i.test(key)) return;
        queue.push({ value: child, depth: depth + 1 });
      });
    }
  }

  return best.arr || [];
}

function asRecordArray(value) {
  if (!value || Array.isArray(value)) return null;
  const values = Object.values(value);
  if (!values.length || typeof values[0] !== "object") return null;
  const sample = values.slice(0, 40);
  const score = scoreRecords(sample);
  return score > 0 ? values : null;
}

function scoreRecords(records) {
  let score = 0;
  const sample = records.slice(0, 50);
  sample.forEach((record) => {
    if (!record || typeof record !== "object") return;
    if (hasPreferredKey(record)) score += 2;
    if (hasSynonymKey(record)) score += 1;
  });
  return score;
}

function hasPreferredKey(record) {
  return PREFERRED_KEYS.some((key) => record[key]);
}

function hasSynonymKey(record) {
  return SYNONYM_KEYS.some((key) => record[key]);
}

function extractPreferred(record) {
  for (const key of PREFERRED_KEYS) {
    const value = record[key];
    const preferred = extractString(value);
    if (preferred) return preferred;
  }

  if (record.descriptor && typeof record.descriptor === "object") {
    const preferred = extractString(record.descriptor.name || record.descriptor.label);
    if (preferred) return preferred;
  }

  return "";
}

function extractConceptId(record) {
  for (const key of ID_KEYS) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

function extractSynonyms(record) {
  const results = [];
  SYNONYM_KEYS.forEach((key) => {
    const value = record[key];
    results.push(...coerceToStrings(value));
  });

  if (record.entry_terms && typeof record.entry_terms === "object") {
    results.push(...coerceToStrings(record.entry_terms.terms));
  }

  if (record.terms && Array.isArray(record.terms)) {
    results.push(...coerceToStrings(record.terms));
  }

  return Array.from(new Set(results.map((item) => item.trim()).filter(Boolean)));
}

function coerceToStrings(value) {
  const results = [];
  if (!value) return results;
  if (typeof value === "string") {
    const parts = value.includes("|") ? value.split("|") : value.split(";");
    return parts.map((part) => part.trim()).filter(Boolean);
  }
  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (typeof item === "string") {
        results.push(item);
      } else if (item && typeof item === "object") {
        results.push(...coerceToStrings(item.term || item.name || item.label));
      }
    });
    return results;
  }
  if (typeof value === "object") {
    if (value.term || value.name || value.label) {
      results.push(...coerceToStrings(value.term || value.name || value.label));
    }
  }
  return results;
}

function extractString(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    return extractString(value.term || value.name || value.label || value.value);
  }
  return "";
}

function dedupeSynonyms(preferredNorm, synonyms) {
  const results = [];
  const seen = new Set();
  if (preferredNorm) {
    seen.add(preferredNorm);
  }
  synonyms.forEach((syn) => {
    const norm = normalize(syn);
    if (!norm || seen.has(norm)) return;
    seen.add(norm);
    results.push(syn);
  });
  return results;
}

function dedupeNormalizedSynonyms(synonyms) {
  const results = [];
  const seen = new Set();
  synonyms.forEach((syn) => {
    const norm = normalize(syn);
    if (!norm || seen.has(norm)) return;
    seen.add(norm);
    results.push(norm);
  });
  return results;
}

function buildAcronymList(preferred, synonyms) {
  const results = new Set();
  const preferredAcronym = makeAcronym(preferred);
  if (preferredAcronym) results.add(preferredAcronym);
  synonyms.forEach((syn) => {
    const acronym = makeAcronym(syn);
    if (acronym) results.add(acronym);
  });
  return Array.from(results);
}

function extractMeshMappings(record) {
  const results = [];
  MESH_MAPPING_KEYS.forEach((key) => {
    const value = record[key];
    results.push(...extractMappingValues(value));
  });

  if (record.mesh && typeof record.mesh === "object") {
    results.push(...extractMappingValues(record.mesh));
  }

  return Array.from(new Set(results.map((item) => item.trim()).filter(Boolean)));
}

function extractEmtreeMappings(record) {
  const results = [];
  EMTREE_MAPPING_KEYS.forEach((key) => {
    const value = record[key];
    results.push(...extractMappingValues(value));
  });

  if (record.emtree && typeof record.emtree === "object") {
    results.push(...extractMappingValues(record.emtree));
  }

  return Array.from(new Set(results.map((item) => item.trim()).filter(Boolean)));
}

function extractMappingValues(value) {
  const results = [];
  if (!value) return results;
  if (typeof value === "string") {
    results.push(...value.split(/[,;|]/g).map((item) => item.trim()));
    return results;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (typeof item === "string") {
        results.push(item);
      } else if (item && typeof item === "object") {
        results.push(
          ...extractMappingValues(
            item.id ||
              item.ui ||
              item.mesh_id ||
              item.meshId ||
              item.descriptor_id ||
              item.descriptorId ||
              item.term ||
              item.label ||
              item.name
          )
        );
      }
    });
    return results;
  }
  if (typeof value === "object") {
    results.push(
      ...extractMappingValues(
        value.id ||
          value.ui ||
          value.mesh_id ||
          value.meshId ||
          value.descriptor_id ||
          value.descriptorId ||
          value.term ||
          value.label ||
          value.name
      )
    );
  }
  return results;
}

function serializeIndex(index) {
  return {
    version: 1,
    terms: index.terms,
    normRecords: index.normRecords,
    entryNorms: index.entryNorms,
    exactEntries: Array.from(index.exact.entries()),
    prefixEntries: Array.from(index.prefix.entries()),
    wordPrefixEntries: Array.from(index.wordPrefix.entries()),
    acronymEntries: Array.from(index.acronym.entries()),
    trigramEntries: Array.from(index.trigram.entries()),
    stats: { termCount: index.terms.length },
  };
}

function hydrateIndex(serialized) {
  const hydrated = {
    terms: serialized.terms || [],
    normRecords: serialized.normRecords || [],
    entryNorms: serialized.entryNorms || [],
    exact: new Map(serialized.exactEntries || []),
    prefix: new Map(serialized.prefixEntries || []),
    wordPrefix: new Map(serialized.wordPrefixEntries || []),
    acronym: new Map(serialized.acronymEntries || []),
    trigram: new Map(serialized.trigramEntries || []),
    firstLetterMap: new Map(),
  };
  buildFirstLetterMap(hydrated);
  return hydrated;
}

function finalizeIndex(index) {
  if (!index || !Array.isArray(index.terms)) return;
  index.terms.forEach((entry) => ensureEntryMeta(entry));
  index.meshLookup = buildMeshLookup(index);
  index.emtreeLookup = buildEmtreeLookup(index);
}

function ensureEntryMeta(entry) {
  if (!entry) return;
  if (!entry.preferredNorm) entry.preferredNorm = normalize(entry.preferred);
  if (!entry.normPreferred) entry.normPreferred = entry.preferredNorm;
  if (!Array.isArray(entry.synonyms)) entry.synonyms = [];
  if (!Array.isArray(entry.normSynonyms)) entry.normSynonyms = dedupeNormalizedSynonyms(entry.synonyms);
  if (!Array.isArray(entry.acronyms)) entry.acronyms = buildAcronymList(entry.preferred, entry.synonyms);
  if (!Array.isArray(entry.meshMappings)) entry.meshMappings = [];
  if (!Array.isArray(entry.emtreeMappings)) entry.emtreeMappings = [];
}

function buildMeshLookup(index) {
  const lookup = {
    byId: new Map(),
    byNormPreferred: new Map(),
    byNormSynonym: new Map(),
    acronym: new Map(),
    prefFirstLetterMap: new Map(),
    tokenMap: new Map(),
  };

  index.terms.forEach((entry) => {
    if (entry.source !== "mesh") return;
    const entryId = entry.id;
    if (entry.conceptId) {
      lookup.byId.set(entry.conceptId, entryId);
    }
    addLookupEntry(lookup.byNormPreferred, entry.normPreferred, entryId);
    (entry.normSynonyms || []).forEach((normSyn) => addLookupEntry(lookup.byNormSynonym, normSyn, entryId));
    const acronym = makeAcronym(entry.preferred);
    if (acronym && acronym.length >= 2) {
      addLookupEntry(lookup.acronym, acronym, entryId);
    }
    lookup.tokenMap.set(entryId, extractStrongTokens(entry.normPreferred));
  });

  index.normRecords.forEach((record, idx) => {
    const entry = index.terms[record.entryId];
    if (!entry || entry.source !== "mesh" || record.isSyn) return;
    const first = record.norm[0];
    if (!first) return;
    const bucket = lookup.prefFirstLetterMap.get(first) || [];
    bucket.push(idx);
    lookup.prefFirstLetterMap.set(first, bucket);
  });

  return lookup;
}

function buildEmtreeLookup(index) {
  const lookup = {
    byId: new Map(),
    byNormPreferred: new Map(),
    byNormSynonym: new Map(),
    acronym: new Map(),
    prefFirstLetterMap: new Map(),
    tokenMap: new Map(),
  };

  index.terms.forEach((entry) => {
    if (entry.source !== "emtree") return;
    const entryId = entry.id;
    if (entry.conceptId) {
      lookup.byId.set(entry.conceptId, entryId);
    }
    addLookupEntry(lookup.byNormPreferred, entry.normPreferred, entryId);
    (entry.normSynonyms || []).forEach((normSyn) => addLookupEntry(lookup.byNormSynonym, normSyn, entryId));
    const acronym = makeAcronym(entry.preferred);
    if (acronym && acronym.length >= 2) {
      addLookupEntry(lookup.acronym, acronym, entryId);
    }
    lookup.tokenMap.set(entryId, extractStrongTokens(entry.normPreferred));
  });

  index.normRecords.forEach((record, idx) => {
    const entry = index.terms[record.entryId];
    if (!entry || entry.source !== "emtree" || record.isSyn) return;
    const first = record.norm[0];
    if (!first) return;
    const bucket = lookup.prefFirstLetterMap.get(first) || [];
    bucket.push(idx);
    lookup.prefFirstLetterMap.set(first, bucket);
  });

  return lookup;
}

function addLookupEntry(map, key, entryId) {
  if (!key) return;
  const bucket = map.get(key) || [];
  if (!bucket.includes(entryId)) bucket.push(entryId);
  map.set(key, bucket);
}

function extractStrongTokens(norm) {
  if (!norm) return [];
  const tokens = norm.split(" ").filter((item) => item.length >= 3);
  return Array.from(new Set(tokens));
}

function getSuggestions(query, limit) {
  const qNorm = normalize(query);
  const qUpper = query.replace(nonWordRegex, "").toUpperCase();
  const used = new Map();

  const bestMatches = [];
  const acronyms = [];
  const didYouMean = [];
  const closeMatches = [];

  collectMatches(searchIndex.exact.get(qNorm), bestMatches, used, limit);
  collectMatches(searchIndex.prefix.get(qNorm), bestMatches, used, limit);
  collectMatches(searchIndex.wordPrefix.get(qNorm), bestMatches, used, limit);

  if (qUpper.length >= 2) {
    collectMatches(searchIndex.acronym.get(qUpper), acronyms, used, 5);
  }

  const strongCount = bestMatches.length + acronyms.length;
  if (qNorm.length >= 4 && strongCount < 3) {
    didYouMean.push(...getDidYouMean(qNorm, used));
  }

  if (qNorm.length >= 5 && bestMatches.length === 0 && didYouMean.length === 0 && acronyms.length === 0) {
    closeMatches.push(...getCloseMatches(qNorm, used));
  }

  return { bestMatches, didYouMean, acronyms, closeMatches };
}

function getMeshEquivalents(entry) {
  if (!entry || entry.source !== "emtree") {
    return { equivalents: [], reason: null };
  }
  if (Array.isArray(entry.meshEquivalentsResolved)) {
    return { equivalents: entry.meshEquivalentsResolved, reason: entry.meshReason || null };
  }
  const resolved = resolveMeshEquivalentsForEmtree(entry);
  entry.meshEquivalentsResolved = resolved.equivalents;
  entry.meshReason = resolved.reason;
  return resolved;
}

function getEmtreeEquivalents(entry) {
  if (!entry || entry.source !== "mesh") {
    return { equivalents: [], reason: null };
  }
  if (Array.isArray(entry.emtreeEquivalentsResolved)) {
    return { equivalents: entry.emtreeEquivalentsResolved, reason: entry.emtreeReason || null };
  }
  const resolved = resolveEmtreeEquivalentsForMesh(entry);
  entry.emtreeEquivalentsResolved = resolved.equivalents;
  entry.emtreeReason = resolved.reason;
  return resolved;
}

function resolveMeshEquivalentsForEmtree(entry) {
  const lookup = searchIndex?.meshLookup;
  if (!lookup) return { equivalents: [], reason: null };
  const normPreferred = entry.normPreferred || entry.preferredNorm || normalize(entry.preferred);
  const normSynonyms = entry.normSynonyms || [];

  const mappingEquivalents = resolveMeshMappings(entry.meshMappings, lookup);
  if (mappingEquivalents.length) {
    return { equivalents: mappingEquivalents, reason: "mapping" };
  }

  const exactPreferred = getSingleMeshCandidate(lookup.byNormPreferred.get(normPreferred));
  if (exactPreferred.length) {
    return { equivalents: exactPreferred, reason: "exact" };
  }

  const stage2Ids = collectCandidateIds([
    lookup.byNormSynonym.get(normPreferred),
    ...normSynonyms.map((syn) => lookup.byNormPreferred.get(syn)),
  ]);
  const stage2 = getSingleMeshCandidate(stage2Ids);
  if (stage2.length) {
    return { equivalents: stage2, reason: "synonym" };
  }

  const stage3Ids = collectCandidateIds(normSynonyms.map((syn) => lookup.byNormSynonym.get(syn)));
  const stage3 = getSingleMeshCandidate(stage3Ids);
  if (stage3.length) {
    return { equivalents: stage3, reason: "synonym" };
  }

  const acronym = makeAcronym(entry.preferred);
  if (acronym && acronym.length >= 2) {
    const candidates = lookup.acronym.get(acronym) || [];
    const tokenA = extractStrongTokens(normPreferred);
    const filtered = candidates.filter((entryId) => hasStrongTokenOverlap(tokenA, lookup.tokenMap.get(entryId) || []));
    const stage4 = getSingleMeshCandidate(filtered);
    if (stage4.length) {
      return { equivalents: stage4, reason: "acronym" };
    }
  }

  const fuzzyIds = resolveFuzzyMeshCandidate(normPreferred, lookup);
  const stage5 = getSingleMeshCandidate(fuzzyIds);
  if (stage5.length) {
    return { equivalents: stage5, reason: "fuzzy" };
  }

  return { equivalents: [], reason: null };
}

function resolveEmtreeEquivalentsForMesh(entry) {
  const lookup = searchIndex?.emtreeLookup;
  if (!lookup) return { equivalents: [], reason: null };
  const normPreferred = entry.normPreferred || entry.preferredNorm || normalize(entry.preferred);
  const normSynonyms = entry.normSynonyms || [];

  const mappingEquivalents = resolveEmtreeMappings(entry.emtreeMappings, lookup);
  if (mappingEquivalents.length) {
    return { equivalents: mappingEquivalents, reason: "mapping" };
  }

  const exactPreferred = getSingleEmtreeCandidate(lookup.byNormPreferred.get(normPreferred));
  if (exactPreferred.length) {
    return { equivalents: exactPreferred, reason: "exact" };
  }

  const stage2Ids = collectCandidateIds([
    lookup.byNormSynonym.get(normPreferred),
    ...normSynonyms.map((syn) => lookup.byNormPreferred.get(syn)),
  ]);
  const stage2 = getSingleEmtreeCandidate(stage2Ids);
  if (stage2.length) {
    return { equivalents: stage2, reason: "synonym" };
  }

  const acronym = makeAcronym(entry.preferred);
  if (acronym && acronym.length >= 2) {
    const candidates = lookup.acronym.get(acronym) || [];
    const tokenA = extractStrongTokens(normPreferred);
    const filtered = candidates.filter((entryId) => hasStrongTokenOverlap(tokenA, lookup.tokenMap.get(entryId) || []));
    const stage3 = getSingleEmtreeCandidate(filtered);
    if (stage3.length) {
      return { equivalents: stage3, reason: "acronym" };
    }
  }

  return { equivalents: [], reason: null };
}

function resolveMeshMappings(mappings, lookup) {
  if (!Array.isArray(mappings) || !mappings.length) return [];
  const candidates = new Set();
  mappings.forEach((mapping) => {
    const value = (mapping || "").trim();
    if (!value) return;
    const byId = lookup.byId.get(value);
    if (byId !== undefined) {
      candidates.add(byId);
      return;
    }
    const norm = normalize(value);
    const byPreferred = lookup.byNormPreferred.get(norm);
    if (byPreferred && byPreferred.length === 1) {
      candidates.add(byPreferred[0]);
    }
  });
  return buildMeshEquivalents(Array.from(candidates));
}

function resolveEmtreeMappings(mappings, lookup) {
  if (!Array.isArray(mappings) || !mappings.length) return [];
  const candidates = new Set();
  mappings.forEach((mapping) => {
    const value = (mapping || "").trim();
    if (!value) return;
    const byId = lookup.byId.get(value);
    if (byId !== undefined) {
      candidates.add(byId);
      return;
    }
    const norm = normalize(value);
    const byPreferred = lookup.byNormPreferred.get(norm);
    if (byPreferred && byPreferred.length === 1) {
      candidates.add(byPreferred[0]);
    }
  });
  return buildEmtreeEquivalents(Array.from(candidates));
}

function resolveFuzzyMeshCandidate(normPreferred, lookup) {
  if (!normPreferred) return [];
  const first = normPreferred[0];
  const candidates = (lookup.prefFirstLetterMap.get(first) || []).slice(0, 600);
  const shortlist = [];
  const prefixSeed = normPreferred.slice(0, 2);

  for (const idx of candidates) {
    const record = searchIndex.normRecords[idx];
    if (!record) continue;
    if (Math.abs(record.norm.length - normPreferred.length) > 2) continue;
    if (!record.norm.includes(prefixSeed)) continue;
    shortlist.push(record);
    if (shortlist.length >= 300) break;
  }

  let bestDistance = Infinity;
  let bestEntryIds = new Set();
  const maxDistance = normPreferred.length >= 8 ? 2 : 1;

  shortlist.forEach((record) => {
    const distance = boundedLevenshtein(normPreferred, record.norm, maxDistance);
    if (distance === null) return;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestEntryIds = new Set([record.entryId]);
    } else if (distance === bestDistance) {
      bestEntryIds.add(record.entryId);
    }
  });

  if (bestEntryIds.size !== 1) return [];
  const candidateId = Array.from(bestEntryIds)[0];
  const tokenA = extractStrongTokens(normPreferred);
  if (!hasStrongTokenOverlap(tokenA, lookup.tokenMap.get(candidateId) || [])) {
    return [];
  }
  return [candidateId];
}

function collectCandidateIds(list) {
  const set = new Set();
  list.forEach((items) => {
    if (!Array.isArray(items)) return;
    items.forEach((id) => set.add(id));
  });
  return Array.from(set);
}

function getSingleMeshCandidate(ids) {
  const unique = Array.from(new Set(Array.isArray(ids) ? ids : []));
  if (unique.length !== 1) return [];
  return buildMeshEquivalents(unique);
}

function getSingleEmtreeCandidate(ids) {
  const unique = Array.from(new Set(Array.isArray(ids) ? ids : []));
  if (unique.length !== 1) return [];
  return buildEmtreeEquivalents(unique);
}

function buildMeshEquivalents(entryIds) {
  const results = [];
  const seen = new Set();
  entryIds.forEach((entryId) => {
    const entry = searchIndex.terms[entryId];
    if (!entry || entry.source !== "mesh") return;
    const id = entry.conceptId || String(entry.id);
    const label = entry.preferred;
    const key = `${id}|${label}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push({ id, label });
  });
  return results;
}

function buildEmtreeEquivalents(entryIds) {
  const results = [];
  const seen = new Set();
  entryIds.forEach((entryId) => {
    const entry = searchIndex.terms[entryId];
    if (!entry || entry.source !== "emtree") return;
    const id = entry.conceptId || String(entry.id);
    const label = entry.preferred;
    const key = `${id}|${label}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push({ id, label });
  });
  return results;
}

function hasStrongTokenOverlap(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return false;
  const setB = new Set(tokensB);
  return tokensA.some((token) => setB.has(token));
}

function collectMatches(matches, targetList, used, limit) {
  if (!matches) return;
  if (targetList.length >= limit) return;
  for (const match of matches) {
    const entry = searchIndex.terms[match.entryId];
    if (!entry) continue;
    const existing = used.get(match.entryId);
    if (existing) {
      if (match.isSyn) existing.matchedViaSynonym = true;
      continue;
    }
    const suggestion = {
      id: entry.id,
      label: entry.preferred,
      source: entry.source,
      conceptId: entry.conceptId,
      synonyms: entry.synonyms || [],
      matchedViaSynonym: match.isSyn,
    };
    if (entry.source === "emtree") {
      const mapping = getMeshEquivalents(entry);
      if (mapping.equivalents.length) {
        suggestion.meshEquivalents = mapping.equivalents;
        suggestion.meshReason = mapping.reason;
      }
    }
    if (entry.source === "mesh") {
      const mapping = getEmtreeEquivalents(entry);
      if (mapping.equivalents.length) {
        suggestion.emtreeEquivalents = mapping.equivalents;
        suggestion.emtreeReason = mapping.reason;
      }
    }
    used.set(match.entryId, suggestion);
    targetList.push(suggestion);
    if (targetList.length >= limit) break;
  }
}

function getDidYouMean(qNorm, used) {
  const results = [];
  const first = qNorm[0];
  const candidates = (searchIndex.firstLetterMap.get(first) || []).slice(0, 600);
  const shortlist = [];
  const prefixSeed = qNorm.slice(0, 2);

  for (const idx of candidates) {
    const record = searchIndex.normRecords[idx];
    if (!record) continue;
    if (Math.abs(record.norm.length - qNorm.length) > 2) continue;
    if (!record.norm.includes(prefixSeed)) continue;
    shortlist.push(record);
    if (shortlist.length >= 300) break;
  }

  const bestByEntry = new Map();
  shortlist.forEach((record) => {
    if (used.has(record.entryId)) return;
    const distance = boundedLevenshtein(qNorm, record.norm, qNorm.length >= 8 ? 2 : 1);
    if (distance === null) return;
    const existing = bestByEntry.get(record.entryId);
    if (!existing || distance < existing.distance) {
      bestByEntry.set(record.entryId, { distance, isSyn: record.isSyn });
    }
  });

  const sorted = Array.from(bestByEntry.entries())
    .sort((a, b) => a[1].distance - b[1].distance)
    .slice(0, 3);

  sorted.forEach(([entryId, meta]) => {
    const entry = searchIndex.terms[entryId];
    if (!entry) return;
    results.push({
      id: entry.id,
      label: entry.preferred,
      source: entry.source,
      conceptId: entry.conceptId,
      synonyms: entry.synonyms || [],
      matchedViaSynonym: meta.isSyn,
    });
    if (entry.source === "emtree") {
      const mapping = getMeshEquivalents(entry);
      if (mapping.equivalents.length) {
        results[results.length - 1].meshEquivalents = mapping.equivalents;
        results[results.length - 1].meshReason = mapping.reason;
      }
    }
    used.set(entryId, results[results.length - 1]);
  });

  return results;
}

function getCloseMatches(qNorm, used) {
  const results = [];
  const qTrigrams = getTrigrams(qNorm);
  if (!qTrigrams.length) return results;

  const candidateScores = new Map();
  qTrigrams.forEach((tri) => {
    const entries = searchIndex.trigram.get(tri) || [];
    entries.forEach((entryId) => {
      candidateScores.set(entryId, (candidateScores.get(entryId) || 0) + 1);
    });
  });

  const candidates = Array.from(candidateScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 200)
    .map(([entryId]) => entryId);

  candidates.forEach((entryId) => {
    if (used.has(entryId)) return;
    const entry = searchIndex.terms[entryId];
    const norms = searchIndex.entryNorms[entryId] || [];
    let bestScore = 0;
    let bestIsSyn = false;

    norms.forEach((normIndex) => {
      const record = searchIndex.normRecords[normIndex];
      if (!record) return;
      const score = trigramSimilarity(qTrigrams, getTrigrams(record.norm));
      if (score > bestScore) {
        bestScore = score;
        bestIsSyn = record.isSyn;
      }
    });

    if (bestScore >= 0.45) {
      results.push({
        id: entry.id,
        label: entry.preferred,
        source: entry.source,
        conceptId: entry.conceptId,
        synonyms: entry.synonyms || [],
        matchedViaSynonym: bestIsSyn,
      });
      if (entry.source === "emtree") {
        const mapping = getMeshEquivalents(entry);
        if (mapping.equivalents.length) {
          results[results.length - 1].meshEquivalents = mapping.equivalents;
          results[results.length - 1].meshReason = mapping.reason;
        }
      }
      used.set(entryId, results[results.length - 1]);
    }
  });

  return results.slice(0, 5);
}

function trigramSimilarity(setA, setB) {
  if (!setA.length || !setB.length) return 0;
  const set = new Set(setB);
  let intersection = 0;
  setA.forEach((tri) => {
    if (set.has(tri)) intersection += 1;
  });
  const union = setA.length + setB.length - intersection;
  return union ? intersection / union : 0;
}

function boundedLevenshtein(a, b, maxDistance) {
  const aLen = a.length;
  const bLen = b.length;
  if (Math.abs(aLen - bLen) > maxDistance) return null;

  const prev = new Array(bLen + 1).fill(0);
  const curr = new Array(bLen + 1).fill(0);

  for (let j = 0; j <= bLen; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i <= aLen; i += 1) {
    curr[0] = i;
    let minInRow = curr[0];
    for (let j = 1; j <= bLen; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < minInRow) minInRow = curr[j];
    }
    if (minInRow > maxDistance) return null;
    for (let j = 0; j <= bLen; j += 1) {
      prev[j] = curr[j];
    }
  }

  return prev[bLen] <= maxDistance ? prev[bLen] : null;
}
