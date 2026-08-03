/* ============================================================
   Shine for Good — shared site script
   Loaded on every page. Every block is guarded, so a page that
   does not contain a given component simply skips it.
   ============================================================ */
(function () {
"use strict";

function $(s, c) { return (c || document).querySelector(s); }
function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

/* ---------- defaults, overridable from the edit panel ---------- */
var CFG = {
  phone: "305-304-9579",
  email: "hello@shineforgood.com",
  areas: ["St. Petersburg","Tampa","Clearwater","Gulfport","St. Pete Beach","Treasure Island","Pinellas Park","Seminole","South Tampa","Kenneth City"],
  rate: 0.11, min: 135, bathExtra: 25, bedExtra: 18,
  deepMult: 1.50, moveMult: 1.60, bizMult: 1.05, orgRate: 60,
  wk: 20, bi: 15, mo: 10, spread: 10, give: 10
};

var ADDONS = [
  { id:"fridge",  name:"Inside the fridge",  price:35 },
  { id:"oven",    name:"Inside the oven",    price:35 },
  { id:"windows", name:"Interior windows",   price:50 },
  { id:"base",    name:"Baseboards by hand", price:35 },
  { id:"cab",     name:"Inside cabinets",    price:45 },
  { id:"laundry", name:"Wash and fold",      price:30 },
  { id:"pet",     name:"Heavy pet hair",     price:30 },
  { id:"garage",  name:"Garage or lanai",    price:55 }
];

var SVC_LABELS = {
  standard: "Standard clean", deep: "Deep clean",
  move: "Move-in or move-out clean", biz: "Small business clean"
};

/* ---------- storage ---------- */
var KEY = "sfg.site.v1";
var STATE = { text:{}, img:{}, cfg:{}, contact:{} };

var store = {
  get: function (k) {
    try {
      if (window.storage && window.storage.get)
        return window.storage.get(k).then(function (r) { return r ? r.value : null; }).catch(function () { return null; });
      return Promise.resolve(window.localStorage.getItem(k));
    } catch (e) { return Promise.resolve(null); }
  },
  set: function (k, v) {
    try {
      if (window.storage && window.storage.set) return window.storage.set(k, v).catch(function () {});
      window.localStorage.setItem(k, v);
    } catch (e) {}
    return Promise.resolve();
  },
  del: function (k) {
    try {
      if (window.storage && window.storage.delete) return window.storage.delete(k).catch(function () {});
      window.localStorage.removeItem(k);
    } catch (e) {}
    return Promise.resolve();
  }
};
function saveState() { store.set(KEY, JSON.stringify(STATE)); }

/* ---------- toast ---------- */
var toastEl = $("#toast"), toastT;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("is-on");
  clearTimeout(toastT);
  toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 3800);
}

function telDigits() { return "+1" + (STATE.contact.phone || CFG.phone).replace(/\D/g, ""); }
function emailAddr() { return STATE.contact.email || CFG.email; }

var SECTION_ROOTS = {
  services: "services.html",
  journal: "journal.html"
};

var PAGE_SECTIONS = {
  "services.html": "services",
  "residential-cleaning.html": "services",
  "deep-cleaning.html": "services",
  "home-organization.html": "services",
  "move-in-move-out.html": "services",
  "small-business-cleaning.html": "services",
  "pricing.html": "pricing",
  "work.html": "work",
  "giving-back.html": "giving",
  "about.html": "about",
  "faq.html": "faq",
  "journal.html": "journal",
  "journal-florida-deep-clean-frequency.html": "journal",
  "journal-move-out-cleaning-checklist-st-pete.html": "journal",
  "journal-where-the-ten-percent-went.html": "journal",
  "contact.html": "contact",
  "404.html": ""
};

/* ============================================================
   NAV
   ============================================================ */
var nav = $("#nav"), burger = $("#burger"), scrim = $("#navScrim");

if (nav) {
  var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 40); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Normalize nav semantics so only the real current page gets aria-current.
  // Section roots still get a visual cue on child pages.
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var hereSection = PAGE_SECTIONS[here] || "";
  $$("#navLinks a[href]").forEach(function (a) {
    var href = a.getAttribute("href").split("#")[0].toLowerCase();
    var exact = href && href === here;
    var sectionRoot = hereSection && SECTION_ROOTS[hereSection] === href && href !== here;
    a.classList.remove("is-active", "is-section-active");
    if (a.getAttribute("aria-current") === "page") a.removeAttribute("aria-current");
    if (exact) {
      a.setAttribute("aria-current", "page");
      a.classList.add("is-active");
      return;
    }
    if (sectionRoot) a.classList.add("is-section-active");
  });
}

