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
function parseIntToken(token) {
  const t = String(token ?? "").trim();
  if (t === "") return { raw: "", ok: false, missing: true, val: NaN };
  const n = Number(t);
  if (Number.isInteger(n) && Number.isFinite(n)) return { raw: t, ok: true, missing: false, val: n };
  return { raw: t, ok: false, missing: false, val: NaN };
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
function csvEscape(x) {
  const s = String(x ?? "");
  if (/[\n\r,\"]/g.test(s)) return '"' + s.replace(/\"/g, '""') + '"';
  return s;
}
const NORMAL_CONST = 2 * inverseNormalCDF(0.75);
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
function StatusIcon({ status }) {
  if (status === "ok") {
    return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M20 6 9 17l-5-5", stroke: "#166534", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }));
  }
  if (status === "warn") {
    return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 9v4", stroke: "#b45309", strokeWidth: "2.4", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M12 17h.01", stroke: "#b45309", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z", stroke: "#b45309", strokeWidth: "2" }));
  }
  return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 8v5", stroke: "#b91c1c", strokeWidth: "2.4", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M12 16h.01", stroke: "#b91c1c", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", stroke: "#b91c1c", strokeWidth: "2" }));
}
function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay", role: "dialog", "aria-modal": "true" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-bold text-slate-800" }, title), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: onClose }, "Close")), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, children)));
}
function InputBar({ id, label, helper, value, onChange, placeholder }) {
  return /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-800", htmlFor: id, title: helper }, label), /* @__PURE__ */ React.createElement(
    "input",
    {
      id,
      type: "text",
      value,
      onChange: (e) => onChange(e.target.value),
      placeholder,
      className: "list-input mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[rgba(24,75,68,0.15)] focus:border-[var(--brand-primary)]",
      autoComplete: "off"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, helper));
}
function Badge({ kind, children }) {
  const cls = kind === "ok" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : kind === "warn" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-red-50 text-red-800 border-red-200";
  return /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs " + cls }, children);
}
function App() {
  const [logoOk, setLogoOk] = useState(true);
  const [inputMode, setInputMode] = useState("iqr");
  const [screenOn, setScreenOn] = useState(false);
  const [decimals, setDecimals] = useState(4);
  const [inputs, setInputs] = useState({
    iqr: "",
    q1: "",
    q3: "",
    median: "",
    n: ""
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
  const [infoOpen, setInfoOpen] = useState(false);
  const meta = useMemo(() => ({
    iqr: { label: "IQR list", helper: "Interquartile range values (must be \u2265 0). Comma-separated.", placeholder: "e.g., 12, 8.5, 3.2" },
    q1: { label: "Q1 list", helper: "Lower quartile values. If Q1 and Q3 are provided for a row, the tool uses them to derive the spread.", placeholder: "e.g., 10, 4.2, 1.1" },
    q3: { label: "Q3 list", helper: "Upper quartile values (should be \u2265 Q1 for the same row).", placeholder: "e.g., 22, 12.7, 4.3" },
    median: { label: "Median (m) list", helper: "Only used when the optional screen is enabled.", placeholder: "e.g., 16, 7.1, 2.4" },
    n: { label: "Sample size (n) list", helper: "Only used when the optional screen is enabled (positive integers).", placeholder: "e.g., 120, 80, 200" }
  }), []);
  function updateInput(key, value) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  const parsed = useMemo(() => {
    const iqr = splitList(inputs.iqr).map(parseNumberToken);
    const q1 = splitList(inputs.q1).map(parseNumberToken);
    const q3 = splitList(inputs.q3).map(parseNumberToken);
    const median = splitList(inputs.median).map(parseNumberToken);
    const n = splitList(inputs.n).map(parseIntToken);
    return { iqr, q1, q3, median, n };
  }, [inputs]);
  const maxLen = useMemo(() => {
    const lens = inputMode === "iqr" ? [parsed.iqr.length] : [parsed.q1.length, parsed.q3.length];
    if (screenOn) lens.push(parsed.median.length, parsed.n.length);
    return Math.max(0, ...lens);
  }, [parsed, screenOn, inputMode]);
  useEffect(() => {
    const problems = [];
    const warnings = [];
    const checkField = (k, list, extraChecks) => {
      const bad = list.filter((t) => !t.ok && !t.missing);
      if (bad.length) {
        problems.push(`${meta[k].label}: invalid value(s) \u2192 ${bad.slice(0, 5).map((t) => `'${t.raw}'`).join(", ")}${bad.length > 5 ? "\u2026" : ""}`);
      }
      const nums = list.filter((t) => t.ok).map((t) => t.val);
      if (extraChecks) extraChecks(nums);
    };
    if (inputMode === "iqr") {
      checkField("iqr", parsed.iqr, (nums) => {
        if (nums.some((n) => n < 0)) problems.push(`${meta.iqr.label}: values must be \u2265 0`);
      });
    } else {
      checkField("q1", parsed.q1);
      checkField("q3", parsed.q3);
      const mlen = Math.min(parsed.q1.length, parsed.q3.length);
      for (let i = 0; i < mlen; i++) {
        if (parsed.q1[i]?.ok && parsed.q3[i]?.ok && parsed.q3[i].val < parsed.q1[i].val) {
          warnings.push("Some rows have Q3 < Q1 and will be flagged.");
          break;
        }
      }
    }
    if (screenOn) {
      checkField("median", parsed.median);
      const badN = parsed.n.filter((t) => !t.ok && !t.missing);
      if (badN.length) problems.push(`${meta.n.label}: invalid integer(s) \u2192 ${badN.slice(0, 5).map((t) => `'${t.raw}'`).join(", ")}${badN.length > 5 ? "\u2026" : ""}`);
      const ns = parsed.n.filter((t) => t.ok).map((t) => t.val);
      if (ns.some((v) => v <= 0)) problems.push(`${meta.n.label}: values must be positive integers`);
      if (ns.some((v) => v < 5)) warnings.push("Some rows have n < 5; the optional screen may be unreliable there.");
    }
    if (problems.length) {
      setFieldSummary({ kind: "err", text: problems[0] + (problems.length > 1 ? ` (+${problems.length - 1} more)` : "") });
    } else if (warnings.length) {
      setFieldSummary({ kind: "warn", text: warnings[0] + (warnings.length > 1 ? ` (+${warnings.length - 1} more)` : "") });
    } else {
      setFieldSummary({ kind: "ok", text: "Ready." });
    }
  }, [parsed, screenOn, inputMode, meta]);
  const assumptionsList = useMemo(() => {
    const list = [
      "This estimate is intended for situations where the underlying data are roughly symmetric and close to a bell-shaped distribution.",
      "Quartiles should be computed using a conventional method consistent across groups/studies.",
      "The result is an approximation; heavy skew or heavy tails can make the estimate misleading."
    ];
    if (screenOn) {
      list.push("The optional screen is a summary-statistics screen only; it does not prove normality.");
    }
    return list;
  }, [screenOn]);
  function formatNumber(x) {
    if (x === null || x === void 0) return "";
    if (x === Infinity) return "Infinity";
    if (x === -Infinity) return "-Infinity";
    if (typeof x !== "number" || !Number.isFinite(x)) return "";
    const d = clamp(Number(decimals), 2, 8);
    return x.toFixed(d);
  }
  function fmtForTable(x) {
    if (x === null || x === void 0) return "\u2014";
    if (x === Infinity) return "\u221E";
    if (x === -Infinity) return "\u2212\u221E";
    if (typeof x !== "number" || !Number.isFinite(x)) return "\u2014";
    const d = clamp(Number(decimals), 2, 8);
    return x.toFixed(d);
  }
  function computeScreenBadge(q1, q3, m, n) {
    if (!(Number.isFinite(q1) && Number.isFinite(q3) && Number.isFinite(m) && Number.isFinite(n))) return null;
    if (!(n > 0) || !Number.isInteger(n)) return { kind: "warn", label: "Screen: invalid n" };
    if (n < 5) return { kind: "warn", label: "Screen: n too small" };
    if (!(q3 > q1)) return { kind: "warn", label: "Screen: Q3 must be > Q1" };
    const T2 = (q1 + q3 - 2 * m) / (q3 - q1);
    const c = 2.65 / Math.sqrt(n) - 6 / (n * n);
    if (!Number.isFinite(T2) || !Number.isFinite(c)) return { kind: "warn", label: "Screen: unavailable" };
    if (Math.abs(T2) > c) return { kind: "warn", label: "Skewness detected (screen)" };
    return { kind: "ok", label: "No skewness detected (screen)" };
  }
  function run() {
    setResults([]);
    setLengthNote("");
    setCsvText("");
    if (maxLen === 0) {
      setLengthNote("No rows to process. Enter comma-separated values in at least one input field.");
      return;
    }
    const lengths = {
      ...inputMode === "iqr" ? { iqr: parsed.iqr.length } : { q1: parsed.q1.length, q3: parsed.q3.length },
      ...screenOn ? { median: parsed.median.length, n: parsed.n.length } : {}
    };
    const nonZeroLens = Object.values(lengths).filter((x) => x > 0);
    const minNonZero = nonZeroLens.length ? Math.min(...nonZeroLens) : 0;
    const maxAny = Math.max(...Object.values(lengths));
    if (minNonZero > 0 && maxAny !== minNonZero) {
      const extraMsg = Object.entries(lengths).filter(([_, len]) => len > minNonZero).map(([k, len]) => `${meta[k].label}: ${len - minNonZero} extra value(s)`).join(" \xB7 ");
      setLengthNote(`Length mismatch: inputs are aligned by index; some fields have more values than others. ${extraMsg}`);
    }
    const rows = [];
    const tol = 1e-8;
    for (let i = 0; i < maxLen; i++) {
      const warn = [];
      const iqrTok = parsed.iqr[i];
      const q1Tok = parsed.q1[i];
      const q3Tok = parsed.q3[i];
      const mTok = parsed.median[i];
      const nTok = parsed.n[i];
      const hasQ1 = !!q1Tok && q1Tok.ok;
      const hasQ3 = !!q3Tok && q3Tok.ok;
      const hasIQR = !!iqrTok && iqrTok.ok;
      let iqrUsed = null;
      let iqrSource = "";
      if (inputMode === "q1q3") {
        if (!(hasQ1 && hasQ3)) {
          rows.push({
            row: i + 1,
            status: "err",
            message: "Missing required input(s) for this row.",
            iqr_source: "Q1/Q3",
            iqr_provided: null,
            q1: inputMode === "q1q3" && hasQ1 ? q1Tok.val : null,
            q3: inputMode === "q1q3" && hasQ3 ? q3Tok.val : null,
            iqr_used: null,
            sd: null,
            approx: "Approximation",
            screen: null,
            warnings: "Provide both Q1 and Q3 for each row."
          });
          continue;
        }
        if (q3Tok.val < q1Tok.val) {
          rows.push({
            row: i + 1,
            status: "err",
            message: "Q3 must be \u2265 Q1.",
            iqr_source: "Q1/Q3",
            iqr_provided: null,
            q1: q1Tok.val,
            q3: q3Tok.val,
            iqr_used: null,
            sd: null,
            approx: "Approximation",
            screen: null,
            warnings: "Invalid quartiles."
          });
          continue;
        }
        iqrUsed = q3Tok.val - q1Tok.val;
        iqrSource = "Q1/Q3";
      } else {
        if (!hasIQR) {
          rows.push({
            row: i + 1,
            status: "err",
            message: "Missing required input(s) for this row.",
            iqr_source: "IQR",
            iqr_provided: null,
            q1: null,
            q3: null,
            iqr_used: null,
            sd: null,
            approx: "Approximation",
            screen: null,
            warnings: "Provide an IQR value for each row."
          });
          continue;
        }
        iqrUsed = iqrTok.val;
        iqrSource = "IQR";
      }
      if (!(iqrUsed >= 0)) {
        rows.push({
          row: i + 1,
          status: "err",
          message: "IQR must be \u2265 0.",
          iqr_source: iqrSource,
          iqr_provided: null,
          q1: inputMode === "q1q3" && hasQ1 ? q1Tok.val : null,
          q3: inputMode === "q1q3" && hasQ3 ? q3Tok.val : null,
          iqr_used: iqrUsed,
          sd: null,
          approx: "Approximation",
          screen: null,
          warnings: "Invalid IQR."
        });
        continue;
      }
      if (!(iqrUsed >= 0)) {
        rows.push({
          row: i + 1,
          status: "err",
          message: "IQR must be \u2265 0.",
          iqr_source: iqrSource,
          iqr_provided: inputMode === "iqr" && hasIQR ? iqrTok.val : null,
          q1: inputMode === "q1q3" && hasQ1 ? q1Tok.val : null,
          q3: inputMode === "q1q3" && hasQ3 ? q3Tok.val : null,
          iqr_used: iqrUsed,
          sd: null,
          approx: "Approximation",
          screen: null,
          warnings: "Invalid IQR."
        });
        continue;
      }
      const sd = iqrUsed / NORMAL_CONST;
      let screenBadge = null;
      if (screenOn) {
        const q1v = hasQ1 ? q1Tok.val : NaN;
        const q3v = hasQ3 ? q3Tok.val : NaN;
        const mv = mTok && mTok.ok ? mTok.val : NaN;
        const nv = nTok && nTok.ok ? nTok.val : NaN;
        screenBadge = computeScreenBadge(q1v, q3v, mv, nv);
        if (!screenBadge) {
          warn.push("Optional screen not available for this row (requires Q1, Q3, median, and n).");
        } else if (screenBadge.kind === "warn") {
          warn.push(screenBadge.label);
        }
      }
      const status = warn.length ? "warn" : "ok";
      rows.push({
        row: i + 1,
        status,
        message: status === "ok" ? "Computed." : "Computed with warnings.",
        iqr_source: iqrSource,
        iqr_provided: inputMode === "iqr" && hasIQR ? iqrTok.val : null,
        q1: inputMode === "q1q3" && hasQ1 ? q1Tok.val : null,
        q3: inputMode === "q1q3" && hasQ3 ? q3Tok.val : null,
        iqr_used: iqrUsed,
        sd,
        approx: "Approximation",
        screen: screenBadge ? screenBadge.label : "",
        warnings: warn.join(" | ")
      });
    }
    setResults(rows);
    const header = [
      "row",
      "iqr_source",
      "iqr_provided",
      "q1",
      "q3",
      "iqr_used",
      "approx_sd",
      "distribution_assumption",
      "optional_screen_enabled",
      "screen_result",
      "status",
      "message",
      "warnings"
    ];
    const lines = [header.join(",")];
    for (const r of rows) {
      const line = [
        r.row,
        r.iqr_source,
        r.iqr_provided === null || r.iqr_provided === void 0 ? "" : formatNumber(r.iqr_provided),
        r.q1 === null || r.q1 === void 0 ? "" : formatNumber(r.q1),
        r.q3 === null || r.q3 === void 0 ? "" : formatNumber(r.q3),
        r.iqr_used === null || r.iqr_used === void 0 ? "" : formatNumber(r.iqr_used),
        r.sd === null || r.sd === void 0 ? "" : formatNumber(r.sd),
        "Normal-approximation",
        screenOn ? "Yes" : "No",
        r.screen || "",
        r.status,
        r.message,
        r.warnings || ""
      ].map(csvEscape);
      lines.push(line.join(","));
    }
    setCsvText(lines.join("\n"));
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
    a.download = "entropy_iqr_to_sd_results.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function resetAll() {
    setInputMode("iqr");
    setScreenOn(false);
    setDecimals(4);
    setInputs({ iqr: "", q1: "", q3: "", median: "", n: "" });
    setResults([]);
    setLengthNote("");
    setCsvText("");
    setParsedFile(null);
    setFileStatus("No file loaded.");
    setColModalOpen(false);
    setColSelections({});
    setHasHeader(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      const keys = (inputMode === "iqr" ? ["iqr"] : ["q1", "q3"]).concat(screenOn ? ["median", "n"] : []);
      const initial = {};
      keys.forEach((k, idx) => {
        initial[k] = Math.min(idx, Math.max(0, maxCols - 1));
      });
      setColSelections(initial);
      setColModalOpen(true);
    } catch (e) {
      setParsedFile(null);
      setFileStatus("No file loaded.");
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    const keys = ["iqr", "q1", "q3", "median", "n"];
    const cols = {};
    keys.forEach((k) => cols[k] = []);
    for (let i = start; i < rows.length; i++) {
      const r = rows[i] || [];
      keys.forEach((k) => {
        const idx = Number(colSelections[k]);
        const v = r[idx] ?? "";
        cols[k].push(String(v).trim());
      });
    }
    {
      const next = { iqr: "", q1: "", q3: "", median: "", n: "" };
      Object.keys(cols).forEach((k) => {
        next[k] = cols[k].join(", ");
      });
      setInputs(next);
    }
    setColModalOpen(false);
    setResults([]);
    setCsvText("");
  }
  const canExport = results.length > 0 && (csvText || "").length > 0;
  const summaryColor = fieldSummary.kind === "err" ? "text-red-700" : fieldSummary.kind === "warn" ? "text-amber-700" : "text-emerald-700";
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 min-w-[220px]" }, logoOk ? /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "Entropy.png",
      alt: "Entropy",
      className: "h-9 w-auto block",
      onError: () => setLogoOk(false)
    }
  ) : /* @__PURE__ */ React.createElement("div", { className: "logo-fallback", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", { className: "main" }, "\u03A3ntr"), /* @__PURE__ */ React.createElement("span", { className: "omega" }, "\u03A9"), /* @__PURE__ */ React.createElement("span", { className: "main" }, ".py"))), /* @__PURE__ */ React.createElement("a", { className: "btn-secondary", href: "Convert Statistical Quantities.html", title: "Return to the tools list" }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u2190"), /* @__PURE__ */ React.createElement("span", null, "Back to Tools")))), /* @__PURE__ */ React.createElement("main", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto px-4 pt-6 pb-12" }, /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up", style: { animationDelay: ".05s" } }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-[#184B44] mb-3 text-center" }, "Interquartile range to standard deviation conversion"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 leading-relaxed text-center" }, "Approximate SD from IQR when only quartile spread is reported (normal-approximation).")), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-5", style: { animationDelay: ".10s" } }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Assumptions"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 leading-relaxed" }, "These notes apply to all rows; per-row issues are listed in the results table.")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-600 bg-white border border-amber-200 rounded-full px-3 py-1" }, "Normal-approximation \xB7 ", screenOn ? "Screen ON" : "Screen OFF")), /* @__PURE__ */ React.createElement("ul", { className: "mt-3 list-disc pl-5 text-sm text-slate-700 leading-relaxed" }, assumptionsList.map((a, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "mt-2" }, a))))), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-6", style: { animationDelay: ".15s" } }, /* @__PURE__ */ React.createElement("div", { className: "tool-card" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Calculator"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 leading-relaxed" }, "Enter comma-separated lists (aligned by index) or import from a file.")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(InfoIconButton, { label: "Open infographic", onClick: () => setInfoOpen(true) }))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Input type"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Choose IQR directly or provide Q1 and Q3.")), /* @__PURE__ */ React.createElement("div", { className: "relative inline-block w-12 h-6 select-none " + (screenOn ? "opacity-60" : "") }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: inputMode === "q1q3",
      disabled: screenOn,
      onChange: (e) => {
        const on = e.target.checked;
        const nextMode = on ? "q1q3" : "iqr";
        setInputMode(nextMode);
        setResults([]);
        setCsvText("");
        setLengthNote("");
        setInputs(
          (prev) => nextMode === "iqr" ? { ...prev, q1: "", q3: "", median: "", n: "" } : { ...prev, iqr: "", median: "", n: "" }
        );
      },
      className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 border-slate-300 appearance-none cursor-pointer transition-all duration-200 ease-in-out",
      style: { top: "0px", right: inputMode === "q1q3" ? "0px" : "24px" },
      "aria-label": "Toggle input type between IQR and Q1/Q3"
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer transition" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-xs text-slate-500" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-slate-700" }, inputMode === "iqr" ? "IQR list" : "Q1 & Q3 lists"), screenOn ? " (locked while screen is ON)" : "")), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Output decimals"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min: "2",
      max: "8",
      step: "1",
      value: decimals,
      onChange: (e) => setDecimals(clamp(Number(e.target.value), 2, 8)),
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
  )), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-2" }, "Applies to table display and CSV numeric formatting.")), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Optional normality screen"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Off by default.")), /* @__PURE__ */ React.createElement("div", { className: "relative inline-block w-12 h-6 select-none" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: screenOn,
      onChange: (e) => {
        const on = e.target.checked;
        setScreenOn(on);
        if (on) setInputMode("q1q3");
        setResults([]);
        setCsvText("");
        setLengthNote("");
        setInputs((prev) => {
          if (on) {
            return { ...prev, iqr: "" };
          }
          return { ...prev, median: "", n: "" };
        });
      },
      className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 border-slate-300 appearance-none cursor-pointer transition-all duration-200 ease-in-out",
      style: { top: "0px", right: screenOn ? "0px" : "24px" },
      "aria-label": "Toggle optional screen"
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer transition" }))), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-2" }, "When ON, additional inputs appear and a per-row screen badge is added."))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 lg:col-span-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Inputs"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Separate bars for each field (comma-separated).")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, "Strict typing \xB7 per-row validation")), /* @__PURE__ */ React.createElement("div", { className: "mt-4 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Manual entry"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-1 gap-4" }, inputMode === "iqr" ? /* @__PURE__ */ React.createElement(InputBar, { id: "in-iqr", label: meta.iqr.label, helper: meta.iqr.helper, value: inputs.iqr, onChange: (v) => updateInput("iqr", v), placeholder: meta.iqr.placeholder }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InputBar, { id: "in-q1", label: meta.q1.label, helper: meta.q1.helper, value: inputs.q1, onChange: (v) => updateInput("q1", v), placeholder: meta.q1.placeholder }), /* @__PURE__ */ React.createElement(InputBar, { id: "in-q3", label: meta.q3.label, helper: meta.q3.helper, value: inputs.q3, onChange: (v) => updateInput("q3", v), placeholder: meta.q3.placeholder })), screenOn ? /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Additional inputs (normality screen ON)"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-1 gap-4" }, /* @__PURE__ */ React.createElement(InputBar, { id: "in-median", label: meta.median.label, helper: meta.median.helper, value: inputs.median, onChange: (v) => updateInput("median", v), placeholder: meta.median.placeholder }), /* @__PURE__ */ React.createElement(InputBar, { id: "in-n", label: meta.n.label, helper: meta.n.helper, value: inputs.n, onChange: (v) => updateInput("n", v), placeholder: meta.n.placeholder }))) : null)), /* @__PURE__ */ React.createElement("details", { className: "rounded-2xl border border-slate-200 bg-white/70 p-4" }, /* @__PURE__ */ React.createElement("summary", { className: "cursor-pointer text-sm font-medium text-slate-800" }, "File upload (optional)", /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-xs font-normal text-slate-500" }, fileStatus)), /* @__PURE__ */ React.createElement(
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
  )), /* @__PURE__ */ React.createElement("details", { className: "rounded-2xl border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("summary", { className: "cursor-pointer text-sm font-medium text-slate-800" }, "Advanced"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-slate-600 leading-relaxed" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, "Normal-theory constant"), /* @__PURE__ */ React.createElement("div", { className: "mt-1" }, "This module uses a fixed scaling constant: ", /* @__PURE__ */ React.createElement("span", { className: "font-medium text-slate-800" }, NORMAL_CONST.toFixed(3)), "."))), /* @__PURE__ */ React.createElement("div", { className: "text-sm leading-relaxed " + summaryColor }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, fieldSummary.kind === "ok" ? "Ready:" : fieldSummary.kind === "warn" ? "Warnings:" : "Input issues:"), /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-slate-700" }, fieldSummary.text)), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-brand", onClick: run }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14", stroke: "white", strokeWidth: "2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M13 5l7 7-7 7", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })), "Run"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-danger", onClick: resetAll }, "Reset")), lengthNote ? /* @__PURE__ */ React.createElement("div", { className: "text-sm text-amber-700 leading-relaxed" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Note:"), " ", lengthNote) : null)), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 lg:col-span-7" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "Results"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "Valid rows are computed even if some rows are invalid.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 justify-end" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: copyCsv, disabled: !canExport }, "Copy to Clipboard"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: downloadCsv, disabled: !canExport }, "Download CSV"))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, results.length, " row", results.length === 1 ? "" : "s"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1" }, "Decimals: ", decimals)), /* @__PURE__ */ React.createElement("div", { className: "mt-4 table-wrap" }, /* @__PURE__ */ React.createElement("table", { "aria-label": "Results table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Row"), /* @__PURE__ */ React.createElement("th", null, "Status"), /* @__PURE__ */ React.createElement("th", null, "Message"), /* @__PURE__ */ React.createElement("th", null, "IQR source"), /* @__PURE__ */ React.createElement("th", null, "IQR used"), /* @__PURE__ */ React.createElement("th", null, "Q1"), /* @__PURE__ */ React.createElement("th", null, "Q3"), /* @__PURE__ */ React.createElement("th", null, "Approx SD"), /* @__PURE__ */ React.createElement("th", null, "Approximation"), /* @__PURE__ */ React.createElement("th", null, "Screen result"), /* @__PURE__ */ React.createElement("th", null, "Warnings"))), /* @__PURE__ */ React.createElement("tbody", null, results.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "11", className: "text-slate-500" }, "Run the calculator to see results.")) : results.map((r, idx) => /* @__PURE__ */ React.createElement("tr", { key: idx, className: idx % 2 === 0 ? "bg-white" : "bg-slate-50/40" }, /* @__PURE__ */ React.createElement("td", { style: { fontVariantNumeric: "tabular-nums" } }, r.row), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(StatusIcon, { status: r.status }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-600 font-medium" }, String(r.status || "").toUpperCase()))), /* @__PURE__ */ React.createElement("td", { className: r.status === "err" ? "text-red-700" : r.status === "warn" ? "text-amber-700" : "text-emerald-700" }, r.message), /* @__PURE__ */ React.createElement("td", { className: "text-slate-700" }, r.iqr_source || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, fmtForTable(r.iqr_used)), /* @__PURE__ */ React.createElement("td", { className: "text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, fmtForTable(r.q1)), /* @__PURE__ */ React.createElement("td", { className: "text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, fmtForTable(r.q3)), /* @__PURE__ */ React.createElement("td", { className: "text-slate-700", style: { fontVariantNumeric: "tabular-nums" } }, fmtForTable(r.sd)), /* @__PURE__ */ React.createElement("td", { className: "text-slate-700" }, r.approx), /* @__PURE__ */ React.createElement("td", { className: "text-slate-700" }, r.screen || (screenOn ? "\u2014" : "")), /* @__PURE__ */ React.createElement("td", { className: "text-slate-700" }, r.warnings || "")))))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-slate-600 leading-relaxed" }, "Exported CSV includes inputs, outputs, and warning flags."))))), /* @__PURE__ */ React.createElement("section", { className: "animate-fade-up mt-8", style: { animationDelay: ".20s" } }, /* @__PURE__ */ React.createElement("div", { className: "references-plain rounded-2xl px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-semibold text-slate-800" }, "References"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-sm text-slate-600 leading-relaxed" }, "Calculation note: This calculator uses a logit-link related normal-theory constant (internally) to convert between interquartile spread and standard deviation."), /* @__PURE__ */ React.createElement("ul", { className: "mt-3 list-disc pl-5 text-sm text-slate-700 leading-relaxed" }, /* @__PURE__ */ React.createElement("li", null, "Wan, X., Wang, W., Liu, J., & Tong, T. (2014). Estimating the sample mean and standard deviation from the sample size, median, range and/or interquartile range. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "BMC Medical Research Methodology, 14"), ", 135. https://doi.org/10.1186/1471-2288-14-135"), /* @__PURE__ */ React.createElement("li", null, "Higgins, J. P. T., Thomas, J., Chandler, J., Cumpston, M., Li, T., Page, M. J., & Welch, V. A. (Eds.). (2024). ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Cochrane Handbook for Systematic Reviews of Interventions"), " (Chapter 6). Cochrane."), /* @__PURE__ */ React.createElement("li", null, "Shi, J., Luo, D., Wan, X., Liu, Y., Liu, J., Bian, Z., & Tong, T. (2023). Detecting the skewness of data from the five-number summary and its application in meta-analysis. ", /* @__PURE__ */ React.createElement("span", { className: "italic" }, "Statistical Methods in Medical Research, 32"), "(7), 1338\u20131360. https://doi.org/10.1177/09622802231172043")))))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")), /* @__PURE__ */ React.createElement(Modal, { open: colModalOpen, title: "Choose columns to import", onClose: () => setColModalOpen(false) }, !parsedFile ? /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600" }, "No file loaded.") : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 leading-relaxed" }, "Select which file columns should populate the input lists."), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex items-center gap-3 flex-wrap" }, /* @__PURE__ */ React.createElement("label", { className: "text-sm text-slate-700 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: hasHeader,
      onChange: (e) => setHasHeader(e.target.checked),
      className: "h-4 w-4"
    }
  ), "Treat first row as headers"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, parsedFile.filename, " \xB7 ", parsedFile.rows.length, " rows")), /* @__PURE__ */ React.createElement("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" }, (inputMode === "iqr" ? ["iqr"] : ["q1", "q3"]).concat(screenOn ? ["median", "n"] : []).map((k) => {
    const maxCols = Math.max(...parsedFile.rows.map((r) => r.length));
    const opts = Array.from({ length: maxCols }, (_, i) => ({ i, name: colName(parsedFile.rows, i, hasHeader) }));
    return /* @__PURE__ */ React.createElement("div", { key: k }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-slate-800" }, meta[k].label), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[rgba(24,75,68,0.15)] focus:border-[var(--brand-primary)]",
        value: String(colSelections[k] ?? 0),
        onChange: (e) => setColSelections((prev) => ({ ...prev, [k]: Number(e.target.value) }))
      },
      opts.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.i, value: o.i }, o.name))
    ), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Choose the column for ", meta[k].helper));
  })), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-wrap gap-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-brand", onClick: applyColumns }, "Use selected columns"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn-secondary", onClick: () => setColModalOpen(false) }, "Cancel")))), /* @__PURE__ */ React.createElement(Modal, { open: infoOpen, title: "Infographic", onClose: () => setInfoOpen(false) }, /* @__PURE__ */ React.createElement("div", { className: "modal-img" }, /* @__PURE__ */ React.createElement("img", { src: "iqr_to_sd_infographic.png", alt: "Infographic" })), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 min-h-[90px]",
      id: "infographicTextPlaceholder",
      "aria-label": "Infographic text placeholder"
    },
    /* @__PURE__ */ React.createElement("span", null, "This infographic helps you understand two common ways to measure how spread out your data is. The Interquartile Range (IQR) focuses on the middle 50% of your data and is perfect for skewed data or when you have extreme outliers, as it ignores them. The Standard Deviation (SD) measures the average distance of every data point from the mean. It is best used for symmetric, bell-shaped data where there are no extreme values to distort the result.")
  )));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
if (window.__RUN_TESTS__) {
  console.assert(Math.abs(NORMAL_CONST - 1.3489795) < 1e-4, "NORMAL_CONST sanity check failed");
  const sd = 1.349 / NORMAL_CONST;
  console.assert(Math.abs(sd - 1) < 1e-3, "SD conversion sanity check failed");
  const b1 = (function() {
    const q1 = 1, q3 = 3, m = 2, n = 100;
    const T2 = (q1 + q3 - 2 * m) / (q3 - q1);
    const c = 2.65 / Math.sqrt(n) - 6 / (n * n);
    return Math.abs(T2) <= c;
  })();
  console.assert(b1 === true, "Skewness screen symmetry sanity check failed");
}
