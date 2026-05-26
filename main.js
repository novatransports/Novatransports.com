(function () {
  "use strict";

  /* ============================================================
     NOVA — main.js (classic IIFE, no modules)
     ============================================================ */

  const data = window.__BRAND__ || {};

  // Helpers
  const $  = (s, sc) => (sc || document).querySelector(s);
  const $$ = (s, sc) => Array.from((sc || document).querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  /* ---- i18n ------------------------------------------------ */
  let LANG = "es";
  try {
    const saved = localStorage.getItem("nova-lang");
    if (saved === "es" || saved === "en") LANG = saved;
  } catch (_) {}

  function tField(obj) {
    if (!obj) return "";
    return obj[LANG] != null ? obj[LANG] : (obj.es || obj.en || "");
  }

  function applyLang() {
    document.documentElement.lang = LANG;
    // text nodes
    $$("[data-es]").forEach(el => {
      const v = el.getAttribute("data-" + LANG);
      if (v != null) el.textContent = v;
    });
    // placeholders
    $$("[data-ph-es]").forEach(el => {
      const v = el.getAttribute("data-ph-" + LANG);
      if (v != null) el.setAttribute("placeholder", v);
    });
    // toggle visual state
    $$(".lang-opt").forEach(o => o.classList.toggle("is-active", o.dataset.lang === LANG));
    try { localStorage.setItem("nova-lang", LANG); } catch (_) {}
  }

  function initLangToggle() {
    const toggle = $("#langToggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      LANG = (LANG === "es") ? "en" : "es";
      relocalizeSplits();        // restore split markup so data-es/en spans exist again
      reRenderDynamic();         // re-render cities/services in new lang
      applyLang();               // localize all text + freshly restored splits
      // re-split the now-localized headings
      if (window.gsap && window.ScrollTrigger) safe(initSplitText, "initSplitText(re)");
    });
  }

  /* ---- Contact enrichment (idempotent) -------------------- */
  function mountContact() {
    const c = data.contact || {};
    const email = $("[data-contact-email]");
    if (email) { email.textContent = c.email || ""; email.setAttribute("href", "mailto:" + (c.email || "")); }
    const phone = $("[data-contact-phone]");
    if (phone) { phone.textContent = c.phoneDisplay || ""; phone.setAttribute("href", "tel:" + (c.phoneHref || "")); }
    const base = $("[data-contact-base]");
    if (base) base.textContent = tField(c.base);
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  // Re-render dynamic blocks on language switch (contact only now; cities/services are hardcoded HTML)
  function reRenderDynamic() {
    mountContact();
  }

  /* ---- Splash --------------------------------------------- */
  function initSplash() {
    const splash = $("#splash");
    if (!splash) return;
    const hide = () => splash.classList.add("is-hidden");
    // JS hide (CSS animation is the safety net)
    setTimeout(hide, reduced ? 300 : 1900);
    splash.addEventListener("animationend", e => {
      if (e.animationName === "splashOut") splash.style.display = "none";
    });
    // hard safety
    setTimeout(() => { splash.style.display = "none"; }, 5000);
  }

  /* ---- Nav ------------------------------------------------ */
  function initNav() {
    const nav = $("#nav");
    if (nav) {
      const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 30);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    // Mobile menu
    const burger = $("#navBurger");
    if (burger) {
      // build mobile menu once
      let mobile = $(".nav-mobile");
      if (!mobile) {
        mobile = document.createElement("div");
        mobile.className = "nav-mobile";
        const links = $$(".nav-links a").map(a =>
          `<a href="${a.getAttribute("href")}" data-es="${a.getAttribute("data-es")}" data-en="${a.getAttribute("data-en")}">${a.textContent}</a>`
        ).join("");
        mobile.innerHTML = links + `<a class="btn btn-primary" href="#contact" data-es="Cotizar" data-en="Get a quote">Cotizar</a>`;
        document.body.appendChild(mobile);
      }
      const close = () => { mobile.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
      burger.addEventListener("click", () => {
        const open = mobile.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });
      mobile.addEventListener("click", e => { if (e.target.closest("a")) close(); });
    }
    // Smooth anchor scroll (native fallback already in CSS)
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 74) - 12;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ---- Reveals -------------------------------------------- */
  let revealObserver = null;
  function initReveals() {
    const els = $$(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
        });
      }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
    }
    els.forEach(el => revealObserver.observe(el));
    // Safety net: reveal everything after 6s no matter what
    setTimeout(() => $$(".reveal:not(.is-visible)").forEach(el => el.classList.add("is-visible")), 6000);
  }

  /* ---- Split text (words) --------------------------------- */
  // Keep original HTML so we can re-localize + re-split on language change
  const splitOriginals = new WeakMap();

  function splitWords(el) {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    const wrap = text => text.split(/(\s+)/).map(w =>
      /^\s+$/.test(w) ? w : `<span class="split-word" aria-hidden="true">${escHTML(w)}</span>`
    ).join("");
    const html = Array.from(el.childNodes).map(node => {
      if (node.nodeType === 3) return wrap(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();
        const cls = node.className ? ` class="${node.className}"` : "";
        return `<${tag}${cls}>${wrap(node.textContent)}</${tag}>`;
      }
      return "";
    }).join("");
    el.innerHTML = html;
  }

  function initSplitText() {
    if (reduced || !window.gsap) return;
    $$('[data-split="words"]').forEach(el => {
      // Cache the localized-but-unsplit HTML on first run
      if (!splitOriginals.has(el)) splitOriginals.set(el, el.innerHTML);
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = "1";
      if (el.classList.contains("reveal")) el.classList.remove("reveal");
      splitWords(el);
      const words = $$(".split-word", el);
      gsap.set(words, { yPercent: 110, opacity: 0 });
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => gsap.to(words, { yPercent: 0, opacity: 1, duration: .9, ease: "expo.out", stagger: 0.04 })
      });
    });
  }

  // On language change: restore original markup, re-localize, then re-split
  function relocalizeSplits() {
    $$('[data-split="words"]').forEach(el => {
      const orig = splitOriginals.get(el);
      if (orig != null) {
        el.innerHTML = orig;          // restore the data-es/data-en spans
        delete el.dataset.splitDone;  // allow re-split
      }
    });
  }

  /* ---- Count-up ------------------------------------------- */
  function initCountUp() {
    const nums = $$("[data-count-to]");
    if (!nums.length) return;
    const run = el => {
      const to = parseFloat(el.getAttribute("data-count-to")) || 0;
      if (reduced) { el.textContent = to; return; }
      const dur = 1100, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => { if (en.isIntersecting) { run(en.target); o.unobserve(en.target); } });
    }, { threshold: 0.4 });
    nums.forEach(n => obs.observe(n));
  }

  /* ---- Tilt (cards) --------------------------------------- */
  function initTilt() {
    if (!fineHover) return;
    $$(".vehicle, .pillar").forEach(card => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      const onMove = e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-5px) perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
      };
      const reset = () => { card.style.transform = ""; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseover", e => { if (!card.contains(e.relatedTarget)) {} });
      card.addEventListener("mouseout", e => { if (!card.contains(e.relatedTarget)) reset(); });
    });
  }

  /* ---- Hero parallax -------------------------------------- */
  function initHeroParallax() {
    if (reduced || !window.gsap) return;
    const mesh = $(".hero-mesh");
    if (!mesh) return;
    gsap.to(mesh, {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ---- Form (simulated) ----------------------------------- */
  function initForm() {
    const form = $("#quoteForm");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const btn = form.querySelector('button[type="submit"]');
      const note = form.querySelector(".form-note");
      const success = $("#formSuccess");
      if (btn) btn.style.display = "none";
      if (note) note.style.display = "none";
      if (success) success.hidden = false;
    });
  }

  /* ---- Boot ----------------------------------------------- */
  function boot() {
    safe(mountContact, "mountContact");
    safe(applyLang, "applyLang");      // localize hardcoded + freshly-mounted
    safe(initLangToggle, "initLangToggle");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initCountUp, "initCountUp");
    safe(initForm, "initForm");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
      safe(initSplitText, "initSplitText");
      safe(initHeroParallax, "initHeroParallax");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