function setMenu(open) {
  if (!nav || !burger) return;
  nav.classList.toggle("is-open", open);
  if (scrim) scrim.classList.toggle("is-on", open);
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("is-locked", open);
  if (open) setTimeout(function () { var f = $("#navLinks a"); if (f) f.focus(); }, 380);
  else burger.focus({ preventScroll: true });
  syncEstBar();
}

if (burger) {
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false);
  });
  var mqDesk = window.matchMedia("(min-width:1081px)");
  var onDesk = function (e) { if (e.matches && nav.classList.contains("is-open")) setMenu(false); };
  if (mqDesk.addEventListener) mqDesk.addEventListener("change", onDesk); else mqDesk.addListener(onDesk);
}

/* ============================================================
   SMOOTH IN-PAGE ANCHORS
   Handled in JS rather than left to the browser so that a link
   like services.html#deep works when arriving from another page,
   and so the fixed header never covers the target heading.
   ============================================================ */
function scrollToId(id, push) {
  var el = document.getElementById(id);
  if (!el) return false;
  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (push) history.replaceState(null, "", "#" + id);
  if (el.hasAttribute("tabindex") === false) el.setAttribute("tabindex", "-1");
  return true;
}

document.addEventListener("click", function (e) {
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var href = a.getAttribute("href");
  if (!href || href.charAt(0) !== "#" || href === "#") return;
  if (scrollToId(href.slice(1), true)) e.preventDefault();
});

/* open an accordion if the URL points at one, e.g. services.html#deep */
function openFromHash() {
  var id = location.hash.slice(1);
  if (!id) return;
  var target = document.getElementById(id);
  if (!target) return;
  var acc = target.closest ? target.closest(".svc, .faq-i") : null;
  if (acc) openAccordion(acc, true);
  setTimeout(function () { scrollToId(id, false); }, 60);
}

/* ============================================================
   ACCORDIONS  (services + FAQ)
   ============================================================ */
function panelOf(item) { return $(".svc-panel", item) || $(".faq-a", item); }

function openAccordion(item, open) {
  var panel = panelOf(item), btn = $(".svc-btn", item) || $(".faq-q", item);
  if (!panel || !btn) return;
  if (open) {
    item.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    panel.style.height = panel.scrollHeight + "px";
  } else {
    panel.style.height = panel.scrollHeight + "px";
    requestAnimationFrame(function () { panel.style.height = "0px"; });
    item.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }
}

$$(".svc-btn, .faq-q").forEach(function (btn) {
  var item = btn.parentNode, exclusive = btn.classList.contains("svc-btn");
  btn.addEventListener("click", function () {
    var open = item.classList.contains("is-open");
    if (exclusive) {
      $$(".svc.is-open").forEach(function (o) { if (o !== item) openAccordion(o, false); });
    }
    openAccordion(item, !open);
  });
});

// keep an open panel correctly sized if the window changes width
var reflowT;
window.addEventListener("resize", function () {
  clearTimeout(reflowT);
  reflowT = setTimeout(function () {
    $$(".svc.is-open, .faq-i.is-open").forEach(function (i) {
      var p = panelOf(i); if (p) p.style.height = p.scrollHeight + "px";
    });
  }, 180);
}, { passive: true });

/* ============================================================
   ESTIMATOR
   ============================================================ */
var E = { svc: "standard", sqft: 1500, bed: 3, bath: 2, freq: "bi", add: [] };
var hasEst = !!$("#chipService");

var FREQ = [
  { id:"once", label:"One time" },
  { id:"wk",   label:"Weekly" },
  { id:"bi",   label:"Every 2 wks" },
  { id:"mo",   label:"Monthly" }
];

function chip(id, label, sub, on) {
  return '<button type="button" class="chip' + (on ? " is-on" : "") + '" data-v="' + id +
         '" role="radio" aria-checked="' + (on ? "true" : "false") + '">' + label +
         (sub ? '<small>' + sub + '</small>' : "") + "</button>";
}

function bindChips(sel, fn) {
  $$(sel + " .chip").forEach(function (c) {
    c.addEventListener("click", function () {
      $$(sel + " .chip").forEach(function (o) { o.classList.remove("is-on"); o.setAttribute("aria-checked", "false"); });
      c.classList.add("is-on"); c.setAttribute("aria-checked", "true");
      fn(c.getAttribute("data-v"));
      calc();
    });
  });
}

