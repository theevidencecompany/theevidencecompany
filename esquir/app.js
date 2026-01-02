import { STUDY_DESIGN_FILTERS } from "./filters.js";

const DB_LIST = ["PubMed", "Embase", "Scopus", "Cochrane", "Web of Science"];
const PICO_FIELDS = [
  { key: "P", label: "Population" },
  { key: "I", label: "Intervention" },
  { key: "C", label: "Control" },
  { key: "O", label: "Outcome" },
];
const SYNTAX_MODE = {
  NARROW: "narrow",
  OPT: "optimised",
  WIDE: "wide",
};
const API_CONFIG = {
  base: (document.body?.dataset.apiBase || "").trim(),
  suggestPath: (document.body?.dataset.apiSuggest || "/api/suggest").trim(),
};
const EMPTY_SECTIONS = { bestMatches: [], didYouMean: [], acronyms: [], closeMatches: [] };

const SYNTAX_REFERENCES = {
  PubMed: [
    { label: "PubMed Help", url: "https://pubmed.ncbi.nlm.nih.gov/help/" },
    { label: "MeSH no-explode tag", url: "https://www.nlm.nih.gov/oet/ed/pubmed/mesh/mod04/01-300.html" },
  ],
  Embase: [
    { label: "Non-alphanumeric searching", url: "https://www.elsevier.support/embase/answer/how-do-i-search-for-nonalphanumeric-characters" },
    { label: "Study-type filters", url: "https://www.elsevier.support/embase/answer/embase-study-type-filters" },
    { label: "How to search Embase", url: "https://www.elsevier.support/embase/answer/how-do-i-search-in-embase" },
  ],
  Scopus: [
    { label: "Notes on advanced search", url: "https://service.elsevier.com/app/answers/detail/a_id/11365/supporthub/scopus/kw/Notes+on+Advanced+Search/" },
  ],
  "Web of Science": [
    { label: "Field tags guide", url: "https://webofscience.zendesk.com/hc/en-us/articles/26916347018257-Web-of-Science-Core-Collection-Advanced-Search-Field-Tags" },
    { label: "Search rules", url: "https://webofscience.zendesk.com/hc/en-us/articles/25350084904721-Search-Rules" },
    { label: "Search operators", url: "https://webofscience.zendesk.com/hc/en-us/articles/20016122409105-Search-Operators" },
  ],
  Cochrane: [
    { label: "Cochrane handbook chapter 4", url: "https://www.cochrane.org/authors/handbooks-and-manuals/handbook/chapter04-tech-supplonlinepdfv65270924" },
    { label: "Search Manager Help", url: "https://www.cochranelibrary.com/search-manager-help" },
    { label: "EPOC syntax guide", url: "https://epoc.cochrane.org/sites/epoc.cochrane.org/files/uploads/Resources-for-authors2017/database_syntax_guide.pdf" },
  ],
};
const state = {
  mode: "basic",
  tokens: new Map(),
  tokenSignatures: new Map(),
  tokenSeq: 1,
  pico: {},
  filters: {},
  ast: null,
  astCustom: false,
  syntaxMode: SYNTAX_MODE.OPT,
  selectedFilterDb: "PubMed",
  selectedNodes: new Set(),
  activeInfoDb: null,
  activeHelpTopic: null,
};

const elements = {
  mainContent: document.getElementById("mainContent"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  loadingText: document.getElementById("loadingText"),
  modeButtons: Array.from(document.querySelectorAll(".mode-btn")),
  filterTabs: Array.from(document.querySelectorAll(".tab-btn")),
  filtersPanel: document.getElementById("filtersPanel"),
  selectedFilters: document.getElementById("selectedFilters"),
  summaryBuilder: document.getElementById("summaryBuilder"),
  summaryTree: document.getElementById("summaryTree"),
  selectionStatus: document.getElementById("selectionStatus"),
  clearSelection: document.getElementById("clearSelection"),
  generateBtn: document.getElementById("generateBtn"),
  clearAll: document.getElementById("clearAll"),
  resetBuilder: document.getElementById("resetBuilder"),
  syntaxGroup: document.getElementById("syntaxGroup"),
  syntaxToggle: document.getElementById("syntaxToggle"),
  syntaxButtons: Array.from(document.querySelectorAll("[data-syntax]")),
  shortenGroup: document.getElementById("shortenGroup"),
  shortenToggle: document.getElementById("shortenToggle"),
  shortenCheckbox: document.getElementById("shortenCheckbox"),
  infoButtons: Array.from(document.querySelectorAll("[data-info]")),
  helpButtons: Array.from(document.querySelectorAll("[data-help]")),
  infoModal: document.getElementById("infoModal"),
  infoModalTitle: document.getElementById("infoModalTitle"),
  infoModalBody: document.getElementById("infoModalBody"),
  closeInfoModal: document.getElementById("closeInfoModal"),
  toast: document.getElementById("toast"),
  freeTextModal: document.getElementById("freeTextModal"),
  freeTextPrompt: document.getElementById("freeTextPrompt"),
  cancelFreeText: document.getElementById("cancelFreeText"),
  confirmFreeText: document.getElementById("confirmFreeText"),
  filterModal: document.getElementById("filterModal"),
  filterModalText: document.getElementById("filterModalText"),
  closeFilterModal: document.getElementById("closeFilterModal"),
  copyFilterQuery: document.getElementById("copyFilterQuery"),
  footerYear: document.getElementById("footerYear"),
};

const outputTextareas = new Map();
const outputWarnings = new Map();
const outputNotes = new Map();

DB_LIST.forEach((db) => {
  outputTextareas.set(db, document.querySelector(`[data-output="${db}"]`));
  outputWarnings.set(db, document.querySelector(`[data-warnings="${db}"]`));
  outputNotes.set(db, document.querySelector(`[data-notes="${db}"]`));
  state.filters[db] = { tokens: [], operators: [] };
});

PICO_FIELDS.forEach(({ key }) => {
  state.pico[key] = { tokens: [], operators: [] };
});

let comboRequestSeq = 0;
let nodeSeq = 1;
let pendingFreeText = null;
let currentFilterQuery = "";
let debugLogged = false;
let indexReady = false;
let loadingTimer = null;
let toastTimer = null;
let filtersAnimationTimer = null;
let shortenQueryEnabled = false;

class ComboBox {
  constructor(fieldEl) {
    this.fieldEl = fieldEl;
    this.picoTag = fieldEl.dataset.pico;
    this.input = fieldEl.querySelector("input");
    this.listbox = fieldEl.querySelector(".suggestions");
    this.clearBtn = fieldEl.querySelector(".clear-btn");
    this.chips = fieldEl.querySelector("[data-chips]");
    this.options = [];
    this.activeIndex = -1;
    this.debounceTimer = null;
    this.pendingRequestId = 0;

    this.input.addEventListener("input", () => this.handleInput());
    this.input.addEventListener("keydown", (event) => this.handleKeyDown(event));
    this.input.addEventListener("blur", () => {
      setTimeout(() => {
        if (!this.listbox.contains(document.activeElement)) {
          this.closeList();
        }
      }, 120);
    });
    this.clearBtn.addEventListener("click", () => {
      this.input.value = "";
      this.closeList();
      this.input.focus();
    });

    this.listbox.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
  }

  handleInput() {
    const value = this.input.value.trim();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (!value) {
      this.closeList();
      return;
    }
    this.debounceTimer = setTimeout(() => {
      const requestId = ++comboRequestSeq;
      this.pendingRequestId = requestId;
      fetchSuggestions(value, 8).then((sections) => {
        if (this.pendingRequestId !== requestId) return;
        this.renderSuggestions(sections, value);
      });
    }, 160);
  }

  handleKeyDown(event) {
    if (!this.listbox.classList.contains("is-open")) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.openList();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.setActiveIndex(Math.min(this.activeIndex + 1, this.options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.setActiveIndex(Math.max(this.activeIndex - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = this.options[this.activeIndex];
      if (option) {
        this.selectOption(option);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.closeList();
    }
  }

  openList() {
    if (!this.options.length) return;
    this.listbox.classList.add("is-open");
    this.input.setAttribute("aria-expanded", "true");
  }

  closeList() {
    this.listbox.classList.remove("is-open");
    this.input.setAttribute("aria-expanded", "false");
    this.activeIndex = -1;
  }

  setActiveIndex(index) {
    this.activeIndex = index;
    this.options.forEach((option, idx) => {
      option.element.classList.toggle("is-active", idx === index);
      option.element.setAttribute("aria-selected", idx === index ? "true" : "false");
    });
    const active = this.options[index];
    if (active) {
      this.input.setAttribute("aria-activedescendant", active.element.id);
    }
  }

  renderSuggestions(sections, query) {
    if (query !== this.input.value.trim()) return;
    this.listbox.innerHTML = "";
    this.options = [];

    const sectionOrder = [
      { title: "Best matches", items: sections.bestMatches },
      { title: "Did you mean", items: sections.didYouMean },
      { title: "Acronyms matched", items: sections.acronyms },
      { title: "Close matches", items: sections.closeMatches },
    ];

    sectionOrder.forEach((section) => {
      if (!section.items || !section.items.length) return;
      const header = document.createElement("div");
      header.className = "suggestion-section";
      header.textContent = section.title;
      this.listbox.appendChild(header);

      section.items.forEach((item) => {
        const option = this.createSuggestionItem(item, "term");
        this.listbox.appendChild(option.element);
      });
    });

    if (query) {
      const freeTextOption = this.createSuggestionItem({ label: query }, "free");
      this.listbox.appendChild(freeTextOption.element);
    }

    if (!this.options.length) {
      const empty = document.createElement("div");
      empty.className = "suggestion-item";
      empty.textContent = "No suggestions";
      this.listbox.appendChild(empty);
    }

    this.openList();
    this.setActiveIndex(0);
  }

  createSuggestionItem(item, type) {
    const optionId = `option-${this.picoTag}-${this.options.length}`;
    const wrapper = document.createElement("div");
    wrapper.className = "suggestion-item";
    wrapper.id = optionId;
    wrapper.setAttribute("role", "option");

    if (type === "free") {
      wrapper.textContent = `Add \"${item.label}\" as free text...`;
    } else {
      const row = document.createElement("div");
      row.className = "suggestion-row";
      const label = document.createElement("span");
      label.textContent = item.label;
      row.appendChild(label);
      wrapper.appendChild(row);

      if (item.matchedViaSynonym) {
        const hint = document.createElement("span");
        hint.className = "suggestion-hint";
        hint.textContent = "matched via synonym";
        wrapper.appendChild(hint);
      }
    }

    const option = { type, data: item, element: wrapper };
    wrapper.addEventListener("click", () => this.selectOption(option));
    this.options.push(option);
    return option;
  }

  selectOption(option) {
    if (option.type === "free") {
      openFreeTextModal(option.data.label, this.picoTag);
      this.closeList();
      return;
    }

    const normalizedSource = normalizeSource(option.data.source);
    const tokenId = createToken({
      type: "TERM",
      label: option.data.label,
      source: normalizedSource,
      conceptId: option.data.conceptId,
      synonyms: option.data.synonyms || [],
      meshEquivalents: option.data.meshEquivalents || [],
      meshReason: option.data.meshReason || null,
      emtreeEquivalents: option.data.emtreeEquivalents || [],
      emtreeReason: option.data.emtreeReason || null,
      picoTag: this.picoTag,
    });

    addTokenToPico(this.picoTag, tokenId);
    this.input.value = "";
    this.closeList();
  }
}

function init() {
  elements.footerYear.textContent = String(new Date().getFullYear());
  document.body.dataset.mode = state.mode;

  elements.modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  elements.syntaxButtons.forEach((btn) => {
    btn.addEventListener("click", () => setSyntaxMode(btn.dataset.syntax));
  });

  if (elements.shortenCheckbox) {
    elements.shortenCheckbox.addEventListener("change", () => {
      shortenQueryEnabled = elements.shortenCheckbox.checked;
      updateOutputs();
    });
  }

  elements.filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => setFilterTab(tab.dataset.db));
  });

  elements.generateBtn.addEventListener("click", () => {
    updateOutputs();
    document.getElementById("outputs").scrollIntoView({ behavior: "smooth" });
  });

  elements.clearAll.addEventListener("click", () => clearAll());

  elements.resetBuilder.addEventListener("click", () => {
    state.astCustom = false;
    rebuildAstFromSelections();
  });

  elements.clearSelection.addEventListener("click", () => clearSelection());

  elements.cancelFreeText.addEventListener("click", closeFreeTextModal);
  elements.confirmFreeText.addEventListener("click", confirmFreeText);
  elements.closeFilterModal.addEventListener("click", closeFilterModal);
  elements.copyFilterQuery.addEventListener("click", copyFilterQuery);
  elements.closeInfoModal.addEventListener("click", closeInfoModal);

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => handleCopy(button.dataset.copy));
  });

  elements.infoButtons.forEach((button) => {
    button.addEventListener("click", () => openInfoModal(button.dataset.info));
  });

  elements.helpButtons.forEach((button) => {
    button.addEventListener("click", () => openHelpModal(button.dataset.help));
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const helpBtn = target?.closest ? target.closest("[data-help]") : null;
    if (helpBtn) {
      openHelpModal(helpBtn.dataset.help);
      return;
    }
    const infoBtn = target?.closest ? target.closest("[data-info]") : null;
    if (infoBtn) {
      openInfoModal(infoBtn.dataset.info);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!elements.infoModal.hidden) {
        closeInfoModal();
      }
    }
  });

  setupCombos();
  setFilterTab(state.selectedFilterDb);
  syncSyntaxToggle();
  rebuildAstFromSelections();
  updateOutputs();
  initSearchClient();
}

