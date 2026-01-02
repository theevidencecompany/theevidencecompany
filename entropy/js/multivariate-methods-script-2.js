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
  const methods = [
    { title: "PCA", active: false },
    { title: "Exploratory Factor Analysis", active: false },
    { title: "k-means clustering", active: false },
    { title: "Hierarchical clustering", active: false },
    { title: "Distance matrices", active: false },
    { title: "MANOVA", active: false },
    { title: "Discriminant analysis", active: false }
  ];
  const filteredMethods = methods.filter(
    (method) => method.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col" }, /* @__PURE__ */ React.createElement("header", { className: "header-bg py-4 sticky top-0 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-6 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 transition-opacity hover:opacity-80 cursor-pointer" }, /* @__PURE__ */ React.createElement("img", { src: "Entropy.png", alt: "Entro.py", className: "h-8 drop-shadow-sm" })), /* @__PURE__ */ React.createElement("a", { href: "Title page.html", className: "btn-back" }, React.createElement(ArrowLeftIcon, { className: "w-4 h-4" }), "Back to Tools"))), /* @__PURE__ */ React.createElement("main", { className: "flex-grow max-w-7xl mx-auto px-6 py-12 w-full z-0 relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#184B44]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" }), /* @__PURE__ */  /* @__PURE__ */ React.createElement("div", { className: "text-center mb-12 animate-fade-up", style: { animationDelay: "0.1s" } }, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-bold text-[#184B44] mb-4 tracking-tight" }, "Multivariate Methods"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-500 text-lg max-w-2xl mx-auto" }, "Analyze complex datasets with multiple variables using advanced multivariate techniques.")), /* @__PURE__ */ React.createElement("div", { className: "search-container animate-fade-up", style: { animationDelay: "0.2s" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "search-input",
      placeholder: "Search for a method (e.g. 'PCA', 'Clustering')...",
      value: searchQuery,
      onChange: (e) => setSearchQuery(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement(SearchIcon, { className: "search-icon" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up", style: { animationDelay: "0.3s" } }, filteredMethods.map((method, index) => /* @__PURE__ */ React.createElement(
    "a",
    {
      key: index,
      href: `${method.title}.html`,
      className: `multi-card group ${!method.active ? "opacity-70 grayscale hover:grayscale-0 hover:opacity-100" : ""}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-start gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-slate-700 group-hover:text-[#184B44] transition-colors pr-4" }, method.title), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${method.active ? "text-teal-700 bg-teal-50 border border-teal-100" : "text-slate-400 bg-slate-100 border border-slate-200"}` }, method.active ? "Active" : "Soon")),
    /* @__PURE__ */ React.createElement("div", { className: "card-icon ml-auto flex-shrink-0" }, /* @__PURE__ */ React.createElement(ArrowRightIcon, null))
  )), filteredMethods.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "col-span-full text-center py-16 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300" }, /* @__PURE__ */ React.createElement("div", { className: "mb-2 text-4xl" }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-medium text-slate-600" }, "No methods found"), /* @__PURE__ */ React.createElement("p", null, "Try adjusting your search terms")))), /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved.")));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