function renderEstimator() {
  if (!hasEst) return;
  var svcChips = [
    ["standard","Residential"], ["deep","Deep"], ["organize","Organization"],
    ["move","Move-in / out"], ["biz","Business"]
  ];
  $("#chipService").innerHTML = svcChips.map(function (s) { return chip(s[0], s[1], "", s[0] === E.svc); }).join("");
  $("#chipBed").innerHTML  = [1,2,3,4,5,6].map(function (n) { return chip(n, n === 6 ? "6+" : n, "", n === E.bed); }).join("");
  $("#chipBath").innerHTML = [1,1.5,2,2.5,3,4].map(function (n) { return chip(n, n === 4 ? "4+" : n, "", n === E.bath); }).join("");
  $("#chipFreq").innerHTML = FREQ.map(function (f) {
    var off = { wk: CFG.wk, bi: CFG.bi, mo: CFG.mo }[f.id];
    return chip(f.id, f.label, off ? "save " + off + "%" : "", f.id === E.freq);
  }).join("");
  $("#addonList").innerHTML = ADDONS.map(function (a) {
    var on = E.add.indexOf(a.id) > -1;
    return '<button type="button" class="addon' + (on ? " is-on" : "") + '" data-add="' + a.id +
      '" aria-pressed="' + on + '"><span style="display:flex;align-items:center;gap:.6rem">' +
      '<span class="box"></span>' + a.name + "</span><i>+" + money(a.price) + "</i></button>";
  }).join("");

  bindChips("#chipService", function (v) { E.svc = v; renderEstimator(); });
  bindChips("#chipBed",  function (v) { E.bed = parseFloat(v); });
  bindChips("#chipBath", function (v) { E.bath = parseFloat(v); });
  bindChips("#chipFreq", function (v) { E.freq = v; });
  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.getAttribute("data-add"), i = E.add.indexOf(id);
      if (i > -1) E.add.splice(i, 1); else E.add.push(id);
      b.classList.toggle("is-on"); b.setAttribute("aria-pressed", i < 0);
      calc();
    });
  });
  toggleFreq();
  calc();
}

function toggleFreq() {
  if (!hasEst) return;
  var recurring = E.svc === "standard" || E.svc === "deep" || E.svc === "biz";
  var wrap = $("#chipFreq").closest(".field");
  wrap.style.display = recurring ? "" : "none";
  if (!recurring) E.freq = "once";
  renumber();
}

function renumber() {
  var n = 0;
  $$("#estimate .field").forEach(function (f) {
    if (f.style.display === "none") return;
    var lab = $(".field-lab", f); if (!lab) return;
    n++;
    lab.innerHTML = n + " &middot; " + lab.getAttribute("data-lab");
  });
}

var sqftEl = $("#sqft");
if (sqftEl) sqftEl.addEventListener("input", function () {
  E.sqft = parseInt(this.value, 10);
  $("#sqftVal").textContent = (E.sqft >= 4000 ? "4,000+" : E.sqft.toLocaleString("en-US")) + " sq ft";
  calc();
});

function pct(id) { return ({ wk: CFG.wk, bi: CFG.bi, mo: CFG.mo, once: 0 })[id] || 0; }

