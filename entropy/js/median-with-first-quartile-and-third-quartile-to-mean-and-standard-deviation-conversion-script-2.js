const { useState, useEffect, useRef } = React;
function ThreadmindsLogo(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "5", r: "3" }), /* @__PURE__ */ React.createElement("circle", { cx: "6", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "19", r: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" }), /* @__PURE__ */ React.createElement("line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49" }));
}
function UploadIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ React.createElement("polyline", { points: "17 8 12 3 7 8" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "3", y2: "15" }));
}
function ArrowRightIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14" }), /* @__PURE__ */ React.createElement("path", { d: "m12 5 7 7-7 7" }));
}
function TableIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M12 3v18" }), /* @__PURE__ */ React.createElement("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M3 9h18" }), /* @__PURE__ */ React.createElement("path", { d: "M3 15h18" }));
}
function DownloadIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ React.createElement("polyline", { points: "7 10 12 15 17 10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "15", y2: "3" }));
}
function AlertCircleIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12", y1: "8", y2: "12" }), /* @__PURE__ */ React.createElement("line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }));
}
function CheckCircle2Icon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("path", { d: "m9 12 2 2 4-4" }));
}
function InfoIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M12 16v-4" }), /* @__PURE__ */ React.createElement("path", { d: "M12 8h.01" }));
}
function SparklesIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" }), /* @__PURE__ */ React.createElement("path", { d: "M5 3v4" }), /* @__PURE__ */ React.createElement("path", { d: "M9 3v4" }), /* @__PURE__ */ React.createElement("path", { d: "M3 5h4" }), /* @__PURE__ */ React.createElement("path", { d: "M3 9h4" }));
}
function BrainIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" }), /* @__PURE__ */ React.createElement("path", { d: "M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" }));
}
function LoaderIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "animate-spin", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }));
}
function RightSkewIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M2 20h20" }), /* @__PURE__ */ React.createElement("path", { d: "M4 20c0-10 2-15 5-15 3 0 9 8 13 15" }));
}
function LeftSkewIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M2 20h20" }), /* @__PURE__ */ React.createElement("path", { d: "M2 20c4-7 10-15 13-15 3 0 5 5 5 15" }));
}
function BellCurveIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M2 20h20" }), /* @__PURE__ */ React.createElement("path", { d: "M3 20C5 9 8 5 12 5s7 4 9 15" }));
}
function inverseNormalCDF(p) {
  const a1 = -39.69683028665376;
  const a2 = 220.9460984245205;
  const a3 = -275.9285104469687;
  const a4 = 138.357751867269;
  const a5 = -30.66479806614716;
  const a6 = 2.506628277459239;
  const b1 = -54.47609879822406;
  const b2 = 161.5858368580409;
  const b3 = -155.6989798598866;
  const b4 = 66.80131188771972;
  const b5 = -13.28068155288572;
  const c1 = -0.007784894002430293;
  const c2 = -0.3223964580411365;
  const c3 = -2.400758277161838;
  const c4 = -2.549732539343734;
  const c5 = 4.374664141464968;
  const c6 = 2.938163982698783;
  const d1 = 0.007784695709041462;
  const d2 = 0.3224671290700398;
  const d3 = 2.445134137142996;
  const d4 = 3.754408661907416;
  const p_low = 0.02425;
  const p_high = 1 - p_low;
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
function calculateLuoMean(q1, m, q3, n) {
  const w = 0.7 + 0.39 / n;
  return w * ((q1 + q3) / 2) + (1 - w) * m;
}
function calculateWanSD(q1, q3, n) {
  if (n <= 0) return NaN;
  const numerator = q3 - q1;
  const arg = (0.75 * n - 0.125) / (n + 0.25);
  const denominator = 2 * inverseNormalCDF(arg);
  return numerator / denominator;
}
function detectShiSkewness(q1, m, q3, n) {
  if (q3 === q1) return { isSkewed: false, t2: 0, critical: 0, error: "IQR is 0" };
  const t2 = (q1 + q3 - 2 * m) / (q3 - q1);
  const criticalValue = 2.65 / Math.sqrt(n) - 6 / (n * n);
  const direction = t2 > 0 ? "Right" : "Left";
  return {
    isSkewed: Math.abs(t2) > criticalValue,
    t2,
    critical: criticalValue,
    direction
  };
}
function Card({ children, className }) {
  return /* @__PURE__ */ React.createElement("div", { className: `card-flashy rounded-xl shadow-sm border border-slate-200 ${className}` }, children);
}
function Button({ children, onClick, variant = "primary", className, disabled, icon: Icon }) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 btn-flashy";
  const variants = {
    primary: "bg-[#184B44] text-white hover:bg-[#123b36] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 hover:shadow-md",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    gemini: "bg-gradient-to-r from-[#184B44] to-[#2a6e64] text-white hover:from-[#123b36] hover:to-[#1f574d] disabled:opacity-70 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
  };
  return /* @__PURE__ */ React.createElement("button", { onClick, className: `${baseStyle} ${variants[variant]} ${className}`, disabled }, typeof Icon === "function" && /* @__PURE__ */ React.createElement(Icon, { className: "w-4 h-4" }), children);
}
function ManualEntry({ onProcess }) {
  const [inputData, setInputData] = useState({
    n: "",
    median: "",
    q1: "",
    q3: ""
  });
  const handleProcess = () => {
    const ns = inputData.n.split(",").map((s) => s.trim()).filter((s) => s !== "");
    const medians = inputData.median.split(",").map((s) => s.trim()).filter((s) => s !== "");
    const q1s = inputData.q1.split(",").map((s) => s.trim()).filter((s) => s !== "");
    const q3s = inputData.q3.split(",").map((s) => s.trim()).filter((s) => s !== "");
    if (ns.length === 0 || ns.length !== medians.length || ns.length !== q1s.length || ns.length !== q3s.length) {
      alert("Error: Please ensure all fields have the same number of values separated by commas.");
      return;
    }
    const processedRows = ns.map((n, i) => {
      return {
        n,
        median: medians[i],
        q1: q1s[i],
        q3: q3s[i]
      };
    });
    onProcess(processedRows);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 animate-fade-in", style: { animationDelay: "0.2s" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-4" }, /* @__PURE__ */ React.createElement(TableIcon, { className: "w-5 h-5 text-slate-500" }), /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-slate-700" }, "Manual Data Entry")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mb-4" }, 'Enter single values or multiple values separated by commas (e.g., "10, 15, 20").'), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-600 mb-1" }, "Sample Size (N)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. 50, 42, 100",
      className: "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#184B44] outline-none transition-all duration-200 hover:border-[#2a6e64] focus:border-[#184B44]",
      value: inputData.n,
      onChange: (e) => setInputData({ ...inputData, n: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-600 mb-1" }, "Median"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. 25.5, 30, 12",
      className: "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#184B44] outline-none transition-all duration-200 hover:border-[#2a6e64] focus:border-[#184B44]",
      value: inputData.median,
      onChange: (e) => setInputData({ ...inputData, median: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-600 mb-1" }, "First Quartile (Q1)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. 20, 25, 10",
      className: "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#184B44] outline-none transition-all duration-200 hover:border-[#2a6e64] focus:border-[#184B44]",
      value: inputData.q1,
      onChange: (e) => setInputData({ ...inputData, q1: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-600 mb-1" }, "Third Quartile (Q3)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. 35, 40, 18",
      className: "w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#184B44] outline-none transition-all duration-200 hover:border-[#2a6e64] focus:border-[#184B44]",
      value: inputData.q3,
      onChange: (e) => setInputData({ ...inputData, q3: e.target.value })
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(Button, { onClick: handleProcess, icon: ArrowRightIcon }, "Process Manual Data")));
}
function FileUploader({ onFileLoaded }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  const processFile = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a CSV file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n").map((row) => row.split(","));
      onFileLoaded(rows);
    };
    reader.readAsText(file);
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ${dragActive ? "drag-active border-[#184B44] shadow-md scale-[1.01]" : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"}`,
      onDragEnter: handleDrag,
      onDragLeave: handleDrag,
      onDragOver: handleDrag,
      onDrop: handleDrop
    },
    /* @__PURE__ */ React.createElement(UploadIcon, { className: `w-12 h-12 mb-4 transition-colors duration-300 ${dragActive ? "text-[#184B44]" : "text-slate-400"}` }),
    /* @__PURE__ */ React.createElement("p", { className: "text-lg font-medium text-slate-700" }, "Drag and drop your CSV file here"),
    /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500 mt-2 mb-6" }, "or click to browse from your computer"),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: ".csv",
        className: "hidden",
        onChange: handleChange
      }
    ),
    /* @__PURE__ */ React.createElement(Button, { onClick: () => inputRef.current.click(), variant: "secondary", className: "hover-pulse" }, "Select File")
  );
}
function ColumnMapper({ headers, onMapConfirm, onCancel }) {
  const [mapping, setMapping] = useState({
    n: "",
    median: "",
    q1: "",
    q3: ""
  });
  useEffect(() => {
    const newMapping = { ...mapping };
    headers.forEach((h, index) => {
      const lowerH = h.toLowerCase().trim();
      if (!newMapping.n && (lowerH.includes("size") || lowerH === "n" || lowerH === "count")) newMapping.n = index;
      if (!newMapping.median && (lowerH.includes("median") || lowerH === "m" || lowerH === "med")) newMapping.median = index;
      if (!newMapping.q1 && (lowerH.includes("q1") || lowerH.includes("25") || lowerH.includes("first") || lowerH.includes("lower"))) newMapping.q1 = index;
      if (!newMapping.q3 && (lowerH.includes("q3") || lowerH.includes("75") || lowerH.includes("third") || lowerH.includes("upper"))) newMapping.q3 = index;
    });
    setMapping(newMapping);
  }, [headers]);
  const isReady = mapping.n !== "" && mapping.median !== "" && mapping.q1 !== "" && mapping.q3 !== "";
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6 animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 shadow-sm" }, /* @__PURE__ */ React.createElement(InfoIcon, { className: "w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-medium text-blue-900" }, "Map your CSV Columns"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-blue-700 mt-1" }, "Please identify which columns contain the required statistical data."))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
    { key: "n", label: "Sample Size (N)" },
    { key: "median", label: "Median" },
    { key: "q1", label: "First Quartile (Q1)" },
    { key: "q3", label: "Third Quartile (Q3)" }
  ].map((field) => /* @__PURE__ */ React.createElement("div", { key: field.key, className: "space-y-2" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-slate-700" }, field.label), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#184B44] focus:border-[#184B44] transition-shadow duration-200",
      value: mapping[field.key],
      onChange: (e) => setMapping({ ...mapping, [field.key]: e.target.value })
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "Select Column..."),
    headers.map((h, i) => /* @__PURE__ */ React.createElement("option", { key: i, value: i }, h || `Column ${i + 1}`))
  )))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end gap-3 pt-4 border-t border-slate-100" }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", onClick: onCancel }, "Cancel"), /* @__PURE__ */ React.createElement(Button, { disabled: !isReady, onClick: () => onMapConfirm(mapping), icon: ArrowRightIcon }, "Calculate Statistics")));
}
function AnalysisResult({ analysis, loading, error }) {
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center gap-3" }, /* @__PURE__ */ React.createElement(LoaderIcon, { className: "w-8 h-8 text-[#184B44]" }), /* @__PURE__ */ React.createElement("p", { className: "text-slate-600 font-medium" }, "Consulting Gemini AI..."), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, "Analyzing statistical reliability based on skewness")));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement("div", { className: "bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 animate-fade-in" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, "Analysis Failed"), /* @__PURE__ */ React.createElement("p", { className: "text-sm mt-1 opacity-80" }, error.message || "Unknown Error"));
  }
  if (!analysis) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "ai-card border border-[#184B44]/20 rounded-xl p-6 shadow-md relative overflow-hidden animate-slide-in" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 p-4 opacity-10" }, /* @__PURE__ */ React.createElement(BrainIcon, { width: "120", height: "120" })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-4" }, /* @__PURE__ */ React.createElement(SparklesIcon, { className: "w-5 h-5 text-[#184B44] animate-bounce" }), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg text-slate-900" }, "AI Interpretation")), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "markdown-body text-sm text-slate-700 leading-relaxed",
      dangerouslySetInnerHTML: { __html: marked.parse(analysis) }
    }
  ));
}
function App() {
  const [step, setStep] = useState("upload");
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [skippedRowsCount, setSkippedRowsCount] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const handleFileLoaded = (rows) => {
    if (rows.length < 2) {
      alert("File appears to be empty or missing headers");
      return;
    }
    setHeaders(rows[0]);
    setRawData(rows.slice(1).filter((r) => r.length > 1));
    setStep("map");
    setAiAnalysis(null);
    setSkippedRowsCount(0);
  };
  const handleCalculation = (mappingOrData, isManual = false) => {
    let results = [];
    let skippedCount = 0;
    const processRowData = (n, m, q1, q3, rowData, index) => {
      const isValidNumeric = !isNaN(n) && !isNaN(m) && !isNaN(q1) && !isNaN(q3) && n > 0;
      let logicError = null;
      if (isValidNumeric) {
        if (m <= q1 || m >= q3) {
          logicError = "Invalid Distribution: Median must be strictly between Q1 and Q3 (Q1 < Median < Q3).";
        }
      }
      if (!isValidNumeric) {
        return { id: index, isValid: false, error: "Invalid numeric data", rowData };
      }
      if (logicError) {
        skippedCount++;
        return { id: index, isValid: false, error: logicError, rowData, input: { n, m, q1, q3 } };
      }
      const mean = calculateLuoMean(q1, m, q3, n);
      const sd = calculateWanSD(q1, q3, n);
      const skewness = detectShiSkewness(q1, m, q3, n);
      return {
        id: index,
        isValid: true,
        input: { n, m, q1, q3 },
        mean,
        sd,
        skewness,
        rowData
      };
    };
    if (isManual) {
      results = mappingOrData.map((row, index) => {
        return processRowData(
          parseFloat(row.n),
          parseFloat(row.median),
          parseFloat(row.q1),
          parseFloat(row.q3),
          row,
          index
        );
      });
    } else {
      results = rawData.map((row, index) => {
        return processRowData(
          parseFloat(row[mappingOrData.n]),
          parseFloat(row[mappingOrData.median]),
          parseFloat(row[mappingOrData.q1]),
          parseFloat(row[mappingOrData.q3]),
          row,
          index
        );
      });
    }
    setSkippedRowsCount(skippedCount);
    setProcessedData(results);
    setStep("results");
  };
  const downloadCSV = () => {
    const csvHeaders = ["Row ID", "Sample Size", "Q1", "Median", "Q3", "Est. Mean (Luo 2018)", "Est. SD (Wan 2014)", "Skewness Status (Shi 2023)", "T2 Statistic", "Critical Value", "Notes"];
    const csvRows = processedData.map((item) => {
      if (!item.isValid) {
        return [
          item.id + 1,
          item.input ? item.input.n : "N/A",
          item.input ? item.input.q1 : "N/A",
          item.input ? item.input.m : "N/A",
          item.input ? item.input.q3 : "N/A",
          "",
          "",
          "",
          "",
          "",
          item.error || "Invalid Data"
        ].join(",");
      }
      return [
        item.id + 1,
        item.input.n,
        item.input.q1,
        item.input.m,
        item.input.q3,
        item.mean.toFixed(4),
        item.sd.toFixed(4),
        item.skewness.isSkewed ? item.skewness.direction + " Skewed" : "Normal/Symmetric",
        item.skewness.t2.toFixed(4),
        item.skewness.critical.toFixed(4),
        ""
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders.join(","), ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "statistical_analysis_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen pb-12" }, /* @__PURE__ */ React.createElement("header", { className: "bg-white border-b border-slate-200 py-4 mb-8 sticky top-0 z-10 bg-opacity-90 backdrop-blur-sm shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto px-6 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity" }, /* @__PURE__ */ React.createElement("img", { src: "Entropy.png", alt: "Entro.py", className: "h-8" })), /* @__PURE__ */ React.createElement("a", { href: "Convert Statistical Quantities.html", className: "btn-back" }, React.createElement("span", { "aria-hidden": "true" }, "←"), React.createElement("span", null, "Back to Tools")))), /* @__PURE__ */ React.createElement("main", { className: "max-w-6xl mx-auto px-6" }, step === "upload" && /* @__PURE__ */ React.createElement("div", { className: "mb-10 text-center max-w-2xl mx-auto animate-fade-in" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#184B44] to-[#2a6e64]" }, "Median & IQR to Mean & SD Converter"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-600 mb-2" }, "Convert Median, Q1, Q3, and Sample Size into estimated Mean and Standard Deviation. Detect statistical skewness automatically.")), /* @__PURE__ */ React.createElement(Card, { className: "p-8 animate-fade-in" }, step === "upload" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "mb-6 p-4 bg-[#f0fdfa] border border-[#ccfbf1] rounded-lg text-sm text-[#134e4a]" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold mb-2" }, "Assumptions"), /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-5 space-y-1" }, /* @__PURE__ */ React.createElement("li", null, "The data is roughly symmetrical / not extreme skew"), /* @__PURE__ */ React.createElement("li", null, "Quartiles are computed conventionally"))), /* @__PURE__ */ React.createElement(FileUploader, { onFileLoaded: handleFileLoaded }), /* @__PURE__ */ React.createElement("div", { className: "flex items-center py-4 animate-fade-in", style: { animationDelay: "0.1s" } }, /* @__PURE__ */ React.createElement("div", { className: "flex-grow border-t border-slate-300" }), /* @__PURE__ */ React.createElement("span", { className: "flex-shrink-0 mx-4 text-slate-500 text-sm font-medium uppercase tracking-wide" }, "OR"), /* @__PURE__ */ React.createElement("div", { className: "flex-grow border-t border-slate-300" })), /* @__PURE__ */ React.createElement(ManualEntry, { onProcess: (data) => handleCalculation(data, true) }), /* @__PURE__ */ React.createElement("div", { className: "mt-8 pt-6 border-t border-slate-200" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-slate-700 mb-2" }, "References"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 space-y-2" }, /* @__PURE__ */ React.createElement("p", null, 'J. Shi, D. Luo, X. Wan, Y. Liu, J. Liu, Z. Bian and T. Tong (2023), "Detecting the skewness of data from the five-number summary and its application in meta-analysis", Statistical Methods in Medical Research, 32: 1338-1360.'), /* @__PURE__ */ React.createElement("p", null, 'D. Luo, X. Wan, J. Liu and T. Tong (2018), "Optimally estimating the sample mean from the sample size, median, mid-range and/or mid-quartile range", Statistical Methods in Medical Research, 27: 1785-1805.'), /* @__PURE__ */ React.createElement("p", null, 'X. Wan, W. Wang, J. Liu and T. Tong (2014), "Estimating the sample mean and standard deviation from the sample size, median, range and/or interquartile range", BMC Medical Research Methodology, 14: 135.')))), step === "map" && /* @__PURE__ */ React.createElement(
    ColumnMapper,
    {
      headers,
      onMapConfirm: (mapping) => handleCalculation(mapping, false),
      onCancel: () => setStep("upload")
    }
  ), step === "results" && /* @__PURE__ */ React.createElement("div", { className: "space-y-8 animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold text-slate-900" }, "Analysis Results"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500 mt-1" }, "Processed ", processedData.length, " records")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", onClick: () => setStep("upload") }, "Calculate Again"), /* @__PURE__ */ React.createElement(Button, { onClick: downloadCSV, icon: DownloadIcon }, "Download CSV"))), skippedRowsCount > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-pulse shadow-md" }, /* @__PURE__ */ React.createElement(AlertCircleIcon, { className: "w-5 h-5 text-red-600 mt-0.5" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-red-800" }, "Error: Invalid Distribution Detected"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-red-700" }, skippedRowsCount, " row(s) were excluded because they violated the condition", /* @__PURE__ */ React.createElement("span", { className: "font-mono mx-1 bg-red-100 px-1 rounded font-bold" }, "Q1 < Median < Q3"), ". These rows have been flagged in the table below.")))), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto border border-slate-200 rounded-lg shadow-sm" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm text-left" }, /* @__PURE__ */ React.createElement("thead", { className: "text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3" }, "ID"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 bg-slate-100" }, "N"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 bg-slate-100" }, "Q1"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 bg-slate-100" }, "Median"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 bg-slate-100" }, "Q3"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-[#184B44] font-semibold border-l border-slate-200" }, "Est. Mean"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 text-[#184B44] font-semibold" }, "Est. SD"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-3 border-l border-slate-200" }, "Skewness Status"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-100" }, processedData.slice(0, 100).map((row, idx) => /* @__PURE__ */ React.createElement("tr", { key: row.id, className: "hover:bg-slate-50 table-row-animate transition-colors duration-150" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 font-medium text-slate-900" }, row.id + 1), row.isValid ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-slate-600 bg-slate-50/50" }, row.input.n), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-slate-600 bg-slate-50/50" }, row.input.q1), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-slate-600 bg-slate-50/50" }, row.input.m), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-slate-600 bg-slate-50/50" }, row.input.q3), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 font-mono text-[#184B44] border-l border-slate-200" }, row.mean.toFixed(3)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 font-mono text-[#184B44]" }, row.sd.toFixed(3)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 border-l border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm transition-transform hover:scale-105 ${row.skewness.isSkewed ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}` }, row.skewness.isSkewed ? /* @__PURE__ */ React.createElement(React.Fragment, null, row.skewness.direction === "Right" ? /* @__PURE__ */ React.createElement(RightSkewIcon, { className: "w-4 h-4" }) : /* @__PURE__ */ React.createElement(LeftSkewIcon, { className: "w-4 h-4" }), row.skewness.direction, " Skewed") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BellCurveIcon, { className: "w-4 h-4" }), "Symmetric")))) : /* @__PURE__ */ React.createElement(React.Fragment, null, row.input ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-red-400 bg-red-50/50" }, row.input.n), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-red-400 bg-red-50/50" }, row.input.q1), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-red-400 bg-red-50/50" }, row.input.m), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-red-400 bg-red-50/50" }, row.input.q3)) : /* @__PURE__ */ React.createElement("td", { colSpan: "4", className: "bg-red-50/50" }), /* @__PURE__ */ React.createElement("td", { colSpan: "3", className: "px-6 py-3 text-red-600 font-medium italic border-l border-red-100 bg-red-50/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(AlertCircleIcon, { className: "w-4 h-4" }), row.error))))))), processedData.length > 100 && /* @__PURE__ */ React.createElement("div", { className: "p-4 text-center text-sm text-slate-500 border-t border-slate-200" }, "Showing first 100 rows. Download CSV to see full results.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 animate-fade-in", style: { animationDelay: "0.5s" } }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-[#184B44]/20 transition-colors duration-300" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-slate-900 mb-1" }, "Estimated Mean"), /* @__PURE__ */ React.createElement("p", { className: "text-xs mb-2" }, "Luo et al. (2018), Scenario 2"), /* @__PURE__ */ React.createElement("code", { className: "text-xs bg-white px-2 py-1 rounded border border-slate-200 block w-fit font-mono text-[#184B44]" }, "w(q1+q3)/2 + (1-w)m")), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-[#184B44]/20 transition-colors duration-300" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-slate-900 mb-1" }, "Estimated SD"), /* @__PURE__ */ React.createElement("p", { className: "text-xs mb-2" }, "Wan et al. (2014), Scenario 3"), /* @__PURE__ */ React.createElement("code", { className: "text-xs bg-white px-2 py-1 rounded border border-slate-200 block w-fit font-mono text-[#184B44]" }, "IQR / 2\u03A6\u207B\xB9(\u03B7)")), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-[#184B44]/20 transition-colors duration-300" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-slate-900 mb-1" }, "Skewness Test"), /* @__PURE__ */ React.createElement("p", { className: "text-xs mb-2" }, "Shi et al. (2023)"), /* @__PURE__ */ React.createElement("code", { className: "text-xs bg-white px-2 py-1 rounded border border-slate-200 block w-fit font-mono text-[#184B44]" }, "|T\u2082| > Critical Value")))))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
