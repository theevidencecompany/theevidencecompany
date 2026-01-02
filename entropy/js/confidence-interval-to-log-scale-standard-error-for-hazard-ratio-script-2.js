const { useEffect, useMemo, useRef, useState } = React;
function inverseNormalCDF(p) {
  if (!(p > 0 && p < 1)) return NaN;
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q, r;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  q = p - 0.5;
  r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
const nf = new Intl.NumberFormat("en-US", { maximumSignificantDigits: 8, useGrouping: false });
function fmt(x) {
  if (x === Infinity) return "\u221E";
  if (x === -Infinity) return "\u2212\u221E";
  if (x === 0) return "0";
  if (x === null || x === void 0) return "\u2014";
  if (typeof x !== "number" || !Number.isFinite(x)) return "\u2014";
  return nf.format(x);
}
function computeZ(confPct, sided, tail) {
  const alpha = 1 - confPct / 100;
  const p = sided === "two" ? 1 - alpha / 2 : 1 - alpha;
  return inverseNormalCDF(p);
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
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-slate-800" }, title), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary text-sm", onClick: onClose }, "Close")), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, children)));
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
  ), /* @__PURE__ */ React.createElement(
    "label",
    {
      className: "toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer transition"
    }
  )))), helper ? /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 mt-1 leading-relaxed" }, helper) : null);
}
function Tabs({ value, onChange, options }) {
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2" }, options.map((opt) => {
    const active = opt.value === value;
    return /* @__PURE__ */ React.createElement("div", { key: opt.value, className: "flex items-stretch gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => onChange(opt.value),
        className: "w-full text-left text-sm font-medium px-3 py-2 rounded-xl border transition leading-snug " + (active ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow" : "bg-white text-slate-700 border-slate-200 hover:border-[var(--brand-primary)]")
      },
      opt.label
    ), opt.info ? /* @__PURE__ */ React.createElement(
      InfoIconButton,
      {
        label: opt.info.ariaLabel || "More information",
        onClick: opt.info.onClick
      }
    ) : null);
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
  ), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, helper));
}
const MODE = {
  A: "A",
  B: "B",
  C: "C"
};
function App() {
  const [logoOk, setLogoOk] = useState(true);
  const [mode, setMode] = useState(MODE.A);
  const [sided, setSided] = useState("two");
  const [tail, setTail] = useState("left");
  const [conf, setConf] = useState(95);
  const [inputs, setInputs] = useState({
    hr: "",
    se: "",
    lcl: "",
    ucl: "",
    a: "",
    // O-E
    b: "",
    // V
    c: "",
    // n_experimental (optional)
    d: ""
    // n_control (optional)
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
  const [colSelections, setColSelections] = useState({});
  const [infoModal, setInfoModal] = useState({ open: false, type: "twoone" });
  const z = useMemo(() => computeZ(conf, sided, tail), [conf, sided, tail]);
  const requiredKeys = useMemo(() => {
    if (mode === MODE.A) {
      if (sided === "two") return ["hr", "lcl", "ucl"];
      return tail === "left" ? ["hr", "lcl"] : ["hr", "ucl"];
    }
    if (mode === MODE.B) {
      return ["hr", "se"];
    }
    return ["a", "b"];
  }, [mode, sided, tail]);
  const visibleManualKeys = useMemo(() => {
    if (mode === MODE.A) {
      if (sided === "two") return ["hr", "lcl", "ucl"];
      return tail === "left" ? ["hr", "lcl", "ucl"] : ["hr", "lcl", "ucl"];
    }
    if (mode === MODE.B) {
      return ["hr", "se"];
    }
    return ["a", "b", "c", "d"];
  }, [mode, sided, tail]);
  const inputMeta = useMemo(() => ({
    hr: {
      label: "HR list",
      helper: "Hazard ratio values (must be > 0). Comma-separated.",
      placeholder: "e.g., 0.78, 1.12, 0.95"
    },
    se: {
      label: "Standard error list",
      helper: "Standard error of log(HR) (must be > 0). Comma-separated.",
      placeholder: "e.g., 0.10, 0.22, 0.08"
    },
    lcl: {
      label: "Lower CI list",
      helper: "Lower confidence bound (must be > 0). Leave blank if not applicable for your one-sided direction.",
      placeholder: "e.g., 0.62, 0.90, 0.81"
    },
    ucl: {
      label: "Upper CI list",
      helper: "Upper confidence bound (must be > 0). Leave blank if not applicable for your one-sided direction.",
      placeholder: "e.g., 0.97, 1.39, 1.11"
    },
    a: {
      label: "a list (O \u2212 E)",
      helper: "Log-rank \u201Cobserved minus expected\u201D for experimental group. Comma-separated.",
      placeholder: "e.g., -4.2, 1.1, 0.0"
    },
    b: {
      label: "b list (V)",
      helper: "Variance of O \u2212 E (must be > 0). Comma-separated.",
      placeholder: "e.g., 16.0, 9.4, 25.1"
    },
    c: {
      label: "c list (n_experimental, optional)",
      helper: "Optional. Stored/displayed but not used in computation. Comma-separated.",
      placeholder: "e.g., 120, 80, 200"
    },
    d: {
      label: "d list (n_control, optional)",
      helper: "Optional. Stored/displayed but not used in computation. Comma-separated.",
      placeholder: "e.g., 118, 79, 198"
    }
  }), []);
  function updateInput(key, value) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  useEffect(() => {
    const problems = [];
    const warnings = [];
    for (const k of requiredKeys) {
      const parsed = parseList(inputs[k]);
      const bad = parsed.filter((t) => !t.ok);
      if (bad.length) {
        const samples = bad.slice(0, 5).map((t) => t.missing ? "(blank)" : `'${t.raw}'`).join(", ");
        problems.push(`${inputMeta[k].label}: invalid value(s) \u2192 ${samples}${bad.length > 5 ? "\u2026" : ""}`);
      }
      const nums = parsed.filter((t) => t.ok).map((t) => t.val);
      if (k === "hr") {
        if (nums.some((n) => !(n > 0))) problems.push(`${inputMeta[k].label}: values must be > 0`);
      }
      if (k === "se") {
        if (nums.some((n) => !(n > 0))) problems.push(`${inputMeta[k].label}: values must be > 0`);
      }
      if (k === "lcl" || k === "ucl") {
        if (nums.some((n) => !(n > 0))) problems.push(`${inputMeta[k].label}: bounds must be > 0`);
      }
      if (mode === MODE.C && k === "b") {
        if (nums.some((n) => !(n > 0))) problems.push(`${inputMeta[k].label}: V must be > 0`);
      }
    }
    if (mode === MODE.A && sided === "two") {
      const l = parseList(inputs.lcl);
      const u = parseList(inputs.ucl);
      const minLen = Math.min(l.length, u.length);
      for (let i = 0; i < minLen; i++) {
        if (l[i]?.ok && u[i]?.ok && !(l[i].val < u[i].val)) {
          warnings.push(`Some rows have Lower CI \u2265 Upper CI (will be flagged per-row).`);
          break;
        }
      }
    }
    if (problems.length) {
      setFieldSummary({ kind: "err", text: problems[0] + (problems.length > 1 ? ` (+${problems.length - 1} more)` : "") });
    } else if (warnings.length) {
      setFieldSummary({ kind: "warn", text: warnings[0] + (warnings.length > 1 ? ` (+${warnings.length - 1} more)` : "") });
    } else {
      setFieldSummary({ kind: "ok", text: "Ready." });
    }
  }, [inputs, requiredKeys, inputMeta, mode, sided]);
  const assumptions = useMemo(() => {
    const base = [
      "Time-to-event outcomes are most appropriately summarized with a hazard ratio; interpretation commonly relies on the proportional hazards assumption.",
      "Ratio measures are handled on the log scale; confidence limits are formed on ln(HR) and exponentiated back to HR.",
      "CI \u2194 SE conversions assume a Wald-type interval on the log scale (approximate normality of ln(HR)).",
      "The log-rank (O\u2212E, V) method assumes b=V>0 and that O\u2212E and V come from a valid log-rank analysis for the same comparison direction.",
      "If the user only has a 2\xD72 event/non-event table at a fixed time point (not O\u2212E and V), this calculator is not appropriate; use RR/OR tools instead."
    ];
    const extra = [];
    if (sided === "one") {
      extra.push(tail === "left" ? "One-sided left-tailed output shows a lower bound and \u221E as the upper bound." : "One-sided right-tailed output shows an upper bound and 0 as the lower bound.");
    } else {
      extra.push("Two-sided output shows both lower and upper bounds.");
    }
    if (mode === MODE.C) extra.push("Log-rank mode computes ln(HR), SE(ln(HR)), HR, and confidence bounds from O\u2212E and V.");
    if (mode === MODE.A) extra.push("CI-to-SE mode back-calculates uncertainty from reported HR confidence bounds.");
    if (mode === MODE.B) extra.push("SE-to-CI mode generates confidence bounds from HR and log-scale standard error.");
    return [...base, ...extra];
  }, [mode, sided, tail]);
  const tableCols = useMemo(() => {
    if (mode === MODE.C) {
      return [
        { key: "status", label: "Status" },
        { key: "message", label: "Message" },
        { key: "a", label: "a (O\u2212E)" },
        { key: "b", label: "b (V)" },
        { key: "c", label: "c (n_exp)" },
        { key: "d", label: "d (n_ctrl)" },
        { key: "lnhr", label: "ln(HR)" },
        { key: "se", label: "SE of log(HR)" },
        { key: "hr", label: "HR" },
        { key: "ciType", label: "CI type" },
        { key: "lcl", label: "Lower bound" },
        { key: "ucl", label: "Upper bound" },
        { key: "warnings", label: "Warnings" }
      ];
    }
    const base = [
      { key: "status", label: "Status" },
      { key: "message", label: "Message" },
      { key: "hr", label: "HR" }
    ];
    if (mode === MODE.A) {
      if (sided === "two") {
        return [
          ...base,
          { key: "lcl", label: "Lower CI" },
          { key: "ucl", label: "Upper CI" },
          { key: "lnhr", label: "ln(HR)" },
          { key: "se", label: "SE of log(HR)" },
          { key: "ciType", label: "CI type" },
          { key: "outLcl", label: "Lower bound" },
          { key: "outUcl", label: "Upper bound" },
          { key: "warnings", label: "Warnings" }
        ];
      }
      return [
        ...base,
        { key: "lcl", label: "Lower CI" },
        { key: "ucl", label: "Upper CI" },
        { key: "lnhr", label: "ln(HR)" },
        { key: "se", label: "SE of log(HR)" },
        { key: "ciType", label: "CI type" },
        { key: "outLcl", label: "Lower bound" },
        { key: "outUcl", label: "Upper bound" },
        { key: "warnings", label: "Warnings" }
      ];
    }
    return [
      ...base,
      { key: "seIn", label: "SE of log(HR)" },
      { key: "lnhr", label: "ln(HR)" },
      { key: "ciType", label: "CI type" },
      { key: "outLcl", label: "Lower bound" },
      { key: "outUcl", label: "Upper bound" },
      { key: "warnings", label: "Warnings" }
    ];
  }, [mode, sided]);
  function alignRows() {
    const reqParsed = requiredKeys.map((k) => ({ k, parsed: parseList(inputs[k]) }));
    const lengths = reqParsed.map((x) => x.parsed.length);
    const minLen = lengths.length ? Math.min(...lengths) : 0;
    const maxLen = lengths.length ? Math.max(...lengths) : 0;
    const extras = reqParsed.filter((x) => x.parsed.length > minLen).map((x) => ({ key: x.k, extra: x.parsed.length - minLen }));
    const optionalKeys = mode === MODE.C ? ["c", "d"] : [];
    const optionalParsed = {};
    for (const ok of optionalKeys) optionalParsed[ok] = parseList(inputs[ok]);
    const rows = [];
    for (let i = 0; i < minLen; i++) {
      const row = { idx: i, vals: {}, raw: {}, ok: true, missing: false, notes: [] };
      for (const { k, parsed } of reqParsed) {
        const t = parsed[i];
        row.raw[k] = t?.raw ?? "";
        row.vals[k] = t?.val;
        if (!t || !t.ok) {
          row.ok = false;
          row.missing = row.missing || !!t?.missing;
        }
      }
      for (const ok of optionalKeys) {
        const t = optionalParsed[ok]?.[i];
        row.raw[ok] = t?.raw ?? "";
        row.vals[ok] = t?.ok ? t.val : t?.missing ? null : NaN;
      }
      rows.push(row);
    }
    return { rows, minLen, maxLen, extras };
  }
  function computeRow(row) {
    const warn = [];
    const sidedLabel = sided === "two" ? "Two-sided" : tail === "left" ? "One-sided left" : "One-sided right";
    if (!row.ok) {
      return {
        status: "err",
        message: row.missing ? "Missing value(s) in required fields." : "Invalid value(s) in required fields.",
        warnings: row.missing ? "Missing input(s)." : "Invalid input(s).",
        ...echoInputs(row)
      };
    }
    try {
      if (mode === MODE.C) {
        const a = row.vals.a;
        const b = row.vals.b;
        if (!(b > 0)) throw new Error("V must be > 0.");
        const lnhr2 = a / b;
        const se = 1 / Math.sqrt(b);
        if (!(se > 0) || !Number.isFinite(se)) throw new Error("Cannot compute SE from V.");
        const hr2 = Math.exp(lnhr2);
        let lcl, ucl;
        if (sided === "two") {
          lcl = Math.exp(lnhr2 - z * se);
          ucl = Math.exp(lnhr2 + z * se);
        } else if (tail === "left") {
          lcl = Math.exp(lnhr2 - z * se);
          ucl = Infinity;
        } else {
          lcl = 0;
          ucl = Math.exp(lnhr2 + z * se);
        }
        return {
          status: warn.length ? "warn" : "ok",
          message: warn.length ? "Computed with warnings." : "Computed.",
          a,
          b,
          c: safeEcho(row, "c"),
          d: safeEcho(row, "d"),
          lnhr: lnhr2,
          se,
          hr: hr2,
          ciType: sidedLabel,
          lcl,
          ucl,
          warnings: warn.join(" | ")
        };
      }
      if (mode === MODE.A) {
        const hr2 = row.vals.hr;
        if (!(hr2 > 0)) throw new Error("HR must be > 0.");
        const lnhr2 = Math.log(hr2);
        let se;
        let outLcl2, outUcl2;
        if (sided === "two") {
          const l = row.vals.lcl;
          const u = row.vals.ucl;
          if (!(l > 0) || !(u > 0)) throw new Error("CI bounds must be > 0.");
          if (!(l < u)) {
            warn.push("Lower CI is not less than Upper CI.");
          }
          if (!(l < u)) throw new Error("Lower CI must be less than Upper CI.");
          se = (Math.log(u) - Math.log(l)) / (2 * z);
          outLcl2 = l;
          outUcl2 = u;
        } else if (tail === "left") {
          const l = row.vals.lcl;
          if (!(l > 0)) throw new Error("Lower CI must be > 0 for left-tailed one-sided.");
          se = (Math.log(hr2) - Math.log(l)) / z;
          outLcl2 = l;
          outUcl2 = Infinity;
        } else {
          const u = row.vals.ucl;
          if (!(u > 0)) throw new Error("Upper CI must be > 0 for right-tailed one-sided.");
          se = (Math.log(u) - Math.log(hr2)) / z;
          outLcl2 = 0;
          outUcl2 = u;
        }
        if (!(se > 0) || !Number.isFinite(se)) throw new Error("SE must be > 0 (check inputs).");
        return {
          status: warn.length ? "warn" : "ok",
          message: warn.length ? "Computed with warnings." : "Computed.",
          hr: hr2,
          lcl: safeEcho(row, "lcl"),
          ucl: safeEcho(row, "ucl"),
          lnhr: lnhr2,
          se,
          ciType: sidedLabel,
          outLcl: outLcl2,
          outUcl: outUcl2,
          warnings: warn.join(" | ")
        };
      }
      const hr = row.vals.hr;
      const seIn = row.vals.se;
      if (!(hr > 0)) throw new Error("HR must be > 0.");
      if (!(seIn > 0)) throw new Error("SE must be > 0.");
      const lnhr = Math.log(hr);
      let outLcl, outUcl;
      if (sided === "two") {
        outLcl = Math.exp(lnhr - z * seIn);
        outUcl = Math.exp(lnhr + z * seIn);
      } else if (tail === "left") {
        outLcl = Math.exp(lnhr - z * seIn);
        outUcl = Infinity;
      } else {
        outLcl = 0;
        outUcl = Math.exp(lnhr + z * seIn);
      }
      return {
        status: warn.length ? "warn" : "ok",
        message: warn.length ? "Computed with warnings." : "Computed.",
        hr,
        seIn,
        lnhr,
        ciType: sidedLabel,
        outLcl,
        outUcl,
        warnings: warn.join(" | ")
      };
    } catch (e) {
      return {
        status: "err",
        message: String(e?.message || e),
        warnings: warn.join(" | "),
        ...echoInputs(row)
      };
    }
  }
  function safeEcho(row, key) {
    const parsed = parseList(inputs[key]);
    const t = parsed[row.idx];
    if (!t) return null;
    if (t.ok) return t.val;
    if (t.missing) return null;
    return NaN;
  }
  function echoInputs(row) {
    const out = {};
    for (const k of visibleManualKeys) {
      out[k] = safeEcho(row, k);
    }
    return out;
  }
  function buildCsv(rows) {
    const metaCols = ["mode", "two_or_one_sided", "tail", "confidence_level_percent", "z_value"];
    const inputCols = ["hr", "se", "lcl", "ucl", "a", "b", "c", "d"];
    const outCols = ["lnhr", "se_out", "hr_out", "ci_type", "lower_bound", "upper_bound", "status", "message", "warnings"];
    const header = [...metaCols, ...inputCols, ...outCols];
    const modeLabel = mode === MODE.A ? "HR + CI \u2192 SE(ln(HR))" : mode === MODE.B ? "HR + SE(ln(HR)) \u2192 CI" : "Log-rank summary (a,b,c,d) \u2192 ln(HR), SE, HR, CI";
    const lines = [header.join(",")];
    for (const r of rows) {
      const ciType = r.ciType ?? "";
      const lower = r.outLcl ?? r.lcl;
      const upper = r.outUcl ?? r.ucl;
      const rowVals = {
        mode: modeLabel,
        two_or_one_sided: sided === "two" ? "two-sided" : "one-sided",
        tail: sided === "two" ? "" : tail,
        confidence_level_percent: conf,
        z_value: z,
        hr: valOrBlank(r.hr),
        se: valOrBlank(r.seIn ?? r.se),
        lcl: valOrBlank(r.lcl),
        ucl: valOrBlank(r.ucl),
        a: valOrBlank(r.a),
        b: valOrBlank(r.b),
        c: valOrBlank(r.c),
        d: valOrBlank(r.d),
        lnhr: valOrBlank(r.lnhr),
        se_out: valOrBlank(mode === MODE.A ? r.se : mode === MODE.C ? r.se : r.seIn),
        hr_out: valOrBlank(r.hr ?? r.hr_out ?? r.hr),
        ci_type: String(ciType),
        lower_bound: valOrBound(lower),
        upper_bound: valOrBound(upper),
        status: String(r.status ?? ""),
        message: String(r.message ?? ""),
        warnings: String(r.warnings ?? "")
      };
      const line = header.map((k) => csvEscape(rowVals[k]));
      lines.push(line.join(","));
    }
    return lines.join("\n");
  }
  function valOrBlank(x) {
    if (x === null || x === void 0) return "";
    if (typeof x === "number") {
      if (!Number.isFinite(x)) return "";
      return x;
    }
    return x;
  }
  function valOrBound(x) {
    if (x === Infinity) return "Infinity";
    if (x === -Infinity) return "-Infinity";
    if (x === 0) return 0;
    if (x === null || x === void 0) return "";
    if (typeof x === "number") {
      if (!Number.isFinite(x)) return "";
      return x;
    }
    return x;
  }
  function csvEscape(x) {
    const s = String(x ?? "");
    if (/[\n\r,\"]/g.test(s)) return '"' + s.replace(/\"/g, '""') + '"';
    return s;
  }
  function run() {
    setResults([]);
    setLengthNote("");
    const aligned = alignRows();
    const { rows, minLen, maxLen, extras } = aligned;
    if (minLen === 0) {
      setResults([]);
      setLengthNote("No rows to process. Enter comma-separated values in the required input fields.");
      setCsvText("");
      return;
    }
    if (maxLen !== minLen) {
      const extraMsg = extras.map((e) => `${inputMeta[e.key].label}: ${e.extra} extra value(s) ignored`).join(" \xB7 ");
      setLengthNote(`Length mismatch: processed up to the shortest list (${minLen}). ${extraMsg}`);
    }
    const computed = rows.map(computeRow);
    setResults(computed);
    const csv = buildCsv(computed);
    setCsvText(csv);
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
    a.download = "entropy_hr_ci_se_results.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function resetAll() {
    setMode(MODE.A);
    setSided("two");
    setTail("left");
    setConf(95);
    setInputs({ hr: "", se: "", lcl: "", ucl: "", a: "", b: "", c: "", d: "" });
    setResults([]);
    setLengthNote("");
    setCsvText("");
    setParsedFile(null);
    setFileStatus("No file loaded.");
    setColModalOpen(false);
    setColSelections({});
    setHasHeader(true);
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
        if (!window.XLSX) throw new Error("XLSX parser not available. Check your network connection.");
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
      requiredKeys.forEach((k, idx) => {
        initial[k] = Math.min(idx, maxCols - 1);
      });
      visibleManualKeys.forEach((k, idx) => {
        if (!(k in initial)) initial[k] = Math.min(idx, maxCols - 1);
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
  }
  const modeOptions = [
    { value: MODE.A, label: "HR + CI \u2192 SE(ln(HR))" },
    { value: MODE.B, label: "HR + SE(ln(HR)) \u2192 CI" },
    {
      value: MODE.C,
      label: "Log-rank summary (a,b,c,d) \u2192 ln(HR), SE, HR, CI",
      info: {
        ariaLabel: "What do O, E, and V mean? (Log-rank summary help)",
        onClick: () => setInfoModal({ open: true, type: "logrank" })
      }
    }
  ];
  const canCopy = results.length > 0 && (csvText || "").length > 0;
  const requiredManualKeys = visibleManualKeys.filter((k) => requiredKeys.includes(k));
  const optionalManualKeys = visibleManualKeys.filter((k) => !requiredKeys.includes(k));
  const infoTwoOneText = "Choosing the right interval depends on whether you need to account for deviations in both directions or just one. A two-sided interval is used when any change is relevant, like testing if a new medication changes blood pressure either higher or lower than the current standard. A one-sided interval is used when you only care about a specific directional benefit, such as verifying that a new car battery lasts longer than the previous model.";
  const infoTailText = "A one-sided confidence interval puts the entire significance level \u03B1 into one tail (the shaded rejection region), so you get just one bound at confidence 1\u2212\u03B1 instead of two. In the left-tailed / lower-bound case, the interval is [L, \u221E), meaning \u201Cwe\u2019re 95% confident the true value is at least L,\u201D which fits questions like \u201CIs a lightbulb\u2019s mean lifetime \u2265 10,000 hours?\u201D In the right-tailed / upper-bound case, the interval is (\u2212\u221E, U], meaning \u201Cwe\u2019re 95% confident the true value is no more than U,\u201D which fits questions like \u201CIs average pollution \u2264 the safety threshold?\u201D You use a one-tailed CI when only one direction matters (and you\u2019re willing to ignore the other), and it lines up with a one-tailed test: if the spec/null value falls beyond your one-sided bound in the wrong direction, you\u2019d reject at level \u03B1.";
  const infoLogRankText = `\u2022 O (observed) counts the events that actually happened in the experimental group during follow-up.
\u2022 E (expected) is how many events you would expect there if both groups had the same risk over time.
\u2022 O\u2212E and V together summarize the direction/strength of the difference and how precise it is, so you can reconstruct an HR and its uncertainty for meta-analysis.`;
  const info = infoModal.type === "twoone" ? { title: "Two-sided vs One-sided", img: "Two One sided.png", text: infoTwoOneText } : infoModal.type === "tail" ? { title: "Left tailed vs Right tailed", img: "One sided CI.png", text: infoTailText } : { title: "Log-rank summary: O, E, and V", img: "HR.png", text: infoLogRankText };
  const statusColor = fieldSummary.kind === "err" ? "text-red-700" : fieldSummary.kind === "warn" ? "text-amber-700" : "text-emerald-700";
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
      className: "btn-secondary text-sm",
      href: "Convert Statistical Quantities.html",
      title: "Return to the tools list"
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u2190"),
    /* @__PURE__ */ React.createElement("span", null, "Back to Tools")
  ))), /* @__PURE__ */ React.createElement("main", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto px-4 py-8" }, /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up", style: { animationDelay: "0.05s" } }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-[#184B44] mb-3 text-center" }, "Confidence interval to log scale standard error for hazard ratio"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 leading-relaxed text-center" }, "Convert hazard ratio uncertainty between reported confidence intervals and log-scale standard errors for meta-analysis; optionally compute ln(HR) and SE(ln(HR)) from log-rank O\u2212E and V.")), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-5", style: { animationDelay: "0.10s" } }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Assumptions"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 leading-relaxed" }, "Mode-aware notes are appended below the core assumptions.")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-600 bg-white border border-amber-200 rounded-full px-3 py-1" }, mode === MODE.A ? "CI \u2192 SE" : mode === MODE.B ? "SE \u2192 CI" : "Log-rank", " \xB7 ", sided === "two" ? "Two-sided" : tail === "left" ? "One-sided (Left tailed)" : "One-sided (Right tailed)")), /* @__PURE__ */ React.createElement("ul", { className: "mt-3 list-disc pl-5 text-sm text-slate-700 leading-relaxed" }, assumptions.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "mt-2" }, a))))), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-6", style: { animationDelay: "0.15s" } }, /* @__PURE__ */ React.createElement("div", { className: "tool-card" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Mode"), /* @__PURE__ */ React.createElement(Tabs, { value: mode, onChange: (v) => {
    setMode(v);
    setResults([]);
    setCsvText("");
    setLengthNote("");
  }, options: modeOptions })), /* @__PURE__ */ React.createElement("div", { className: "mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Interval type"), /* @__PURE__ */ React.createElement(InfoIconButton, { label: "About two-sided vs one-sided", onClick: () => setInfoModal({ open: true, type: "twoone" }) })), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement(
    Toggle,
    {
      checked: sided === "one",
      onChange: (v) => {
        setSided(v ? "one" : "two");
        setResults([]);
        setCsvText("");
        setLengthNote("");
      },
      leftLabel: "Two-sided",
      rightLabel: "One-sided",
      helper: "Controls whether bounds are produced on both sides or just one."
    }
  )), sided === "one" ? /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Direction"), /* @__PURE__ */ React.createElement(InfoIconButton, { label: "About left tailed vs right tailed", onClick: () => setInfoModal({ open: true, type: "tail" }) })), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement(
    Toggle,
    {
      checked: tail === "right",
      onChange: (v) => {
        setTail(v ? "right" : "left");
        setResults([]);
        setCsvText("");
        setLengthNote("");
      },
      leftLabel: "Left tailed",
      rightLabel: "Right tailed",
      helper: "Pick the one-sided direction that matches your question."
    }
  ))) : null), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Confidence level"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min: "80",
      max: "99.9",
      step: "0.1",
      value: conf,
      onChange: (e) => {
        const v = clamp(Number(e.target.value), 80, 99.9);
        setConf(Math.round(v * 10) / 10);
        setResults([]);
        setCsvText("");
      },
      className: "w-full",
      "aria-label": "Confidence level slider"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "80",
      max: "99.9",
      step: "0.1",
      value: conf,
      onChange: (e) => {
        const v = clamp(Number(e.target.value), 80, 99.9);
        setConf(Math.round(v * 10) / 10);
        setResults([]);
        setCsvText("");
      },
      className: "w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[rgba(24,75,68,0.15)] focus:border-[var(--brand-primary)]",
      "aria-label": "Confidence level numeric"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 leading-relaxed" }, "Z-value used internally: ", /* @__PURE__ */ React.createElement("span", { className: "font-medium text-slate-800" }, fmt(z)))))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 lg:col-span-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Inputs"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Manual entry (comma-separated) or file upload.")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, "Strict typing \xB7 per-row validation")), /* @__PURE__ */ React.createElement("div", { className: "mt-4 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Required inputs"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-1 gap-4" }, requiredManualKeys.map((k) => /* @__PURE__ */ React.createElement(
    InputBar,
    {
      key: k,
      id: `in-${k}`,
      label: inputMeta[k].label,
      helper: inputMeta[k].helper,
      value: inputs[k],
      onChange: (v) => updateInput(k, v),
      placeholder: inputMeta[k].placeholder
    }
  )))), optionalManualKeys.length ? /* @__PURE__ */ React.createElement("details", { className: "rounded-2xl border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("summary", { className: "cursor-pointer text-sm font-medium text-slate-800" }, "Optional inputs", /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-xs font-normal text-slate-500" }, "(not required to run)")), /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-1 gap-4" }, optionalManualKeys.map((k) => /* @__PURE__ */ React.createElement(
    InputBar,
    {
      key: k,
      id: `in-${k}`,
      label: inputMeta[k].label,
      helper: inputMeta[k].helper,
      value: inputs[k],
      onChange: (v) => updateInput(k, v),
      placeholder: inputMeta[k].placeholder
    }
  )))) : null), /* @__PURE__ */ React.createElement("div", { className: "mt-4 text-sm leading-relaxed " + statusColor }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, fieldSummary.kind === "ok" ? "Ready:" : fieldSummary.kind === "warn" ? "Warnings:" : "Input issues:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-slate-700" }, fieldSummary.text)), /* @__PURE__ */ React.createElement("details", { className: "mt-5 rounded-2xl border border-slate-200 bg-white/70 p-4" }, /* @__PURE__ */ React.createElement("summary", { className: "cursor-pointer text-sm font-medium text-slate-800" }, "File upload (optional)", /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-xs font-normal text-slate-500" }, fileStatus)), /* @__PURE__ */ React.createElement(
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
    /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Drag & drop a .csv, .txt, or .xlsx file"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Upload \u2192 parse \u2192 choose columns \u2192 populate inputs.")), /* @__PURE__ */ React.createElement(
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
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-wrap gap-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-brand text-sm", onClick: run }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14", stroke: "white", strokeWidth: "2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M13 5l7 7-7 7", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })), "Run"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-danger text-sm", onClick: resetAll }, "Reset")), lengthNote ? /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-amber-700 leading-relaxed" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Note:"), " ", lengthNote) : null), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 lg:col-span-7" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Output"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Per-row results with warnings (non-blocking).")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 justify-end" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary text-sm", onClick: copyCsv, disabled: !canCopy }, "Copy to Clipboard"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary text-sm", onClick: downloadCsv, disabled: !canCopy }, "Download CSV"))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, results.length, " row", results.length === 1 ? "" : "s"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, "Z-value: ", fmt(z))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 border border-slate-200 rounded-2xl bg-white overflow-auto", style: { maxHeight: 460 } }, /* @__PURE__ */ React.createElement("table", { className: "min-w-[980px] w-full border-collapse" }, /* @__PURE__ */ React.createElement("thead", { className: "sticky top-0 bg-slate-50" }, /* @__PURE__ */ React.createElement("tr", null, tableCols.map((c) => /* @__PURE__ */ React.createElement("th", { key: c.key, className: "text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-2 border-b border-slate-200" }, c.label)))), /* @__PURE__ */ React.createElement("tbody", null, results.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: tableCols.length, className: "px-3 py-4 text-sm text-slate-500" }, "Run the calculator to see results.")) : results.map((r, idx) => /* @__PURE__ */ React.createElement("tr", { key: idx, className: (idx % 2 === 0 ? "bg-white" : "bg-slate-50/40") + " hover:bg-[rgba(240,253,250,0.75)]" }, tableCols.map((c) => {
    if (c.key === "status") {
      return /* @__PURE__ */ React.createElement("td", { key: c.key, className: "px-3 py-2 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(StatusIcon, { status: r.status }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 font-medium" }, String(r.status || "").toUpperCase())));
    }
    if (c.key === "message") {
      const cls = r.status === "err" ? "text-red-700" : r.status === "warn" ? "text-amber-700" : "text-emerald-700";
      return /* @__PURE__ */ React.createElement("td", { key: c.key, className: "px-3 py-2 border-b border-slate-100 text-sm " + cls }, r.message);
    }
    const v = r[c.key];
    let display;
    if (c.key === "ciType") display = v || "";
    else if (c.key === "warnings") display = (v || "").toString();
    else display = fmt(v);
    return /* @__PURE__ */ React.createElement("td", { key: c.key, className: "px-3 py-2 border-b border-slate-100 text-sm text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, display);
  })))))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-slate-600 leading-relaxed" }, "Exported CSV includes inputs, computed outputs, and warning flags."))))), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-8", style: { animationDelay: "0.20s" } }, /* @__PURE__ */ React.createElement("div", { className: "references-plain rounded-2xl px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "References"), /* @__PURE__ */ React.createElement("ul", { className: "mt-3 list-disc pl-5 text-sm text-slate-700 leading-relaxed" }, /* @__PURE__ */ React.createElement("li", null, "Higgins, J. P. T., Li, T., & Deeks, J. J. (Eds.). (2024). ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Chapter 6: Choosing effect measures and computing estimates of effect"), " (Cochrane Handbook for Systematic Reviews of Interventions, Version 6.5; last updated August 2023). Cochrane."), /* @__PURE__ */ React.createElement("li", null, "Deeks, J. J., & Higgins, J. P. T. (2022, May). ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Statistical algorithms in Review Manager"), ". Cochrane Statistical Methods Group, Cochrane."), /* @__PURE__ */ React.createElement("li", null, "Tierney, J. F., Stewart, L. A., Ghersi, D., Burdett, S., & Sydes, M. R. (2007). Practical methods for incorporating summary time-to-event data into meta-analysis. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Trials, 8"), ", 16. https://doi.org/10.1186/1745-6215-8-16"), /* @__PURE__ */ React.createElement("li", null, "Parmar, M. K. B., Torri, V., & Stewart, L. (1998). Extracting summary statistics to perform meta-analyses of the published literature for survival endpoints. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Statistics in Medicine, 17"), "(24), 2815\u20132834. https://doi.org/10.1002/(SICI)1097-0258(19981230)17:24<2815::AID-SIM110>3.0.CO;2-8")))))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")), /* @__PURE__ */ React.createElement(
    Modal,
    {
      open: colModalOpen,
      title: "Choose columns to import",
      onClose: () => setColModalOpen(false)
    },
    !parsedFile ? /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "No file loaded.") : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 leading-relaxed" }, "Select which file columns should populate the current mode\u2019s input lists."), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "hdr",
        type: "checkbox",
        checked: hasHeader,
        onChange: (e) => setHasHeader(e.target.checked),
        className: "h-4 w-4"
      }
    ), /* @__PURE__ */ React.createElement("label", { htmlFor: "hdr", className: "text-sm text-slate-700" }, "Treat first row as headers"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, parsedFile.filename, " \xB7 ", parsedFile.rows.length, " rows")), /* @__PURE__ */ React.createElement("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" }, visibleManualKeys.map((k) => {
      const maxCols = Math.max(...parsedFile.rows.map((r) => r.length));
      const opts = Array.from({ length: maxCols }, (_, i) => ({ i, name: colName(parsedFile.rows, i, hasHeader) }));
      return /* @__PURE__ */ React.createElement("div", { key: k }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, inputMeta[k].label), /* @__PURE__ */ React.createElement(
        "select",
        {
          className: "mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[rgba(24,75,68,0.15)] focus:border-[var(--brand-primary)]",
          value: String(colSelections[k] ?? 0),
          onChange: (e) => setColSelections((prev) => ({ ...prev, [k]: Number(e.target.value) }))
        },
        opts.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.i, value: o.i }, o.name))
      ), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Choose the column for ", inputMeta[k].helper));
    })), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-wrap gap-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-brand text-sm", onClick: applyColumns }, "Use selected columns"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary text-sm", onClick: () => setColModalOpen(false) }, "Cancel")))
  ), /* @__PURE__ */ React.createElement(
    Modal,
    {
      open: infoModal.open,
      title: info.title,
      onClose: () => setInfoModal({ open: false, type: "twoone" })
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-2xl border border-slate-200 overflow-hidden", style: { aspectRatio: "11 / 6" } }, /* @__PURE__ */ React.createElement("img", { src: info.img, alt: "Infographic", className: "w-full h-full object-contain bg-white" })),
    /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line" }, info.text)
  ));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
