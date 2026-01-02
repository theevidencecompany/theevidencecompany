const { useState, useEffect, useRef } = React;
function SearchIcon(props) {
  return /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "8" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }));
}
function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTools, setShowTools] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
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
      setShowHeader(scrollPosition > windowHeight * 0.55);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
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
      active: false,
      keywords: ["G*Power", "Effect Size", "Alpha", "Beta"]
    },
    {
      title: "Core hypothesis tests",
      href: "Core hypothesis tests.html",
      active: false,
      keywords: ["T-test", "ANOVA", "Chi-square", "P-value"]
    },
    {
      title: "Descriptive statistics",
      href: "Descriptive Statistics.html",
      active: false,
      keywords: ["Mean", "Median", "Mode", "Variance", "Standard Deviation"]
    },
    {
      title: "Exploratory plots",
      href: "Exploratory plots.html",
      active: false,
      keywords: ["Boxplot", "Histogram", "Scatter Plot", "Violin Plot"]
    },
    {
      title: "Estimation & confidence intervals",
      href: "Estimation & confidence intervals.html",
      active: false,
      keywords: ["CI", "Standard Error", "Bootstrap"]
    },
    {
      title: "ANOVA & designed experiments",
      href: "ANOVA & designed experiments.html",
      active: false,
      keywords: ["Factorial", "Block Design", "Post-hoc"]
    },
    {
      title: "Nonparametric & permutation tests",
      href: "Nonparametric & permutation tests.html",
      active: false,
      keywords: ["Mann-Whitney", "Kruskal-Wallis", "Wilcoxon"]
    },
    {
      title: "Correlation & association",
      href: "Correlation & association.html",
      active: false,
      keywords: ["Pearson", "Spearman", "Kendall", "Covariance"]
    },
    {
      title: "Categorical data & effect measures",
      href: "Categorical data & effect measures.html",
      active: false,
      keywords: ["Odds Ratio", "Relative Risk", "Fisher's Exact"]
    },
    {
      title: "Regression & generalized linear models",
      href: "Regression & generalized linear models.html",
      active: false,
      keywords: ["Linear Regression", "Logistic Regression", "GLM"]
    },
    {
      title: "Survival & reliability",
      href: "Survival & reliability.html",
      active: false,
      keywords: ["Kaplan-Meier", "Cox Proportional Hazards", "Log-rank"]
    },
    {
      title: "Multivariate methods",
      href: "Multivariate methods.html",
      active: false,
      keywords: ["PCA", "Factor Analysis", "Cluster Analysis"]
    },
    {
      title: "Multiple testing & FDR control",
      href: "Multiple testing & FDR control.html",
      active: false,
      keywords: ["Bonferroni", "Benjamini-Hochberg", "False Discovery Rate"]
    },
    {
      title: "Diagnostic test / classifier evaluation",
      href: "Diagnostic test classifier evaluation.html",
      active: false,
      keywords: ["Sensitivity", "Specificity", "ROC", "AUC"]
    },
    {
      title: "Meta-analysis (forest plots and beyond)",
      href: "Meta-analysis (forest plots and beyond).html",
      active: false,
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
    "header",
    {
      className: `fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all duration-500 ease-out ${showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex h-16 items-center justify-between" }, /* @__PURE__ */ React.createElement("a", { href: "#", className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("img", { src: "Entropy.png", alt: "Entro.py", className: "h-8 sm:h-9 w-auto" })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "akinator.html",
        className: "stat-akinator-btn inline-flex items-center gap-2 rounded-full px-8 py-2 text-white font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#184B44]",
        title: "Find the right statistical test"
      },
      /* @__PURE__ */ React.createElement("img", { src: "arbor.png", alt: "Arbo.R", className: "arbor-logo" }),
      /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-4 h-4 opacity-90", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { fillRule: "evenodd", d: "M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z", clipRule: "evenodd" })),
      /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, "Open the statistical test finder")
    ), /* @__PURE__ */ React.createElement("div", { className: "relative group" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        "aria-label": "About Stat Test Akinator",
        "aria-describedby": "akinator-tooltip",
        className: "w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-slate-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#184B44]"
      },
      /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M12 16v-4" }), /* @__PURE__ */ React.createElement("path", { d: "M12 8h.01" }))
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        id: "akinator-tooltip",
        role: "tooltip",
        className: "pointer-events-none absolute right-0 top-full mt-2 w-[19rem] rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-xl ring-1 ring-slate-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all"
      },
      /* @__PURE__ */ React.createElement("div", { className: "font-semibold text-slate-900 mb-1" }, "Arbo.R helps you pick the right statistical test \u2014 fast"),
      /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-5 space-y-1" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-slate-900" }, "5"), " quick questions"), /* @__PURE__ */ React.createElement("li", null, "Compares across ", /* @__PURE__ */ React.createElement("span", { className: "font-medium text-slate-900" }, "137"), " prevalent tests"), /* @__PURE__ */ React.createElement("li", null, "Returns the best-fit test + assumptions checklist"))
    )))))
  ), /* @__PURE__ */ React.createElement(
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
