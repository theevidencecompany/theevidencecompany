const { useState, useEffect, useRef } = React;
function SearchIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }));
}
function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTools, setShowTools] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / (windowHeight * 0.5), 1);
      setScrollProgress(progress);
      if (scrollPosition > windowHeight * 0.3) {
        setShowTools(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const allTools = [
    {
      title: "Convert Statistical Quantities",
      href: "Convert Statistical Quantities.html",
      active: true,
      keywords: ["Median to Mean", "IQR to SD", "Skewness Detection", "Wan et al", "Luo et al", "Shi et al", "Missing Data", "Meta-analysis Conversion"]
    },
    {
      title: "Power Analysis & Sample Size",
      href: "Power Analysis & Sample Size.html",
      active: true,
      keywords: ["G*Power", "Effect Size", "Alpha", "Beta"]
    },
    {
      title: "Core hypothesis tests",
      href: "Core hypothesis tests.html",
      active: true,
      keywords: ["T-test", "ANOVA", "Chi-square", "P-value"]
    },
    {
      title: "Descriptive statistics",
      href: "Descriptive Statistics.html",
      active: true,
      keywords: ["Mean", "Median", "Mode", "Variance", "Standard Deviation"]
    },
    {
      title: "Exploratory plots",
      href: "Exploratory plots.html",
      active: true,
      keywords: ["Boxplot", "Histogram", "Scatter Plot", "Violin Plot"]
    },
    {
      title: "Estimation & confidence intervals",
      href: "Estimation & confidence intervals.html",
      active: true,
      keywords: ["CI", "Standard Error", "Bootstrap"]
    },
    {
      title: "ANOVA & designed experiments",
      href: "ANOVA & designed experiments.html",
      active: true,
      keywords: ["Factorial", "Block Design", "Post-hoc"]
    },
    {
      title: "Nonparametric & permutation tests",
      href: "Nonparametric & permutation tests.html",
      active: true,
      keywords: ["Mann-Whitney", "Kruskal-Wallis", "Wilcoxon"]
    },
    {
      title: "Correlation & association",
      href: "Correlation & association.html",
      active: true,
      keywords: ["Pearson", "Spearman", "Kendall", "Covariance"]
    },
    {
      title: "Categorical data & effect measures",
      href: "Categorical data & effect measures.html",
      active: true,
      keywords: ["Odds Ratio", "Relative Risk", "Fisher's Exact"]
    },
    {
      title: "Regression & generalized linear models",
      href: "Regression & generalized linear models.html",
      active: true,
      keywords: ["Linear Regression", "Logistic Regression", "GLM"]
    },
    {
      title: "Survival & reliability",
      href: "Survival & reliability.html",
      active: true,
      keywords: ["Kaplan-Meier", "Cox Proportional Hazards", "Log-rank"]
    },
    {
      title: "Multivariate methods",
      href: "Multivariate methods.html",
      active: true,
      keywords: ["PCA", "Factor Analysis", "Cluster Analysis"]
    },
    {
      title: "Multiple testing & FDR control",
      href: "Multiple testing & FDR control.html",
      active: true,
      keywords: ["Bonferroni", "Benjamini-Hochberg", "False Discovery Rate"]
    },
    {
      title: "Diagnostic test / classifier evaluation",
      href: "Diagnostic test classifier evaluation.html",
      active: true,
      keywords: ["Sensitivity", "Specificity", "ROC", "AUC"]
    },
    {
      title: "Meta-analysis (forest plots and beyond)",
      href: "Meta-analysis (forest plots and beyond).html",
      active: true,
      keywords: ["Fixed Effects", "Random Effects", "Heterogeneity", "Funnel Plot"]
    }
  ];
  const filteredTools = allTools.filter((tool) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = tool.title.toLowerCase().includes(query);
    const keywordMatch = tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(query));
    return titleMatch || keywordMatch;
  }).map((tool) => {
    const query = searchQuery.toLowerCase();
    if (!tool.title.toLowerCase().includes(query) && tool.keywords) {
      const matchedKeyword = tool.keywords.find((k) => k.toLowerCase().includes(query));
      return { ...tool, matchReason: matchedKeyword };
    }
    return { ...tool, matchReason: null };
  });
  return /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "section-hero",
      style: {
        opacity: 1 - scrollProgress,
        transform: `scale(${1 - scrollProgress * 0.1})`,
        pointerEvents: scrollProgress > 0.9 ? "none" : "auto"
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "animate-fade-up" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "Entropy.png",
        alt: "Entro.py",
        className: "w-full max-w-3xl h-auto",
        style: { aspectRatio: "10/2" }
      }
    )),
    /* @__PURE__ */ React.createElement("p", { className: "mt-8 text-black font-light text-xl animate-fade-up", style: { animationDelay: "0.2s" } }, "by Threadminds"),
    /* @__PURE__ */ React.createElement("div", { className: "scroll-indicator" }, /* @__PURE__ */ React.createElement("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 14l-7 7m0 0l-7-7m7 7V3" })))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "section-tools",
      style: {
        opacity: Math.max(0, (scrollProgress - 0.2) * 1.25),
        transform: `translateY(${(1 - scrollProgress) * 50}px)`
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold text-[#184B44] mb-4" }, "Select an Analysis Module"), /* @__PURE__ */ React.createElement("p", { className: "text-1xl text-[#184B44] mb-4" }, "Comprehensive tools for your statistical needs")), /* @__PURE__ */ React.createElement("div", { className: "search-container" }, /* @__PURE__ */ React.createElement(SearchIcon, { className: "search-icon" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "search-input",
        placeholder: "Search tests, methods, or pages...",
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }, filteredTools.map((tool, index) => /* @__PURE__ */ React.createElement(
      "a",
      {
        key: index,
        href: tool.href || "#",
        className: `tool-card group ${!tool.active ? "opacity-70 grayscale hover:grayscale-0 hover:opacity-100" : ""}`,
        style: {
          animationDelay: `${index * 0.05}s`
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-lg text-slate-800 group-hover:text-[#184B44] transition-colors" }, tool.title), tool.matchReason && /* @__PURE__ */ React.createElement("div", { className: "match-highlight" }, "Includes: ", tool.matchReason), !tool.active && /* @__PURE__ */ React.createElement("span", { className: "absolute top-3 right-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded" }, "Soon"), tool.active && /* @__PURE__ */ React.createElement("span", { className: "absolute top-3 right-3 text-[10px] uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded" }, "Active"))
    )), filteredTools.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "col-span-full text-center py-12 text-slate-400" }, /* @__PURE__ */ React.createElement("p", null, "No matching tools found. Try a different keyword.")))),
    /* @__PURE__ */ React.createElement("footer", { className: "site-footer" }, React.createElement("div", { className: "site-footer-inner" }, "Entropy | © 2025 Threadminds. All rights reserved."))
  ));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