function initSearchClient() {
  indexReady = true;
  setLoading(false, "Ready", true);
}

function setupCombos() {
  document.querySelectorAll(".pico-field").forEach((field) => {
    const combo = new ComboBox(field);
    field.combo = combo;
  });
}

function buildSuggestEndpoint() {
  const raw = API_CONFIG.suggestPath || "/api/suggest";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = API_CONFIG.base.replace(/\/$/, "");
  if (!base) return raw.startsWith("/") ? raw : `/${raw}`;
  return raw.startsWith("/") ? `${base}${raw}` : `${base}/${raw}`;
}

async function fetchSuggestions(query, limit) {
  const endpoint = buildSuggestEndpoint();
  const url = new URL(endpoint, window.location.origin);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit || 8));
  try {
    const response = await fetch(url.toString(), { method: "GET", headers: { Accept: "application/json" } });
    if (!response.ok) return { ...EMPTY_SECTIONS };
    const data = await response.json();
    const sections = data.sections || data || {};
    return {
      bestMatches: sections.bestMatches || [],
      didYouMean: sections.didYouMean || [],
      acronyms: sections.acronyms || [],
      closeMatches: sections.closeMatches || [],
    };
  } catch (error) {
    return { ...EMPTY_SECTIONS };
  }
}

function setLoading(isLoading, message, background) {
  elements.mainContent.setAttribute("aria-busy", isLoading ? "true" : "false");
  if (message) {
    elements.loadingText.textContent = message;
  }

  if (background || indexReady) {
    clearLoadingOverlay();
    return;
  }

  if (isLoading) {
    if (!loadingTimer) {
      loadingTimer = setTimeout(() => {
        elements.loadingOverlay.classList.add("is-visible");
        elements.loadingOverlay.setAttribute("aria-hidden", "false");
      }, 450);
    }
  } else {
    clearLoadingOverlay();
  }
}

function clearLoadingOverlay() {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  elements.loadingOverlay.classList.remove("is-visible");
  elements.loadingOverlay.setAttribute("aria-hidden", "true");
}

function syncSyntaxToggle() {
  const isAdvanced = state.mode === "advanced";
  if (elements.syntaxGroup) {
    elements.syntaxGroup.hidden = !isAdvanced;
  }
  if (elements.syntaxToggle) {
    elements.syntaxToggle.hidden = !isAdvanced;
  }
  if (elements.shortenGroup) {
    elements.shortenGroup.hidden = !isAdvanced;
  }
  if (elements.shortenToggle) {
    elements.shortenToggle.hidden = !isAdvanced;
  }
  if (elements.shortenCheckbox) {
    elements.shortenCheckbox.checked = shortenQueryEnabled;
  }
  updateSyntaxButtons();
}

function setSyntaxMode(mode) {
  if (!mode || mode === state.syntaxMode) return;
  state.syntaxMode = mode;
  updateSyntaxButtons();
  updateOutputs();
  if (state.activeInfoDb || state.activeHelpTopic) {
    renderInfoModal();
  }
}

function updateSyntaxButtons() {
  elements.syntaxButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.syntax === state.syntaxMode);
  });
}

function getEffectiveSyntaxMode() {
  return state.mode === "basic" ? SYNTAX_MODE.OPT : state.syntaxMode;
}

function formatModeLabel(mode) {
  if (mode === SYNTAX_MODE.NARROW) return "Narrow";
  if (mode === SYNTAX_MODE.WIDE) return "Wide";
  return "Optimised";
}

function setMode(mode) {
  if (state.mode === mode) return;
  state.mode = mode;
  document.body.dataset.mode = state.mode;
  elements.modeButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.mode === mode);
  });

  if (mode === "basic") {
    elements.summaryBuilder.hidden = true;
    trimSelectionsForBasic();
    state.astCustom = false;
    state.syntaxMode = SYNTAX_MODE.OPT;
    shortenQueryEnabled = false;
    if (elements.shortenCheckbox) {
      elements.shortenCheckbox.checked = false;
    }
  } else {
    elements.summaryBuilder.hidden = false;
  }

  syncSyntaxToggle();
  state.selectedNodes.clear();
  rebuildAstFromSelections();
  renderAllChips();
  renderFilters();
  if (state.activeInfoDb || state.activeHelpTopic) {
    renderInfoModal();
  }
  updateOutputs();
}

function trimSelectionsForBasic() {
  PICO_FIELDS.forEach(({ key }) => {
    const selection = state.pico[key];
    if (selection.tokens.length > 1) {
      selection.tokens = selection.tokens.slice(0, 1);
      selection.operators = [];
    }
  });

  DB_LIST.forEach((db) => {
    const selection = state.filters[db];
    if (selection.tokens.length > 1) {
      selection.tokens = selection.tokens.slice(0, 1);
      selection.operators = [];
    }
  });
}

function createToken(data) {
  const signature = tokenSignature(data);
  if (state.tokenSignatures.has(signature)) {
    return state.tokenSignatures.get(signature);
  }
  const id = `t${state.tokenSeq++}`;
  const token = { id, ...data, source: normalizeSource(data.source) || data.source };
  state.tokens.set(id, token);
  state.tokenSignatures.set(signature, id);
  return id;
}

function normalizeSource(source) {
  if (!source) return "";
  if (typeof source !== "string") return source;
  return source.trim().toLowerCase();
}

function tokenSignature(data) {
  const parts = [
    data.type || "",
    normalizeSource(data.source) || "",
    data.db || "",
    data.conceptId || "",
    (data.label || "").toLowerCase(),
    data.fieldScope || "",
    data.picoTag || "",
    data.query || "",
  ];
  return parts.join("|");
}

function addTokenToPico(picoTag, tokenId) {
  const selection = state.pico[picoTag];
  if (state.mode === "basic" && selection.tokens.length) {
    selection.tokens.forEach((existingId) => removeToken(existingId));
    selection.tokens = [];
    selection.operators = [];
  }

  if (!selection.tokens.includes(tokenId)) {
    selection.tokens.push(tokenId);
    if (selection.tokens.length > 1) {
      selection.operators.push("AND");
    }
  }

  if (state.mode === "advanced") {
    if (state.astCustom) {
      insertTokenIntoAst(tokenId);
    } else {
      rebuildAstFromSelections();
    }
  }

  renderPicoChips(picoTag);
  updateOutputs();
}

function removeToken(tokenId, options = {}) {
  const token = state.tokens.get(tokenId);
  if (!token) return;

  PICO_FIELDS.forEach(({ key }) => {
    const selection = state.pico[key];
    const idx = selection.tokens.indexOf(tokenId);
    if (idx !== -1) {
      selection.tokens.splice(idx, 1);
      selection.operators.splice(Math.max(idx - 1, 0), selection.operators.length > 0 ? 1 : 0);
    }
  });

  DB_LIST.forEach((db) => {
    const selection = state.filters[db];
    const idx = selection.tokens.indexOf(tokenId);
    if (idx !== -1) {
      selection.tokens.splice(idx, 1);
      selection.operators.splice(Math.max(idx - 1, 0), selection.operators.length > 0 ? 1 : 0);
    }
  });

  state.tokens.delete(tokenId);
  state.tokenSignatures.forEach((value, key) => {
    if (value === tokenId) {
      state.tokenSignatures.delete(key);
    }
  });

  if (!options.skipAst && state.mode === "advanced") {
    removeTokenFromAst(tokenId);
  }

  renderAllChips();
  renderFilters();
  renderSummaryBuilder();
  updateOutputs();
}

function clearAll() {
  state.tokens.clear();
  state.tokenSignatures.clear();
  state.tokenSeq = 1;
  nodeSeq = 1;
  state.selectedNodes.clear();

  PICO_FIELDS.forEach(({ key }) => {
    state.pico[key] = { tokens: [], operators: [] };
  });

  DB_LIST.forEach((db) => {
    state.filters[db] = { tokens: [], operators: [] };
  });

  state.astCustom = false;
  rebuildAstFromSelections();
  renderAllChips();
  renderFilters();
  updateOutputs();
}

function renderAllChips() {
  PICO_FIELDS.forEach(({ key }) => renderPicoChips(key));
}

function renderPicoChips(picoTag) {
  const field = document.querySelector(`.pico-field[data-pico="${picoTag}"]`);
  if (!field) return;
  const container = field.querySelector("[data-chips]");
  const selection = state.pico[picoTag];

  container.innerHTML = "";
  selection.tokens.forEach((tokenId, index) => {
    const token = state.tokens.get(tokenId);
    if (!token) return;
    const chip = buildChip(token);
    container.appendChild(chip);

    if (state.mode === "advanced" && index < selection.tokens.length - 1) {
      const operator = document.createElement("select");
      operator.className = "operator-select";
      ["AND", "OR", "NOT"].forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        operator.appendChild(option);
      });
      operator.value = selection.operators[index] || "AND";
      operator.addEventListener("change", () => {
        selection.operators[index] = operator.value;
        if (state.mode === "advanced" && !state.astCustom) {
          rebuildAstFromSelections();
        }
        updateOutputs();
      });
      container.appendChild(operator);
    }
  });
}

