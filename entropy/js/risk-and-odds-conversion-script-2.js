const { useEffect, useMemo, useRef, useState } = React;
const nf = new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10, useGrouping: false });
function fmt(x) {
  if (x === Infinity) return "\u221E";
  if (x === -Infinity) return "\u2212\u221E";
  if (x === null || x === void 0) return "\u2014";
  if (typeof x !== "number" || !Number.isFinite(x)) return "\u2014";
  return nf.format(x);
}
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
  return splitList(raw).map(parseNumberToken);
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
  let nonNumeric = 0, numeric = 0;
  for (const cell of firstRow) {
    const t = String(cell ?? "").trim();
    if (!t) continue;
    const n = Number(t);
    if (Number.isFinite(n)) numeric++;
    else nonNumeric++;
  }
  return nonNumeric > 0 && nonNumeric >= numeric;
}
function csvEscape(x) {
  const s = String(x ?? "");
  if (/[^\S\r\n]*[\n\r,\"]/g.test(s) || /[\n\r,\"]/g.test(s)) return '"' + s.replace(/\"/g, '""') + '"';
  return s;
}
function riskToOdds(p) {
  return p / (1 - p);
}
function oddsToRisk(o) {
  return o / (1 + o);
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
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-slate-800" }, title), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary text-sm", onClick: onClose }, "Close")), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, children)));
}
function Toggle({ checked, onChange, leftLabel, rightLabel, helper }) {
  return /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, leftLabel), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-slate-700" }, checked ? rightLabel : leftLabel), /* @__PURE__ */ React.createElement("div", { className: "relative inline-block w-12 align-middle select-none" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked,
      onChange: (e) => onChange(e.target.checked),
      className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 border-slate-300 appearance-none cursor-pointer transition-all duration-200 ease-in-out",
      style: { top: "0px", right: checked ? "0px" : "24px" }
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer transition" })))), helper ? /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 mt-1 leading-relaxed" }, helper) : null);
}
function Tabs({ value, onChange, options }) {
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2" }, options.map((opt) => {
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
function InputBar({ id, label, helper, value, onChange, placeholder, rightAdornment }) {
  return /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-800", htmlFor: id, title: helper }, label), rightAdornment ? /* @__PURE__ */ React.createElement("div", { className: "shrink-0" }, rightAdornment) : null), /* @__PURE__ */ React.createElement(
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
  RR_P0_TO_OR: "RR_P0_TO_OR",
  OR_P0_TO_RR: "OR_P0_TO_RR",
  RISK_ODDS: "RISK_ODDS",
  P1P0_TO_BOTH: "P1P0_TO_BOTH"
};
function App() {
  const [logoOk, setLogoOk] = useState(true);
  const [mode, setMode] = useState(MODE.RR_P0_TO_OR);
  const [riskToOddsDir, setRiskToOddsDir] = useState(true);
  const [inputs, setInputs] = useState({
    rr: "",
    or: "",
    p0: "",
    p1: "",
    p: "",
    odds: ""
  });
  const [results, setResults] = useState([]);
  const [csvText, setCsvText] = useState("");
  const [lengthNote, setLengthNote] = useState("");
  const [fieldSummary, setFieldSummary] = useState({ kind: "ok", text: "Ready." });
  const fileInputRef = useRef(null);
  const [dropActive, setDropActive] = useState(false);
  const [fileStatus, setFileStatus] = useState("No file loaded.");
  const [parsedFile, setParsedFile] = useState(null);
  const [colModalOpen, setColModalOpen] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [colSelections, setColSelections] = useState({});
  const [infoModal, setInfoModal] = useState({ open: false, type: "p0" });
  function updateInput(key, value) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  const inputMeta = useMemo(() => ({
    rr: {
      label: "Relative risk (RR) list",
      helper: "RR values (must be > 0). Comma-separated.",
      placeholder: "e.g., 0.75, 1.10, 2.05"
    },
    or: {
      label: "Odds ratio (OR) list",
      helper: "OR values (must be > 0). Comma-separated.",
      placeholder: "e.g., 0.65, 1.25, 3.10"
    },
    p0: {
      label: "Baseline risk (p0) list",
      helper: "Risk in the control/unexposed group as a probability. Must satisfy 0 < p0 < 1. Comma-separated.",
      placeholder: "e.g., 0.10, 0.25, 0.40"
    },
    p1: {
      label: "Risk in exposed (p1) list",
      helper: "Risk in the exposed/treated group as a probability. Must satisfy 0 < p1 < 1. Comma-separated.",
      placeholder: "e.g., 0.08, 0.30, 0.60"
    },
    p: {
      label: "Risk (p) list",
      helper: "Risk as a probability. Must satisfy 0 < p < 1. Comma-separated.",
      placeholder: "e.g., 0.05, 0.20, 0.75"
    },
    odds: {
      label: "Odds list",
      helper: "Odds values (must be \u2265 0). Comma-separated.",
      placeholder: "e.g., 0.10, 0.25, 3.00"
    }
  }), []);
  const requiredKeys = useMemo(() => {
    if (mode === MODE.RR_P0_TO_OR) return ["rr", "p0"];
    if (mode === MODE.OR_P0_TO_RR) return ["or", "p0"];
    if (mode === MODE.RISK_ODDS) return [riskToOddsDir ? "p" : "odds"];
    return ["p1", "p0"];
  }, [mode, riskToOddsDir]);
  const visibleManualKeys = useMemo(() => {
    if (mode === MODE.RR_P0_TO_OR) return ["rr", "p0"];
    if (mode === MODE.OR_P0_TO_RR) return ["or", "p0"];
    if (mode === MODE.RISK_ODDS) return [riskToOddsDir ? "p" : "odds"];
    return ["p1", "p0"];
  }, [mode, riskToOddsDir]);
  const assumptions = useMemo(() => {
    const base = [
      "RR\u2194OR conversion requires a baseline risk (p0) or both group risks; the same RR/OR can correspond to different conversions depending on baseline risk.",
      "Conversions treat \u201Crisk\u201D as a probability for a binary outcome over a stated time horizon; ensure RR/OR/p0 refer to the same outcome and time window."
    ];
    const extra = [];
    if (mode === MODE.RR_P0_TO_OR) extra.push("This mode converts RR to OR by first deriving the treated risk (p1) from RR and baseline risk (p0).");
    if (mode === MODE.OR_P0_TO_RR) extra.push("This mode converts OR to RR by translating odds under the baseline risk (p0) to an implied treated risk (p1).");
    if (mode === MODE.RISK_ODDS) extra.push(riskToOddsDir ? "This helper converts risk values to odds." : "This helper converts odds values to risk.");
    if (mode === MODE.P1P0_TO_BOTH) extra.push("This mode computes RR and OR directly from group risks (p1 and p0).");
    return [...base, ...extra];
  }, [mode, riskToOddsDir]);
  useEffect(() => {
    const problems = [];
    for (const k of requiredKeys) {
      const parsed = parseList(inputs[k]);
      const bad = parsed.filter((t) => !t.ok);
      if (bad.length) {
        const samples = bad.slice(0, 5).map((t) => t.missing ? "(blank)" : `'${t.raw}'`).join(", ");
        problems.push(`${inputMeta[k].label}: invalid value(s) \u2192 ${samples}${bad.length > 5 ? "\u2026" : ""}`);
      }
      const nums = parsed.filter((t) => t.ok).map((t) => t.val);
      if (k === "rr" || k === "or") {
        if (nums.some((n) => !(n > 0))) problems.push(`${inputMeta[k].label}: values must be > 0`);
      }
      if (k === "p0" || k === "p1" || k === "p") {
        if (nums.some((n) => !(n > 0 && n < 1))) problems.push(`${inputMeta[k].label}: values must satisfy 0 < p < 1`);
      }
      if (k === "odds") {
        if (nums.some((n) => !(n >= 0))) problems.push(`${inputMeta[k].label}: values must be \u2265 0`);
      }
    }
    if (problems.length) setFieldSummary({ kind: "err", text: problems[0] + (problems.length > 1 ? ` (+${problems.length - 1} more)` : "") });
    else setFieldSummary({ kind: "ok", text: "Ready." });
  }, [inputs, requiredKeys, inputMeta]);
  function alignRows() {
    const reqParsed = requiredKeys.map((k) => ({ k, parsed: parseList(inputs[k]) }));
    const lengths = reqParsed.map((x) => x.parsed.length);
    const minLen = lengths.length ? Math.min(...lengths) : 0;
    const maxLen = lengths.length ? Math.max(...lengths) : 0;
    const extras = reqParsed.filter((x) => x.parsed.length > minLen).map((x) => ({ key: x.k, extra: x.parsed.length - minLen }));
    const rows = [];
    for (let i = 0; i < minLen; i++) {
      const row = { idx: i, vals: {}, raw: {}, ok: true, missing: false };
      for (const { k, parsed } of reqParsed) {
        const t = parsed[i];
        row.raw[k] = t?.raw ?? "";
        row.vals[k] = t?.val;
        if (!t || !t.ok) {
          row.ok = false;
          row.missing = row.missing || !!t?.missing;
        }
      }
      rows.push(row);
    }
    return { rows, minLen, maxLen, extras };
  }
  function computeRow(row) {
    const warn = [];
    if (!row.ok) {
      return {
        status: "err",
        message: row.missing ? "Missing value(s) in required fields." : "Invalid value(s) in required fields.",
        warnings: row.missing ? "Missing input(s)." : "Invalid input(s).",
        ...echoInputs(row)
      };
    }
    try {
      if (mode === MODE.RR_P0_TO_OR) {
        const rr2 = row.vals.rr;
        const p02 = row.vals.p0;
        if (!(rr2 > 0)) throw new Error("RR must be > 0.");
        if (!(p02 > 0 && p02 < 1)) throw new Error("Baseline risk p0 must satisfy 0 < p0 < 1.");
        const p12 = rr2 * p02;
        if (!(p12 > 0 && p12 < 1)) throw new Error("Derived treated risk (p1) must satisfy 0 < p1 < 1. Check RR and p0.");
        const odds02 = riskToOdds(p02);
        const odds12 = riskToOdds(p12);
        const OR2 = odds12 / odds02;
        if (!(OR2 > 0) || !Number.isFinite(OR2)) throw new Error("Cannot compute OR (check inputs).");
        return {
          status: warn.length ? "warn" : "ok",
          message: warn.length ? "Computed with warnings." : "Computed.",
          rr: rr2,
          p0: p02,
          p1: p12,
          odds0: odds02,
          odds1: odds12,
          or: OR2,
          warnings: warn.join(" | ")
        };
      }
      if (mode === MODE.OR_P0_TO_RR) {
        const OR2 = row.vals.or;
        const p02 = row.vals.p0;
        if (!(OR2 > 0)) throw new Error("OR must be > 0.");
        if (!(p02 > 0 && p02 < 1)) throw new Error("Baseline risk p0 must satisfy 0 < p0 < 1.");
        const odds02 = riskToOdds(p02);
        const odds12 = OR2 * odds02;
        if (!(odds12 >= 0) || !Number.isFinite(odds12)) throw new Error("Cannot compute implied odds (check inputs).");
        const p12 = oddsToRisk(odds12);
        if (!(p12 > 0 && p12 < 1)) throw new Error("Implied treated risk (p1) must satisfy 0 < p1 < 1.");
        const rr2 = p12 / p02;
        if (!(rr2 > 0) || !Number.isFinite(rr2)) throw new Error("Cannot compute RR (check inputs).");
        return {
          status: warn.length ? "warn" : "ok",
          message: warn.length ? "Computed with warnings." : "Computed.",
          or: OR2,
          p0: p02,
          p1: p12,
          odds0: odds02,
          odds1: odds12,
          rr: rr2,
          warnings: warn.join(" | ")
        };
      }
      if (mode === MODE.RISK_ODDS) {
        if (riskToOddsDir) {
          const p = row.vals.p;
          if (!(p > 0 && p < 1)) throw new Error("Risk p must satisfy 0 < p < 1.");
          const odds = riskToOdds(p);
          if (!(odds >= 0) || !Number.isFinite(odds)) throw new Error("Cannot compute odds (check input).");
          return {
            status: warn.length ? "warn" : "ok",
            message: warn.length ? "Computed with warnings." : "Computed.",
            direction: "Risk \u2192 Odds",
            p,
            odds,
            warnings: warn.join(" | ")
          };
        } else {
          const odds = row.vals.odds;
          if (!(odds >= 0)) throw new Error("Odds must be \u2265 0.");
          const p = oddsToRisk(odds);
          if (!(p > 0 && p < 1)) {
            warn.push("Converted risk is not strictly between 0 and 1.");
          }
          return {
            status: warn.length ? "warn" : "ok",
            message: warn.length ? "Computed with warnings." : "Computed.",
            direction: "Odds \u2192 Risk",
            odds,
            p,
            warnings: warn.join(" | ")
          };
        }
      }
      const p1 = row.vals.p1;
      const p0 = row.vals.p0;
      if (!(p0 > 0 && p0 < 1)) throw new Error("Baseline risk p0 must satisfy 0 < p0 < 1.");
      if (!(p1 > 0 && p1 < 1)) throw new Error("Risk in exposed p1 must satisfy 0 < p1 < 1.");
      const rr = p1 / p0;
      if (!(rr > 0) || !Number.isFinite(rr)) throw new Error("Cannot compute RR (check inputs).");
      const odds0 = riskToOdds(p0);
      const odds1 = riskToOdds(p1);
      const OR = odds1 / odds0;
      if (!(OR > 0) || !Number.isFinite(OR)) throw new Error("Cannot compute OR (check inputs).");
      return {
        status: warn.length ? "warn" : "ok",
        message: warn.length ? "Computed with warnings." : "Computed.",
        p0,
        p1,
        rr,
        or: OR,
        odds0,
        odds1,
        warnings: warn.join(" | ")
      };
    } catch (e) {
      return {
        status: "err",
        message: String(e?.message || e),
        warnings: "",
        ...echoInputs(row)
      };
    }
  }
  function echoInputs(row) {
    const out = {};
    for (const k of visibleManualKeys) out[k] = safeEcho(k, row.idx);
    return out;
  }
  function safeEcho(key, idx) {
    const parsed = parseList(inputs[key]);
    const t = parsed[idx];
    if (!t) return null;
    if (t.ok) return t.val;
    if (t.missing) return null;
    return NaN;
  }
  const tableCols = useMemo(() => {
    if (mode === MODE.RR_P0_TO_OR) {
      return [
        { key: "status", label: "Status" },
        { key: "message", label: "Message" },
        { key: "rr", label: "RR" },
        { key: "p0", label: "Baseline risk (p0)" },
        { key: "p1", label: "Treated risk (p1)" },
        { key: "odds0", label: "Baseline odds" },
        { key: "odds1", label: "Treated odds" },
        { key: "or", label: "OR" },
        { key: "warnings", label: "Warnings" }
      ];
    }
    if (mode === MODE.OR_P0_TO_RR) {
      return [
        { key: "status", label: "Status" },
        { key: "message", label: "Message" },
        { key: "or", label: "OR" },
        { key: "p0", label: "Baseline risk (p0)" },
        { key: "p1", label: "Treated risk (p1)" },
        { key: "odds0", label: "Baseline odds" },
        { key: "odds1", label: "Treated odds" },
        { key: "rr", label: "RR" },
        { key: "warnings", label: "Warnings" }
      ];
    }
    if (mode === MODE.RISK_ODDS) {
      return [
        { key: "status", label: "Status" },
        { key: "message", label: "Message" },
        { key: "direction", label: "Direction" },
        { key: "p", label: "Risk (p)" },
        { key: "odds", label: "Odds" },
        { key: "warnings", label: "Warnings" }
      ];
    }
    return [
      { key: "status", label: "Status" },
      { key: "message", label: "Message" },
      { key: "p0", label: "Baseline risk (p0)" },
      { key: "p1", label: "Exposed risk (p1)" },
      { key: "rr", label: "RR" },
      { key: "or", label: "OR" },
      { key: "odds0", label: "Baseline odds" },
      { key: "odds1", label: "Exposed odds" },
      { key: "warnings", label: "Warnings" }
    ];
  }, [mode]);
  function buildCsv(computedRows) {
    const metaCols = ["mode"];
    const inputCols = ["rr", "or", "p0", "p1", "p", "odds"];
    const outCols = ["status", "message", "direction", "rr_out", "or_out", "p0_out", "p1_out", "risk_out", "odds_out", "baseline_odds", "treated_odds", "warnings"];
    const header = [...metaCols, ...inputCols, ...outCols];
    const modeLabel = mode === MODE.RR_P0_TO_OR ? "RR + Baseline Risk \u2192 OR" : mode === MODE.OR_P0_TO_RR ? "OR + Baseline Risk \u2192 RR" : mode === MODE.RISK_ODDS ? "Risk \u2194 Odds (helper)" : "Group Risks (p1, p0) \u2192 RR & OR";
    const lines = [header.join(",")];
    for (const r of computedRows) {
      const rowVals = {
        mode: modeLabel,
        rr: r.rr ?? "",
        or: r.or ?? "",
        p0: r.p0 ?? "",
        p1: r.p1 ?? "",
        p: r.p ?? "",
        odds: r.odds ?? "",
        status: r.status ?? "",
        message: r.message ?? "",
        direction: r.direction ?? "",
        rr_out: r.rr ?? "",
        or_out: r.or ?? "",
        p0_out: r.p0 ?? "",
        p1_out: r.p1 ?? "",
        risk_out: r.p ?? "",
        odds_out: r.odds ?? "",
        baseline_odds: r.odds0 ?? "",
        treated_odds: r.odds1 ?? "",
        warnings: r.warnings ?? ""
      };
      const line = header.map((k) => csvEscape(valOrBound(rowVals[k])));
      lines.push(line.join(","));
    }
    return lines.join("\n");
  }
  function valOrBound(x) {
    if (x === Infinity) return "Infinity";
    if (x === -Infinity) return "-Infinity";
    if (x === null || x === void 0) return "";
    if (typeof x === "number") {
      if (!Number.isFinite(x)) return "";
      return x;
    }
    return x;
  }
  function run() {
    setResults([]);
    setLengthNote("");
    setCsvText("");
    const aligned = alignRows();
    const { rows, minLen, maxLen, extras } = aligned;
    if (minLen === 0) {
      setResults([]);
      setLengthNote("No rows to process. Enter comma-separated values in the required input fields.");
      return;
    }
    if (maxLen !== minLen) {
      const extraMsg = extras.map((e) => `${inputMeta[e.key].label}: ${e.extra} extra value(s) ignored`).join(" \xB7 ");
      setLengthNote(`Length mismatch: processed up to the shortest list (${minLen}). ${extraMsg}`);
    }
    const computed = rows.map(computeRow);
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
    a.download = "entropy_rr_or_conversion_results.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function resetAll() {
    setMode(MODE.RR_P0_TO_OR);
    setRiskToOddsDir(true);
    setInputs({ rr: "", or: "", p0: "", p1: "", p: "", odds: "" });
    setResults([]);
    setCsvText("");
    setLengthNote("");
    setParsedFile(null);
    setFileStatus("No file loaded.");
    setColModalOpen(false);
    setColSelections({});
    setHasHeader(true);
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
      const maxCols = Math.max(...rows.map((r) => r.length));
      const initial = {};
      visibleManualKeys.forEach((k, idx) => {
        initial[k] = Math.min(idx, Math.max(0, maxCols - 1));
      });
      setColSelections(initial);
      setColModalOpen(true);
    } catch (e) {
      setParsedFile(null);
      setFileStatus("No file loaded.");
      alert(String(e?.message || e));
    }
  }
  function colName(rows, idx, headerOn) {
    const maxCols = Math.max(...rows.map((r) => r.length));
    const defaultNames = Array.from({ length: maxCols }, (_, i) => `Column ${String.fromCharCode(65 + i)}`);
    if (!headerOn) return defaultNames[idx] || `Column ${idx + 1}`;
    const h = String(rows?.[0]?.[idx] ?? "").trim();
    return h ? h : defaultNames[idx] || `Column ${idx + 1}`;
  }
  function applyColumns() {
    if (!parsedFile) return;
    const { rows } = parsedFile;
    const start = hasHeader ? 1 : 0;
    const keysToFill = visibleManualKeys;
    const out = { ...inputs };
    const cols = {};
    keysToFill.forEach((k) => cols[k] = []);
    for (let i = start; i < rows.length; i++) {
      const r = rows[i] || [];
      keysToFill.forEach((k) => {
        const idx = Number(colSelections[k]);
        const v = r[idx] ?? "";
        cols[k].push(String(v).trim());
      });
    }
    keysToFill.forEach((k) => {
      out[k] = cols[k].join(", ");
    });
    setInputs(out);
    setColModalOpen(false);
    setResults([]);
    setCsvText("");
    setLengthNote("");
  }
  const modeOptions = useMemo(() => [
    { value: MODE.RR_P0_TO_OR, label: "RR + Baseline Risk \u2192 OR" },
    { value: MODE.OR_P0_TO_RR, label: "OR + Baseline Risk \u2192 RR" },
    { value: MODE.RISK_ODDS, label: "Risk \u2194 Odds (helper)" },
    { value: MODE.P1P0_TO_BOTH, label: "Group Risks (p1, p0) \u2192 RR & OR" }
  ], []);
  const requiredManualKeys = visibleManualKeys;
  const statusColor = fieldSummary.kind === "err" ? "text-red-700" : fieldSummary.kind === "warn" ? "text-amber-700" : "text-emerald-700";
  const canCopy = results.length > 0 && (csvText || "").length > 0;
  const baselineInfoText = "RR \u2194 OR conversion is not uniquely defined without a baseline risk.\n\n\u2022 Baseline risk (p0) is the risk in the control/unexposed group.\n\u2022 Providing p0 (or both p1 and p0) lets the tool translate between RR and OR in a way that stays consistent with the same outcome and time window.";
  const hrorInfoText = `This infographic uses a standard 2x2 table to illustrate four key ways researchers measure the relationship between an exposure (like a treatment) and an outcome. On the left, it defines Risk as the direct probability of the event happening in a group (a simple percentage), while Odds is defined as the ratio of events occurring versus them not occurring (like betting odds). The right side compares the two groups: Relative Risk (RR) is the most intuitive measure, directly comparing the probabilities to tell you, for instance, that the treated group is "twice as likely" to experience the event. The Odds Ratio (OR) compares the betting odds instead; it is mathematically useful for specific study designs (like case-control studies) but is generally less intuitive for beginners than the direct probability comparison provided by RR.`;
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-40 bg-[rgba(240,253,250,0.75)] backdrop-blur border-b border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 min-w-[220px]" }, logoOk ? /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "Entropy.png",
      alt: "Entropy",
      className: "h-9 w-auto",
      onError: () => setLogoOk(false)
    }
  ) : /* @__PURE__ */ React.createElement("div", { className: "logo-fallback", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 30, fontWeight: 400 } }, "\u03A3ntr"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22.5, fontWeight: 700 } }, "\u03A9"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 30, fontWeight: 400 } }, ".py"))), /* @__PURE__ */ React.createElement("a", { className: "btn-secondary text-sm", href: "Convert Statistical Quantities.html", title: "Return to the tools list" }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u2190"), /* @__PURE__ */ React.createElement("span", null, "Back to Tools")))), /* @__PURE__ */ React.createElement("main", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto px-4 py-8" }, /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up", style: { animationDelay: "0.05s" } }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-[#184B44] mb-3 text-center" }, "Risk and odds conversion"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 leading-relaxed text-center" }, "Convert between relative risk and odds ratio by anchoring the calculation to a baseline risk; also includes a risk\u2194odds helper and an optional mode that computes both measures from group risks.")), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-5", style: { animationDelay: "0.10s" } }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Assumptions"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 leading-relaxed" }, "Mode-aware notes are appended below the core assumptions.")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-600 bg-white border border-amber-200 rounded-full px-3 py-1" }, mode === MODE.RR_P0_TO_OR ? "RR\u2192OR" : mode === MODE.OR_P0_TO_RR ? "OR\u2192RR" : mode === MODE.RISK_ODDS ? "Risk\u2194Odds" : "p1,p0\u2192RR&OR")), /* @__PURE__ */ React.createElement("ul", { className: "mt-3 list-disc pl-5 text-sm text-slate-700 leading-relaxed" }, assumptions.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "mt-2" }, a))))), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-6", style: { animationDelay: "0.15s" } }, /* @__PURE__ */ React.createElement("div", { className: "tool-card" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Mode"), /* @__PURE__ */ React.createElement(
    InfoIconButton,
    {
      label: "What are risk, odds, RR, and OR?",
      onClick: () => setInfoModal({ open: true, type: "hror" })
    }
  )), /* @__PURE__ */ React.createElement(
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
  )), mode === MODE.RISK_ODDS ? /* @__PURE__ */ React.createElement("div", { className: "mt-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Helper direction"), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement(
    Toggle,
    {
      checked: !riskToOddsDir,
      onChange: (v) => {
        setRiskToOddsDir(!v);
        setResults([]);
        setCsvText("");
        setLengthNote("");
      },
      leftLabel: "Risk \u2192 Odds",
      rightLabel: "Odds \u2192 Risk",
      helper: "Choose which value you want to convert."
    }
  ))) : null, /* @__PURE__ */ React.createElement("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 lg:col-span-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Inputs"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Manual entry (comma-separated) or file upload.")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, "Strict typing \xB7 per-row validation")), /* @__PURE__ */ React.createElement("div", { className: "mt-4 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Required inputs"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-1 gap-4" }, requiredManualKeys.map((k) => /* @__PURE__ */ React.createElement(
    InputBar,
    {
      key: k,
      id: `in-${k}`,
      label: inputMeta[k].label,
      helper: inputMeta[k].helper,
      value: inputs[k],
      onChange: (v) => updateInput(k, v),
      placeholder: inputMeta[k].placeholder,
      rightAdornment: k === "p0" && mode !== MODE.RISK_ODDS ? /* @__PURE__ */ React.createElement(
        InfoIconButton,
        {
          label: "Why baseline risk is required",
          onClick: () => setInfoModal({ open: true, type: "p0" })
        }
      ) : null
    }
  ))))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 text-sm leading-relaxed " + statusColor }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, fieldSummary.kind === "ok" ? "Ready:" : "Input issues:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-slate-700" }, fieldSummary.text)), /* @__PURE__ */ React.createElement("details", { className: "mt-5 rounded-2xl border border-slate-200 bg-white/70 p-4" }, /* @__PURE__ */ React.createElement("summary", { className: "cursor-pointer text-sm font-medium text-slate-800" }, "File upload (optional)", /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-xs font-normal text-slate-500" }, fileStatus)), /* @__PURE__ */ React.createElement(
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
    /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Drag & drop a .csv, .txt, or .xlsx file"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1 font-normal" }, "Upload \u2192 parse \u2192 choose columns \u2192 populate inputs.")), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "btn-secondary text-sm",
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
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-wrap gap-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-brand text-sm", onClick: run }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14", stroke: "white", strokeWidth: "2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M13 5l7 7-7 7", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })), "Run"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-danger text-sm", onClick: resetAll }, "Reset")), lengthNote ? /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-amber-700 leading-relaxed" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Note:"), " ", lengthNote) : null), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 lg:col-span-7" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Output"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Per-row results with warnings (non-blocking).")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 justify-end" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary text-sm", onClick: copyCsv, disabled: !canCopy }, "Copy to Clipboard"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary text-sm", onClick: downloadCsv, disabled: !canCopy }, "Download CSV"))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, results.length, " row", results.length === 1 ? "" : "s")), /* @__PURE__ */ React.createElement("div", { className: "mt-4 border border-slate-200 rounded-2xl bg-white overflow-auto", style: { maxHeight: 460 } }, /* @__PURE__ */ React.createElement("table", { className: "min-w-[980px] w-full border-collapse" }, /* @__PURE__ */ React.createElement("thead", { className: "sticky top-0 bg-slate-50" }, /* @__PURE__ */ React.createElement("tr", null, tableCols.map((c) => /* @__PURE__ */ React.createElement("th", { key: c.key, className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, c.label)))), /* @__PURE__ */ React.createElement("tbody", null, results.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: tableCols.length, className: "px-3 py-4 text-sm text-slate-500" }, "Run the calculator to see results.")) : results.map((r, idx) => /* @__PURE__ */ React.createElement("tr", { key: idx, className: (idx % 2 === 0 ? "bg-white" : "bg-slate-50/40") + " hover:bg-[rgba(240,253,250,0.75)]" }, tableCols.map((c) => {
    if (c.key === "status") {
      return /* @__PURE__ */ React.createElement("td", { key: c.key, className: "px-3 py-2 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(StatusIcon, { status: r.status }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 font-medium" }, String(r.status || "").toUpperCase())));
    }
    if (c.key === "message") {
      const cls = r.status === "err" ? "text-red-700" : r.status === "warn" ? "text-amber-700" : "text-emerald-700";
      return /* @__PURE__ */ React.createElement("td", { key: c.key, className: "px-3 py-2 border-b border-slate-100 text-sm " + cls }, r.message);
    }
    const v = r[c.key];
    const display = c.key === "warnings" || c.key === "direction" ? String(v ?? "") : fmt(v);
    return /* @__PURE__ */ React.createElement("td", { key: c.key, className: "px-3 py-2 border-b border-slate-100 text-sm text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, display);
  })))))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-slate-600 leading-relaxed" }, "Exported CSV includes inputs, computed outputs, and warning flags."))))), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-8", style: { animationDelay: "0.20s" } }, /* @__PURE__ */ React.createElement("div", { className: ".tool-card-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "References"), /* @__PURE__ */ React.createElement("ul", { className: "mt-3 list-disc pl-5 text-sm text-slate-700 leading-relaxed" }, /* @__PURE__ */ React.createElement("li", null, "Zhang, J., & Yu, K. F. (1998). What\u2019s the relative risk? A method of correcting the odds ratio in cohort studies of common outcomes. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "JAMA, 280"), "(19), 1690\u20131691."), /* @__PURE__ */ React.createElement("li", null, "Cummings, P. (2009). The relative merits of risk ratios and odds ratios. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "JAMA Pediatrics, 163"), "(5), 438\u2013445."), /* @__PURE__ */ React.createElement("li", null, "Montreuil, B. (2005). What is so odd about odds? ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Journal of the Canadian Chiropractic Association, 49"), "(1), 51\u201354."), /* @__PURE__ */ React.createElement("li", null, "Prasad, K., Jaeschke, R., Wyer, P., Keitz, S., & Guyatt, G. (2008). Understanding odds ratios and their relationship to risk ratios. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Journal of General Internal Medicine, 23"), "(5), 635\u2013640."), /* @__PURE__ */ React.createElement("li", null, "Kim, H. Y. (2017). Risk difference, risk ratio, and odds ratio. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Korean Journal of Anesthesiology, 70"), "(4), 378\u2013380.")))))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")), /* @__PURE__ */ React.createElement(
    Modal,
    {
      open: colModalOpen,
      title: parsedFile?.filename ? `Select columns \u2014 ${parsedFile.filename}` : "Select columns",
      onClose: () => setColModalOpen(false)
    },
    parsedFile ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 leading-relaxed" }, "Map file columns to the required input fields for the current mode. After applying, the inputs will be populated as comma-separated lists."), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement(
      Toggle,
      {
        checked: !hasHeader,
        onChange: (v) => setHasHeader(!v),
        leftLabel: "Headers present",
        rightLabel: "No headers",
        helper: "If headers are present, the first row is treated as column names and will not be imported as data."
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "mt-5 grid grid-cols-1 md:grid-cols-2 gap-4" }, visibleManualKeys.map((k) => {
      const maxCols = Math.max(1, ...(parsedFile.rows || []).map((r) => r ? r.length : 0));
      return /* @__PURE__ */ React.createElement("div", { key: k, className: "w-full" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-800" }, inputMeta[k].label), /* @__PURE__ */ React.createElement(
        "select",
        {
          value: colSelections[k] ?? 0,
          onChange: (e) => setColSelections((prev) => ({ ...prev, [k]: Number(e.target.value) })),
          className: "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-[rgba(24,75,68,0.15)] focus:border-[var(--brand-primary)]"
        },
        Array.from({ length: maxCols }, (_, i) => /* @__PURE__ */ React.createElement("option", { key: i, value: i }, colName(parsedFile.rows, i, hasHeader)))
      ), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1 font-normal" }, "Choose the column that should populate this input."));
    })), /* @__PURE__ */ React.createElement("div", { className: "mt-5" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Preview"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1 font-normal" }, "Showing the first few rows that will be imported."), /* @__PURE__ */ React.createElement("div", { className: "mt-3 border border-slate-200 rounded-2xl overflow-auto bg-white", style: { maxHeight: 220 } }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full border-collapse" }, /* @__PURE__ */ React.createElement("thead", { className: "sticky top-0 bg-slate-50" }, /* @__PURE__ */ React.createElement("tr", null, Array.from({ length: Math.min(6, Math.max(1, ...parsedFile.rows.map((r) => r ? r.length : 0))) }, (_, i) => /* @__PURE__ */ React.createElement("th", { key: i, className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, colName(parsedFile.rows, i, hasHeader))))), /* @__PURE__ */ React.createElement("tbody", null, parsedFile.rows.slice(hasHeader ? 1 : 0, (hasHeader ? 1 : 0) + 5).map((r, ri) => /* @__PURE__ */ React.createElement("tr", { key: ri, className: ri % 2 === 0 ? "bg-white" : "bg-slate-50/40" }, Array.from({ length: Math.min(6, Math.max(1, ...parsedFile.rows.map((r0) => r0 ? r0.length : 0))) }, (_, ci) => /* @__PURE__ */ React.createElement("td", { key: ci, className: "px-3 py-2 border-b border-slate-100 text-sm text-slate-700" }, String(r?.[ci] ?? "").trim())))))))), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-wrap gap-3 justify-end" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary text-sm", onClick: () => setColModalOpen(false) }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-brand text-sm", onClick: applyColumns }, "Apply columns"))) : /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600" }, "No parsed file found.")
  ), /* @__PURE__ */ React.createElement(
    Modal,
    {
      open: infoModal.open,
      title: infoModal.type === "hror" ? "Risk, odds, relative risk, and odds ratio" : "Baseline risk (p0)",
      onClose: () => setInfoModal({ open: false, type: "p0" })
    },
    infoModal.type === "hror" ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-full overflow-hidden rounded-2xl border border-slate-200 bg-white",
        style: { aspectRatio: "11 / 6" }
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: "HR_OR.png",
          alt: "Risk, odds, relative risk, and odds ratio infographic",
          className: "w-full h-full object-contain",
          onError: (e) => {
            e.currentTarget.style.display = "none";
          }
        }
      )
    ), /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-sm text-slate-700 leading-relaxed" }, hrorInfoText)) : /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-700 leading-relaxed whitespace-pre-line" }, baselineInfoText)
  ));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
