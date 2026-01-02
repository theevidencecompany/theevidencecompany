const { useState, useRef, useEffect } = React;
const ArrowLeft = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "m12 19-7-7 7-7" }), /* @__PURE__ */ React.createElement("path", { d: "M19 12H5" }));
const Calculator = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "8", x2: "16", y1: "6", y2: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "16", x2: "16", y1: "14", y2: "18" }), /* @__PURE__ */ React.createElement("path", { d: "M16 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 14h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 14h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 18h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 18h.01" }));
const Download = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ React.createElement("polyline", { points: "7 10 12 15 17 10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "15", y2: "3" }));
const Copy = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }));
const AlertCircle = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "8", y2: "12" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }));
const RefreshCw = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }), /* @__PURE__ */ React.createElement("path", { d: "M21 3v5h-5" }), /* @__PURE__ */ React.createElement("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }), /* @__PURE__ */ React.createElement("path", { d: "M8 16H3v5" }));
const Info = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M12 16v-4" }), /* @__PURE__ */ React.createElement("path", { d: "M12 8h.01" }));
const XIcon = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M18 6 6 18" }), /* @__PURE__ */ React.createElement("path", { d: "M6 6 18 18" }));
const UploadCloud = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }), /* @__PURE__ */ React.createElement("path", { d: "M12 12v9" }), /* @__PURE__ */ React.createElement("path", { d: "m16 16-4-4-4 4" }));
function inverseNormalCDF(p) {
  const a1 = -39.69683028665376, a2 = 220.9460984245205, a3 = -275.9285104469687;
  const a4 = 138.357751867269, a5 = -30.66479806614716, a6 = 2.506628277459239;
  const b1 = -54.47609879822406, b2 = 161.5858368580409, b3 = -155.6989798598866;
  const b4 = 66.80131188771972, b5 = -13.28068155288572;
  const c1 = -0.007784894002430293, c2 = -0.3223964580411365, c3 = -2.400758277161838;
  const c4 = -2.549732539343734, c5 = 4.374664141464968, c6 = 2.938163982698783;
  const d1 = 0.007784695709041462, d2 = 0.3224671290700398, d3 = 2.445134137142996;
  const d4 = 3.754408661907416;
  const p_low = 0.02425, p_high = 1 - p_low;
  if (p < 0 || p > 1) return NaN;
  if (p === 0) return -Infinity;
  if (p === 1) return Infinity;
  let q, r;
  if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
}
function getZScore(confidenceLevel, sides) {
  const alpha = 1 - confidenceLevel / 100;
  const p = sides === "two" ? 1 - alpha / 2 : 1 - alpha;
  return inverseNormalCDF(p);
}
function App() {
  const [mode, setMode] = useState("se_to_ci");
  const [sides, setSides] = useState("two");
  const [tail, setTail] = useState("right");
  const [meanInput, setMeanInput] = useState("");
  const [seInput, setSeInput] = useState("");
  const [lowerInput, setLowerInput] = useState("");
  const [upperInput, setUpperInput] = useState("");
  const [confInput, setConfInput] = useState("");
  const [results, setResults] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [inputType, setInputType] = useState("manual");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [colMean, setColMean] = useState("");
  const [colSE, setColSE] = useState("");
  const [colLower, setColLower] = useState("");
  const [colUpper, setColUpper] = useState("");
  const [colConf, setColConf] = useState("");
  const fileInputRef = useRef(null);
  const handleReset = () => {
    setMeanInput("");
    setSeInput("");
    setLowerInput("");
    setUpperInput("");
    setConfInput("");
    setResults([]);
    setFileData(null);
    setHeaders([]);
    setShowColumnSelector(false);
    setInputType("manual");
    setColMean("");
    setColSE("");
    setColLower("");
    setColUpper("");
    setColConf("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const calculateRow = (idx, meanStr, val2Str, val3Str, confStr) => {
    const mean = Number(meanStr);
    const conf = Number(confStr);
    if (isNaN(mean) || isNaN(conf)) return { id: idx, error: "Invalid Number" };
    if (conf <= 0 || conf >= 100) return { id: idx, error: "Conf% must be 0-100" };
    const z = getZScore(conf, sides);
    if (mode === "se_to_ci") {
      const se = Number(val2Str);
      if (isNaN(se) || se < 0) return { id: idx, error: "Invalid SE" };
      const margin = z * se;
      if (sides === "two") {
        return {
          id: idx,
          input: `Mean=${mean}, SE=${se}, ${conf}% (2-sided)`,
          output1: (mean - margin).toFixed(4),
          // Lower
          output2: (mean + margin).toFixed(4),
          // Upper
          type: "CI"
        };
      } else {
        if (tail === "right") {
          return {
            id: idx,
            input: `Mean=${mean}, SE=${se}, ${conf}% (1-sided Right)`,
            output1: (mean + margin).toFixed(4),
            type: "Upper Bound"
          };
        } else {
          return {
            id: idx,
            input: `Mean=${mean}, SE=${se}, ${conf}% (1-sided Left)`,
            output1: (mean - margin).toFixed(4),
            type: "Lower Bound"
          };
        }
      }
    } else {
      if (sides === "two") {
        const lower = Number(val2Str);
        const upper = Number(val3Str);
        if (isNaN(lower) || isNaN(upper)) return { id: idx, error: "Invalid Limits" };
        if (lower > upper) return { id: idx, error: "Lower > Upper" };
        const se = (upper - lower) / (2 * z);
        return {
          id: idx,
          input: `[${lower}, ${upper}], ${conf}%`,
          output1: se.toFixed(4),
          type: "SE"
        };
      } else {
        if (isNaN(mean)) return { id: idx, error: "Mean required" };
        let bound;
        let inputDesc;
        if (tail === "right") {
          bound = Number(val3Str);
          inputDesc = `Mean=${mean}, Upper=${bound}, ${conf}%`;
        } else {
          bound = Number(val2Str);
          inputDesc = `Mean=${mean}, Lower=${bound}, ${conf}%`;
        }
        if (isNaN(bound)) return { id: idx, error: "Invalid Bound" };
        const se = Math.abs(bound - mean) / z;
        return {
          id: idx,
          input: inputDesc,
          output1: se.toFixed(4),
          type: "SE"
        };
      }
    }
  };
  const handleCalculate = () => {
    const means = meanInput.split(",").map((s) => s.trim());
    const confs = confInput.split(",").map((s) => s.trim());
    let results2 = [];
    if (mode === "se_to_ci") {
      const ses = seInput.split(",").map((s) => s.trim());
      const maxLen = Math.max(means.length, ses.length, confs.length);
      for (let i = 0; i < maxLen; i++) {
        const m = means[i] || "";
        const s = ses[i] || "";
        const c = confs[i] || "95";
        if (m === "" && s === "") continue;
        results2.push(calculateRow(i, m, s, null, c));
      }
    } else {
      const lowers = lowerInput.split(",").map((s) => s.trim());
      const uppers = upperInput.split(",").map((s) => s.trim());
      const maxLen = Math.max(lowers.length, uppers.length, confs.length, means.length);
      for (let i = 0; i < maxLen; i++) {
        const l = lowers[i] || "";
        const u = uppers[i] || "";
        const c = confs[i] || "95";
        const m = means[i] || "";
        if (l === "" && u === "" && m === "") continue;
        results2.push(calculateRow(i, m, l, u, c));
      }
    }
    setResults(results2);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      let rows = [];
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: "" });
      } else {
        const text = data;
        rows = text.split(/\r?\n/).map((row) => row.split(","));
      }
      if (rows.length > 0) {
        rows = rows.filter((r) => r.some((cell) => cell !== null && cell !== "" && cell !== void 0));
        const potentialHeaders = rows[0].map((h) => String(h).trim());
        setHeaders(potentialHeaders);
        setFileData(rows);
        setShowColumnSelector(true);
        setInputType("file");
        setResults([]);
      }
    };
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };
  const handleFileProcess = () => {
    const dataRows = fileData.slice(1);
    const getColData = (colIndex) => {
      if (colIndex === "" || colIndex === void 0) return [];
      const idx = parseInt(colIndex);
      return dataRows.map((row) => row[idx] !== void 0 ? row[idx] : "");
    };
    const meanData = getColData(colMean);
    const seData = getColData(colSE);
    const lowerData = getColData(colLower);
    const upperData = getColData(colUpper);
    const confData = getColData(colConf);
    setMeanInput(meanData.join(", "));
    setSeInput(seData.join(", "));
    setLowerInput(lowerData.join(", "));
    setUpperInput(upperData.join(", "));
    setConfInput(confData.join(", "));
    setShowColumnSelector(false);
    setInputType("manual");
  };
  const copyToClipboard = () => {
    const text = results.map((r) => {
      if (mode === "se_to_ci" && sides === "two") {
        return `${r.input}	${r.output1}	${r.output2}`;
      } else {
        return `${r.input}	${r.output1}`;
      }
    }).join("\n");
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy: " + err);
    }
    document.body.removeChild(textarea);
  };
  const exportCSV = () => {
    let header = "Input,Output";
    if (mode === "se_to_ci") {
      header = sides === "two" ? "Input,Lower CI,Upper CI" : "Input,Bound";
    } else {
      header = "Input,Standard Error";
    }
    const rows = results.map((r) => {
      if (mode === "se_to_ci" && sides === "two") {
        return `"${r.input}",${r.output1},${r.output2}`;
      }
      return `"${r.input}",${r.output1}`;
    }).join("\n");
    const csv = `data:text/csv;charset=utf-8,${header}
${rows}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement("header", { className: "bg-white border-b border-slate-200 py-4 sticky top-0 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-6 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 cursor-pointer", onClick: () => window.location.href = "index.html" }, /* @__PURE__ */ React.createElement("img", { src: "Entropy.png", alt: "Entro.py", className: "h-8" })), /* @__PURE__ */ React.createElement("a", { href: "Convert Statistical Quantities.html", className: "btn-secondary text-sm" }, /* @__PURE__ */ React.createElement(ArrowLeft, null), "Back to Tools"))), /* @__PURE__ */ React.createElement("main", { className: "flex-grow max-w-5xl mx-auto px-6 py-12 w-full z-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-10 animate-fade-up" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-[#184B44] mb-3" }, "Standard Error & CI Conversion"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-600 max-w-2xl mx-auto" }, "Convert between standard errors and confidence intervals for display and downstream calculations.")), /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto mb-8 animate-fade-up", style: { animationDelay: "0.1s" } }, /* @__PURE__ */ React.createElement("div", { className: "bg-[#fffbeb] border border-[#fcd34d] rounded-lg p-5 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-[#92400e] flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(AlertCircle, null), " Assumptions"), /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-5 space-y-1 text-sm text-[#92400e]/90" }, /* @__PURE__ */ React.createElement("li", null, "Independent observations."), /* @__PURE__ */ React.createElement("li", null, "Standard deviation refers to the same sample used for the mean."), /* @__PURE__ */ React.createElement("li", null, "Sample is adequately large / at least normally distributed.")))), /* @__PURE__ */ React.createElement("div", { className: "tool-card animate-fade-up", style: { animationDelay: "0.2s" } }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-6 mb-8 border-b border-slate-100 pb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setMode("se_to_ci");
        setResults([]);
      },
      className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === "se_to_ci" ? "bg-[#184B44] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`
    },
    "SE \u2192 CI"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setMode("ci_to_se");
        setResults([]);
      },
      className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === "ci_to_se" ? "bg-[#184B44] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`
    },
    "CI \u2192 SE"
  )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: `text-sm font-medium ${sides === "one" ? "text-[#184B44]" : "text-slate-400"}` }, "One-Sided"), /* @__PURE__ */ React.createElement("div", { className: "relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", name: "toggle", id: "toggle", className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer", checked: sides === "two", onChange: () => setSides((s) => s === "one" ? "two" : "one") }), /* @__PURE__ */ React.createElement("label", { htmlFor: "toggle", className: "toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer" })), /* @__PURE__ */ React.createElement("span", { className: `text-sm font-medium ${sides === "two" ? "text-[#184B44]" : "text-slate-400"}` }, "Two-Sided")), /* @__PURE__ */ React.createElement("button", { onClick: () => setModalContent("two-sided"), className: "text-[#184B44] hover:bg-[#e6fffa] p-2 rounded-full transition-colors" }, /* @__PURE__ */ React.createElement(Info, null)))), sides === "one" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-fade-up" }, /* @__PURE__ */ React.createElement("span", { className: `text-sm font-medium ${tail === "left" ? "text-[#184B44]" : "text-slate-400"}` }, "Left Tailed (Lower Bound)"), /* @__PURE__ */ React.createElement("div", { className: "relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer", checked: tail === "right", onChange: () => setTail((t) => t === "left" ? "right" : "left") }), /* @__PURE__ */ React.createElement("label", { className: "toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer" })), /* @__PURE__ */ React.createElement("span", { className: `text-sm font-medium ${tail === "right" ? "text-[#184B44]" : "text-slate-400"}` }, "Right Tailed (Upper Bound)"), /* @__PURE__ */ React.createElement("button", { onClick: () => setModalContent("one-sided"), className: "text-[#184B44] hover:bg-[#e6fffa] p-2 rounded-full transition-colors" }, /* @__PURE__ */ React.createElement(Info, null)))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-6" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setInputType("manual");
        setShowColumnSelector(false);
      },
      className: `text-xs px-3 py-1 rounded border ${inputType === "manual" ? "bg-slate-100 border-slate-300 font-semibold" : "border-transparent text-slate-400"}`
    },
    "Manual Entry"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setInputType("file");
        if (fileData) setShowColumnSelector(true);
      },
      className: `text-xs px-3 py-1 rounded border ${inputType === "file" ? "bg-slate-100 border-slate-300 font-semibold" : "border-transparent text-slate-400"}`
    },
    "Upload File"
  )), inputType === "file" && !showColumnSelector && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-50 transition-colors mb-8",
      onClick: () => fileInputRef.current.click()
    },
    /* @__PURE__ */ React.createElement(UploadCloud, null),
    /* @__PURE__ */ React.createElement("span", { className: "text-sm text-slate-500 mt-2" }, "Click to upload .csv, .txt, or .xlsx"),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        className: "hidden",
        accept: ".csv,.txt,.xlsx,.xls",
        onChange: handleFileUpload
      }
    )
  ), inputType === "file" && showColumnSelector && /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-slate-50 border border-slate-200 rounded-lg mb-8 animate-fade-up" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-semibold text-slate-700 mb-3" }, "Map Columns from File:"), /* @__PURE__ */ (() => {
    const Options = () => headers.map((h, i) => /* @__PURE__ */ React.createElement("option", { key: i, value: i }, h || `Column ${i + 1}`));
    return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-500 block mb-1" }, "Confidence Level %"), /* @__PURE__ */ React.createElement("select", { className: "w-full p-2 border border-slate-300 rounded text-sm", value: colConf, onChange: (e) => setColConf(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Optional (Default 95) --"), /* @__PURE__ */ React.createElement(Options, null))), (mode === "se_to_ci" || mode === "ci_to_se" && sides === "one") && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-500 block mb-1" }, "Mean Estimate"), /* @__PURE__ */ React.createElement("select", { className: "w-full p-2 border border-slate-300 rounded text-sm", value: colMean, onChange: (e) => setColMean(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Select --"), /* @__PURE__ */ React.createElement(Options, null))), mode === "se_to_ci" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-500 block mb-1" }, "Standard Error"), /* @__PURE__ */ React.createElement("select", { className: "w-full p-2 border border-slate-300 rounded text-sm", value: colSE, onChange: (e) => setColSE(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Select --"), /* @__PURE__ */ React.createElement(Options, null))), mode === "ci_to_se" && (sides === "two" || sides === "one" && tail === "left") && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-500 block mb-1" }, "Lower CI Limit"), /* @__PURE__ */ React.createElement("select", { className: "w-full p-2 border border-slate-300 rounded text-sm", value: colLower, onChange: (e) => setColLower(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Select --"), /* @__PURE__ */ React.createElement(Options, null))), mode === "ci_to_se" && (sides === "two" || sides === "one" && tail === "right") && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-500 block mb-1" }, "Upper CI Limit"), /* @__PURE__ */ React.createElement("select", { className: "w-full p-2 border border-slate-300 rounded text-sm", value: colUpper, onChange: (e) => setColUpper(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Select --"), /* @__PURE__ */ React.createElement(Options, null))));
  })(), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-4" }, /* @__PURE__ */ React.createElement("button", { onClick: handleFileProcess, className: "btn-brand flex-grow justify-center text-xs" }, "Populate Data"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setShowColumnSelector(false);
    setInputType("file");
  }, className: "btn-secondary text-xs" }, "Cancel"))), inputType === "manual" && /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, "Confidence Level % (comma-separated)"), /* @__PURE__ */ React.createElement("textarea", { className: "w-full h-16 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm", placeholder: "95, 99, 90", value: confInput, onChange: (e) => setConfInput(e.target.value) })), mode === "se_to_ci" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, "Mean Estimate (comma-separated)"), /* @__PURE__ */ React.createElement("textarea", { className: "w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm", placeholder: "10.5, 20.1", value: meanInput, onChange: (e) => setMeanInput(e.target.value) })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, "Standard Error (comma-separated)"), /* @__PURE__ */ React.createElement("textarea", { className: "w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm", placeholder: "1.2, 0.5", value: seInput, onChange: (e) => setSeInput(e.target.value) }))) : /* @__PURE__ */ React.createElement(React.Fragment, null, sides === "one" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, "Mean Estimate (comma-separated)"), /* @__PURE__ */ React.createElement("textarea", { className: "w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm", placeholder: "10.5, 20.1", value: meanInput, onChange: (e) => setMeanInput(e.target.value) })), (sides === "two" || sides === "one" && tail === "left") && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, "Lower CI Limit (comma-separated)"), /* @__PURE__ */ React.createElement("textarea", { className: "w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm", placeholder: "8.1, 15.5", value: lowerInput, onChange: (e) => setLowerInput(e.target.value) })), (sides === "two" || sides === "one" && tail === "right") && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, "Upper CI Limit (comma-separated)"), /* @__PURE__ */ React.createElement("textarea", { className: "w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm", placeholder: "12.9, 25.0", value: upperInput, onChange: (e) => setUpperInput(e.target.value) }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 pt-2" }, /* @__PURE__ */ React.createElement("button", { onClick: handleCalculate, className: "btn-brand w-full justify-center" }, /* @__PURE__ */ React.createElement(Calculator, null), " Calculate"), /* @__PURE__ */ React.createElement("button", { onClick: handleReset, className: "btn-danger w-auto px-4" }, /* @__PURE__ */ React.createElement(RefreshCw, null)))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col h-full min-h-[300px]" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-3" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-semibold text-slate-700" }, "Results"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: copyToClipboard, className: "p-1 hover:bg-white rounded text-slate-500 hover:text-[#184B44]", title: "Copy" }, /* @__PURE__ */ React.createElement(Copy, null)), /* @__PURE__ */ React.createElement("button", { onClick: exportCSV, className: "p-1 hover:bg-white rounded text-slate-500 hover:text-[#184B44]", title: "Download CSV" }, /* @__PURE__ */ React.createElement(Download, null)))), /* @__PURE__ */ React.createElement("div", { className: "flex-grow overflow-y-auto max-h-96 bg-white border border-slate-100 rounded" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm text-left" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50 text-xs uppercase text-slate-500 sticky top-0" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-4 py-2 border-b" }, "Input"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-2 border-b" }, mode === "se_to_ci" ? sides === "two" ? "CI Range" : tail === "right" ? "Upper Bound" : "Lower Bound" : "Std Error"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-100" }, results.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "2", className: "px-4 py-8 text-center text-slate-400 italic" }, "No data calculated yet.")) : results.map((row) => /* @__PURE__ */ React.createElement("tr", { key: row.id }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-2 font-mono text-slate-600 border-r border-slate-100 max-w-[150px] truncate", title: row.input }, row.input), /* @__PURE__ */ React.createElement("td", { className: `px-4 py-2 font-mono font-medium ${row.error ? "text-red-500" : "text-[#184B44]"}` }, row.error ? row.error : mode === "se_to_ci" && sides === "two" ? `[${row.output1}, ${row.output2}]` : row.output1))))))))), /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-200 animate-fade-up", style: { animationDelay: "0.3s" } }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider" }, "Reference"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 leading-relaxed" }, /* @__PURE__ */ React.createElement("p", null, "Altman, D. G., & Bland, J. M. (2011). How to obtain the P value from a confidence interval. BMJ, 343, d2304. ", /* @__PURE__ */ React.createElement("a", { href: "https://doi.org/10.1136/bmj.d2304", target: "_blank", className: "text-[#184B44] hover:underline" }, "https://doi.org/10.1136/bmj.d2304"))))), modalContent && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay", onClick: () => setModalContent(null) }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl relative animate-fade-up", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { onClick: () => setModalContent(null), className: "absolute top-4 right-4 text-slate-400 hover:text-slate-600" }, /* @__PURE__ */ React.createElement(XIcon, null)), modalContent === "two-sided" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-[#184B44] mb-4" }, "One-Sided vs Two-Sided Intervals"), /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement("img", { src: "Two One sided.png", alt: "One vs Two Sided", className: "w-full rounded-lg border border-slate-200", style: { aspectRatio: "11/6" } })), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 leading-relaxed" }, "Choosing the right interval depends on whether you need to account for deviations in both directions or just one. A ", /* @__PURE__ */ React.createElement("strong", null, "two-sided interval"), " is used when any change is relevant, like testing if a new medication changes blood pressure either higher or lower than the current standard. A ", /* @__PURE__ */ React.createElement("strong", null, "one-sided interval"), " is used when you only care about a specific directional benefit, such as verifying that a new car battery lasts longer than the previous model.")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-[#184B44] mb-4" }, "One-Sided Confidence Intervals"), /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement("img", { src: "One sided CI.png", alt: "One Sided CI", className: "w-full rounded-lg border border-slate-200", style: { aspectRatio: "11/6" } })), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 leading-relaxed" }, "A ", /* @__PURE__ */ React.createElement("strong", null, "one-sided confidence interval"), " puts the entire significance level \u03B1 into one tail (the shaded rejection region), so you get just one bound at confidence 1\u2212\u03B1 instead of two. In the ", /* @__PURE__ */ React.createElement("strong", null, "left-tailed / lower-bound"), " case, the interval is [L, \u221E), meaning \u201Cwe\u2019re 95% confident the true value is at least L,\u201D which fits questions like \u201CIs a lightbulb\u2019s mean lifetime \u2265 10,000 hours?\u201D In the ", /* @__PURE__ */ React.createElement("strong", null, "right-tailed / upper-bound"), " case, the interval is (\u2212\u221E, U], meaning \u201Cwe\u2019re 95% confident the true value is no more than U,\u201D which fits questions like \u201CIs average pollution \u2264 the safety threshold?\u201D You use a one-tailed CI when only one direction matters (and you\u2019re willing to ignore the other), and it lines up with a one-tailed test: if the spec/null value falls beyond your one-sided bound in the wrong direction, you\u2019d reject at level \u03B1.")))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