function calc() {
  if (!hasEst) return;
  $("#bedVal").textContent  = E.bed === 6 ? "6+" : E.bed;
  $("#bathVal").textContent = E.bath === 4 ? "4+" : E.bath;

  var base, forLine, baseLab = "Base clean", hours = 0;

  if (E.svc === "organize") {
    hours = Math.max(2, Math.min(10, Math.round(E.sqft / 450)));
    base = hours * CFG.orgRate;
    baseLab = hours + " hours at " + money(CFG.orgRate) + "/hr";
    forLine = "Home organization, roughly " + hours + " hours";
  } else {
    base = Math.max(CFG.min, E.sqft * CFG.rate);
    base += Math.max(0, E.bath - 2) * CFG.bathExtra;
    base += Math.max(0, E.bed - 3) * CFG.bedExtra;
    if (E.svc === "deep") base *= CFG.deepMult;
    if (E.svc === "move") base *= CFG.moveMult;
    if (E.svc === "biz")  base *= CFG.bizMult;
    var freqName = { once:"one time", wk:"every week", bi:"every two weeks", mo:"once a month" }[E.freq];
    forLine = SVC_LABELS[E.svc] + (E.freq === "once" ? ", one time" : ", " + freqName);
  }

  var addTotal = E.add.reduce(function (s, id) {
    var a = ADDONS.filter(function (x) { return x.id === id; })[0];
    return s + (a ? a.price : 0);
  }, 0);

  var sub = base + addTotal;
  var discount = sub * (pct(E.freq) / 100);
  var total = sub - discount;
  var lo = Math.round((total * (1 - CFG.spread / 100)) / 5) * 5;
  var hi = Math.round((total * (1 + CFG.spread / 100)) / 5) * 5;
  var give = Math.max(1, Math.round(total * (CFG.give / 100)));

  $("#resRange").innerHTML = money(lo) + ' <span class="to">to</span> ' + money(hi);
  $("#resFor").textContent = forLine;
  $("#resBaseLab").textContent = baseLab;
  $("#resBase").textContent = money(base);
  $("#resAddRow").hidden = addTotal === 0;
  $("#resAdd").textContent = money(addTotal);
  $("#resSaveRow").hidden = discount < 1;
  $("#resSaveLab").textContent = pct(E.freq) + "% recurring discount";
  $("#resSave").textContent = "-" + money(discount);
  $("#giveAmt").textContent = money(give);

  var bar = $("#estBarVal");
  if (bar) bar.textContent = money(lo) + " to " + money(hi);

  E._lo = lo; E._hi = hi; E._for = forLine;
}

function val(id) { var el = $(id); return el ? el.value.trim() : ""; }

function summary() {
  var names = E.add.map(function (id) {
    return ADDONS.filter(function (a) { return a.id === id; })[0].name;
  });
  var lines = [
    "Quote request from the Shine for Good site", "",
    "Name: " + (val("#qName") || "-"),
    "Phone: " + (val("#qPhone") || "-"),
    "Where: " + (val("#qAddr") || "-"), "",
    "Service: " + E._for,
    "Size: " + E.sqft.toLocaleString("en-US") + " sq ft, " + E.bed + " bd / " + E.bath + " ba",
    "Add-ons: " + (names.length ? names.join(", ") : "none"),
    "Site estimate: " + money(E._lo) + " to " + money(E._hi), ""
  ];
  if (val("#qNote")) lines.push("Notes: " + val("#qNote"));
  return lines.join("\n");
}

var sendToggle = $("#sendToggle");
if (sendToggle) sendToggle.addEventListener("click", function () {
  var p = $("#sendPanel");
  p.classList.toggle("is-on");
  this.textContent = p.classList.contains("is-on") ? "Hide the form" : "Send this to Chelsea";
  if (p.classList.contains("is-on")) setTimeout(function () { $("#qName").focus(); }, 220);
});

var sendSms = $("#sendSms");
if (sendSms) sendSms.addEventListener("click", function () {
  if (!val("#qName") || !val("#qPhone")) { toast("Add your name and phone so Chelsea can reply."); return; }
  window.location.href = "sms:" + telDigits() + "?&body=" + encodeURIComponent(summary());
  toast("Opening your messages app with the details filled in.");
});

var sendEmail = $("#sendEmail");
if (sendEmail) sendEmail.addEventListener("click", function () {
  if (!val("#qName")) { toast("Add your name first."); return; }
  window.location.href = "mailto:" + emailAddr() +
    "?subject=" + encodeURIComponent("Quote request: " + E._for) +
    "&body=" + encodeURIComponent(summary());
  toast("Opening your email with the details filled in.");
});

/* ---------- contact form ---------- */
var cSend = $("#cSend");
if (cSend) cSend.addEventListener("click", function () {
  var n = val("#cName"), ph = val("#cPhone");
  if (!n || !ph) { toast("Name and phone, then it can send."); return; }
  var body = ["Message from the Shine for Good site", "",
    "Name: " + n, "Phone: " + ph, "Email: " + (val("#cEmail") || "-"),
    "Looking for: " + (val("#cWhat") || "-"), "", val("#cMsg")].join("\n");
  window.location.href = "sms:" + telDigits() + "?&body=" + encodeURIComponent(body);
  toast("Opening your messages app so you can hit send.");
});

/* ============================================================
   MOBILE ESTIMATE BAR
   ============================================================ */
var estBar = $("#estBar"), estInView = false, resultInView = false;