function buildChip(token) {
  const chip = document.createElement("span");
  chip.className = "chip";

  const label = document.createElement("span");
  label.textContent = token.label;
  chip.appendChild(label);

  if (token.type === "FILTER") {
    const badge = document.createElement("span");
    badge.className = "chip-badge";
    badge.textContent = token.db || "Filter";
    chip.appendChild(badge);
  }

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "chip-remove";
  removeBtn.setAttribute("aria-label", `Remove ${token.label}`);
  removeBtn.textContent = "x";
  removeBtn.addEventListener("click", () => removeToken(token.id));
  chip.appendChild(removeBtn);

  return chip;
}

function setFilterTab(db) {
  state.selectedFilterDb = db;
  elements.filterTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.db === db);
    tab.setAttribute("aria-selected", tab.dataset.db === db ? "true" : "false");
  });
  renderFilters();
}

function renderFilters() {
  const db = state.selectedFilterDb;
  const filters = STUDY_DESIGN_FILTERS[db] || [];
  elements.filtersPanel.innerHTML = "";
  elements.selectedFilters.innerHTML = "";

  elements.filtersPanel.classList.remove("is-animating");
  void elements.filtersPanel.offsetWidth;
  elements.filtersPanel.classList.add("is-animating");
  if (filtersAnimationTimer) {
    clearTimeout(filtersAnimationTimer);
  }
  filtersAnimationTimer = setTimeout(() => {
    elements.filtersPanel.classList.remove("is-animating");
  }, 300);

  renderSelectedFilters(db);

  filters.forEach((filter) => {
    const card = document.createElement("div");
    card.className = "filter-item";

    const header = document.createElement("div");
    header.className = "filter-row";

    const title = document.createElement("h4");
    title.className = "filter-title";
    title.textContent = filter.title;

    const titleWrap = document.createElement("div");
    titleWrap.className = "filter-title-wrap";
    titleWrap.appendChild(title);

    const isSelected = isFilterSelected(db, filter);
    if (isSelected) {
      const status = document.createElement("span");
      status.className = "builder-tag";
      status.textContent = "Selected";
      titleWrap.appendChild(status);
    }

    header.appendChild(titleWrap);

    const cta = document.createElement("div");
    cta.className = "filter-cta";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = isSelected ? "btn btn-secondary btn-compact" : "btn btn-primary btn-compact";
    btn.textContent = isSelected ? "Remove" : "Add";
    btn.addEventListener("click", () => toggleFilter(db, filter));
    cta.appendChild(btn);

    header.appendChild(cta);
    card.appendChild(header);

    const actions = document.createElement("div");
    actions.className = "filter-actions-row";

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.className = "btn btn-secondary btn-compact";
    viewBtn.textContent = "View query";
    viewBtn.addEventListener("click", () => openFilterModal(filter));
    actions.appendChild(viewBtn);

    if (filter.ref) {
      const link = document.createElement("a");
      link.href = filter.ref;
      link.textContent = "Reference";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "btn btn-secondary btn-compact filter-ref";
      actions.appendChild(link);
    }

    card.appendChild(actions);
    elements.filtersPanel.appendChild(card);
  });
}

function isFilterSelected(db, filter) {
  const selection = state.filters[db];
  return selection.tokens.some((tokenId) => {
    const token = state.tokens.get(tokenId);
    return token && token.type === "FILTER" && token.label === filter.title;
  });
}

function toggleFilter(db, filter) {
  const selection = state.filters[db];
  const existing = selection.tokens.find((tokenId) => {
    const token = state.tokens.get(tokenId);
    return token && token.type === "FILTER" && token.label === filter.title;
  });

  if (existing) {
    removeToken(existing);
    return;
  }

  if (state.mode === "basic" && selection.tokens.length) {
    selection.tokens.forEach((tokenId) => removeToken(tokenId));
    selection.tokens = [];
    selection.operators = [];
  }

  const tokenId = createToken({
    type: "FILTER",
    label: filter.title,
    db,
    query: filter.query,
    picoTag: "Filter",
    source: "filter",
  });

  selection.tokens.push(tokenId);
  if (selection.tokens.length > 1) {
    selection.operators.push("AND");
  }

  if (state.mode === "advanced") {
    if (state.astCustom) {
      insertTokenIntoAst(tokenId);
    } else {
      rebuildAstFromSelections();
    }
  }

  renderFilters();
  renderSummaryBuilder();
  updateOutputs();
}

function renderSelectedFilters(db) {
  const selection = state.filters[db];
  if (!selection.tokens.length) return;

  selection.tokens.forEach((tokenId, index) => {
    const token = state.tokens.get(tokenId);
    if (!token) return;
    const chip = buildChip(token);
    elements.selectedFilters.appendChild(chip);

    if (state.mode === "advanced" && index < selection.tokens.length - 1) {
      const operator = document.createElement("select");
      operator.className = "operator-select";
      ["AND", "OR", "NOT"].forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        operator.appendChild(option);
      });
      operator.value = selection.operators[index] || "AND";
      operator.addEventListener("change", () => {
        selection.operators[index] = operator.value;
        if (state.mode === "advanced" && !state.astCustom) {
          rebuildAstFromSelections();
        }
        updateOutputs();
      });
      elements.selectedFilters.appendChild(operator);
    }
  });
}

function openFreeTextModal(term, picoTag) {
  pendingFreeText = { term, picoTag };
  elements.freeTextPrompt.textContent = `Add \"${term}\" as free text. Where should we search it?`;
  elements.freeTextModal.classList.add("is-open");
  elements.freeTextModal.hidden = false;
}

function closeFreeTextModal() {
  pendingFreeText = null;
  elements.freeTextModal.classList.remove("is-open");
  elements.freeTextModal.hidden = true;
}

function confirmFreeText() {
  if (!pendingFreeText) return;
  const scope = document.querySelector("input[name=\"freeTextScope\"]:checked").value;
  const tokenId = createToken({
    type: "TERM",
    label: pendingFreeText.term,
    source: "free",
    fieldScope: scope,
    picoTag: pendingFreeText.picoTag,
  });
  addTokenToPico(pendingFreeText.picoTag, tokenId);
  closeFreeTextModal();
}

function openFilterModal(filter) {
  currentFilterQuery = filter.query || "";
  elements.filterModalText.value = currentFilterQuery;
  elements.filterModal.classList.add("is-open");
  elements.filterModal.hidden = false;
}

function closeFilterModal() {
  currentFilterQuery = "";
  elements.filterModal.classList.remove("is-open");
  elements.filterModal.hidden = true;
}

async function copyFilterQuery() {
  if (!currentFilterQuery) return;
  try {
    await navigator.clipboard.writeText(currentFilterQuery);
  } catch (err) {
    elements.filterModalText.select();
    document.execCommand("copy");
  }
  showToast("Copied to clipboard");
}

function openHelpModal(topic) {
  state.activeHelpTopic = topic;
  state.activeInfoDb = null;
  renderInfoModal();
  elements.infoModal.classList.add("is-open");
  elements.infoModal.hidden = false;
}

function openInfoModal(db) {
  state.activeInfoDb = db;
  state.activeHelpTopic = null;
  renderInfoModal();
  elements.infoModal.classList.add("is-open");
  elements.infoModal.hidden = false;
}

function closeInfoModal() {
  state.activeInfoDb = null;
  state.activeHelpTopic = null;
  elements.infoModal.classList.remove("is-open");
  elements.infoModal.hidden = true;
}

function renderInfoModal() {
  if (state.activeHelpTopic) {
    renderHelpModal(state.activeHelpTopic);
    return;
  }
  const db = state.activeInfoDb;
  if (!db) return;
  const mode = getEffectiveSyntaxMode();
  const modeLabel = formatModeLabel(mode);

  elements.infoModalTitle.textContent = `${db} syntax (${modeLabel})`;
  elements.infoModalBody.innerHTML = "";

  const intro = document.createElement("p");
  intro.className = "muted";
  intro.textContent = `Current mode: ${modeLabel}`;
  elements.infoModalBody.appendChild(intro);

  const rules = document.createElement("ul");
  rules.className = "info-list";
  getSyntaxRules(db, mode).forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    rules.appendChild(item);
  });
  elements.infoModalBody.appendChild(rules);

  const refsTitle = document.createElement("h4");
  refsTitle.textContent = "References";
  elements.infoModalBody.appendChild(refsTitle);

  const refs = document.createElement("ul");
  refs.className = "info-links";
  (SYNTAX_REFERENCES[db] || []).forEach((ref) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = ref.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = ref.label;
    li.appendChild(link);
    refs.appendChild(li);
  });
  elements.infoModalBody.appendChild(refs);
}

function renderHelpModal(topic) {
  const content = getHelpContent(topic);
  if (!content) return;
  elements.infoModalTitle.textContent = content.title;
  elements.infoModalBody.innerHTML = "";

  content.paragraphs.forEach((text) => {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = text;
    elements.infoModalBody.appendChild(p);
  });

  if (content.bullets.length) {
    const list = document.createElement("ul");
    list.className = "info-list";
    content.bullets.forEach((itemText) => {
      const item = document.createElement("li");
      item.textContent = itemText;
      list.appendChild(item);
    });
    elements.infoModalBody.appendChild(list);
  }
}

function getHelpContent(topic) {
  if (topic === "shorten") {
    return {
      title: "Shorten query",
      paragraphs: [
        "Shorten query runs as a post-process after the full query is built.",
      ],
      bullets: [
        "It reduces OR-lists by applying truncation/wildcards and removing redundant Scopus plural variants.",
        "In Cochrane, wildcard phrases are rewritten using NEXT because wildcards are not supported inside phrase searches.",
        "This does not change the chosen syntax mode; it only compresses the final output.",
      ],
    };
  }
  if (topic === "mode") {
    return {
      title: "Search modes",
      paragraphs: [],
      bullets: [
        "Basic: one term per PICO input; fixed Optimised syntax with no mode selector.",
        "Advanced: multi-term logic and nesting; shows syntax mode selector and Shorten query.",
      ],
    };
  }
  if (topic === "syntax") {
    return {
      title: "Syntax modes",
      paragraphs: [
        "The syntax mode affects all five database outputs in Advanced mode.",
      ],
      bullets: [
        "Narrow: tighter field limits and non-exploded headings where applicable.",
        "Optimised: balanced field limits with exploded headings (default).",
        "Wide: broader field coverage with fewer field restrictions.",
      ],
    };
  }
  return null;
}

