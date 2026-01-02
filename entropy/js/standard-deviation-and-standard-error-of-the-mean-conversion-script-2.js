const { useState, useRef } = React;
const ArrowLeft = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "m12 19-7-7 7-7" }), /* @__PURE__ */ React.createElement("path", { d: "M19 12H5" }));
const UploadCloud = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }), /* @__PURE__ */ React.createElement("path", { d: "M12 12v9" }), /* @__PURE__ */ React.createElement("path", { d: "m16 16-4-4-4 4" }));
const Calculator = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "8", x2: "16", y1: "6", y2: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "16", x2: "16", y1: "14", y2: "18" }), /* @__PURE__ */ React.createElement("path", { d: "M16 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 14h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 14h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 18h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 18h.01" }));
const Download = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ React.createElement("polyline", { points: "7 10 12 15 17 10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "15", y2: "3" }));
const Copy = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }));
const AlertCircle = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "8", y2: "12" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }));
const RefreshCw = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }), /* @__PURE__ */ React.createElement("path", { d: "M21 3v5h-5" }), /* @__PURE__ */ React.createElement("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }), /* @__PURE__ */ React.createElement("path", { d: "M8 16H3v5" }));
function App() {
  const [mode, setMode] = useState("sd_to_se");
  const [inputType, setInputType] = useState("manual");
  const [valuesInput, setValuesInput] = useState("");
  const [nInput, setNInput] = useState("");
  const [results, setResults] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [valColumn, setValColumn] = useState("");
  const [nColumn, setNColumn] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const fileInputRef = useRef(null);
  const handleReset = () => {
    setValuesInput("");
    setNInput("");
    setResults([]);
    setFileData(null);
    setHeaders([]);
    setValColumn("");
    setNColumn("");
    setShowColumnSelector(false);
    setInputType("manual");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const calculateRow = (valRaw, nRaw, idx) => {
    const valStr = valRaw ? String(valRaw).trim() : "";
    const nStr = nRaw ? String(nRaw).trim() : "";
    if (valStr === "" || nStr === "") return { id: idx, input: { val: valStr, n: nStr }, output: null, error: "Empty Fields" };
    const val = Number(valStr);
    const n = Number(nStr);
    if (isNaN(val) || isNaN(n)) return { id: idx, input: { val: valStr, n: nStr }, output: null, error: "Invalid Input (String/Alpha)" };
    if (val < 0 || n <= 0) return { id: idx, input: { val: valStr, n: nStr }, output: null, error: "Invalid Value (Negative or N<=0)" };
    let output;
    if (mode === "sd_to_se") {
      output = val / Math.sqrt(n);
    } else {
      output = val * Math.sqrt(n);
    }
    return { id: idx, input: { val, n }, output, error: null };
  };
  const handleCalculate = () => {
    if (inputType === "manual") {
      const valList = valuesInput.split(",").map((s) => s.trim());
      const nList = nInput.split(",").map((s) => s.trim());
      const maxLength = Math.max(valList.length, nList.length);
      const newResults = [];
      for (let i = 0; i < maxLength; i++) {
        const v = valList[i] !== void 0 ? valList[i] : "";
        const n = nList[i] !== void 0 ? nList[i] : "";
        if (v === "" && n === "") continue;
        newResults.push(calculateRow(v, n, i));
      }
      setResults(newResults);
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));
      if (rows.length > 0) {
        const potentialHeaders = rows[0].map((h) => h.trim());
        setHeaders(potentialHeaders);
        setFileData(rows);
        setShowColumnSelector(true);
        setValColumn("");
        setNColumn("");
        setResults([]);
      }
    };
    reader.readAsText(file);
  };
  const handleFileProcess = () => {
    if (valColumn === "" || nColumn === "") {
      alert("Please select both columns.");
      return;
    }
    const vIdx = parseInt(valColumn);
    const nIdx = parseInt(nColumn);
    const dataRows = fileData.slice(1);
    const newResults = dataRows.map((row, idx) => {
      if (row[vIdx] === void 0 || row[nIdx] === void 0) return { id: idx, input: { val: "", n: "" }, output: null, error: "Missing Data" };
      return calculateRow(row[vIdx], row[nIdx], idx);
    });
    setResults(newResults);
    setShowColumnSelector(false);
    setInputType("manual");
    const vValues = dataRows.map((r) => r[vIdx]).filter((v) => v !== void 0).join(", ");
    const nValues = dataRows.map((r) => r[nIdx]).filter((v) => v !== void 0).join(", ");
    setValuesInput(vValues);
    setNInput(nValues);
  };
  const exportCSV = () => {
    const valLabel = mode === "sd_to_se" ? "SD" : "SE";
    const outLabel = mode === "sd_to_se" ? "SE" : "SD";
    const header = `${valLabel},Sample Size (N),${outLabel},Status`;
    const rows = results.map((r) => `${r.input.val},${r.input.n},${r.output !== null ? r.output : ""},${r.error || "Success"}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "conversion_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const copyToClipboard = () => {
    const text = results.map((r) => `${r.input.val}, ${r.input.n}	${r.output !== null ? r.output : r.error}`).join("\n");
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement("header", { className: "header-bg py-4 sticky top-0 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-6 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 cursor-pointer", onClick: () => window.location.href = "index.html" }, /* @__PURE__ */ React.createElement("img", { src: "Entropy.png", alt: "Entro.py", className: "h-8" })), /* @__PURE__ */ React.createElement("a", { href: "Convert Statistical Quantities.html", className: "btn-secondary text-sm" }, /* @__PURE__ */ React.createElement(ArrowLeft, null), "Back to Tools"))), /* @__PURE__ */ React.createElement("main", { className: "flex-grow max-w-5xl mx-auto px-6 py-12 w-full z-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-10 animate-fade-up" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-[#184B44] mb-3" }, "Variance and Standard Deviation Conversion"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-600 max-w-2xl mx-auto" }, "Convert between dispersion measures when different papers report different forms. Essential for standardizing data in meta-analyses.")), /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto mb-8 animate-fade-up", style: { animationDelay: "0.15s" } }, /* @__PURE__ */ React.createElement("div", { className: "bg-[#fffbeb] border border-[#fcd34d] rounded-lg p-5 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-[#92400e] flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(AlertCircle, null), " Assumptions & Constraints"), /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-5 space-y-1 text-sm text-[#92400e]/90" }, /* @__PURE__ */ React.createElement("li", null, "The data must be numerical (quantitative), not categorical or purely ordinal."), /* @__PURE__ */ React.createElement("li", null, "Variance is always \u2265 0, and Standard Deviation is always \u2265 0."), /* @__PURE__ */ React.createElement("li", null, "Ensure consistent definition when converting:", /* @__PURE__ */ React.createElement("div", { className: "flex flex-col mt-1 gap-1 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-green-600" }, "\u2713"), " sample variance \u2192 sample SD"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-red-600" }, "\u2717"), " sample variance \u2192 population SD")))))), /* @__PURE__ */ React.createElement("div", { className: "tool-card animate-fade-up", style: { animationDelay: "0.2s" } }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-4 mb-8 border-b border-slate-100 pb-6" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setMode("sd_to_se");
        setResults([]);
      },
      className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === "sd_to_se" ? "bg-[#184B44] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`
    },
    "SD \u2192 Standard Error"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setMode("se_to_sd");
        setResults([]);
      },
      className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === "se_to_sd" ? "bg-[#184B44] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`
    },
    "Standard Error \u2192 SD"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleReset,
      className: "ml-auto btn-danger",
      title: "Clear all data"
    },
    /* @__PURE__ */ React.createElement(RefreshCw, { className: "w-4 h-4" }),
    " Reset"
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3" }, /* @__PURE__ */ React.createElement(
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
      onClick: () => setInputType("file"),
      className: `text-xs px-3 py-1 rounded border ${inputType === "file" ? "bg-slate-100 border-slate-300 font-semibold" : "border-transparent text-slate-400"}`
    },
    "Upload File"
  )), inputType === "manual" && !showColumnSelector ? /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, mode === "sd_to_se" ? "Standard Deviations" : "Standard Errors", " (comma-separated)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm",
      placeholder: "e.g., 10.5, 20.2, 5.1",
      value: valuesInput,
      onChange: (e) => setValuesInput(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, "Sample Sizes (N) (comma-separated)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm",
      placeholder: "e.g., 50, 100, 30",
      value: nInput,
      onChange: (e) => setNInput(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("button", { onClick: handleCalculate, className: "btn-brand w-full justify-center" }, /* @__PURE__ */ React.createElement(Calculator, null), " Calculate"))) : null, inputType === "file" && !showColumnSelector ? /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-slate-50 transition-colors",
      onClick: () => fileInputRef.current.click()
    },
    /* @__PURE__ */ React.createElement(UploadCloud, null),
    /* @__PURE__ */ React.createElement("span", { className: "text-sm text-slate-500 mt-2" }, "Click to upload .csv or .txt"),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        className: "hidden",
        accept: ".csv,.txt",
        onChange: handleFileUpload
      }
    )
  ) : null, showColumnSelector && /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-slate-50 border border-slate-200 rounded-lg animate-fade-up" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-semibold text-slate-700 mb-3" }, "Map Columns:"), /* @__PURE__ */ React.createElement("div", { className: "mb-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-500 block mb-1" }, "Column for ", mode === "sd_to_se" ? "Standard Deviation" : "Standard Error"), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#184B44] outline-none text-sm",
      value: valColumn,
      onChange: (e) => setValColumn(e.target.value)
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Select --"),
    headers.map((h, i) => /* @__PURE__ */ React.createElement("option", { key: i, value: i }, h || `Column ${i + 1}`))
  )), /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement("label", { className: "text-xs text-slate-500 block mb-1" }, "Column for Sample Size (N)"), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#184B44] outline-none text-sm",
      value: nColumn,
      onChange: (e) => setNColumn(e.target.value)
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Select --"),
    headers.map((h, i) => /* @__PURE__ */ React.createElement("option", { key: i, value: i }, h || `Column ${i + 1}`))
  )), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: handleFileProcess, className: "btn-brand flex-grow justify-center text-xs" }, "Process Data"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setShowColumnSelector(false);
    setInputType("file");
  }, className: "btn-secondary text-xs" }, "Cancel")))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col h-full" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-3" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-semibold text-slate-700" }, "Results Preview"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: copyToClipboard, className: "p-1 hover:bg-white rounded text-slate-500 hover:text-[#184B44]", title: "Copy" }, /* @__PURE__ */ React.createElement(Copy, null)), /* @__PURE__ */ React.createElement("button", { onClick: exportCSV, className: "p-1 hover:bg-white rounded text-slate-500 hover:text-[#184B44]", title: "Download CSV" }, /* @__PURE__ */ React.createElement(Download, null)))), /* @__PURE__ */ React.createElement("div", { className: "flex-grow overflow-y-auto max-h-60 bg-white border border-slate-100 rounded" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm text-left" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50 text-xs uppercase text-slate-500 sticky top-0" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-4 py-2 border-b" }, "Input (", mode === "sd_to_se" ? "SD" : "SE", ", N)"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-2 border-b" }, "Output (", mode === "sd_to_se" ? "SE" : "SD", ")"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-100" }, results.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "2", className: "px-4 py-8 text-center text-slate-400 italic" }, "No data calculated yet.")) : results.map((row) => /* @__PURE__ */ React.createElement("tr", { key: row.id }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-2 font-mono text-slate-600 border-r border-slate-100" }, String(row.input.val), ", ", String(row.input.n)), /* @__PURE__ */ React.createElement("td", { className: `px-4 py-2 font-mono font-medium ${row.error ? "text-red-500" : "text-[#184B44]"}` }, row.error ? /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 text-xs" }, /* @__PURE__ */ React.createElement(AlertCircle, null), " ", row.error) : row.output.toFixed(4)))))))))), /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-200 animate-fade-up", style: { animationDelay: "0.3s" } }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider" }, "Reference"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 leading-relaxed" }, /* @__PURE__ */ React.createElement("p", null, "Altman, D. G., & Bland, J. M. (2005). Standard deviations and standard errors. BMJ, 331(7521), 903. ", /* @__PURE__ */ React.createElement("a", { href: "https://doi.org/10.1136/bmj.331.7521.903", target: "_blank", className: "text-[#184B44] hover:underline" }, "https://doi.org/10.1136/bmj.331.7521.903"))))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