function syncEstBar() {
  if (!estBar) return;
  var small = window.matchMedia("(max-width:1000px)").matches;
  var blocked = (nav && nav.classList.contains("is-open")) || document.body.classList.contains("editing");
  estBar.classList.toggle("is-on", small && estInView && !resultInView && !blocked);
}

if (estBar && "IntersectionObserver" in window) {
  var estSec = $("#estimate"), resCard = $(".result");
  if (estSec) new IntersectionObserver(function (es) {
    es.forEach(function (e) { estInView = e.isIntersecting; }); syncEstBar();
  }, { threshold: 0 }).observe(estSec);
  if (resCard) new IntersectionObserver(function (es) {
    es.forEach(function (e) { resultInView = e.isIntersecting; }); syncEstBar();
  }, { threshold: .12 }).observe(resCard);
}
var estBarBtn = $("#estBarBtn");
if (estBarBtn) estBarBtn.addEventListener("click", function () {
  var r = $(".result"); if (r) r.scrollIntoView({ behavior: "smooth", block: "center" });
});
window.addEventListener("resize", syncEstBar, { passive: true });

/* ============================================================
   BEFORE / AFTER
   ============================================================ */
$$(".ba").forEach(function (box) {
  var range = $(".ba-range", box), dragging = false;
  function set(v) {
    v = Math.max(0, Math.min(100, v));
    box.style.setProperty("--sp", v + "%");
    if (range) range.value = v;
  }
  function fromX(x) { var r = box.getBoundingClientRect(); set(((x - r.left) / r.width) * 100); }
  if (range) range.addEventListener("input", function () { set(parseFloat(this.value)); });
  box.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true; box.setPointerCapture(e.pointerId); fromX(e.clientX);
  });
  box.addEventListener("pointermove", function (e) { if (dragging) fromX(e.clientX); });
  ["pointerup", "pointercancel"].forEach(function (t) {
    box.addEventListener(t, function (e) {
      dragging = false;
      if (box.hasPointerCapture && box.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId);
    });
  });
  set(50);
});

/* ============================================================
   SCROLL REVEALS
   ============================================================ */
