(() => {
  "use strict";

  const viewer = document.getElementById("modelViewer");
  const loading = document.getElementById("viewerLoading");
  const loadBar = document.getElementById("loadBar");
  const loadPercent = document.getElementById("loadPercent");
  const errorBox = document.getElementById("viewerError");
  const autoBtn = document.getElementById("autoRotate");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const frame = document.getElementById("viewerFrame");
  const viewButtons = Array.from(document.querySelectorAll(".view-btn"));

  if (!viewer) return;

  let loaded = false;
  let activeView = "front";

  const views = {
    front: "0deg 78deg 105%",
    three: "35deg 76deg 105%",
    side: "90deg 78deg 105%",
    back: "180deg 78deg 105%",
  };

  const markLoaded = () => {
    if (loaded) return;
    loaded = true;
    document.body.classList.add("is-loaded");
    if (loading) loading.setAttribute("aria-hidden", "true");
    if (errorBox) errorBox.hidden = true;
  };

  const showError = () => {
    if (errorBox) errorBox.hidden = false;
    if (loading) loading.style.display = "none";
  };

  if (viewer.loaded) {
    markLoaded();
  } else {
    viewer.addEventListener("load", markLoaded, { once: true });
  }

  viewer.addEventListener("progress", (event) => {
    const total = event.detail && typeof event.detail.totalProgress === "number"
      ? event.detail.totalProgress
      : 0;
    const percent = Math.max(0, Math.min(1, total));
    if (loadBar) loadBar.style.transform = `scaleX(${percent})`;
    if (loadPercent) loadPercent.textContent = `${Math.round(percent * 100)}%`;
    if (percent >= 1) window.setTimeout(markLoaded, 250);
  });

  viewer.addEventListener("error", showError);

  const setAutoRotate = (on) => {
    if (on) {
      viewer.setAttribute("auto-rotate", "");
    } else {
      viewer.removeAttribute("auto-rotate");
    }
    autoBtn.classList.toggle("is-active", on);
    autoBtn.setAttribute("aria-pressed", String(on));
  };

  autoBtn.addEventListener("click", () => {
    const on = !viewer.hasAttribute("auto-rotate");
    setAutoRotate(on);
  });

  const setView = (name) => {
    if (!views[name]) return;
    activeView = name;
    setAutoRotate(false);
    viewer.setAttribute("camera-orbit", views[name]);
    viewButtons.forEach((btn) => {
      const on = btn.dataset.view === name;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  };

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });

  viewer.addEventListener("camera-change", (event) => {
    if (!event.detail || event.detail.source !== "user-interaction") return;
    viewButtons.forEach((btn) => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-pressed", "false");
    });
  });

  const focusViewer = () => {
    try {
      viewer.focus({ preventScroll: true });
    } catch (error) {
      // focus is a progressive enhancement
    }
  };

  document.querySelectorAll("[data-focus-viewer]").forEach((link) => {
    link.addEventListener("click", () => {
      window.setTimeout(focusViewer, 650);
    });
  });

  fullscreenBtn.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        await frame.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      // Safari and some embedded browsers block programmatic fullscreen.
      fullscreenBtn.title = "Fullscreen is not available in this browser";
    }
  });

  document.addEventListener("fullscreenchange", () => {
    const isFullscreen = document.fullscreenElement === frame;
    fullscreenBtn.classList.toggle("is-active", isFullscreen);
    fullscreenBtn.setAttribute("aria-pressed", String(isFullscreen));
    fullscreenBtn.title = isFullscreen ? "Exit fullscreen" : "Fullscreen";
  });

  // Lightbox for the plates.
  const dialog = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  if (dialog && typeof dialog.showModal === "function") {
    document.querySelectorAll("[data-full]").forEach((item) => {
      item.addEventListener("click", () => {
        const source = item.getAttribute("data-full");
        const caption = item.getAttribute("data-caption") || "";
        const thumb = item.querySelector("img");
        if (!source) return;
        lightboxImage.src = source;
        lightboxImage.alt = thumb ? thumb.alt : caption;
        lightboxCaption.textContent = caption;
        dialog.showModal();
        document.body.classList.add("lightbox-open");
      });
    });

    const closeLightbox = () => {
      if (dialog.open) dialog.close();
    };

    lightboxClose.addEventListener("click", closeLightbox);

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeLightbox();
    });

    dialog.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
      lightboxImage.removeAttribute("src");
    });
  }

  // Only show the active view marker after a deliberate camera change.
  if (viewButtons.length) {
    viewButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.view === activeView));
    });
  }
})();