function getSyntaxRules(db, mode) {
  if (db === "PubMed") {
    if (mode === SYNTAX_MODE.NARROW) {
      return [
        "MeSH headings use [mh:noexp].",
        "Entry terms use [tiab] with double quotes.",
        "Apostrophes are converted to spaces.",
      ];
    }
    if (mode === SYNTAX_MODE.WIDE) {
      return [
        "MeSH headings use [mh].",
        "Entry terms use no field tags.",
        "Apostrophes are converted to spaces.",
      ];
    }
    return [
      "MeSH headings use [mh] (exploded).",
      "Entry terms use [tiab] with double quotes.",
      "Apostrophes are converted to spaces.",
    ];
  }

  if (db === "Embase") {
    if (mode === SYNTAX_MODE.NARROW) {
      return [
        "Emtree headings use /de (no explosion).",
        "Entry terms use :ti,ab.",
        "Apostrophes are converted to backticks (`).",
      ];
    }
    if (mode === SYNTAX_MODE.WIDE) {
      return [
        "Emtree headings use /exp (exploded).",
        "Entry terms use no field restriction.",
        "Apostrophes are converted to backticks (`).",
      ];
    }
    return [
      "Emtree headings use /exp (exploded).",
      "Entry terms use :ti,ab.",
      "Apostrophes are converted to backticks (`).",
    ];
  }

  if (db === "Scopus") {
    if (mode === SYNTAX_MODE.NARROW) {
      return [
        "Concept blocks use TITLE(...).",
        "Phrases use { ... }.",
        "Apostrophes are converted to spaces.",
      ];
    }
    if (mode === SYNTAX_MODE.WIDE) {
      return [
        "No field wrapper is applied.",
        "Phrases use double quotes.",
        "Apostrophes are converted to spaces.",
      ];
    }
    return [
      "Concept blocks use TITLE-ABS-KEY(...).",
      "Phrases use { ... }.",
      "Apostrophes are converted to spaces.",
    ];
  }

  if (db === "Web of Science") {
    if (mode === SYNTAX_MODE.NARROW) {
      return [
        "Concept blocks use TI=(...).",
        "Phrases use double quotes.",
        "Apostrophes are preserved.",
      ];
    }
    if (mode === SYNTAX_MODE.WIDE) {
      return [
        "Concept blocks use ALL=(...).",
        "Phrases use double quotes.",
        "Apostrophes are preserved.",
      ];
    }
    return [
      "Concept blocks use TS=(...).",
      "Phrases use double quotes.",
      "Apostrophes are preserved.",
    ];
  }

  if (db === "Cochrane") {
    if (mode === SYNTAX_MODE.NARROW) {
      return [
        "MeSH headings use [mh ^\"TERM\"].",
        "Entry terms use :ti,ab.",
        "Apostrophes are converted to spaces.",
      ];
    }
    if (mode === SYNTAX_MODE.WIDE) {
      return [
        "MeSH headings use [mh \"TERM\"].",
        "Entry terms use no field restriction.",
        "Apostrophes are converted to spaces.",
      ];
    }
    return [
      "MeSH headings use [mh \"TERM\"].",
      "Entry terms use :ti,ab,kw.",
      "Apostrophes are converted to spaces.",
    ];
  }

  return [];
}

function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 900);
}

function rebuildAstFromSelections() {
  state.selectedNodes.clear();
  state.ast = buildAstFromSelections();
  renderSummaryBuilder();
}

function buildAstFromSelections() {
  const root = createGroup("AND", []);

  PICO_FIELDS.forEach(({ key }) => {
    const selection = state.pico[key];
    if (!selection.tokens.length) return;
    const node = buildExpressionFromTokens(selection.tokens, selection.operators);
    root.children.push(node);
  });

  DB_LIST.forEach((db) => {
    const selection = state.filters[db];
    if (!selection.tokens.length) return;
    const node = buildExpressionFromTokens(selection.tokens, selection.operators);
    root.children.push(node);
  });

  return root;
}

function buildExpressionFromTokens(tokens, operators) {
  let current = createLeaf(tokens[0]);
  for (let i = 1; i < tokens.length; i += 1) {
    const operator = operators[i - 1] || "AND";
    const nextLeaf = createLeaf(tokens[i]);
    if (operator === "NOT") {
      current = createGroup("AND", [current, createNot(nextLeaf)]);
    } else {
      current = createGroup(operator, [current, nextLeaf]);
    }
  }
  return current;
}

function createGroup(operator, children) {
  return { id: `g${nodeSeq++}`, type: "GROUP", operator, children };
}

function createLeaf(tokenId) {
  return { id: `l${nodeSeq++}`, type: "LEAF", tokenId };
}

function createNot(child) {
  return { id: `n${nodeSeq++}`, type: "NOT", child };
}

function insertTokenIntoAst(tokenId) {
  if (!state.ast) {
    state.ast = createGroup("AND", []);
  }
  state.ast.children.push(createLeaf(tokenId));
  renderSummaryBuilder();
}

function removeTokenFromAst(tokenId) {
  if (!state.ast) return;
  removeNodeByToken(state.ast, tokenId);
  renderSummaryBuilder();
}

function removeNodeByToken(node, tokenId) {
  if (!node) return false;
  if (node.type === "LEAF" && node.tokenId === tokenId) {
    return true;
  }
  if (node.type === "NOT") {
    if (removeNodeByToken(node.child, tokenId)) {
      node.child = null;
      return true;
    }
  }
  if (node.type === "GROUP") {
    node.children = node.children.filter((child) => !removeNodeByToken(child, tokenId));
  }
  return false;
}

function renderSummaryBuilder() {
  if (state.mode !== "advanced") return;
  elements.summaryTree.innerHTML = "";
  if (!state.ast || !state.ast.children.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Add terms and filters to build your search tree.";
    elements.summaryTree.appendChild(empty);
    updateSelectionStatus();
    return;
  }

  const tree = renderNode(state.ast, null, true);
  elements.summaryTree.appendChild(tree);
  updateSelectionStatus();
}

function renderNode(node, parentId, isRoot) {
  if (node.type === "LEAF") {
    return renderLeafNode(node, parentId);
  }
  if (node.type === "NOT") {
    return renderNotNode(node, parentId);
  }
  return renderGroupNode(node, parentId, isRoot);
}

function renderLeafNode(node, parentId) {
  const token = state.tokens.get(node.tokenId);
  const row = document.createElement("div");
  row.className = "builder-node";
  if (state.selectedNodes.has(node.id)) {
    row.classList.add("is-selected");
  }
  row.draggable = true;
  row.dataset.nodeId = node.id;
  row.dataset.parentId = parentId || "";

  const selectBtn = buildSelectButton(node.id);
  row.appendChild(selectBtn);

  const label = document.createElement("button");
  label.type = "button";
  label.className = "builder-node-main";
  label.addEventListener("click", () => toggleSelection(node.id));
  const text = document.createElement("span");
  text.textContent = token ? token.label : "Unknown term";
  label.appendChild(text);

  if (token?.picoTag) {
    const picoTag = document.createElement("span");
    picoTag.className = "builder-tag";
    picoTag.textContent = token.picoTag;
    label.appendChild(picoTag);
  }

  row.appendChild(label);

  const actions = document.createElement("div");
  actions.className = "builder-node-actions";
  actions.appendChild(buildActionButton("Negate", () => toggleNegate(node.id)));
  actions.appendChild(buildActionButton("Delete", () => deleteSelectedNodes(node.id, true)));
  row.appendChild(actions);

  attachDragHandlers(row);
  attachNodeDropHandlers(row);
  return row;
}

function renderNotNode(node, parentId) {
  const wrapper = document.createElement("div");
  wrapper.className = "builder-group";
  if (state.selectedNodes.has(node.id)) {
    wrapper.classList.add("is-selected");
  }
  wrapper.dataset.nodeId = node.id;
  wrapper.dataset.parentId = parentId || "";
  wrapper.draggable = true;

  const header = document.createElement("div");
  header.className = "builder-group-header";

  const meta = document.createElement("div");
  meta.className = "builder-group-meta";
  meta.appendChild(buildSelectButton(node.id));
  const label = document.createElement("span");
  label.textContent = "Negated group";
  const badge = document.createElement("span");
  badge.className = "builder-negated";
  badge.textContent = "NOT";
  meta.append(label, badge);
  header.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "builder-group-actions";
  actions.appendChild(buildActionButton("Remove NOT", () => toggleNegate(node.id)));
  actions.appendChild(buildActionButton("Delete group", () => deleteSelectedNodes(node.id, true)));
  header.appendChild(actions);
  wrapper.appendChild(header);

  const children = document.createElement("div");
  children.className = "builder-children";
  children.dataset.parentId = node.id;
  if (node.child) {
    children.appendChild(renderNode(node.child, node.id, false));
  }
  wrapper.appendChild(children);

  attachDragHandlers(wrapper);
  attachNodeDropHandlers(wrapper);
  attachDropHandlers(children);

  return wrapper;
}

function renderGroupNode(node, parentId, isRoot) {
  const wrapper = document.createElement("div");
  wrapper.className = "builder-group";
  if (state.selectedNodes.has(node.id)) {
    wrapper.classList.add("is-selected");
  }
  wrapper.dataset.nodeId = node.id;
  wrapper.dataset.parentId = parentId || "";
  wrapper.draggable = true;

  const header = document.createElement("div");
  header.className = "builder-group-header";

  const left = document.createElement("div");
  left.className = "builder-group-meta";
  left.appendChild(buildSelectButton(node.id));

  const label = document.createElement("span");
  label.textContent = isRoot ? "Query group" : "Group";
  left.appendChild(label);

  const operatorSelect = document.createElement("select");
  operatorSelect.className = "operator-select";
  ["AND", "OR"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    operatorSelect.appendChild(option);
  });
  operatorSelect.value = node.operator;
  operatorSelect.addEventListener("change", () => {
    node.operator = operatorSelect.value;
    state.astCustom = true;
    updateOutputs();
  });

  left.appendChild(operatorSelect);
  header.appendChild(left);

  const controls = document.createElement("div");
  controls.className = "builder-group-actions";
  controls.appendChild(buildActionButton("Group selected", () => groupSelectedNodes(node.id)));
  controls.appendChild(buildActionButton("Ungroup selected", () => ungroupSelectedNodes(node.id)));
  controls.appendChild(buildActionButton("Negate selected", () => negateSelectedNodes(node.id)));
  controls.appendChild(buildActionButton("Delete selected", () => deleteSelectedNodes(node.id)));
  header.appendChild(controls);

  wrapper.appendChild(header);

  const children = document.createElement("div");
  children.className = "builder-children";
  children.dataset.parentId = node.id;
  node.children.forEach((child) => {
    children.appendChild(renderNode(child, node.id, false));
  });
  wrapper.appendChild(children);

  attachDragHandlers(wrapper);
  attachNodeDropHandlers(wrapper);
  attachDropHandlers(children);

  return wrapper;
}

function buildSelectButton(nodeId) {
  const button = document.createElement("button");
  const isSelected = state.selectedNodes.has(nodeId);
  button.type = "button";
  button.className = "builder-select";
  button.classList.toggle("is-active", isSelected);
  button.textContent = isSelected ? "Selected" : "Select";
  button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSelection(nodeId);
  });
  return button;
}

function buildActionButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-secondary btn-compact";
  button.textContent = label;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    state.astCustom = true;
    onClick();
  });
  return button;
}

function toggleSelection(nodeId) {
  if (state.selectedNodes.has(nodeId)) {
    state.selectedNodes.delete(nodeId);
  } else {
    state.selectedNodes.add(nodeId);
  }
  renderSummaryBuilder();
}

function clearSelection() {
  state.selectedNodes.clear();
  renderSummaryBuilder();
}

function updateSelectionStatus() {
  if (!elements.selectionStatus) return;
  elements.selectionStatus.textContent = `${state.selectedNodes.size} selected`;
}

function groupSelectedNodes(parentId) {
  const parent = findNodeById(state.ast, parentId);
  if (!parent || parent.type !== "GROUP") return;
  const selectedChildren = parent.children.filter((child) => state.selectedNodes.has(child.id));
  if (selectedChildren.length < 2) return;

  const indices = parent.children
    .map((child, idx) => (state.selectedNodes.has(child.id) ? idx : -1))
    .filter((idx) => idx !== -1);
  const insertAt = Math.min(...indices);

  parent.children = parent.children.filter((child) => !state.selectedNodes.has(child.id));
  const grouped = createGroup("AND", selectedChildren);
  parent.children.splice(insertAt, 0, grouped);
  state.selectedNodes.clear();
  renderSummaryBuilder();
  updateOutputs();
}

