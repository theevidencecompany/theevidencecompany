const { useState, useEffect } = React;
function SearchIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }));
}
function ArrowRightIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M5 12h14" }), /* @__PURE__ */ React.createElement("path", { d: "m12 5 7 7-7 7" }));
}
function ArrowLeftIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("path", { d: "m12 19-7-7 7-7" }), /* @__PURE__ */ React.createElement("path", { d: "M19 12H5" }));
}
function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const converters = [
    { title: "Variance and standard deviation conversion", href: "Variance and standard deviation conversion.html" },
    { title: "Standard deviation and standard error of the mean conversion", href: "Standard deviation and standard error of the mean conversion.html" },
    { title: "Standard error and confidence interval conversion", href: "Standard error and confidence interval conversion.html" },
    { title: "Confidence interval to log scale standard error for relative risk", href: "Confidence interval to log scale standard error for relative risk.html" },
    { title: "Confidence interval to log scale standard error for odds ratio", href: "Confidence interval to log scale standard error for odds ratio.html" },
    { title: "Confidence interval to log scale standard error for hazard ratio", href: "Confidence interval to log scale standard error for hazard ratio.html" },
    { title: "Risk and odds conversion", href: "Risk and odds conversion.html" },
    { title: "Logit and probability conversion", href: "Logit and probability conversion.html" },
    { title: "Interquartile range to standard deviation conversion", href: "Interquartile range to standard deviation conversion.html" },
    { title: "Median absolute deviation to standard deviation conversion", href: "#" },
    { title: "Percentile and standard normal score conversion", href: "#" },
    { title: "Median with minimum and maximum to mean and standard deviation conversion", href: "#" },
    { title: "Median with first quartile and third quartile to mean and standard deviation conversion", href: "Median with first quartile and third quartile to mean and standard deviation conversion.html" },
    { title: "Five number summary to mean and standard deviation conversion", href: "#" },
    { title: "Baseline and final standard deviations to change score standard deviation conversion", href: "#" },
    { title: "Mean difference and standardized mean difference conversion", href: "#" },
    { title: "Cohen standardized mean difference and Hedges standardized mean difference conversion", href: "#" },
    { title: "Standardized mean difference and correlation coefficient conversion", href: "#" },
    { title: "Odds ratio and standardized mean difference conversion", href: "#" },
    { title: "Two by two contingency table to risk and odds conversion", href: "#" },
    { title: "Two by two contingency table to relative risk conversion", href: "#" },
    { title: "Two by two contingency table to odds ratio conversion", href: "#" },
    { title: "Two by two contingency table to risk difference conversion", href: "#" },
    { title: "Odds ratio to relative risk conversion using baseline risk", href: "#" },
    { title: "Relative risk to absolute risk difference conversion using baseline risk", href: "#" },
    { title: "Odds ratio to absolute risk difference conversion using baseline risk", href: "#" },
    { title: "Absolute risk difference to number needed to treat conversion", href: "#" },
    { title: "Student t statistic to F statistic conversion", href: "#" },
    { title: "Student t statistic to correlation coefficient conversion", href: "#" },
    { title: "Student t statistic to standardized mean difference conversion", href: "#" },
    { title: "Chi square statistic to phi coefficient conversion", href: "#" },
    { title: "Chi square statistic to Cram\xE9r association measure conversion", href: "#" },
    { title: "P value to standard normal score conversion", href: "#" },
    { title: "P value to Student t statistic conversion", href: "#" },
    { title: "Correlation coefficient and Fisher transformed correlation conversion", href: "#" },
    { title: "Hazard ratio and log hazard ratio conversion", href: "#" },
    { title: "Hazard ratio confidence interval to log scale standard error conversion", href: "#" },
    { title: "Kaplan\u2013Meier curve to hazard ratio conversion", href: "#" },
    { title: "Log rank results to hazard ratio conversion", href: "#" },
    { title: "Hazard ratio to absolute survival conversion using baseline survival", href: "#" },
    { title: "Hazard ratio to median survival conversion using baseline survival", href: "#" },
    { title: "Confusion matrix to sensitivity and specificity conversion", href: "#" },
    { title: "Confusion matrix to prevalence conversion", href: "#" },
    { title: "Confusion matrix to positive predictive value and negative predictive value conversion", href: "#" },
    { title: "Sensitivity and specificity to likelihood ratios conversion", href: "#" },
    { title: "Likelihood ratios to post-test probability conversion", href: "#" },
    { title: "Likelihood ratios to diagnostic odds ratio conversion", href: "#" },
    { title: "Confusion matrix to precision recall and F one score conversion", href: "#" }
  ];
  const filteredConverters = converters.filter(
    (converter) => converter.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement("header", { className: "header-bg py-4 sticky top-0 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-6 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 transition-opacity hover:opacity-80 cursor-pointer" }, /* @__PURE__ */ React.createElement("img", { src: "Entropy.png", alt: "Entro.py", className: "h-8 drop-shadow-sm" })), React.createElement("a", { href: "Title page.html", className: "btn-back" }, React.createElement(ArrowLeftIcon, { className: "w-4 h-4" }), "Back to Tools"))), /* @__PURE__ */ React.createElement("main", { className: "flex-grow max-w-7xl mx-auto px-6 py-12 w-full z-0 relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#184B44]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" }), /* @__PURE__ */  /* @__PURE__ */ React.createElement("div", { className: "text-center mb-12 animate-fade-up" }, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-bold text-[#184B44] mb-4 tracking-tight" }, "Convert Statistical Quantities"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-500 text-lg max-w-2xl mx-auto" }, "Access a comprehensive suite of 48+ statistical conversion tools designed for meta-analysis and evidence synthesis.")), /* @__PURE__ */ React.createElement("div", { className: "search-container animate-fade-up", style: { animationDelay: "0.1s" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "search-input",
      placeholder: "Search for a converter (e.g. 'Odds Ratio', 'Mean')...",
      value: searchQuery,
      onChange: (e) => setSearchQuery(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement(SearchIcon, { className: "search-icon" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up", style: { animationDelay: "0.2s" } }, filteredConverters.map((converter, index) => /* @__PURE__ */ React.createElement(
    "a",
    {
      key: index,
      href: converter.href,
      className: "converter-card group"
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-medium text-slate-700 group-hover:text-[#184B44] transition-colors pr-4" }, converter.title),
    /* @__PURE__ */ React.createElement("div", { className: "card-icon ml-auto flex-shrink-0" }, /* @__PURE__ */ React.createElement(ArrowRightIcon, null))
  )), filteredConverters.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "col-span-full text-center py-16 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300" }, /* @__PURE__ */ React.createElement("div", { className: "mb-2 text-4xl" }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-medium text-slate-600" }, "No converters found"), /* @__PURE__ */ React.createElement("p", null, "Try adjusting your search terms")))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