function observeReveals() {
  var items = $$(".rv:not(.is-in)");
  if (!("IntersectionObserver" in window)) { items.forEach(function (e) { e.classList.add("is-in"); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
  items.forEach(function (e) { io.observe(e); });
}

/* ============================================================
   EDIT MODE
   ============================================================ */
var editing = false, edPanel = $("#edPanel"), edToggle = $("#edToggle");

function applyContact() {
  var ph = STATE.contact.phone || CFG.phone;
  $$("[data-tel-href]").forEach(function (a) { a.setAttribute("href", "tel:" + telDigits()); });
  $$("[data-mail-href]").forEach(function (a) { a.setAttribute("href", "mailto:" + emailAddr()); });
  $$('[data-edit^="phoneShort"]').forEach(function (e) {
    if (!STATE.text[e.getAttribute("data-edit")]) e.textContent = ph;
  });
  $$('[data-edit="emailAddr"]').forEach(function (e) {
    if (!STATE.text.emailAddr) e.textContent = emailAddr();
  });
  var list = $("#areaList");
  if (list) list.innerHTML = (STATE.contact.areas || CFG.areas)
    .map(function (a) { return '<span class="area">' + a + "</span>"; }).join("");
}

function applyState() {
  Object.keys(STATE.text).forEach(function (k) {
    var el = document.querySelector('[data-edit="' + k + '"]');
    if (el) el.innerHTML = STATE.text[k];
  });
  Object.keys(STATE.img).forEach(function (k) {
    var el = document.querySelector('[data-img="' + k + '"]');
    if (el && STATE.img[k]) {
      el.style.backgroundImage = 'url("' + STATE.img[k] + '")';
      var ph = $(".ph", el); if (ph) ph.style.display = "none";
    }
  });
  Object.keys(STATE.cfg).forEach(function (k) {
    if (STATE.cfg[k] !== "" && !isNaN(STATE.cfg[k])) CFG[k] = parseFloat(STATE.cfg[k]);
  });
  applyContact();
}

function setEditing(on) {
  editing = on;
  document.body.classList.toggle("editing", on);
  if (edToggle) edToggle.classList.toggle("is-on", on);
  $$("[data-edit]").forEach(function (el) {
    if (on) { el.setAttribute("contenteditable", "true"); el.setAttribute("spellcheck", "true"); }
    else el.removeAttribute("contenteditable");
  });
  if (!on && edPanel) edPanel.classList.remove("is-on");
  syncEstBar();
}

document.addEventListener("input", function (e) {
  var t = e.target;
  if (editing && t.hasAttribute && t.hasAttribute("data-edit")) {
    STATE.text[t.getAttribute("data-edit")] = t.innerHTML;
    saveState();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) {
    e.preventDefault(); setEditing(!editing);
    toast(editing ? "Edit mode on. Click any outlined text to rewrite it." : "Edit mode off.");
  }
});

if (edToggle) edToggle.addEventListener("click", function () { edPanel.classList.toggle("is-on"); });
var edClose = $("#edClose");
if (edClose) edClose.addEventListener("click", function () { edPanel.classList.remove("is-on"); });

function initEditPanel() {
  if (!edPanel) return;

  function bindNum(id, key) {
    var el = $(id); if (!el) return;
    el.value = STATE.cfg[key] !== undefined ? STATE.cfg[key] : CFG[key];
    el.addEventListener("input", function () {
      STATE.cfg[key] = el.value;
      if (el.value !== "" && !isNaN(el.value)) CFG[key] = parseFloat(el.value);
      if (hasEst) renderEstimator();
      saveState();
    });
  }
  function bindTxt(id, key) {
    var el = $(id); if (!el) return;
    el.value = STATE.contact[key] !== undefined ? STATE.contact[key] : CFG[key];
    el.addEventListener("input", function () { STATE.contact[key] = el.value; applyContact(); saveState(); });
  }

  bindTxt("#edPhone", "phone");
  bindTxt("#edEmail", "email");

  var areas = $("#edAreas");
  if (areas) {
    areas.value = (STATE.contact.areas || CFG.areas).join(", ");
    areas.addEventListener("input", function () {
      STATE.contact.areas = areas.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      applyContact(); saveState();
    });
  }

  [["#edRate","rate"],["#edMin","min"],["#edBath","bathExtra"],["#edBed","bedExtra"],
   ["#edDeep","deepMult"],["#edMove","moveMult"],["#edWk","wk"],["#edBi","bi"],
   ["#edMo","mo"],["#edGive","give"]].forEach(function (p) { bindNum(p[0], p[1]); });

  $$("[data-imgin]").forEach(function (inp) {
    var k = inp.getAttribute("data-imgin");
    inp.value = STATE.img[k] || "";
    inp.addEventListener("input", function () {
      var v = inp.value.trim();
      STATE.img[k] = v;
      var el = document.querySelector('[data-img="' + k + '"]');
      if (el) {
        el.style.backgroundImage = v ? 'url("' + v + '")' : "";
        var ph = $(".ph", el); if (ph) ph.style.display = v ? "none" : "";
      }
      saveState();
    });
  });

  var dl = $("#edDownload");
  if (dl) dl.addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(STATE, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "shine-content.json"; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    toast("Downloaded shine-content.json. Send it to whoever manages the site.");
  });

  var pg = $("#edPage");
  if (pg) pg.addEventListener("click", function () {
    var clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll("[contenteditable]").forEach(function (e) {
      e.removeAttribute("contenteditable"); e.removeAttribute("spellcheck");
    });
    clone.querySelector("body").classList.remove("editing", "is-locked");
    var html = "<!DOCTYPE html>\n" + clone.outerHTML;
    var url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    var a = document.createElement("a");
    a.href = url;
    a.download = (location.pathname.split("/").pop() || "index.html");
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    toast("Downloaded this page with your edits baked in.");
  });

  var rs = $("#edReset");
  if (rs) rs.addEventListener("click", function () {
    if (!confirm("This clears every edit on every page and restores the original text and prices. Continue?")) return;
    store.del(KEY).then(function () { location.reload(); });
  });
}

/* ============================================================
   BOOT
   ============================================================ */
var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

store.get(KEY).then(function (raw) {
  if (raw) {
    try {
      var s = JSON.parse(raw);
      STATE.text = s.text || {}; STATE.img = s.img || {};
      STATE.cfg = s.cfg || {};   STATE.contact = s.contact || {};
    } catch (e) {}
  }
  applyState();
  renderEstimator();
  initEditPanel();
  observeReveals();
  openFromHash();
  if (/[?&]edit=1/.test(location.search)) {
    setEditing(true);
    if (edPanel) edPanel.classList.add("is-on");
  }
});

})();