function ungroupSelectedNodes(parentId) {
  const parent = findNodeById(state.ast, parentId);
  if (!parent || parent.type !== "GROUP") return;

  const newChildren = [];
  parent.children.forEach((child) => {
    if (state.selectedNodes.has(child.id) && child.type === "GROUP") {
      newChildren.push(...child.children);
    } else {
      newChildren.push(child);
    }
  });
  parent.children = newChildren;
  state.selectedNodes.clear();
  renderSummaryBuilder();
  updateOutputs();
}

function negateSelectedNodes(parentId) {
  const parent = findNodeById(state.ast, parentId);
  if (!parent || parent.type !== "GROUP") return;

  parent.children = parent.children.map((child) => {
    if (!state.selectedNodes.has(child.id)) return child;
    return wrapOrUnwrapNot(child);
  });
  state.selectedNodes.clear();
  renderSummaryBuilder();
  updateOutputs();
}

function deleteSelectedNodes(parentId, deleteSelf = false) {
  const parent = findNodeById(state.ast, parentId);
  if (!parent) return;

  if (deleteSelf) {
    const tokens = collectTokenIds(parent);
    tokens.forEach((tokenId) => removeToken(tokenId, { skipAst: true }));
    removeNodeById(state.ast, parentId);
    state.selectedNodes.clear();
    renderSummaryBuilder();
    updateOutputs();
    return;
  }

  if (parent.type !== "GROUP") return;

  const removed = [];
  parent.children = parent.children.filter((child) => {
    if (state.selectedNodes.has(child.id)) {
      removed.push(child);
      return false;
    }
    return true;
  });

  removed.forEach((node) => {
    collectTokenIds(node).forEach((tokenId) => removeToken(tokenId, { skipAst: true }));
  });

  state.selectedNodes.clear();
  renderSummaryBuilder();
  updateOutputs();
}

function toggleNegate(nodeId) {
  const parentInfo = findParentOfNode(state.ast, nodeId);
  if (!parentInfo) return;
  const { parent, index } = parentInfo;
  if (parent.type === "GROUP") {
    parent.children[index] = wrapOrUnwrapNot(parent.children[index]);
  } else if (parent.type === "NOT") {
    parent.child = wrapOrUnwrapNot(parent.child);
  }
  renderSummaryBuilder();
  updateOutputs();
}

function wrapOrUnwrapNot(node) {
  if (node.type === "NOT") {
    return node.child;
  }
  return createNot(node);
}

function collectTokenIds(node) {
  const tokens = [];
  traverseAst(node, (current) => {
    if (current.type === "LEAF") tokens.push(current.tokenId);
  });
  return tokens;
}

function findNodeById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.type === "NOT") {
    return findNodeById(node.child, id);
  }
  if (node.type === "GROUP") {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

function findParentOfNode(node, id, parent = null) {
  if (!node) return null;
  if (node.type === "GROUP") {
    const index = node.children.findIndex((child) => child.id === id);
    if (index !== -1) return { parent: node, index };
    for (const child of node.children) {
      const found = findParentOfNode(child, id, node);
      if (found) return found;
    }
  }
  if (node.type === "NOT") {
    if (node.child && node.child.id === id) return { parent: node, index: 0 };
    return findParentOfNode(node.child, id, node);
  }
  return null;
}

function traverseAst(node, callback) {
  if (!node) return;
  callback(node);
  if (node.type === "GROUP") {
    node.children.forEach((child) => traverseAst(child, callback));
  }
  if (node.type === "NOT" && node.child) {
    traverseAst(node.child, callback);
  }
}

function removeNodeById(node, id) {
  if (!node || node.type !== "GROUP") return false;
  const index = node.children.findIndex((child) => child.id === id);
  if (index !== -1) {
    node.children.splice(index, 1);
    return true;
  }
  for (const child of node.children) {
    if (child.type === "GROUP") {
      if (removeNodeById(child, id)) return true;
    } else if (child.type === "NOT") {
      if (child.child && child.child.id === id) {
        child.child = null;
        return true;
      }
    }
  }
  return false;
}

let draggedNodeId = null;

function attachDragHandlers(element) {
  element.addEventListener("dragstart", (event) => {
    draggedNodeId = element.dataset.nodeId;
    event.dataTransfer.setData("text/plain", draggedNodeId);
  });
}

function attachDropHandlers(container) {
  container.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  container.addEventListener("drop", (event) => {
    event.preventDefault();
    const targetParentId = container.dataset.parentId;
    if (!draggedNodeId || !targetParentId) return;
    if (draggedNodeId === targetParentId) return;
    moveNode(draggedNodeId, targetParentId, null);
    draggedNodeId = null;
  });
}

function attachNodeDropHandlers(element) {
  element.addEventListener("dragover", (event) => {
    event.preventDefault();
    element.classList.add("drag-over");
  });
  element.addEventListener("dragleave", () => {
    element.classList.remove("drag-over");
  });
  element.addEventListener("drop", (event) => {
    event.preventDefault();
    element.classList.remove("drag-over");
    const targetParentId = element.dataset.parentId;
    const beforeId = element.dataset.nodeId;
    if (!targetParentId || !beforeId || !draggedNodeId) return;
    moveNode(draggedNodeId, targetParentId, beforeId);
    draggedNodeId = null;
  });
}

function moveNode(nodeId, targetParentId, beforeId) {
  const target = findNodeById(state.ast, targetParentId);
  if (!target || target.type !== "GROUP") return;
  const node = findNodeById(state.ast, nodeId);
  if (!node) return;
  if (node.id === targetParentId || findNodeById(node, targetParentId)) return;
  const detached = detachNode(state.ast, nodeId);
  if (!detached) return;

  if (beforeId) {
    const idx = target.children.findIndex((child) => child.id === beforeId);
    if (idx !== -1) {
      target.children.splice(idx, 0, detached);
    } else {
      target.children.push(detached);
    }
  } else {
    target.children.push(detached);
  }

  state.astCustom = true;
  renderSummaryBuilder();
  updateOutputs();
}

function detachNode(node, nodeId) {
  if (!node) return null;
  if (node.type === "GROUP") {
    const index = node.children.findIndex((child) => child.id === nodeId);
    if (index !== -1) {
      return node.children.splice(index, 1)[0];
    }
    for (const child of node.children) {
      const detached = detachNode(child, nodeId);
      if (detached) return detached;
    }
  }
  if (node.type === "NOT" && node.child) {
    if (node.child.id === nodeId) {
      const detached = node.child;
      node.child = null;
      return detached;
    }
    return detachNode(node.child, nodeId);
  }
  return null;
}

function isDescendant(nodeId, targetId) {
  const target = findNodeById(state.ast, nodeId);
  if (!target) return false;
  let found = false;
  traverseAst(target, (node) => {
    if (node.id === targetId) {
      found = true;
    }
  });
  return found;
}

function updateOutputs() {
  const ast = state.mode === "advanced" && state.astCustom ? state.ast : buildAstFromSelections();
  const syntaxMode = getEffectiveSyntaxMode();
  const shorten = state.mode === "advanced" && shortenQueryEnabled;
  DB_LIST.forEach((db) => {
    const { query, notes, warnings } = generateQuery(db, ast, true, syntaxMode, shorten);
    const textarea = outputTextareas.get(db);
    const notesEl = outputNotes.get(db);
    const warningsEl = outputWarnings.get(db);

    if (textarea) {
      textarea.value = query || "";
    }
    if (notesEl) {
      notesEl.textContent = notes.length ? notes.join(" ") : "";
    }
    if (warningsEl) {
      warningsEl.textContent = warnings.length ? warnings.join(" ") : "";
    }
  });
  debugSynonymExpansion();
}

function generateQuery(db, ast, optimized, syntaxMode, shorten) {
  const notes = [];
  const clause = buildClause(ast, db, { optimized, notes, syntaxMode });
  let query = clause || "";
  if (shorten) {
    query = shortenQueryAfterBuild(db, query);
  }
  const warnings = buildWarnings(db, query, ast);
  return { query, notes, warnings };
}

function shortenQueryAfterBuild(db, query) {
  if (!query) return query;
  let output = query;
  if (db === "Scopus") {
    output = applyScopusQuoteIterationCollapse(output);
  }
  output = applyIterationTruncation(db, output);
  if (db === "Scopus") {
    output = enforceScopusWildcardQuotes(output);
  }
  if (db === "Cochrane") {
    output = enforceCochraneWildcardNext(output);
  }
  return output;
}

function applyScopusQuoteIterationCollapse(query) {
  const pairs = findParenPairs(query);
  if (!pairs.length) return query;
  let output = query;
  const sorted = pairs.sort((a, b) => b.start - a.start);
  sorted.forEach(({ start, end }) => {
    const content = output.slice(start + 1, end);
    const collapsed = collapseScopusOrList(content);
    if (collapsed !== content) {
      output = `${output.slice(0, start + 1)}${collapsed}${output.slice(end)}`;
    }
  });
  return output;
}

function applyIterationTruncation(db, query) {
  const pairs = findParenPairs(query);
  if (!pairs.length) return query;
  let output = query;
  const sorted = pairs.sort((a, b) => b.start - a.start);
  sorted.forEach(({ start, end }) => {
    const content = output.slice(start + 1, end);
    const collapsed = collapseIterationOrList(db, content);
    if (collapsed !== content) {
      output = `${output.slice(0, start + 1)}${collapsed}${output.slice(end)}`;
    }
  });
  return output;
}

function enforceScopusWildcardQuotes(query) {
  return query.replace(/\{([^}]*[*?][^}]*)\}/g, (_, inner) => {
    const cleaned = inner.replace(/\\"/g, "\"");
    return `"${escapeDoubleQuotes(cleaned)}"`;
  });
}

function enforceCochraneWildcardNext(query) {
  const protectedBlocks = [];
  const protectedQuery = query.replace(/\[mh[^\]]*\]/gi, (match) => {
    const token = `__MHBLOCK_${protectedBlocks.length}__`;
    protectedBlocks.push(match);
    return token;
  });
  const rewritten = replaceCochraneWildcardPhrases(protectedQuery);
  return protectedBlocks.reduce((acc, block, idx) => acc.replace(`__MHBLOCK_${idx}__`, block), rewritten);
}

function replaceCochraneWildcardPhrases(content) {
  const regex = /"([^"]*)"/gi;
  let result = "";
  let cursor = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;
    result += content.slice(cursor, start);

    const phrase = match[1] || "";
    if (!/[*?]/.test(phrase)) {
      result += content.slice(start, end);
      cursor = end;
      continue;
    }

    const after = content.slice(end);
    const suffixMatch = after.match(/^(\s*:[^\s)]+)/);
    const suffix = suffixMatch && suffixMatch[1] ? suffixMatch[1] : "";

    const replacement = buildCochraneNextReplacement(phrase, suffix || "");
    if (replacement) {
      result += replacement;
      cursor = end + suffix.length;
      regex.lastIndex = cursor;
    } else {
      result += content.slice(start, end);
      cursor = end;
    }
  }
  result += content.slice(cursor);
  return result;
}

