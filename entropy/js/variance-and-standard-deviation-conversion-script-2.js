const { useState, useRef } = React;
const ArrowLeft = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "m12 19-7-7 7-7" }), /* @__PURE__ */ React.createElement("path", { d: "M19 12H5" }));
const UploadCloud = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }), /* @__PURE__ */ React.createElement("path", { d: "M12 12v9" }), /* @__PURE__ */ React.createElement("path", { d: "m16 16-4-4-4 4" }));
const Calculator = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "8", x2: "16", y1: "6", y2: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "16", x2: "16", y1: "14", y2: "18" }), /* @__PURE__ */ React.createElement("path", { d: "M16 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 10h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 14h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 14h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M12 18h.01" }), /* @__PURE__ */ React.createElement("path", { d: "M8 18h.01" }));
const Download = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ React.createElement("polyline", { points: "7 10 12 15 17 10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "15", y2: "3" }));
const Copy = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }));
const AlertCircle = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "8", y2: "12" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }));
const RefreshCw = () => /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }), /* @__PURE__ */ React.createElement("path", { d: "M21 3v5h-5" }), /* @__PURE__ */ React.createElement("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }), /* @__PURE__ */ React.createElement("path", { d: "M8 16H3v5" }));
function App() {
  const [mode, setMode] = useState("sd_to_var");
  const [inputType, setInputType] = useState("manual");
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const fileInputRef = useRef(null);
  const handleReset = () => {
    setInputValue("");
    setResults([]);
    setFileData(null);
    setHeaders([]);
    setSelectedColumn("");
    setShowColumnSelector(false);
    setInputType("manual");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const calculateRow = (val, idx) => {
    const trimmedVal = val ? String(val).trim() : "";
    if (trimmedVal === "") return { id: idx, input: "", output: null, error: "Empty" };
    const num = Number(trimmedVal);
    if (isNaN(num)) return { id: idx, input: trimmedVal, output: null, error: "Invalid Input (String/Alpha)" };
    if (num < 0) return { id: idx, input: trimmedVal, output: null, error: "Negative Value" };
    let output;
    if (mode === "sd_to_var") {
      output = Math.pow(num, 2);
    } else {
      output = Math.sqrt(num);
    }
    return { id: idx, input: num, output, error: null };
  };
  const handleCalculate = () => {
    let data = [];
    if (inputType === "manual") {
      data = inputValue.split(",").map((s) => s);
    } else {
      return;
    }
    const newResults = data.map((val, idx) => calculateRow(val, idx));
    setResults(newResults);
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
        setSelectedColumn("");
        setResults([]);
      }
    };
    reader.readAsText(file);
  };
  const handleFileProcess = () => {
    if (selectedColumn === "") {
      alert("Please select a column to process.");
      return;
    }
    const colIndex = parseInt(selectedColumn);
    const dataToProcess = fileData.slice(1).map((row) => row[colIndex]);
    const newResults = dataToProcess.map((val, idx) => calculateRow(val, idx));
    setResults(newResults);
    setShowColumnSelector(false);
    setInputType("manual");
    setInputValue(dataToProcess.filter((v) => v !== void 0).join(", "));
  };
  const exportCSV = () => {
    const header = mode === "sd_to_var" ? "Standard Deviation,Variance,Status" : "Variance,Standard Deviation,Status";
    const rows = results.map((r) => `${r.input},${r.output !== null ? r.output : ""},${r.error || "Success"}`).join("\n");
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
    const text = results.map((r) => `${r.input}	${r.output !== null ? r.output : r.error}`).join("\n");
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement("header", { className: "header-bg py-4 sticky top-0 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-6 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 cursor-pointer", onClick: () => window.location.href = "index.html" }, /* @__PURE__ */ React.createElement("img", { src: "Entropy.png", alt: "Entro.py", className: "h-8" })), /* @__PURE__ */ React.createElement("a", { href: "Convert Statistical Quantities.html", className: "btn-secondary text-sm" }, /* @__PURE__ */ React.createElement(ArrowLeft, null), "Back to Tools"))), /* @__PURE__ */ React.createElement("main", { className: "flex-grow max-w-5xl mx-auto px-6 py-12 w-full z-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-10 animate-fade-up" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-[#184B44] mb-3" }, "Variance and Standard Deviation Conversion"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-600 max-w-2xl mx-auto" }, "Convert between dispersion measures when different papers report different forms. Essential for standardizing data in meta-analyses.")), /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto mb-8 animate-fade-up", style: { animationDelay: "0.15s" } }, /* @__PURE__ */ React.createElement("div", { className: "bg-[#fffbeb] border border-[#fcd34d] rounded-lg p-5 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-[#92400e] flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(AlertCircle, null), " Assumptions & Constraints"), /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-5 space-y-2 text-sm text-[#92400e]/90" }, /* @__PURE__ */ React.createElement("li", null, "The data must be numerical (quantitative), not categorical or purely ordinal."), /* @__PURE__ */ React.createElement("li", null, "Variance is always \u2265 0, and Standard Deviation is always \u2265 0."), /* @__PURE__ */ React.createElement("li", null, "Ensure consistent definition when converting:", /* @__PURE__ */ React.createElement("div", { className: "flex flex-col mt-1 gap-1 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-green-600" }, "\u2713"), " sample variance \u2192 sample SD"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-red-600" }, "\u2717"), " sample variance \u2192 population SD")))))), /* @__PURE__ */ React.createElement("div", { className: "tool-card animate-fade-up", style: { animationDelay: "0.2s" } }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-4 mb-8 border-b border-slate-100 pb-6" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setMode("sd_to_var");
        setResults([]);
      },
      className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === "sd_to_var" ? "bg-[#184B44] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`
    },
    "SD \u2192 Variance"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setMode("var_to_sd");
        setResults([]);
      },
      className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === "var_to_sd" ? "bg-[#184B44] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`
    },
    "Variance \u2192 SD"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleReset,
      className: "ml-auto btn-danger",
      title: "Clear all data"
    },
    /* @__PURE__ */ React.createElement(RefreshCw, { className: "w-4 h-4" }),
    " Reset"
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-2" }, "Input ", mode === "sd_to_var" ? "Standard Deviations" : "Variances"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3" }, /* @__PURE__ */ React.createElement(
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
  )), inputType === "manual" && !showColumnSelector ? /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] outline-none resize-none font-mono text-sm",
      placeholder: "Enter values separated by commas (e.g., 10.5, 20.2, 5.1)",
      value: inputValue,
      onChange: (e) => setInputValue(e.target.value)
    }
  ) : null, inputType === "file" && !showColumnSelector ? /* @__PURE__ */ React.createElement(
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
  ) : null, showColumnSelector && /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-slate-50 border border-slate-200 rounded-lg animate-fade-up" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-semibold text-slate-700 mb-2" }, "Select Column to Process:"), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#184B44] outline-none text-sm mb-4",
      value: selectedColumn,
      onChange: (e) => setSelectedColumn(e.target.value)
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Select Column --"),
    headers.map((h, i) => /* @__PURE__ */ React.createElement("option", { key: i, value: i }, h || `Column ${i + 1}`))
  ), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: handleFileProcess, className: "btn-brand flex-grow justify-center text-xs" }, "Process Data"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setShowColumnSelector(false);
    setInputType("file");
  }, className: "btn-secondary text-xs" }, "Cancel"))), !showColumnSelector && /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("button", { onClick: handleCalculate, className: "btn-brand w-full justify-center" }, /* @__PURE__ */ React.createElement(Calculator, null), " Calculate"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col h-full" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-3" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-semibold text-slate-700" }, "Results Preview"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: copyToClipboard, className: "p-1 hover:bg-white rounded text-slate-500 hover:text-[#184B44]", title: "Copy" }, /* @__PURE__ */ React.createElement(Copy, null)), /* @__PURE__ */ React.createElement("button", { onClick: exportCSV, className: "p-1 hover:bg-white rounded text-slate-500 hover:text-[#184B44]", title: "Download CSV" }, /* @__PURE__ */ React.createElement(Download, null)))), /* @__PURE__ */ React.createElement("div", { className: "flex-grow overflow-y-auto max-h-60 bg-white border border-slate-100 rounded" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm text-left" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50 text-xs uppercase text-slate-500 sticky top-0" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-4 py-2 border-b" }, "Input (", mode === "sd_to_var" ? "SD" : "Var", ")"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-2 border-b" }, "Output (", mode === "sd_to_var" ? "Var" : "SD", ")"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-100" }, results.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "2", className: "px-4 py-8 text-center text-slate-400 italic" }, "No data calculated yet.")) : results.map((row) => /* @__PURE__ */ React.createElement("tr", { key: row.id }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-2 font-mono text-slate-600 border-r border-slate-100" }, String(row.input)), /* @__PURE__ */ React.createElement("td", { className: `px-4 py-2 font-mono font-medium ${row.error ? "text-red-500" : "text-[#184B44]"}` }, row.error ? /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 text-xs" }, /* @__PURE__ */ React.createElement(AlertCircle, null), " ", row.error) : row.output.toFixed(4)))))))))), /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-200 animate-fade-up", style: { animationDelay: "0.3s" } }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider" }, "Reference"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 leading-relaxed" }, /* @__PURE__ */ React.createElement("p", null, "Altman, D. G., & Bland, J. M. (2005). Standard deviations and standard errors. BMJ, 331(7521), 903. ", /* @__PURE__ */ React.createElement("a", { href: "https://doi.org/10.1136/bmj.331.7521.903", target: "_blank", className: "text-[#184B44] hover:underline" }, "https://doi.org/10.1136/bmj.331.7521.903"))))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
