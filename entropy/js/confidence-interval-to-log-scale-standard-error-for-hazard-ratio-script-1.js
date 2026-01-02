    // Disable right-click
    document.addEventListener('contextmenu', e => e.preventDefault());

    const redirectHome = () => {
      window.location.href = "index.html";
    };

    // DevTools detection
    setInterval(() => {
      if (
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160
      ) {
        redirectHome();
      }
    }, 500);

    // Disable DevTools shortcuts
    document.addEventListener('keydown', e => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        redirectHome();
      }
    });
  