function buildCochraneNextExpression(raw) {
  const words = collapseWhitespace(raw).split(" ").filter(Boolean);
  if (words.length < 2) {
    return raw;
  }
  return `(${words.join(" NEXT ")})`;
}

function buildCochraneNextReplacement(phrase, suffix) {
  if (!/[*?]/.test(phrase)) return null;
  if (phrase.toUpperCase().includes(" NEXT ")) return null;
  if (/[:()[\]]/.test(phrase)) return null;
  if (/\b(OR|AND|NOT)\b/i.test(phrase)) return null;
  const cleaned = collapseWhitespace(phrase);
  if (!cleaned) return null;
  if (!/\s/.test(cleaned)) {
    return `${cleaned}${suffix || ""}`;
  }
  const nextExpr = buildCochraneNextExpression(cleaned);
  return `${nextExpr}${suffix || ""}`;
}

function collapseIterationOrList(db, content) {
  const { parts, hasOtherOps } = splitGenericOrParts(content);
  if (hasOtherOps || parts.length < 2) return content;
  const parsed = parts.map((part) => parseTermPart(db, part));
  if (parsed.some((item) => !item)) return content;

  const groups = new Map();
  parsed.forEach((item, index) => {
    if (!item || item.skip || item.raw.includes("*")) return;
    const keyInfo = buildIterationKeyInfo(item.raw);
    if (!keyInfo) return;
    const key = `${item.suffix}|${item.wrapper}|${keyInfo.key}`;
    const group = groups.get(key) || { indices: [] };
    group.indices.push(index);
    groups.set(key, group);
  });

  const replacements = new Map();
  groups.forEach((group) => {
    if (group.indices.length < 2) return;
    const replacement = buildWildcardReplacement(db, parsed, group);
    if (!replacement) return;
    replacements.set(group.indices[0], replacement);
    group.indices.slice(1).forEach((idx) => replacements.set(idx, ""));
  });

  const nextParts = replacements.size
    ? parts.map((part, idx) => {
      if (!replacements.has(idx)) return part.trim();
      const value = replacements.get(idx);
      return value || "";
    }).filter(Boolean)
    : parts.map((part) => part.trim()).filter(Boolean);

  const stemCollapsed = collapseStemVariants(db, nextParts);
  return stemCollapsed.join(" OR ");
}

function splitGenericOrParts(content) {
  const parts = [];
  let buffer = "";
  let hasOtherOps = false;
  let inDouble = false;
  let inSingle = false;
  let depth = 0;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (ch === "\"" && !inSingle) {
      inDouble = !inDouble;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    }
    if (!inDouble && !inSingle) {
      if (ch === "(") depth += 1;
      if (ch === ")") depth = Math.max(0, depth - 1);
      if (depth === 0) {
        if (content.startsWith(" AND ", i) || content.startsWith(" NOT ", i)) {
          hasOtherOps = true;
        }
        if (content.startsWith(" OR ", i)) {
          parts.push(buffer.trim());
          buffer = "";
          i += 3;
          continue;
        }
      }
    }
    buffer += ch;
  }
  parts.push(buffer.trim());
  return { parts: parts.filter((part) => part.length), hasOtherOps };
}

function parseTermPart(db, part) {
  const trimmed = part.trim();
  if (!trimmed) return null;

  if (db === "PubMed") {
    const tagMatch = trimmed.match(/^(.*?)(\[[^\]]+\])$/);
    const termPart = tagMatch ? tagMatch[1].trim() : trimmed;
    const suffix = tagMatch ? tagMatch[2] : "";
    if (/^\[mh/i.test(suffix)) return { skip: true };
    const { raw, wrapper } = unwrapTerm(termPart);
    if (!raw) return null;
    return { raw, wrapper, suffix, original: trimmed };
  }

  if (db === "Embase") {
    if (/\/(exp|de)$/i.test(trimmed)) return { skip: true };
    const fieldMatch = trimmed.match(/^(.*?)(:ti,ab,kw|:ti,ab)$/i);
    const termPart = fieldMatch ? fieldMatch[1].trim() : trimmed;
    const suffix = fieldMatch ? fieldMatch[2] : "";
    const { raw, wrapper } = unwrapTerm(termPart);
    if (!raw) return null;
    return { raw, wrapper: wrapper || "'", suffix, original: trimmed };
  }

  if (db === "Cochrane") {
    if (/^\[mh/i.test(trimmed)) return { skip: true };
    const fieldMatch = trimmed.match(/^(.*?)(:ti,ab,kw|:ti,ab)$/i);
    const termPart = fieldMatch ? fieldMatch[1].trim() : trimmed;
    const suffix = fieldMatch ? fieldMatch[2] : "";
    const { raw, wrapper } = unwrapTerm(termPart);
    if (!raw) return null;
    return { raw, wrapper, suffix, original: trimmed };
  }

  if (db === "Web of Science") {
    const { raw, wrapper } = unwrapTerm(trimmed);
    if (!raw) return null;
    return { raw, wrapper, suffix: "", original: trimmed };
  }

  if (db === "Scopus") {
    const { raw, wrapper } = unwrapScopusTerm(trimmed);
    if (!raw) return null;
    return { raw, wrapper, suffix: "", original: trimmed };
  }

  return null;
}

function unwrapTerm(termPart) {
  const trimmed = termPart.trim();
  if (!trimmed) return { raw: "", wrapper: "" };
  if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
    return { raw: trimmed.slice(1, -1), wrapper: "\"" };
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return { raw: trimmed.slice(1, -1), wrapper: "'" };
  }
  return { raw: trimmed, wrapper: "" };
}

function unwrapScopusTerm(termPart) {
  const trimmed = termPart.trim();
  if (!trimmed) return { raw: "", wrapper: "" };
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return { raw: trimmed.slice(1, -1), wrapper: "{" };
  }
  if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
    return { raw: trimmed.slice(1, -1), wrapper: "\"" };
  }
  return { raw: trimmed, wrapper: "" };
}

function buildIterationKeyInfo(raw) {
  const tokens = tokenizeTerm(raw);
  if (!tokens.length) return null;
  const normalized = tokens
    .map((token) => normalizeToken(singularizeToken(token.core)))
    .filter(Boolean);
  if (!normalized.length) return null;
  return { key: normalized.join(" "), tokens };
}

function buildWildcardReplacement(db, parsed, group) {
  const indices = group.indices;
  const items = indices.map((idx) => parsed[idx]).filter(Boolean);
  if (items.some((item) => !item || item.raw.includes("*"))) return null;

  const tokenSets = items.map((item) => tokenizeTerm(item.raw));
  const length = tokenSets[0]?.length || 0;
  if (!length || tokenSets.some((tokens) => tokens.length !== length)) return null;

  const baseTokens = tokenSets[0].map((token) => singularizeToken(token.core));
  if (!baseTokens.length) return null;

  const variantPositions = [];
  for (let i = 0; i < length; i += 1) {
    const base = normalizeToken(baseTokens[i]);
    if (!base) return null;
    const allMatch = tokenSets.every((tokens) => normalizeToken(singularizeToken(tokens[i].core)) === base);
    if (!allMatch) return null;
    const distinct = new Set(tokenSets.map((tokens) => normalizeToken(tokens[i].core)));
    if (distinct.size > 1) {
      variantPositions.push(i);
    }
  }

  if (variantPositions.length !== 1) return null;
  const position = variantPositions[0];

  let repIndex = indices[0];
  indices.forEach((idx) => {
    if (parsed[idx].raw.length < parsed[repIndex].raw.length) {
      repIndex = idx;
    }
  });
  const rep = parsed[repIndex];
  const repTokens = tokenizeTerm(rep.raw);
  const baseToken = singularizeToken(repTokens[position].core);
  if (!baseToken) return null;
  repTokens[position].core = `${baseToken}*`;
  const rebuilt = rebuildTokens(repTokens);
  const wrapper = shouldQuoteWildcard(db) ? getWildcardWrapper(db, rep.wrapper, rebuilt) : "";
  const wrapped = wrapper ? `${wrapper}${rebuilt}${wrapper === "{" ? "}" : wrapper}` : rebuilt;
  return `${wrapped}${rep.suffix || ""}`;
}

function collapseStemVariants(db, parts) {
  const parsed = parts.map((part) => parseTermPart(db, part));
  if (parsed.some((item) => !item)) return parts;

  const groups = new Map();
  parsed.forEach((item, idx) => {
    if (!item || item.skip || item.raw.includes("*")) return;
    if (/\s/.test(item.raw)) return;
    if (/[^a-z0-9]/i.test(item.raw)) return;
    const stem = stemFromToken(item.raw);
    if (!stem || stem.length < 5) return;
    const key = `${item.suffix}|${item.wrapper}|${stem.toLowerCase()}`;
    const group = groups.get(key) || [];
    group.push(idx);
    groups.set(key, group);
  });

  const replacements = new Map();
  groups.forEach((indices) => {
    if (indices.length < 2) return;
    let repIndex = indices[0];
    indices.forEach((idx) => {
      if (parsed[idx].raw.length < parsed[repIndex].raw.length) {
        repIndex = idx;
      }
    });
    const rep = parsed[repIndex];
    const stem = stemFromToken(rep.raw);
    if (!stem) return;
    const wildcard = `${stem}*`;
    const wrapper = shouldQuoteWildcard(db) ? getWildcardWrapper(db, rep.wrapper, wildcard) : "";
    const wrapped = wrapper ? `${wrapper}${wildcard}${wrapper === "{" ? "}" : wrapper}` : wildcard;
    replacements.set(indices[0], `${wrapped}${rep.suffix || ""}`);
    indices.slice(1).forEach((idx) => replacements.set(idx, ""));
  });

  if (!replacements.size) return parts;
  return parts.map((part, idx) => {
    if (!replacements.has(idx)) return part.trim();
    const value = replacements.get(idx);
    return value || "";
  }).filter(Boolean);
}

function shouldQuoteWildcard(db) {
  return db === "PubMed" || db === "Embase" || db === "Web of Science" || db === "Scopus" || db === "Cochrane";
}

function getWildcardWrapper(db, wrapper, term) {
  if (!wrapper) return "";
  if (db !== "Scopus") return wrapper;
  if (wrapper === "{" && /[*?]/.test(term)) return "\"";
  return wrapper;
}

function stemFromToken(token) {
  const lower = token.toLowerCase();
  const suffixes = ["ing", "tion", "tions", "ed", "es", "s", "al", "als", "ic"];
  for (const suffix of suffixes) {
    if (lower.endsWith(suffix) && token.length - suffix.length >= 5) {
      return token.slice(0, -suffix.length);
    }
  }
  return "";
}

function tokenizeTerm(raw) {
  return raw.split(/\s+/g).filter(Boolean).map((token) => {
    const match = token.match(/^(.+?)([,:;])?$/);
    const core = match ? match[1] : token;
    const punct = match && match[2] ? match[2] : "";
    return { core, punct };
  });
}

function rebuildTokens(tokens) {
  return tokens.map((token) => `${token.core}${token.punct}`).join(" ");
}

