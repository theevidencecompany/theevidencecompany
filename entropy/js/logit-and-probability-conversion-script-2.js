const { useEffect, useMemo, useRef, useState } = React;
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
function splitList(raw) {
  const s = String(raw ?? "");
  if (s.trim() === "") return [];
  const parts = s.split(",").map((t) => t.trim());
  while (parts.length && parts[parts.length - 1] === "") parts.pop();
  return parts;
}
function parseNumberToken(token) {
  const t = String(token ?? "").trim();
  if (t === "") return { raw: "", ok: false, missing: true, val: NaN };
  const n = Number(t);
  if (Number.isFinite(n)) return { raw: t, ok: true, missing: false, val: n };
  return { raw: t, ok: false, missing: false, val: NaN };
}
function parseList(raw) {
  const tokens = splitList(raw);
  return tokens.map(parseNumberToken);
}
function detectDelimiter(line) {
  const c = (line.match(/,/g) || []).length;
  const t = (line.match(/\t/g) || []).length;
  const s = (line.match(/;/g) || []).length;
  const m = Math.max(c, t, s);
  if (m === t) return "	";
  if (m === s) return ";";
  return ",";
}
function parseCSV(text, delim) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && ch === delim) {
      row.push(cur);
      cur = "";
    } else if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  while (rows.length && rows[rows.length - 1].every((x) => String(x ?? "").trim() === "")) rows.pop();
  return rows;
}
function looksLikeHeader(firstRow) {
  if (!firstRow || !firstRow.length) return false;
  let nonNumeric = 0;
  let numeric = 0;
  for (const cell of firstRow) {
    const t = String(cell ?? "").trim();
    if (!t) continue;
    const n = Number(t);
    if (Number.isFinite(n)) numeric++;
    else nonNumeric++;
  }
  return nonNumeric > 0 && nonNumeric >= numeric;
}
async function ensureXLSX() {
  if (window.XLSX) return;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load XLSX parser. Please retry."));
    document.head.appendChild(s);
  });
}
function sigmoid(x) {
  if (!Number.isFinite(x)) return NaN;
  if (x >= 0) {
    const ex2 = Math.exp(-x);
    return 1 / (1 + ex2);
  }
  const ex = Math.exp(x);
  return ex / (1 + ex);
}
function logitFromP(p) {
  if (p === 0) return -Infinity;
  if (p === 1) return Infinity;
  return Math.log(p / (1 - p));
}
function fmtInfinity(x) {
  if (x === Infinity) return "\u221E";
  if (x === -Infinity) return "\u2212\u221E";
  return null;
}
function StatusIcon({ status }) {
  if (status === "ok") {
    return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M20 6 9 17l-5-5", stroke: "#166534", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }));
  }
  if (status === "warn") {
    return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 9v4", stroke: "#b45309", strokeWidth: "2.4", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M12 17h.01", stroke: "#b45309", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z", stroke: "#b45309", strokeWidth: "2" }));
  }
  return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 8v5", stroke: "#b91c1c", strokeWidth: "2.4", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M12 16h.01", stroke: "#b91c1c", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", stroke: "#b91c1c", strokeWidth: "2" }));
}
function InfoIconButton({ onClick, label }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick,
      "aria-label": label,
      className: "inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 bg-white hover:border-[var(--brand-primary)] hover:shadow-sm transition"
    },
    /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 17v-6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M12 7h.01", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", stroke: "currentColor", strokeWidth: "2" }))
  );
}
function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-slate-800" }, title), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: onClose }, "Close")), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, children)));
}
function Tabs({ value, onChange, options }) {
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2" }, options.map((opt) => {
    const active = opt.value === value;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: opt.value,
        type: "button",
        onClick: () => onChange(opt.value),
        className: "w-full text-left text-sm font-medium px-3 py-2 rounded-xl border transition leading-snug " + (active ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow" : "bg-white text-slate-700 border-slate-200 hover:border-[var(--brand-primary)]")
      },
      opt.label
    );
  }));
}
function InputBar({ id, label, helper, value, onChange, placeholder }) {
  return /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-800", htmlFor: id, title: helper }, label), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      id,
      value,
      onChange: (e) => onChange(e.target.value),
      placeholder,
      rows: 2,
      className: "mono-input mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[rgba(24,75,68,0.15)] focus:border-[var(--brand-primary)]"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1 font-normal" }, helper));
}
const MODE = {
  LOGIT_TO_P: "LOGIT_TO_P",
  P_TO_LOGIT: "P_TO_LOGIT"
};
function App() {
  const [logoOk, setLogoOk] = useState(true);
  const [mode, setMode] = useState(MODE.LOGIT_TO_P);
  const [decimals, setDecimals] = useState(4);
  const [inputs, setInputs] = useState({
    logit: "",
    p: ""
  });
  const [fieldSummary, setFieldSummary] = useState({ kind: "ok", text: "Ready." });
  const [results, setResults] = useState([]);
  const [lengthNote, setLengthNote] = useState("");
  const [csvText, setCsvText] = useState("");
  const fileInputRef = useRef(null);
  const [dropActive, setDropActive] = useState(false);
  const [fileStatus, setFileStatus] = useState("No file loaded.");
  const [parsedFile, setParsedFile] = useState(null);
  const [colModalOpen, setColModalOpen] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [colSelection, setColSelection] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const requiredKey = mode === MODE.LOGIT_TO_P ? "logit" : "p";
  const inputMeta = useMemo(() => ({
    logit: {
      label: "Logit values",
      helper: "Comma-separated list of logit values (finite numbers).",
      placeholder: "e.g., -1.2, 0, 2.5"
    },
    p: {
      label: "Probabilities (p)",
      helper: "Comma-separated list of probabilities in [0, 1].",
      placeholder: "e.g., 0.12, 0.5, 0.92"
    }
  }), []);
  function updateInput(key, value) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  const formatNumber = useMemo(() => {
    return (x) => {
      const inf = fmtInfinity(x);
      if (inf) return inf;
      if (x === null || x === void 0) return "\u2014";
      if (typeof x !== "number") return "\u2014";
      if (!Number.isFinite(x)) return "\u2014";
      const s = x.toFixed(decimals);
      return s;
    };
  }, [decimals]);
  useEffect(() => {
    const problems = [];
    const parsed = parseList(inputs[requiredKey]);
    const bad = parsed.filter((t) => !t.ok);
    if (bad.length) {
      const samples = bad.slice(0, 5).map((t) => t.missing ? "(blank)" : `'${t.raw}'`).join(", ");
      problems.push(`${inputMeta[requiredKey].label}: invalid value(s) \u2192 ${samples}${bad.length > 5 ? "\u2026" : ""}`);
    }
    const nums = parsed.filter((t) => t.ok).map((t) => t.val);
    if (requiredKey === "p") {
      const outOfRange = nums.some((n) => n < 0 || n > 1);
      if (outOfRange) problems.push("Probabilities must be within [0, 1].");
    }
    if (requiredKey === "logit") {
      const nonFinite = nums.some((n) => !Number.isFinite(n));
      if (nonFinite) problems.push("Logit values must be finite numbers.");
    }
    if (problems.length) setFieldSummary({ kind: "err", text: problems[0] + (problems.length > 1 ? ` (+${problems.length - 1} more)` : "") });
    else setFieldSummary({ kind: "ok", text: "Ready." });
  }, [inputs, requiredKey, inputMeta]);
  const assumptions = useMemo(() => [
    "Logit is the natural log of odds; probability is a value in [0,1].",
    "Edge probabilities p=0 or p=1 map to infinite logits; this is expected mathematically.",
    "Conversions are deterministic and do not represent uncertainty intervals."
  ], []);
  function alignRows() {
    const parsed = parseList(inputs[requiredKey]);
    const minLen = parsed.length;
    return { tokens: parsed, minLen };
  }
  function computeRow(token, idx) {
    if (!token.ok) {
      return {
        status: "err",
        message: token.missing ? "Missing input." : "Invalid input.",
        input: token.missing ? "" : token.raw,
        output: null,
        warnings: token.missing ? "Blank value." : "Not a number."
      };
    }
    const v = token.val;
    try {
      if (mode === MODE.LOGIT_TO_P) {
        if (!Number.isFinite(v)) {
          return { status: "err", message: "Invalid input.", input: token.raw, output: null, warnings: "Logit must be finite." };
        }
        const p = sigmoid(v);
        if (!Number.isFinite(p) && p !== 0 && p !== 1) {
          return { status: "err", message: "Cannot compute.", input: v, output: null, warnings: "Numerical issue." };
        }
        return {
          status: "ok",
          message: "Computed.",
          input: v,
          output: p,
          warnings: ""
        };
      }
      if (v < 0 || v > 1) {
        return {
          status: "err",
          message: "Invalid probability.",
          input: v,
          output: null,
          warnings: "p must be within [0, 1]."
        };
      }
      if (v === 0) {
        return {
          status: "warn",
          message: "Edge case.",
          input: v,
          output: -Infinity,
          warnings: "p=0 maps to \u2212\u221E logit."
        };
      }
      if (v === 1) {
        return {
          status: "warn",
          message: "Edge case.",
          input: v,
          output: Infinity,
          warnings: "p=1 maps to \u221E logit."
        };
      }
      const lg = logitFromP(v);
      return {
        status: "ok",
        message: "Computed.",
        input: v,
        output: lg,
        warnings: ""
      };
    } catch (e) {
      return {
        status: "err",
        message: "Cannot compute.",
        input: token.raw,
        output: null,
        warnings: String(e?.message || e)
      };
    }
  }
  function buildCsv(rows) {
    const header = ["mode", "decimals", "row_index", "input_value", "output_value", "status", "message", "warnings"];
    const modeLabel = mode === MODE.LOGIT_TO_P ? "Logit \u2192 Probability" : "Probability \u2192 Logit";
    const lines = [header.join(",")];
    for (const r of rows) {
      const out = r.output === Infinity ? "Infinity" : r.output === -Infinity ? "-Infinity" : typeof r.output === "number" ? r.output : "";
      const input = r.input === Infinity ? "Infinity" : r.input === -Infinity ? "-Infinity" : r.input;
      const vals = {
        mode: modeLabel,
        decimals,
        row_index: r.idx + 1,
        input_value: input,
        output_value: out,
        status: r.status,
        message: r.message,
        warnings: r.warnings
      };
      const line = header.map((k) => csvEscape(vals[k]));
      lines.push(line.join(","));
    }
    return lines.join("\n");
  }
  function csvEscape(x) {
    const s = String(x ?? "");
    if (/[\n\r,\"]/g.test(s)) return '"' + s.replace(/\"/g, '""') + '"';
    return s;
  }
  function run() {
    setResults([]);
    setLengthNote("");
    const { tokens, minLen } = alignRows();
    if (minLen === 0) {
      setResults([]);
      setLengthNote("No rows to process. Enter comma-separated values in the input bar.");
      setCsvText("");
      return;
    }
    const computed = tokens.map((t, i) => ({ ...computeRow(t, i), idx: i }));
    setResults(computed);
    setCsvText(buildCsv(computed));
  }
  async function copyCsv() {
    try {
      await navigator.clipboard.writeText(csvText || "");
    } catch {
      alert("Clipboard copy failed in this browser. You can still use Download CSV.");
    }
  }
  function downloadCsv() {
    const blob = new Blob([csvText || ""], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "entro_py_logit_probability_results.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function resetAll() {
    setMode(MODE.LOGIT_TO_P);
    setDecimals(4);
    setInputs({ logit: "", p: "" });
    setResults([]);
    setLengthNote("");
    setCsvText("");
    setParsedFile(null);
    setFileStatus("No file loaded.");
    setColModalOpen(false);
    setHasHeader(true);
    setColSelection(0);
    setInfoOpen(false);
  }
  async function handleFile(file) {
    const name = file?.name || "file";
    const ext = name.toLowerCase().split(".").pop();
    setFileStatus(`Loaded: ${name}`);
    try {
      let rows;
      if (ext === "csv" || ext === "txt") {
        const text = await file.text();
        const firstLine = text.split(/\r?\n/)[0] ?? "";
        const delim = detectDelimiter(firstLine);
        rows = parseCSV(text, delim);
      } else if (ext === "xlsx") {
        await ensureXLSX();
        const buf = await file.arrayBuffer();
        const wb = window.XLSX.read(buf, { type: "array" });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        rows = window.XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
      } else {
        throw new Error("Unsupported file type. Please upload .csv, .txt, or .xlsx.");
      }
      if (!rows || rows.length < 1) throw new Error("File appears empty.");
      const headerGuess = looksLikeHeader(rows[0]);
      setParsedFile({ rows, filename: name, headerGuess });
      setHasHeader(headerGuess);
      const maxCols = Math.max(1, ...rows.map((r) => r ? r.length : 0));
      setColSelection(0);
      if (maxCols === 1) setColSelection(0);
      setColModalOpen(true);
    } catch (e) {
      setParsedFile(null);
      setFileStatus("No file loaded.");
      alert(String(e?.message || e));
    }
  }
  function colName(rows, idx, headerOn) {
    const maxCols = Math.max(1, ...rows.map((r) => r ? r.length : 0));
    const defaultNames = Array.from({ length: maxCols }, (_, i) => `Column ${String.fromCharCode(65 + i)}`);
    if (!headerOn) return defaultNames[idx] || `Column ${idx + 1}`;
    const h = String(rows?.[0]?.[idx] ?? "").trim();
    return h ? h : defaultNames[idx] || `Column ${idx + 1}`;
  }
  function applyColumn() {
    if (!parsedFile) return;
    const { rows } = parsedFile;
    const start = hasHeader ? 1 : 0;
    const idx = Number(colSelection);
    const vals = [];
    for (let i = start; i < rows.length; i++) {
      const r = rows[i] || [];
      vals.push(String(r[idx] ?? "").trim());
    }
    const key = requiredKey;
    setInputs((prev) => ({ ...prev, [key]: vals.join(", ") }));
    setColModalOpen(false);
    setResults([]);
    setCsvText("");
  }
  const modeOptions = [
    { value: MODE.LOGIT_TO_P, label: "Logit \u2192 Probability" },
    { value: MODE.P_TO_LOGIT, label: "Probability \u2192 Logit" }
  ];
  const canCopy = results.length > 0 && (csvText || "").length > 0;
  const statusColor = fieldSummary.kind === "err" ? "text-red-700" : fieldSummary.kind === "warn" ? "text-amber-700" : "text-emerald-700";
  const activeInputKey = requiredKey;
  const outLabel = mode === MODE.LOGIT_TO_P ? "Probability (p)" : "Logit";
  const inLabel = mode === MODE.LOGIT_TO_P ? "Logit" : "Probability (p)";
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-40 bg-[rgba(240,253,250,0.75)] backdrop-blur border-b border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 min-w-[220px]" }, logoOk ? /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "Entropy.png",
      alt: "Entropy",
      className: "h-9 w-auto",
      onError: () => setLogoOk(false)
    }
  ) : /* @__PURE__ */ React.createElement("div", { className: "logo-fallback", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 30, fontWeight: 400 } }, "\u03A3ntr"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22.5, fontWeight: 700 } }, "\u03A9"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 30, fontWeight: 400 } }, ".py"))), /* @__PURE__ */ React.createElement(
    "a",
    {
      className: "btn-secondary",
      href: "Convert Statistical Quantities.html",
      title: "Return to the tools list"
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u2190"),
    /* @__PURE__ */ React.createElement("span", null, "Back to Tools")
  ))), /* @__PURE__ */ React.createElement("main", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto px-4 py-8" }, /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up", style: { animationDelay: "0.05s" } }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-[#184B44] mb-3 text-center" }, "Logit - probability conversion"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 leading-relaxed text-center" }, "Convert between logit (log-odds) values and probabilities, using batch inputs or bulk imports.")), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-5", style: { animationDelay: "0.10s" } }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Assumptions"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 leading-relaxed" }, "These conversions are deterministic and do not represent uncertainty intervals.")), /* @__PURE__ */ React.createElement("ul", { className: "mt-3 list-disc pl-5 text-sm text-slate-700 leading-relaxed" }, assumptions.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "mt-2" }, a))))), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-6", style: { animationDelay: "0.15s" } }, /* @__PURE__ */ React.createElement("div", { className: "tool-card" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Mode"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Pick a direction to convert.")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(InfoIconButton, { onClick: () => setInfoOpen(true), label: "Open info" }))), /* @__PURE__ */ React.createElement(
    Tabs,
    {
      value: mode,
      onChange: (v) => {
        setMode(v);
        setResults([]);
        setCsvText("");
        setLengthNote("");
      },
      options: modeOptions
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Output formatting"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex items-center gap-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-sm font-medium text-slate-800", htmlFor: "decimals" }, "Decimals"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "decimals",
      type: "range",
      min: "2",
      max: "8",
      step: "1",
      value: decimals,
      onChange: (e) => setDecimals(Number(e.target.value)),
      className: "w-full",
      "aria-label": "Decimals slider"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "2",
      max: "8",
      step: "1",
      value: decimals,
      onChange: (e) => setDecimals(clamp(Number(e.target.value), 2, 8)),
      className: "w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[rgba(24,75,68,0.15)] focus:border-[var(--brand-primary)]",
      "aria-label": "Decimals numeric"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-2 font-normal" }, "Infinity values display as \u221E / \u2212\u221E and export as Infinity / -Infinity.")), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Input validation"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-sm text-slate-600 leading-relaxed" }, "Mixed valid/invalid entries are handled per row. Invalid rows are flagged without stopping the run."), /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm leading-relaxed " + statusColor }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, fieldSummary.kind === "ok" ? "Ready:" : "Input issues:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-slate-700" }, fieldSummary.text)))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 lg:col-span-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Inputs"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Manual entry (comma-separated) or file upload.")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, "Separate input bar")), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement(
    InputBar,
    {
      id: "primary",
      label: inputMeta[activeInputKey].label,
      helper: inputMeta[activeInputKey].helper,
      value: inputs[activeInputKey],
      onChange: (v) => updateInput(activeInputKey, v),
      placeholder: inputMeta[activeInputKey].placeholder
    }
  )), /* @__PURE__ */ React.createElement("details", { className: "mt-5 rounded-2xl border border-slate-200 bg-white/70 p-4" }, /* @__PURE__ */ React.createElement("summary", { className: "cursor-pointer text-sm font-medium text-slate-800" }, "File upload (optional)", /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-xs font-normal text-slate-500" }, fileStatus)), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "mt-3 rounded-2xl border-2 border-dashed p-4 transition " + (dropActive ? "border-[var(--brand-primary)] bg-[rgba(230,255,250,0.6)]" : "border-slate-300 bg-white/70"),
      onDragEnter: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropActive(true);
      },
      onDragOver: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropActive(true);
      },
      onDragLeave: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropActive(false);
      },
      onDrop: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropActive(false);
        const f = e.dataTransfer?.files?.[0];
        if (f) handleFile(f);
      },
      role: "button",
      tabIndex: 0,
      "aria-label": "Upload a CSV, TXT, or XLSX file"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Drag & drop a .csv, .txt, or .xlsx file"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1 font-normal" }, "Upload \u2192 parse \u2192 choose column \u2192 populate input.")), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-secondary",
        onClick: () => fileInputRef.current?.click()
      },
      "Browse files"
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: ".csv,.txt,.xlsx",
        className: "hidden",
        onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }
      }
    ))
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-wrap gap-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-brand", onClick: run }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14", stroke: "white", strokeWidth: "2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M13 5l7 7-7 7", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })), "Run"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-danger", onClick: resetAll }, "Reset")), lengthNote ? /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-amber-700 leading-relaxed" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Note:"), " ", lengthNote) : null), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 lg:col-span-7" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Results"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Per-row output with warning flags.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 justify-end" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: copyCsv, disabled: !canCopy }, "Copy to Clipboard"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: downloadCsv, disabled: !canCopy }, "Download CSV"))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, results.length, " row", results.length === 1 ? "" : "s"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, "Output: ", outLabel)), /* @__PURE__ */ React.createElement("div", { className: "mt-4 border border-slate-200 rounded-2xl bg-white overflow-auto", style: { maxHeight: 460 } }, /* @__PURE__ */ React.createElement("table", { className: "min-w-[860px] w-full border-collapse" }, /* @__PURE__ */ React.createElement("thead", { className: "sticky top-0 bg-slate-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, "Row"), /* @__PURE__ */ React.createElement("th", { className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, inLabel), /* @__PURE__ */ React.createElement("th", { className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, outLabel), /* @__PURE__ */ React.createElement("th", { className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, "Message"), /* @__PURE__ */ React.createElement("th", { className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, "Warnings"))), /* @__PURE__ */ React.createElement("tbody", null, results.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 6, className: "px-3 py-4 text-sm text-slate-500" }, "Run the calculator to see results.")) : results.map((r, i) => {
    const rowBg = i % 2 === 0 ? "bg-white" : "bg-slate-50/40";
    const msgCls = r.status === "err" ? "text-red-700" : r.status === "warn" ? "text-amber-700" : "text-emerald-700";
    const inputDisplay = typeof r.input === "number" ? formatNumber(r.input) : String(r.input ?? "");
    const outputDisplay = typeof r.output === "number" ? formatNumber(r.output) : "\u2014";
    return /* @__PURE__ */ React.createElement("tr", { key: i, className: rowBg + " hover:bg-[rgba(240,253,250,0.75)]" }, /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 border-b border-slate-100 text-sm text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, i + 1), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(StatusIcon, { status: r.status }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 font-medium" }, String(r.status || "").toUpperCase()))), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 border-b border-slate-100 text-sm text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, inputDisplay), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 border-b border-slate-100 text-sm text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, outputDisplay), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 border-b border-slate-100 text-sm " + msgCls }, r.message), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 border-b border-slate-100 text-sm text-slate-700" }, r.warnings || ""));
  })))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-slate-600 leading-relaxed" }, "Exported CSV includes inputs, outputs, and warning flags."))))), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-8", style: { animationDelay: "0.20s" } }, /* @__PURE__ */ React.createElement("div", { className: "references-plain rounded-2xl px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "References"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-sm text-slate-700 leading-relaxed" }, "Calculation note: This calculator uses the logit link (log-odds) and its inverse (logistic function) to convert between logits and probabilities."), /* @__PURE__ */ React.createElement("ul", { className: "mt-3 list-disc pl-5 text-sm text-slate-700 leading-relaxed" }, /* @__PURE__ */ React.createElement("li", null, "Bewick, V., Cheek, L., & Ball, J. (2005). Statistics review 14: Logistic regression. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Critical Care, 9"), "(1), 112\u2013118. https://doi.org/10.1186/cc3045")))))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")), /* @__PURE__ */ React.createElement(
    Modal,
    {
      open: colModalOpen,
      title: parsedFile?.filename ? `Select a column \u2014 ${parsedFile.filename}` : "Select a column",
      onClose: () => setColModalOpen(false)
    },
    !parsedFile ? /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "No file loaded.") : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 leading-relaxed" }, "Choose the file column to import into the ", /* @__PURE__ */ React.createElement("span", { className: "font-medium text-slate-800" }, inputMeta[requiredKey].label), " input bar."), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "hdr",
        type: "checkbox",
        checked: hasHeader,
        onChange: (e) => setHasHeader(e.target.checked),
        className: "h-4 w-4"
      }
    ), /* @__PURE__ */ React.createElement("label", { htmlFor: "hdr", className: "text-sm text-slate-700" }, "Treat first row as headers"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500 font-normal" }, parsedFile.filename, " \xB7 ", parsedFile.rows.length, " rows")), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-800" }, "Column"), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[rgba(24,75,68,0.15)] focus:border-[var(--brand-primary)]",
        value: String(colSelection),
        onChange: (e) => setColSelection(Number(e.target.value))
      },
      Array.from({ length: Math.max(1, ...parsedFile.rows.map((r) => r ? r.length : 0)) }, (_, i) => /* @__PURE__ */ React.createElement("option", { key: i, value: i }, colName(parsedFile.rows, i, hasHeader)))
    ), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1 font-normal" }, "The selected column will be imported as a comma-separated list.")), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-wrap gap-3 justify-end" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: () => setColModalOpen(false) }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-brand", onClick: applyColumn }, "Apply column")))
  ), /* @__PURE__ */ React.createElement(
    Modal,
    {
      open: infoOpen,
      title: "WTH are Logits and Probabilities",
      onClose: () => setInfoOpen(false)
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50", style: { aspectRatio: "11 / 6" } }, /* @__PURE__ */ React.createElement("div", { className: "w-full h-full flex items-center justify-center text-sm text-slate-500" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "logits.png"
      }
    ))),
    /* @__PURE__ */ React.createElement("div", { className: "mt-3 rounded-2xl border border-slate-200 bg-white p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-500 leading-relaxed" }, 'This infographic visualizes how statistics translates "logits," which exist on an infinite scale from negative to positive infinity, into usable "probabilities" constrained between 0 and 1. The central "sigmoid function" acts like a funnel, "squeezing" the unbounded logit values into that tight probability window. A logit of zero perfectly translates to a 0.5 (or 50%) probability. The crucial concept shown at the top and bottom is that as logits get infinitely large or infinitely small, they are all compressed into the exact terminal points of Probability = 1 (certainty) and Probability = 0 (impossibility), respectively. Therefore, these two terminal probabilities represent "sinks" that absorb an infinite number of extreme logit values.'))
  ));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