function normalizeToken(token) {
  return token.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function singularizeToken(token) {
  let cleaned = token;
  const lower = cleaned.toLowerCase();
  if (lower.endsWith("'s") || lower.endsWith("’s")) {
    cleaned = cleaned.slice(0, -2);
  } else if (lower.endsWith("s'")) {
    cleaned = cleaned.slice(0, -2);
  }
  const lowerClean = cleaned.toLowerCase();
  if (lowerClean.endsWith("ies") && cleaned.length > 3) {
    cleaned = `${cleaned.slice(0, -3)}y`;
  } else if (lowerClean.endsWith("es") && cleaned.length > 2) {
    cleaned = cleaned.slice(0, -2);
  } else if (lowerClean.endsWith("s") && cleaned.length > 1) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

function findParenPairs(text) {
  const stack = [];
  const pairs = [];
  let inDouble = false;
  let inSingle = false;
  let inBrace = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "\"" && !inSingle && !inBrace) {
      inDouble = !inDouble;
    }
    if (ch === "'" && !inDouble && !inBrace) {
      inSingle = !inSingle;
    }
    if (!inDouble && !inSingle) {
      if (ch === "{") inBrace = true;
      if (ch === "}") inBrace = false;
    }
    if (!inDouble && !inSingle && !inBrace) {
      if (ch === "(") {
        stack.push(i);
      } else if (ch === ")" && stack.length) {
        const start = stack.pop();
        pairs.push({ start, end: i });
      }
    }
  }
  return pairs;
}

function collapseScopusOrList(content) {
  const { parts, hasOtherOps } = splitScopusOrParts(content);
  if (hasOtherOps || parts.length < 2) return content;

  const parsed = parts.map((part) => parseScopusTerm(part));
  if (parsed.some((item) => !item)) return content;

  const counts = new Map();
  const reps = new Map();
  parsed.forEach((item) => {
    const key = iterationKey(item.raw);
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
    const candidate = item.raw.trim();
    const existing = reps.get(key);
    if (!existing || candidate.length < existing.length) {
      reps.set(key, candidate);
    }
  });

  const output = [];
  const used = new Set();
  parsed.forEach((item, idx) => {
    const key = iterationKey(item.raw);
    const count = counts.get(key) || 0;
    if (count > 1) {
      if (used.has(key)) return;
      used.add(key);
      const rep = reps.get(key) || item.raw;
      output.push(`\"${escapeDoubleQuotes(collapseWhitespace(rep))}\"`);
      return;
    }
    output.push(parts[idx].trim());
  });

  return output.join(" OR ");
}

function splitScopusOrParts(content) {
  const parts = [];
  let buffer = "";
  let hasOtherOps = false;
  let inDouble = false;
  let inBrace = false;
  let depth = 0;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (ch === "\"" && !inBrace) {
      inDouble = !inDouble;
    }
    if (!inDouble) {
      if (ch === "{") inBrace = true;
      if (ch === "}") inBrace = false;
    }
    if (!inDouble && !inBrace) {
      if (ch === "(") depth += 1;
      if (ch === ")") depth = Math.max(0, depth - 1);
      if (depth === 0) {
        if (content.startsWith(" AND ", i) || content.startsWith(" NOT ", i)) {
          hasOtherOps = true;
        }
        if (content.startsWith(" OR ", i)) {
          parts.push(buffer.trim());
          buffer = "";
          i += 3;
          continue;
        }
      }
    }
    buffer += ch;
  }
  parts.push(buffer.trim());
  return { parts: parts.filter((part) => part.length), hasOtherOps };
}

function parseScopusTerm(part) {
  const trimmed = part.trim();
  if (!trimmed) return null;
  let raw = trimmed;
  if (raw.startsWith("{") && raw.endsWith("}")) {
    raw = raw.slice(1, -1);
  } else if (raw.startsWith("\"") && raw.endsWith("\"")) {
    raw = raw.slice(1, -1);
  }
  if (/[()]/.test(raw)) return null;
  return { original: trimmed, raw: raw.replace(/\\"/g, "\"") };
}

function iterationKey(term) {
  const base = normalizeIterationBase(term);
  return base ? base.toLowerCase() : "";
}

function normalizeIterationBase(term) {
  const cleaned = collapseWhitespace(term);
  if (!cleaned) return "";
  const tokens = cleaned.split(" ");
  if (tokens.length > 1 && tokens[tokens.length - 1].toLowerCase() === "s") {
    tokens.pop();
  }
  if (!tokens.length) return "";
  const lastIndex = tokens.length - 1;
  let last = tokens[lastIndex];
  const lower = last.toLowerCase();
  if (lower.endsWith("'s") || lower.endsWith("’s")) {
    last = last.slice(0, -2);
  } else if (lower.endsWith("s'")) {
    last = last.slice(0, -2);
  }
  if (last.length > 2 && lower.endsWith("es")) {
    last = last.slice(0, -2);
  } else if (last.length > 1 && lower.endsWith("s")) {
    last = last.slice(0, -1);
  }
  tokens[lastIndex] = last;
  return collapseWhitespace(tokens.join(" "));
}

function debugSynonymExpansion() {
  if (debugLogged) return;
  const token = Array.from(state.tokens.values()).find((item) => item.type === "TERM" && item.source !== "free");
  if (!token) return;
  const pubmed = outputTextareas.get("PubMed")?.value || "";
  const scopus = outputTextareas.get("Scopus")?.value || "";
  const emb = outputTextareas.get("Embase")?.value || "";
  console.log("[debug] Synonym expansion", {
    term: token.label,
    synonymCount: token.synonyms.length,
    sampleSynonyms: token.synonyms.slice(0, 5),
    pubmed,
    scopus,
  });
  const meshToken = Array.from(state.tokens.values()).find((item) => item.type === "TERM" && item.source === "mesh");
  if (meshToken) {
    console.log("[debug] MeSH token check", {
      meshTerm: meshToken.label,
      pubmedHasMesh: pubmed.includes("[mh"),
    });
  }
  if (token.source === "emtree") {
    console.log("[debug] Emtree crosswalk", {
      meshEquivalents: token.meshEquivalents || [],
      meshReason: token.meshReason || null,
      pubmedHasMesh: pubmed.includes("[mh"),
      embHasExp: emb.includes("/exp"),
    });
  }
  debugLogged = true;
}

if (typeof window !== "undefined") {
  window.__testCochraneShorten = () => {
    const sample = '([mh "Alzheimer Disease"] OR ("Alzheimer disease*":ti,ab,kw))';
    const output = enforceCochraneWildcardNext(sample);
    console.log("[test] Cochrane shorten", { input: sample, output });
    return output;
  };
}

function buildClause(node, db, ctx) {
  if (!node) return "";
  if (node.type === "LEAF") {
    return tokenToClause(node.tokenId, db, ctx);
  }
  if (node.type === "NOT") {
    const childClause = buildClause(node.child, db, ctx);
    if (!childClause) return "";
    const wrapped = needsParens(childClause) ? `(${childClause})` : childClause;
    return `NOT ${wrapped}`;
  }
  if (node.type === "GROUP") {
    return buildGroupClause(node, db, ctx);
  }
  return "";
}

function buildGroupClause(node, db, ctx) {
  const clauses = [];
  const truncated = new Set();

  if (ctx.optimized && node.operator === "OR") {
    const truncation = computeTruncation(node.children, db, ctx);
    truncation.tokenIds.forEach((id) => truncated.add(id));
    truncation.clauses.forEach((clause) => clauses.push(clause));
  }

  node.children.forEach((child) => {
    if (child.type === "LEAF" && truncated.has(child.tokenId)) return;
    const clause = buildClause(child, db, ctx);
    if (clause) clauses.push(clause);
  });

  let finalClauses = clauses;
  if (ctx.optimized) {
    finalClauses = dedupeClauses(finalClauses);
  }

  if (!finalClauses.length) return "";
  if (finalClauses.length === 1) return finalClauses[0];
  return `(${finalClauses.join(` ${node.operator} `)})`;
}

function computeTruncation(children, db, ctx) {
  const tokenIds = new Set();
  const clauses = [];
  const groups = new Map();
  const suffixes = ["ing", "tion", "tions", "ed", "es", "s", "al", "als"];

  children.forEach((child) => {
    if (child.type !== "LEAF") return;
    const token = state.tokens.get(child.tokenId);
    if (!token || token.type !== "TERM" || token.source !== "free") return;
    if (/\s/.test(token.label.trim())) return;
    const norm = normalizeForCompare(token.label);
    if (!norm) return;
    if (!/^[a-z]+$/.test(norm)) return;

    let stem = "";
    for (const suffix of suffixes) {
      if (norm.endsWith(suffix) && norm.length - suffix.length >= 5) {
        stem = norm.slice(0, -suffix.length);
        break;
      }
    }
    if (!stem) return;

    const key = `${token.fieldScope || "all"}|${stem}`;
    const bucket = groups.get(key) || [];
    bucket.push({ tokenId: child.tokenId, fieldScope: token.fieldScope, stem });
    groups.set(key, bucket);
  });

  groups.forEach((bucket) => {
    if (bucket.length < 2) return;
    const { stem, fieldScope } = bucket[0];
    const truncatedTerm = `${stem}*`;
    const clause = formatFreeTextClause(truncatedTerm, fieldScope, db, true, ctx.syntaxMode || SYNTAX_MODE.OPT);
    if (!clause) return;
    clauses.push(clause);
    ctx.notes.push(`Truncation applied: ${truncatedTerm}`);
    bucket.forEach((item) => tokenIds.add(item.tokenId));
  });

  return { tokenIds, clauses };
}

function dedupeClauses(clauses) {
  const seen = new Set();
  const result = [];
  clauses.forEach((clause) => {
    const key = normalizeForCompare(clause);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(clause);
  });
  return result;
}

function tokenToClause(tokenId, db, ctx) {
  const token = state.tokens.get(tokenId);
  if (!token) return "";

  if (token.type === "FILTER") {
    if (token.db !== db) return "";
    return token.query || "";
  }

  if (token.type !== "TERM") return "";
  const mode = ctx.syntaxMode || SYNTAX_MODE.OPT;
  const expandedTerms = buildExpandedTerms(token);
  if (!expandedTerms.length) return "";

  if (db === "PubMed") {
    return buildPubMedClause(token, expandedTerms, mode, false);
  }
  if (db === "Embase") {
    return buildEmbaseClause(token, expandedTerms, mode, false);
  }
  if (db === "Scopus") {
    return buildScopusClause(token, expandedTerms, mode, false);
  }
  if (db === "Cochrane") {
    return buildCochraneClause(token, expandedTerms, mode, false);
  }
  if (db === "Web of Science") {
    return buildWosClause(token, expandedTerms, mode, false);
  }
  return expandedTerms.length > 1 ? `(${expandedTerms.join(" OR ")})` : expandedTerms[0];
}

function formatFreeTextClause(term, fieldScope, db, allowWildcard, mode) {
  if (!term) return "";
  const token = {
    source: "free",
    fieldScope: fieldScope || "all",
  };
  const terms = [term];

  if (db === "PubMed") {
    return buildPubMedClause(token, terms, mode, allowWildcard);
  }
  if (db === "Embase") {
    return buildEmbaseClause(token, terms, mode, allowWildcard);
  }
  if (db === "Scopus") {
    return buildScopusClause(token, terms, mode, allowWildcard);
  }
  if (db === "Cochrane") {
    return buildCochraneClause(token, terms, mode, allowWildcard);
  }
  if (db === "Web of Science") {
    return buildWosClause(token, terms, mode, allowWildcard);
  }
  return term;
}

function buildExpandedTerms(token) {
  const candidates = [token.label, ...(token.synonyms || [])];
  const deduped = [];
  const seen = new Set();
  candidates.forEach((term) => {
    if (!term || !term.trim()) return;
    const normalized = normalizeForCompare(term);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    deduped.push(term.trim());
  });
  return deduped;
}

function buildPubMedClause(token, terms, mode, allowWildcard) {
  const meshClause = buildPubMedMeshClause(getMeshLabels(token), mode);
  const field = token.source === "free" ? getPubMedFreeField(token.fieldScope, mode) : getPubMedEntryField(mode);
  const textClause = buildTextwordClause(terms, (term) => formatPubMedTerm(term, allowWildcard), field);
  return combineClauses(meshClause, textClause);
}

function buildEmbaseClause(token, terms, mode, allowWildcard) {
  const field = token.source === "free" ? getEmbaseFreeField(token.fieldScope, mode) : getEmbaseEntryField(mode);
  const textClause = buildTextwordClause(terms, formatEmbaseTerm, field);
  let headingClause = "";
  const emtreeLabels = getEmtreeLabels(token);
  if (emtreeLabels.length) {
    const suffix = mode === SYNTAX_MODE.NARROW ? "/de" : "/exp";
    const formatted = emtreeLabels.map((label) => `${formatEmbaseTerm(label)}${suffix}`);
    headingClause = formatted.length > 1 ? `(${formatted.join(" OR ")})` : formatted[0];
  }
  return combineClauses(headingClause, textClause);
}

function buildScopusClause(token, terms, mode, allowWildcard) {
  const formatted = terms.map((term) => formatScopusTerm(term, mode, allowWildcard)).filter(Boolean);
  if (!formatted.length) return "";
  const inner = formatted.join(" OR ");
  const wrapper = token.source === "free" ? getScopusWrapperForFree(token.fieldScope, mode) : getScopusWrapper(mode);
  if (wrapper) {
    return `${wrapper}(${inner})`;
  }
  return formatted.length > 1 ? `(${inner})` : inner;
}

function buildCochraneClause(token, terms, mode, allowWildcard) {
  const meshClause = buildCochraneMeshClause(getMeshLabels(token), mode);
  const field = token.source === "free" ? getCochraneFreeField(token.fieldScope, mode) : getCochraneEntryField(mode);
  const textClause = buildTextwordClause(terms, (term) => formatCochraneTerm(term, allowWildcard), field);
  return combineClauses(meshClause, textClause);
}

function buildWosClause(token, terms, mode, allowWildcard) {
  const formatted = terms.map((term) => formatWosTerm(term, allowWildcard)).filter(Boolean);
  if (!formatted.length) return "";
  const inner = formatted.join(" OR ");
  const wrapper = token.source === "free" ? getWosWrapperForFree(token.fieldScope, mode) : getWosWrapper(mode);
  return `${wrapper}=(${inner})`;
}

function buildTextwordClause(terms, formatter, fieldSuffix) {
  const formatted = terms
    .map((term) => formatter(term))
    .filter(Boolean)
    .map((term) => (fieldSuffix ? `${term}${fieldSuffix}` : term));
  if (!formatted.length) return "";
  return formatted.length > 1 ? `(${formatted.join(" OR ")})` : formatted[0];
}

function buildPubMedMeshClause(labels, mode) {
  const deduped = dedupeLabels(labels);
  if (!deduped.length) return "";
  const tag = mode === SYNTAX_MODE.NARROW ? "[mh:noexp]" : "[mh]";
  const formatted = deduped.map((label) => `${formatAlwaysDoubleQuotedTerm(label, normalizeApostropheForPubMed)}${tag}`);
  return formatted.length > 1 ? `(${formatted.join(" OR ")})` : formatted[0];
}

function buildCochraneMeshClause(labels, mode) {
  const deduped = dedupeLabels(labels);
  if (!deduped.length) return "";
  const formatted = deduped.map((label) => formatCochraneMeshLabel(label, mode));
  return formatted.length > 1 ? `(${formatted.join(" OR ")})` : formatted[0];
}

function formatCochraneMeshLabel(label, mode) {
  const term = formatAlwaysDoubleQuotedTerm(label, normalizeApostropheForCochrane);
  if (!term) return "";
  if (mode === SYNTAX_MODE.NARROW) {
    return `[mh ^${term}]`;
  }
  return `[mh ${term}]`;
}

function getMeshLabels(token) {
  if (!token) return [];
  if (normalizeSource(token.source) === "free") return [];
  const mapped = (token.meshEquivalents || [])
    .map((item) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      return item.label || item.preferred || "";
    })
    .filter(Boolean);
  const labels = [...mapped];
  if (normalizeSource(token.source) === "mesh" && token.label) {
    labels.push(token.label);
  }
  return labels;
}

function getEmtreeLabels(token) {
  if (!token) return [];
  if (normalizeSource(token.source) === "free") return [];
  const mapped = (token.emtreeEquivalents || [])
    .map((item) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      return item.label || item.preferred || "";
    })
    .filter(Boolean);
  const labels = [...mapped];
  if (normalizeSource(token.source) === "emtree" && token.label) {
    labels.push(token.label);
  }
  return labels;
}

function combineClauses(primary, secondary) {
  if (primary && secondary) return `(${primary} OR ${secondary})`;
  return primary || secondary || "";
}

function dedupeLabels(labels) {
  const seen = new Set();
  return labels
    .map((label) => label.trim())
    .filter(Boolean)
    .filter((label) => {
      const key = normalizeForCompare(label);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getPubMedEntryField(mode) {
  return mode === SYNTAX_MODE.WIDE ? "" : "[tiab]";
}

function getPubMedFreeField(_scope, mode) {
  return getPubMedEntryField(mode);
}

function getEmbaseEntryField(mode) {
  return mode === SYNTAX_MODE.WIDE ? "" : ":ti,ab";
}

function getEmbaseFreeField(_scope, mode) {
  return getEmbaseEntryField(mode);
}

function getScopusWrapper(mode) {
  if (mode === SYNTAX_MODE.NARROW) return "TITLE";
  if (mode === SYNTAX_MODE.OPT) return "TITLE-ABS-KEY";
  return "";
}

function getScopusWrapperForFree(_scope, mode) {
  return getScopusWrapper(mode);
}

function getWosWrapper(mode) {
  if (mode === SYNTAX_MODE.NARROW) return "TI";
  if (mode === SYNTAX_MODE.WIDE) return "ALL";
  return "TS";
}

function getWosWrapperForFree(_scope, mode) {
  return getWosWrapper(mode);
}

function getCochraneEntryField(mode) {
  if (mode === SYNTAX_MODE.NARROW) return ":ti,ab";
  if (mode === SYNTAX_MODE.OPT) return ":ti,ab,kw";
  return "";
}

function getCochraneFreeField(_scope, mode) {
  return getCochraneEntryField(mode);
}

function collapseWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeApostropheForPubMed(text) {
  return text.replace(/'/g, " ");
}

function normalizeApostropheForScopus(text) {
  return text.replace(/'/g, " ");
}

function normalizeApostropheForCochrane(text) {
  return text.replace(/'/g, " ");
}

function normalizeApostropheForWos(text) {
  return text;
}

function normalizeApostropheForEmbase(text) {
  return text.replace(/'/g, "`");
}

function formatDoubleQuotedTerm(term, normalizeFn, allowWildcard) {
  if (!term) return "";
  const normalized = collapseWhitespace(normalizeFn(term));
  if (!normalized) return "";
  const hasWildcard = normalized.includes("*");
  const escaped = escapeDoubleQuotes(normalized);
  if (hasWildcard && !allowWildcard) return escaped;
  return /\s/.test(normalized) ? `"${escaped}"` : escaped;
}

function formatAlwaysDoubleQuotedTerm(term, normalizeFn) {
  if (!term) return "";
  const normalized = collapseWhitespace(normalizeFn(term));
  if (!normalized) return "";
  return `"${escapeDoubleQuotes(normalized)}"`;
}

function formatPubMedTerm(term, allowWildcard) {
  if (!term) return "";
  const normalized = collapseWhitespace(normalizeApostropheForPubMed(term));
  if (!normalized) return "";
  const hasWildcard = normalized.includes("*");
  const escaped = escapeDoubleQuotes(normalized);
  if (hasWildcard && !allowWildcard) return escaped;
  if (hasWildcard) return escaped;
  return `"${escaped}"`;
}

function formatWosTerm(term, allowWildcard) {
  return formatDoubleQuotedTerm(term, normalizeApostropheForWos, allowWildcard);
}

function formatCochraneTerm(term, allowWildcard) {
  if (!term) return "";
  const normalized = collapseWhitespace(normalizeApostropheForCochrane(term));
  if (!normalized) return "";
  const hasWildcard = /[*?]/.test(normalized);
  if (allowWildcard && hasWildcard && /\s/.test(normalized)) {
    if (/\bNEXT\b/i.test(normalized)) return normalized;
    return buildCochraneNextExpression(normalized);
  }
  return formatDoubleQuotedTerm(term, normalizeApostropheForCochrane, allowWildcard);
}

function formatScopusTerm(term, mode, allowWildcard) {
  if (!term) return "";
  const normalized = collapseWhitespace(normalizeApostropheForScopus(term));
  if (!normalized) return "";
  const hasWildcard = normalized.includes("*");
  if (hasWildcard && !allowWildcard) return normalized;
  if (mode !== SYNTAX_MODE.WIDE) {
    return /\s/.test(normalized) ? `{${normalized}}` : normalized;
  }
  const escaped = escapeDoubleQuotes(normalized);
  return /\s/.test(normalized) ? `"${escaped}"` : escaped;
}

function formatEmbaseTerm(term) {
  if (!term) return "";
  const normalized = collapseWhitespace(normalizeApostropheForEmbase(term));
  if (!normalized) return "";
  return `'${escapeSingleQuotes(normalized)}'`;
}

function escapeDoubleQuotes(text) {
  return text.replace(/"/g, "\\\"");
}

function escapeSingleQuotes(text) {
  return text.replace(/'/g, "''");
}

function normalizeForCompare(text) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function needsParens(clause) {
  return /\s/.test(clause);
}

function buildWarnings(db, query, ast) {
  const warnings = [];
  if (!query) return warnings;

  if (db === "Web of Science") {
    const operatorCount = (query.match(/\s(AND|OR|NOT|NEAR\/\d+)\s/g) || []).length;
    const termCount = countTerms(ast, db);
    if (operatorCount > 49) {
      warnings.push("Web of Science operator limit exceeded (49). Consider splitting the query.");
    }
    if (termCount > 14000) {
      warnings.push("Web of Science term count is approaching 16,000 terms.");
    }
    return warnings;
  }

  if (query.length > 3500) {
    warnings.push("Query is very long; consider splitting into smaller searches.");
  }

  return warnings;
}

function countTerms(node, db) {
  if (!node) return 0;
  if (node.type === "LEAF") {
    const token = state.tokens.get(node.tokenId);
    if (!token) return 0;
    if (token.type === "FILTER" && token.db !== db) return 0;
    return 1;
  }
  if (node.type === "NOT") {
    return countTerms(node.child, db);
  }
  if (node.type === "GROUP") {
    return node.children.reduce((sum, child) => sum + countTerms(child, db), 0);
  }
  return 0;
}

async function handleCopy(db) {
  const textarea = outputTextareas.get(db);
  if (!textarea || !textarea.value) return;
  try {
    await navigator.clipboard.writeText(textarea.value);
  } catch (err) {
    textarea.select();
    document.execCommand("copy");
  }
  showToast("Copied to clipboard");
}

init();
