(function () {
  "use strict";

  var D = window.BAKEHAUS;
  var doc = document.documentElement;
  doc.classList.add("js");
  var PAGE = document.body.dataset.page || "";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Real pixel sizes: [small width, small height, large width]. Most photos are 540x720 / 960+ wide,
  // so only the exceptions are listed. Lets the browser reserve space and pick the right file.
  var DIMS = {
    "brownie-box-nine": [540, 720, 1086], "brownie-box-ribbon": [540, 720, 1086], "carrot-cake": [540, 720, 1200],
    "cake-gift-box": [540, 720, 1200], "cake-lambeth-birthday": [540, 720, 1086], "cake-lambeth-fifty": [540, 720, 1086],
    "cake-tiered-ruffle": [540, 720, 1200], "cake-tiramisu-monogram": [540, 720, 1200], "canvas-cheese-board": [540, 720, 1200],
    "cookie-cups-box": [540, 720, 1086], "cookie-tin-assorted": [540, 720, 1086], "callet-butter-cake": [540, 720, 960], "diwali-collection": [540, 720, 1086], "diwali-indulgence-trunk": [540, 720, 540],
    "diwali-heritage-box": [540, 720, 1086], "diwali-potli-basket": [540, 720, 1086], "diwali-potli-tin": [540, 720, 1086],
    "diwali-wicker-hamper": [540, 720, 1086], "focaccia": [540, 720, 960], "grazing-cake-stand": [720, 612, 1600],
    "grazing-dips": [720, 480, 1600], "grazing-garden": [720, 480, 1600], "grazing-ladder": [540, 720, 1200],
    "grazing-panorama": [720, 447, 1600], "grazing-round-table": [720, 480, 1600], "grazing-sliders": [540, 720, 1200],
    "grazing-sliders-stand": [720, 588, 1372], "grazing-sunflower": [720, 582, 958], "grazing-tiers": [577, 720, 960],
    "tiramisu-cups": [540, 720, 1200], "bishops-nut-cake": [540, 720, 900]
  };
  function dims(name) { return DIMS[name] || [540, 720, 960]; }
  function sm(name) { return "assets/img/" + name + "-sm.jpg"; }
  function lg(name) { return "assets/img/" + name + "-lg.jpg"; }
  function srcset(name) { var d = dims(name); return sm(name) + " " + d[0] + "w, " + lg(name) + " " + d[2] + "w"; }

  // ---------- helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function rupees(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function waLink(text) { return "https://wa.me/" + D.phone + "?text=" + encodeURIComponent(text); }
  function store(kind) {
    try { return kind === "local" ? window.localStorage : window.sessionStorage; } catch (e) { return null; }
  }
  function load(kind, key, fallback) {
    try { var s = store(kind); var v = s && s.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(kind, key, val) {
    try { var s = store(kind); if (s) s.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
  }
  function wait(fn, ms) { return setTimeout(fn, ms); }

  // ---------- shared chrome (one source for every page) ----------
  var NAV = [
    { page: "menu", href: "menu.html", label: "Menu" },
    { page: "grazing", href: "grazing.html", label: "Grazing tables" },
    { page: "order", href: "order.html", label: "How to order" },
    { page: "gallery", href: "gallery.html", label: "Gallery" },
    { page: "about", href: "about.html", label: "About" }
  ];
  var DW = D.festive && D.festive.enabled ? D.festive : null;
  if (DW) NAV.splice(1, 0, { page: "festive", href: "festive.html", label: DW.short, festive: true });
  function navLinks() {
    return NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.festive ? ' class="nav-festive"' : "") + (n.page === PAGE ? ' aria-current="page"' : "") + ">" + (n.festive ? '<i class="ph-fill ph-sparkle" aria-hidden="true"></i>' : "") + n.label + "</a>";
    }).join("");
  }

  var headerEl = $("#siteHeader");
  if (headerEl) {
    headerEl.innerHTML =
      '<div class="wrap header-inner">' +
        '<a class="brand" href="index.html" aria-label="BakeHaus by Khushi Lalwani, home"><span class="brand-logo" aria-hidden="true"></span></a>' +
        '<nav class="main-nav" aria-label="Main">' + navLinks() + "</nav>" +
        '<a class="btn btn-wa header-cta" data-wa="general" href="https://wa.me/' + D.phone + '" target="_blank" rel="noopener"><i class="ph-fill ph-whatsapp-logo" aria-hidden="true"></i><span>Order on WhatsApp</span></a>' +
        '<button type="button" class="icon-btn nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu"><i class="ph ph-list" aria-hidden="true"></i></button>' +
      "</div>" +
      '<nav class="mobile-nav" id="mobileNav" aria-label="Main" hidden><div class="wrap">' +
        '<a href="index.html"' + (PAGE === "home" ? ' aria-current="page"' : "") + ">Home</a>" + navLinks() +
      "</div></nav>";
    headerEl.insertAdjacentHTML("afterend", '<div class="awning" aria-hidden="true"></div>');
    var toggle = $("#navToggle"), mnav = $("#mobileNav");
    var setNav = function (open) {
      mnav.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.innerHTML = '<i class="ph ' + (open ? "ph-x" : "ph-list") + '" aria-hidden="true"></i>';
    };
    toggle.addEventListener("click", function () { setNav(mnav.hidden); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mnav.hidden) { setNav(false); toggle.focus(); } });
    document.addEventListener("click", function (e) { if (!mnav.hidden && !headerEl.contains(e.target)) setNav(false); });
    window.matchMedia("(min-width: 1080px)").addEventListener("change", function (m) { if (m.matches) setNav(false); });
  }

  var footerEl = $("#siteFooter");
  if (footerEl) {
    footerEl.innerHTML =
      '<div class="wrap footer-inner">' +
        '<div class="footer-brand"><span class="brand-logo brand-logo-lg" role="img" aria-label="BakeHaus by Khushi Lalwani"></span>' +
        "<p>Cloud kitchen by Chef Khushi Lalwani. 100% eggless, made to order.</p></div>" +
        '<ul class="footer-links">' +
          '<li><a data-wa="general" href="https://wa.me/' + D.phone + '" target="_blank" rel="noopener"><i class="ph-fill ph-whatsapp-logo" aria-hidden="true"></i>' + esc(D.phoneDisplay) + "</a></li>" +
          '<li><a href="' + D.instagram + '" target="_blank" rel="noopener"><i class="ph ph-instagram-logo" aria-hidden="true"></i>' + esc(D.instagramHandle) + "</a></li>" +
          '<li><a href="' + D.reviews + '" target="_blank" rel="noopener"><i class="ph ph-star" aria-hidden="true"></i>Review us on Google</a></li>' +
        "</ul>" +
        '<address class="footer-address"><p><i class="ph ph-map-pin" aria-hidden="true"></i><span>' + esc(D.address) + "</span></p>" +
          '<p><i class="ph ph-clock" aria-hidden="true"></i><span>' + esc(D.hours) + "</span></p>" +
          '<a class="text-link" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent("BakeHaus by Khushi, " + D.address) + '" target="_blank" rel="noopener">Get directions <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></address>' +
        '<p class="fine">© ' + new Date().getFullYear() + " BakeHaus by Khushi Lalwani · Pre-orders only · Photos show past orders, every design is made to order</p>" +
      "</div>";
  }

  document.body.insertAdjacentHTML("beforeend",
    '<div class="tray" id="tray" hidden><button type="button" class="tray-bar" id="trayOpen" aria-expanded="false" aria-controls="traySheet">' +
      '<span class="tray-count" id="trayCount">0</span><span class="tray-label" id="trayLabel">items in your order</span>' +
      '<span class="tray-go">Review <i class="ph ph-caret-up" aria-hidden="true"></i></span></button></div>' +
    '<div class="sheet-backdrop" id="sheetBackdrop" hidden></div>' +
    '<section class="sheet" id="traySheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle" hidden>' +
      '<div class="sheet-head"><h2 id="sheetTitle">Your order</h2><button type="button" class="icon-btn" id="trayClose" aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button></div>' +
      '<ul class="sheet-list" id="sheetList"></ul>' +
      '<div class="sheet-fields">' +
        '<div class="field"><label for="sheetDate">Date needed</label><input type="date" class="js-date" id="sheetDate"></div>' +
        '<div class="field"><label for="sheetNotes">Notes for Khushi <span class="opt">(optional)</span></label><textarea id="sheetNotes" rows="2" placeholder="Design, message on cake, pickup or delivery"></textarea></div>' +
      "</div>" +
      '<div class="sheet-foot"><div class="sheet-total"><span id="sheetTotalLabel">Total</span><strong id="sheetTotal">₹0</strong></div>' +
      '<a class="btn btn-wa" id="sheetSend" href="#" target="_blank" rel="noopener"><i class="ph-fill ph-whatsapp-logo" aria-hidden="true"></i><span>Send on WhatsApp</span></a></div>' +
    "</section>" +
    '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>' +
      '<button type="button" class="icon-btn lb-close" id="lbClose" aria-label="Close photo"><i class="ph ph-x" aria-hidden="true"></i></button>' +
      '<button type="button" class="icon-btn lb-prev" id="lbPrev" aria-label="Previous photo"><i class="ph ph-caret-left" aria-hidden="true"></i></button>' +
      '<figure class="lb-fig"><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption></figure>' +
      '<button type="button" class="icon-btn lb-next" id="lbNext" aria-label="Next photo"><i class="ph ph-caret-right" aria-hidden="true"></i></button>' +
    "</div>" +
    '<div class="toast" id="toast" role="status" aria-live="polite"></div>');

  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = wait(function () { toastEl.classList.remove("is-on"); }, 2200);
  }

  // ---------- date ----------
  var state = { date: load("session", "bh-date", ""), tray: load("local", "bh-tray", []) };

  function todayISO() {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  function daysUntil(iso) {
    if (!iso) return null;
    var t = new Date(todayISO() + "T00:00:00"), d = new Date(iso + "T00:00:00");
    return Math.round((d - t) / 86400000);
  }
  function prettyDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    var mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    return wd + " " + d.getDate() + " " + mo + " " + d.getFullYear();
  }
  function dateLine() { return "Date needed: " + (state.date ? prettyDate(state.date) : ""); }

  // ---------- messages ----------
  // What we ask for in each WhatsApp message, by product kind (item.kind overrides the category's).
  var PROMPTS = {
    cake: ["Weight (500g, 1kg or more):", "Design / theme:", "Message on cake:"],
    tin: ["Number of tins:"],
    box: ["Number of boxes:"],
    pack: ["Quantity:"],
    loaf: ["Quantity:"],
    piece: ["Number of pieces:"]
  };
  function kindOf(it, cat) { return it.kind || cat.kind; }

  function priceLabel(it) {
    if (it.price == null) return "price on request";
    return (it.from ? "from " : "") + rupees(it.price) + (it.unit || "");
  }
  // Shown under each item. Category-wide facts (500g, starting price, minimum) live in the category note instead.
  function itemMeta(it, cat) {
    var parts = [];
    if (it.size && it.size !== cat.size) parts.push(it.size);
    if (it.moq) parts.push("min " + it.moq + " pcs");
    return parts.join(" · ");
  }
  function itemPrompts(it, cat) {
    var moq = it.moq || cat.moq;
    var lines = (PROMPTS[kindOf(it, cat)] || ["Quantity:"]).map(function (p) {
      return p === "Number of pieces:" && moq ? "Number of pieces (min " + moq + "):" : p;
    });
    if (it.options) lines.unshift("Flavour (" + it.options.join(" / ") + "):");
    return lines;
  }
  function itemMessage(it, cat) {
    if (kindOf(it, cat) === "hamper") {
      var occasion = DW ? DW.festival : "gifting";
      // Priced hampers are ordered; price-on-request ones are enquired about.
      return (it.price != null
        ? ["Hi BakeHaus! I'd like to order *" + it.name + "* (" + rupees(it.price) + ") for " + occasion + ".", "", "How many:", dateLine(), "Gifting for: family / friends / corporate", "GST bill needed: yes / no", "Pickup or delivery:", "", "Please confirm availability. Thank you!"]
        : ["Hi BakeHaus! I'm interested in the *" + it.name + "* for " + occasion + ".", "", "How many:", dateLine(), "Budget (optional):", "Gifting for: family / friends / corporate", "", "Please share the price and what's inside. Thank you!"]
      ).join("\n");
    }
    if (kindOf(it, cat) === "custom") {
      return ["Hi BakeHaus! I'd like a *customised cake*.", "", "Occasion:", dateLine(), "Weight (kg):", "Flavour:", "Design / theme:", "Message on cake:", "I'll share a reference photo here.", "Pickup or delivery:", "", "Please share the price. Thank you!"].join("\n");
    }
    var detail = [it.size, priceLabel(it)].filter(Boolean).join(", ");
    return ["Hi BakeHaus! I'd like to order:", "*" + it.name + "* (" + cat.short + ")", detail, "", dateLine()]
      .concat(itemPrompts(it, cat))
      .concat(["Pickup or delivery:", "", "Please confirm availability. Thank you!"]).join("\n");
  }
  function generalMessage() {
    return ["Hi BakeHaus! I'd like to place an order.", "", dateLine(), "What I'd like:", "", "Thank you!"].join("\n");
  }

  // ---------- item index (all pages: the tray can hold items from any page visit) ----------
  var ITEMS = {};
  D.categories.concat(DW ? [DW] : []).forEach(function (cat) {
    cat.groups.forEach(function (g) {
      g.items.forEach(function (it) { ITEMS[cat.id + "--" + slug(it.name)] = { it: it, cat: cat, group: g }; });
    });
  });
  function minQty(key) { var r = ITEMS[key]; return r.it.moq || r.cat.moq || 1; }

  // ---------- stickers ----------
  var STICKERS = {
    "chef's pick": { cls: "sticker-chef", icon: "ph-chef-hat" },
    "bestseller": { cls: "sticker-best", icon: "ph-fire" },
    "new": { cls: "sticker-new", icon: "ph-sparkle" }
  };
  function stickerHTML(tag) {
    if (!tag) return "";
    var s = STICKERS[tag.toLowerCase()] || { cls: "sticker-new", icon: "ph-star" };
    return '<span class="sticker ' + s.cls + '"><i class="ph-fill ' + s.icon + '" aria-hidden="true"></i>' + esc(tag) + "</span>";
  }

  // ---------- lightbox sets ----------
  var LB_SETS = {};

  // =================================================================
  // HOME
  // =================================================================
  var tilesEl = $("#catTiles");
  if (tilesEl) {
    var tiles = D.categories.map(function (c) {
      var prices = [];
      c.groups.forEach(function (g) { g.items.forEach(function (it) { if (it.price) prices.push(it.price); }); });
      var starting = c.groups.some(function (g) { return g.items.some(function (it) { return it.from; }); });
      return { href: "menu.html#" + c.id, title: c.title, photo: (c.photos || [])[0], min: Math.min.apply(null, prices), max: Math.max.apply(null, prices), starting: starting, priceText: c.priceText, id: c.id };
    });
    tiles.splice(2, 0, { href: "grazing.html", title: "Grazing tables", photo: D.grazing.photos[0], perHead: D.grazing.pricePerHead, id: "grazing" });
    tilesEl.innerHTML = tiles.map(function (t) {
      var d = t.photo ? dims(t.photo) : null;
      // Only categories marked from: true are starting prices; the rest show their fixed price range.
      var price = t.priceText ? t.priceText : t.perHead ? rupees(t.perHead) + " per person"
        : t.starting ? "Starting at " + rupees(t.min) + ", varies with design"
        : t.min === t.max ? rupees(t.min) : rupees(t.min) + " to " + rupees(t.max);
      return '<a class="ctile ctile-' + t.id + (t.photo ? "" : " ctile-plain") + ' reveal" href="' + t.href + '">' +
        (t.photo ? '<img src="' + sm(t.photo) + '" alt="" loading="lazy" width="' + d[0] + '" height="' + d[1] + '">' : '<i class="ph ph-cake ctile-icon" aria-hidden="true"></i>') +
        '<span class="ctile-text"><span class="ctile-title">' + esc(t.title) + '</span><span class="ctile-price">' + price + "</span></span>" +
        '<i class="ph ph-arrow-up-right ctile-go" aria-hidden="true"></i></a>';
    }).join("");
  }
  var picksEl = $("#chefPicks");
  if (picksEl) {
    var featured = [];
    Object.keys(ITEMS).forEach(function (key) {
      var t = (ITEMS[key].it.tag || "").toLowerCase();
      if (t === "chef's pick" || t === "bestseller") featured.push(key);
    });
    picksEl.innerHTML = featured.map(function (key) {
      var r = ITEMS[key], it = r.it, cat = r.cat;
      var photo = it.img
        ? '<img src="' + sm(it.img) + '" alt="' + esc(it.name) + '" loading="lazy" width="540" height="720">'
        : '<i class="ph ph-cake pick-icon" aria-hidden="true"></i>';
      return '<article class="pick-card reveal">' +
        '<a class="pick-photo' + (it.img ? "" : " pick-photo-plain") + '" href="menu.html#' + cat.id + '" aria-label="' + esc(it.name) + ' on the menu">' + photo + "</a>" +
        stickerHTML(it.tag) +
        '<div class="pick-body"><p class="pick-cat">' + esc(cat.short) + "</p><h3>" + esc(it.name) + "</h3>" +
        '<div class="pick-foot"><span class="price">' + (it.from ? '<span class="from">from</span>' : "") + rupees(it.price) + (it.unit ? "<small>" + esc(it.unit) + "</small>" : "") + "</span>" +
        '<div class="acts"><button type="button" class="act act-add" data-add="' + key + '" aria-pressed="false" aria-label="Add ' + esc(it.name) + ' to your order"><i class="ph ph-plus" aria-hidden="true"></i></button>' +
        '<a class="act act-wa" data-key="' + key + '" href="' + waLink(itemMessage(it, cat)) + '" target="_blank" rel="noopener" aria-label="Order ' + esc(it.name) + ' on WhatsApp"><i class="ph-fill ph-whatsapp-logo" aria-hidden="true"></i></a></div>' +
        "</div></div></article>";
    }).join("");
  }

  // =================================================================
  // FESTIVE SPECIALS (home banner + festive.html), driven by D.festive
  // =================================================================
  var bannerEl = $("#festiveBanner");
  if (bannerEl) {
    if (!DW) bannerEl.remove();
    else {
      bannerEl.innerHTML =
        '<div class="dw-banner-copy"><p class="kicker kicker-festive"><i class="ph-fill ph-sparkle" aria-hidden="true"></i>' + esc(DW.greeting) + "</p>" +
        "<h2>" + esc(DW.bannerTitle) + "</h2><p>" + esc(DW.bannerText) + "</p>" +
        '<a class="btn btn-primary" href="festive.html">' + esc(DW.bannerButton) + ' <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>' +
        '<div class="dw-banner-photos" aria-hidden="true">' + DW.photos.slice(0, 3).map(function (p) {
          return '<img src="' + sm(p) + '" alt="" loading="lazy" width="540" height="720">';
        }).join("") + "</div>";
    }
  }

  function giftCardHTML(it, cat, i) {
    var key = cat.id + "--" + slug(it.name);
    var price = it.link ? "" : it.price != null
      ? '<span class="price">' + rupees(it.price) + "</span>"
      : '<span class="price-request">Price on request</span>';
    var shots = it.photos || [it.img];
    var photo = '<button type="button" class="gift-photo" data-lb-set="gift-' + i + '" data-lb-i="0" aria-label="View ' + (shots.length > 1 ? shots.length + " photos" : "photo") + " of " + esc(it.name) + '">' +
      (shots.length > 1 ? '<span class="photo-count"><i class="ph ph-images" aria-hidden="true"></i>' + shots.length + " photos</span>" : "") +
      '<img src="' + sm(it.img) + '" srcset="' + srcset(it.img) + '" sizes="(min-width: 1000px) 30vw, (min-width: 640px) 46vw, 90vw" alt="' + esc(it.name) + '" loading="lazy" width="540" height="720"></button>';
    var acts = it.link
      ? '<a class="btn btn-ghost btn-sm" href="' + it.link + '">See on the menu <i class="ph ph-arrow-right" aria-hidden="true"></i></a>'
      : '<div class="acts"><button type="button" class="act act-add" data-add="' + key + '" aria-pressed="false" aria-label="Add ' + esc(it.name) + ' to your order"><i class="ph ph-plus" aria-hidden="true"></i></button>' +
        '<a class="btn btn-wa btn-sm act-wa" data-key="' + key + '" href="' + waLink(itemMessage(it, cat)) + '" target="_blank" rel="noopener" aria-label="' + (it.price != null ? "Order " : "Enquire about ") + esc(it.name) + ' on WhatsApp"><i class="ph-fill ph-whatsapp-logo" aria-hidden="true"></i><span>' + (it.price != null ? "Order" : "Enquire") + "</span></a></div>";
    LB_SETS["gift-" + i] = shots.map(function (p) { return { img: p, alt: it.name }; });
    return '<article class="gift-card reveal">' + photo + '<div class="gift-body"><h3>' + esc(it.name) + "</h3>" +
      (it.desc ? "<p>" + esc(it.desc) + "</p>" : "") +
      (it.contents ? '<ul class="gift-contents" aria-label="What is inside">' + it.contents.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" : "") +
      '<div class="gift-foot">' + price + acts + "</div></div></article>";
  }

  var festiveEl = $("#festiveMain");
  if (festiveEl && DW) {
    document.title = DW.title + " | BakeHaus by Khushi";
    $("#fsGreeting").textContent = DW.greeting;
    $("#fsTitle").innerHTML = esc(DW.headline) + " <em>" + esc(DW.headlineAccent) + "</em>";
    $("#fsIntro").textContent = DW.intro;
    $("#fsFacts").innerHTML = (DW.facts || []).map(function (f, i) {
      return '<li><i class="ph ' + ["ph-check-circle", "ph-gift", "ph-buildings"][i % 3] + '" aria-hidden="true"></i>' + esc(f) + "</li>";
    }).join("");
    $("#fsArt").innerHTML = DW.photos.slice(0, 3).map(function (p, i) {
      return '<figure class="ha ha-' + (i + 1) + '"><img src="' + sm(p) + '" alt="" width="540" height="720"' + (i === 0 ? ' fetchpriority="high"' : "") + "></figure>";
    }).join("");
    var n = 0;
    $("#fsGroups").innerHTML = DW.groups.map(function (g, gi) {
      return '<section class="wrap dw-section" aria-labelledby="fs-g' + gi + '"><h2 id="fs-g' + gi + '">' + esc(g.title) + "</h2>" +
        '<div class="gifts' + (gi > 0 ? " gifts-sm" : "") + '">' + g.items.map(function (it) { return giftCardHTML(it, DW, n++); }).join("") + "</div></section>";
    }).join("");
    $("#fsCorporate").hidden = !DW.corporate;
    if (DW.corporateText) $("#fsCorporateText").textContent = DW.corporateText;
    var fsMsg = ["Hi BakeHaus! I'd like to know more about your " + DW.title + ".", "", "How many:", dateLine(), "Gifting for: family / friends / corporate", "", "Thank you!"].join("\n");
    var corpMsg = ["Hi BakeHaus! I'm looking for " + DW.festival + " corporate gifting.", "", "Company:", "Number of hampers:", "Budget per hamper:", dateLine(), "", "Please share options. Thank you!"].join("\n");
    $$("[data-wa-festive]").forEach(function (a) { a.href = waLink(a.dataset.waFestive === "corporate" ? corpMsg : fsMsg); });
  } else if (festiveEl && !DW) {
    // No festival running: send visitors to the menu instead of an empty page.
    location.replace("menu.html");
  }

  var teaserEl = $("#galleryTeaser");
  if (teaserEl) {
    var teaserPhotos = ["cake-princess-tiered", "grazing-dips", "mini-tart-cakes-orange", "cake-lambeth-fifty", "dessert-table-cups"];
    teaserEl.innerHTML = teaserPhotos.map(function (p) {
      var d = dims(p), g = D.gallery.filter(function (x) { return x.img === p; })[0];
      return '<a class="teaser-card reveal" href="gallery.html"><img src="' + sm(p) + '" alt="' + esc(g ? g.alt : "") + '" loading="lazy" width="' + d[0] + '" height="' + d[1] + '"></a>';
    }).join("");
  }

  // =================================================================
  // MENU
  // =================================================================
  var sectionsEl = $("#menuSections");
  var catNav = $("#catNav");
  var activeCat = null;

  function itemHTML(it, cat, group) {
    var key = cat.id + "--" + slug(it.name);
    var search = [it.name, it.desc || "", it.keywords || "", group && group.title || "", cat.title, cat.keywords || ""].join(" ").toLowerCase();
    var thumb = it.img
      ? '<button type="button" class="item-thumb" data-lb="' + esc(it.img) + '" data-lb-alt="' + esc(it.name) + '" aria-label="View photo of ' + esc(it.name) + '"><img src="' + sm(it.img) + '" alt="" loading="lazy" width="56" height="56"></button>'
      : "";
    var price = it.price != null
      ? '<span class="price">' + (it.from ? '<span class="from">from</span>' : "") + rupees(it.price) + (it.unit ? "<small>" + esc(it.unit) + "</small>" : "") + "</span>"
      : "";
    var acts = '<div class="acts">' +
      '<button type="button" class="act act-add" data-add="' + key + '" aria-pressed="false" aria-label="Add ' + esc(it.name) + ' to your order"><i class="ph ph-plus" aria-hidden="true"></i></button>' +
      '<a class="act act-wa" data-key="' + key + '" href="' + waLink(itemMessage(it, cat)) + '" target="_blank" rel="noopener" aria-label="Order ' + esc(it.name) + ' on WhatsApp"><i class="ph-fill ph-whatsapp-logo" aria-hidden="true"></i></a>' +
      "</div>";
    var tag = stickerHTML(it.tag);
    var meta = itemMeta(it, cat);

    if (cat.layout === "tiles") {
      return '<article class="tile" data-search="' + esc(search) + '">' +
        "<h3>" + esc(it.name) + tag + "</h3>" +
        '<div class="tile-foot"><div>' + price + (meta ? '<p class="item-meta">' + esc(meta) + "</p>" : "") + "</div>" + acts + "</div></article>";
    }
    return '<article class="item" data-search="' + esc(search) + '">' + thumb +
      '<div class="item-main"><h3>' + esc(it.name) + tag + "</h3>" +
      (it.desc ? '<p class="item-desc">' + esc(it.desc) + "</p>" : "") +
      (meta ? '<p class="item-meta">' + esc(meta) + "</p>" : "") + "</div>" +
      '<div class="item-side">' + price + acts + "</div></article>";
  }

  function groupHTML(g, cat) {
    var long = g.items.length > 12 ? " is-long" : "";
    return '<div class="group' + long + '">' +
      (g.title ? '<h3 class="group-title">' + esc(g.title) + (g.sub ? "<small>" + esc(g.sub) + "</small>" : "") + "</h3>" : "") +
      '<div class="items">' + g.items.map(function (it) { return itemHTML(it, cat, g); }).join("") + "</div></div>";
  }

  // Crossfading photo panel. Used by the feature and split layouts.
  function stackHTML(cat, sizes) {
    var photos = cat.photos || [];
    return '<div class="photo-stack" data-stack>' + photos.map(function (p, i) {
      var d = dims(p);
      // Only the first photo loads up front; the rest load just before they fade in.
      var src = i === 0 ? 'src="' + sm(p) + '" srcset="' + srcset(p) + '"' : 'data-src="' + sm(p) + '" data-srcset="' + srcset(p) + '"';
      return "<img " + src + ' sizes="' + sizes + '" alt="" loading="lazy" width="' + d[0] + '" height="' + d[1] + '"' + (i === 0 ? ' class="is-on"' : "") + ">";
    }).join("") +
      '<button type="button" data-lb-set="' + cat.id + '" data-lb-i="0" aria-label="View ' + esc(cat.title) + ' photos"></button>' +
      (photos.length > 1 ? '<div class="stack-dots" aria-hidden="true">' + photos.map(function (_, i) { return "<span" + (i === 0 ? ' class="is-on"' : "") + "></span>"; }).join("") + "</div>" : "") +
      "</div>";
  }

  function headHTML(cat) {
    return '<header class="cat-head"><h2 id="h-' + cat.id + '">' + esc(cat.title) + "</h2>" +
      (cat.blurb ? "<p>" + esc(cat.blurb) + "</p>" : "") +
      (cat.note ? '<p class="cat-note"><i class="ph ph-info" aria-hidden="true"></i>' + esc(cat.note) + "</p>" : "") + "</header>";
  }

  function nextHTML(i) {
    var next = D.categories[i + 1];
    var link = next
      ? '<a class="cat-next-link" href="#' + next.id + '" data-show="' + next.id + '"><span>Next</span><strong>' + esc(next.title) + '</strong><i class="ph ph-arrow-right" aria-hidden="true"></i></a>'
      : '<a class="cat-next-link" href="grazing.html"><span>Planning an event?</span><strong>Grazing tables</strong><i class="ph ph-arrow-right" aria-hidden="true"></i></a>';
    return '<nav class="cat-next" aria-label="Next category">' + link + "</nav>";
  }

  var featureCount = 0;
  function renderCategory(cat, i) {
    var photos = cat.photos || [];
    LB_SETS[cat.id] = photos.map(function (p) { return { img: p, alt: cat.title }; });
    var groups = cat.groups.map(function (g) { return groupHTML(g, cat); }).join("");
    var open = '<section class="cat lay-' + cat.layout;
    var attrs = ' wrap" id="' + cat.id + '" aria-labelledby="h-' + cat.id + '" hidden>';
    var body;

    if (cat.layout === "feature") {
      var flip = featureCount++ % 2 === 1 ? " flip" : "";
      body = headHTML(cat) + '<div class="cat-body">' + stackHTML(cat, "(min-width: 900px) 40vw, 100vw") + '<div class="cat-groups">' + groups + "</div></div>";
      return open + flip + attrs + body + nextHTML(i) + "</section>";
    }
    if (cat.layout === "custom") {
      // Price-per-kg card with one WhatsApp enquiry, beside a grid of past designs.
      var customKey = cat.id + "--enquiry";
      ITEMS[customKey] = { it: { name: cat.title, kind: "custom" }, cat: cat, group: null };
      var search = [cat.title, cat.blurb, cat.keywords || ""].join(" ").toLowerCase();
      body = headHTML(cat) + '<div class="cat-body">' +
        '<div class="custom-card" data-search="' + esc(search) + '"><p class="custom-price">' + esc(cat.priceText) + '</p><p class="custom-note">' + esc(cat.priceNote) + "</p>" +
        '<ul class="custom-steps"><li><i class="ph ph-image" aria-hidden="true"></i>Send a reference photo or describe your idea</li>' +
        '<li><i class="ph ph-scales" aria-hidden="true"></i>Pick the weight and flavour</li>' +
        '<li><i class="ph ph-check-circle" aria-hidden="true"></i>We confirm the design and final price</li></ul>' +
        '<a class="btn btn-wa act-wa" data-key="' + customKey + '" href="' + waLink(itemMessage(ITEMS[customKey].it, cat)) + '" target="_blank" rel="noopener"><i class="ph-fill ph-whatsapp-logo" aria-hidden="true"></i><span>Enquire on WhatsApp</span></a></div>' +
        '<div class="custom-grid">' + photos.map(function (p, j) {
          return '<button type="button" class="custom-shot" data-lb-set="' + cat.id + '" data-lb-i="' + j + '" aria-label="View customised cake ' + (j + 1) + '"><img src="' + sm(p) + '" alt="" loading="lazy" width="540" height="720"></button>';
        }).join("") + "</div></div>";
      return open + attrs + body + nextHTML(i) + "</section>";
    }
    if (cat.layout === "tiles") {
      var p0 = photos[0], d0 = dims(p0);
      body = headHTML(cat) + '<div class="cat-body"><div class="tiles-photo"><img src="' + sm(p0) + '" srcset="' + srcset(p0) + '" sizes="(min-width: 1000px) 40vw, 100vw" alt="' + esc(cat.title) + '" loading="lazy" width="' + d0[0] + '" height="' + d0[1] + '">' +
        '<button type="button" data-lb-set="' + cat.id + '" data-lb-i="0" aria-label="View ' + esc(cat.title) + ' photos"></button></div>' +
        '<div class="tiles">' + cat.groups[0].items.map(function (it) { return itemHTML(it, cat, cat.groups[0]); }).join("") + "</div></div>";
      return open + attrs + body + nextHTML(i) + "</section>";
    }
    if (cat.layout === "compact") {
      body = '<div class="cat-inner">' + headHTML(cat) + '<div class="compact-band">' + groups + "</div></div>";
      return open + attrs + body + nextHTML(i) + "</section>";
    }
    if (cat.layout === "split") {
      body = headHTML(cat) + '<div class="cat-body"><div class="split-groups">' + groups + "</div>" + stackHTML(cat, "(min-width: 900px) 28vw, 100vw") + "</div>";
      return open + attrs + body + nextHTML(i) + "</section>";
    }
    // gallery: photo strip above two columns of items
    body = headHTML(cat) + '<div class="strip">' + photos.map(function (p, j) {
      var d = dims(p);
      return '<div class="ph-card"><img src="' + sm(p) + '" alt="" loading="lazy" width="' + d[0] + '" height="' + d[1] + '">' +
        '<button type="button" data-lb-set="' + cat.id + '" data-lb-i="' + j + '" aria-label="View ' + esc(cat.title) + " photo " + (j + 1) + '"></button></div>';
    }).join("") + "</div>" + groups;
    return open + attrs + body + nextHTML(i) + "</section>";
  }

  function startStacks(root) {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    $$("[data-stack]", root).forEach(function (stack) {
      if (stack.dataset.ready) return;
      stack.dataset.ready = "1";
      var imgs = $$("img", stack), dots = $$(".stack-dots span", stack), i = 0, timer = null;
      if (imgs.length < 2) return;
      function prime(img) { if (img && img.dataset.src) { img.srcset = img.dataset.srcset; img.src = img.dataset.src; delete img.dataset.src; } }
      prime(imgs[1]);
      function step() {
        imgs[i].classList.remove("is-on"); if (dots[i]) dots[i].classList.remove("is-on");
        i = (i + 1) % imgs.length;
        prime(imgs[i]); prime(imgs[(i + 1) % imgs.length]);
        imgs[i].classList.add("is-on"); if (dots[i]) dots[i].classList.add("is-on");
        var btn = $("button", stack); if (btn) btn.dataset.lbI = i;
      }
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !timer) timer = setInterval(step, 3800);
          else if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
        });
      }).observe(stack);
    });
  }

  function showCat(id, scroll) {
    var cat = D.categories.filter(function (c) { return c.id === id; })[0] || D.categories[0];
    activeCat = cat.id;
    D.categories.forEach(function (c) { document.getElementById(c.id).hidden = c.id !== cat.id; });
    $$("a", catNav).forEach(function (a) {
      var on = a.dataset.cat === cat.id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      if (on) catNav.scrollTo({ left: a.offsetLeft - catNav.clientWidth / 2 + a.offsetWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
    });
    if (scroll) {
      var top = sectionsEl.getBoundingClientRect().top + window.scrollY - $("#menuBar").offsetHeight;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: "auto" });
    }
    try { history.replaceState(null, "", "#" + cat.id); } catch (e) { /* file:// or sandboxed */ }
  }

  if (sectionsEl) {
    sectionsEl.innerHTML = D.categories.map(renderCategory).join("") + '<p class="wrap search-grazing" id="searchGrazing" hidden></p>';
    catNav.innerHTML = D.categories.map(function (c) {
      return '<a href="#' + c.id + '" data-cat="' + c.id + '" data-show="' + c.id + '">' + esc(c.short) + "</a>";
    }).join("") + '<a href="grazing.html" data-cat="grazing">Grazing tables</a>' +
      (DW ? '<a href="festive.html" data-cat="festive" class="cat-festive"><i class="ph-fill ph-sparkle" aria-hidden="true"></i> ' + esc(DW.short) + "</a>" : "");
    startStacks(sectionsEl);
    showCat((location.hash || "").slice(1), false);
    window.addEventListener("hashchange", function () {
      var id = location.hash.slice(1);
      // Only category ids switch the view; skip links and other anchors are left alone.
      if (D.categories.some(function (c) { return c.id === id; })) showCat(id, true);
    });
  }

  // ---------- search (menu page) ----------
  var searchBox = $("#menuSearch");
  if (searchBox) {
    var searchWrap = searchBox.closest(".search");
    var grazingNames = [].concat.apply([], [].concat(D.grazing.savoury, D.grazing.dessert, D.grazing.beverage).map(function (g) { return g.items; }));
    var runSearch = function () {
      var q = searchBox.value.trim().toLowerCase();
      searchWrap.classList.toggle("has-value", q.length > 0);
      sectionsEl.classList.toggle("is-searching", q.length > 0);
      var any = false;
      D.categories.forEach(function (c) {
        var sec = document.getElementById(c.id), secAny = false;
        $$("[data-search]", sec).forEach(function (it) {
          var hit = !q || it.dataset.search.indexOf(q) > -1;
          it.hidden = !hit; if (hit) secAny = true;
        });
        $$(".group", sec).forEach(function (g) { g.hidden = !!q && !$$("[data-search]:not([hidden])", g).length; });
        sec.hidden = q ? !secAny : c.id !== activeCat;
        if (q && secAny) any = true;
      });
      $$("a", catNav).forEach(function (a) { a.classList.toggle("is-active", !q && a.dataset.cat === activeCat); });
      var gHits = q ? grazingNames.filter(function (n) { return n.toLowerCase().indexOf(q) > -1; }) : [];
      var sg = $("#searchGrazing");
      sg.hidden = gHits.length === 0;
      sg.innerHTML = gHits.length ? "Also on our grazing table menu: <strong>" + esc(gHits.slice(0, 4).join(", ")) + (gHits.length > 4 ? " and more" : "") + '</strong>. <a href="grazing.html">Build a table</a>' : "";
      $("#menuEmpty").hidden = any || !q || gHits.length > 0;
      $("#emptyTerm").textContent = searchBox.value.trim();
      $("#emptyAsk").href = waLink("Hi BakeHaus! Do you make " + searchBox.value.trim() + "?\n\n" + dateLine());
      var barH = $("#menuBar").offsetHeight, listTop = sectionsEl.getBoundingClientRect().top;
      if (listTop < barH) window.scrollTo({ top: listTop + window.scrollY - barH - 8, behavior: "auto" });
    };
    searchBox.addEventListener("input", runSearch);
    searchBox.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { searchBox.value = ""; runSearch(); searchBox.blur(); }
    });
    // Picking a category while searching clears the search.
    catNav.addEventListener("click", function () { if (searchBox.value) { searchBox.value = ""; runSearch(); } });
  }

  // =================================================================
  // GRAZING
  // =================================================================
  var G = D.grazing;
  var builder = $("#builder");
  var picks = { savoury: [], dessert: [], beverage: [] };
  var guests = G.minGuests, activeCourse = "savoury";
  var COURSES = [
    { id: "savoury", label: "Savoury", max: G.pick.savoury, groups: G.savoury },
    { id: "dessert", label: "Desserts", max: G.pick.dessert, groups: G.dessert },
    { id: "beverage", label: "Beverage", max: G.pick.beverage, groups: G.beverage }
  ];

  if ($("#gpAmount")) {
    $("#gpAmount").textContent = rupees(G.pricePerHead);
    $("#grazingFacts").innerHTML = [
      ["ph-users-three", "From " + G.minGuests + " guests"],
      ["ph-calendar-check", "1 week notice"],
      ["ph-fork-knife", G.pick.savoury + " savoury · " + G.pick.dessert + " desserts · " + G.pick.beverage + " beverage"]
    ].map(function (f) { return '<li><i class="ph ' + f[0] + '" aria-hidden="true"></i>' + esc(f[1]) + "</li>"; }).join("");
    $("#grazingIncludes").innerHTML = G.includes.map(function (x) { return '<li><i class="ph ph-check" aria-hidden="true"></i>' + esc(x) + "</li>"; }).join("");
  }

  // Photo reel: arrows, swipe (native scroll) and gentle autoplay while visible.
  var reel = $("#grazingReel");
  if (reel) {
    LB_SETS.grazing = G.photos.map(function (p) { return { img: p, alt: "Grazing table" }; });
    reel.innerHTML = G.photos.map(function (p, i) {
      var d = dims(p);
      return '<div class="reel-card"><img src="' + sm(p) + '" alt="" loading="' + (i < 2 ? "eager" : "lazy") + '" width="' + d[0] + '" height="' + d[1] + '"><button type="button" data-lb-set="grazing" data-lb-i="' + i + '" aria-label="View grazing table photo ' + (i + 1) + '"></button></div>';
    }).join("");
    var cards = $$(".reel-card", reel), counter = $("#reelCount");
    var stepW = function () { return cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(reel).columnGap || 12); };
    var atEnd = function () { return reel.scrollLeft + reel.clientWidth >= reel.scrollWidth - 4; };
    var currentIdx = function () { return Math.round(reel.scrollLeft / stepW()); };
    var go = function (dir) {
      if (dir > 0 && atEnd()) reel.scrollTo({ left: 0, behavior: reduceMotion ? "auto" : "smooth" });
      else if (dir < 0 && reel.scrollLeft <= 4) reel.scrollTo({ left: reel.scrollWidth, behavior: reduceMotion ? "auto" : "smooth" });
      else reel.scrollBy({ left: dir * stepW(), behavior: reduceMotion ? "auto" : "smooth" });
      wait(updateCount, 450);
    };
    var updateCount = function () { if (counter) counter.textContent = Math.min(cards.length, currentIdx() + 1) + " / " + cards.length; };
    reel.addEventListener("scroll", updateCount, { passive: true });
    updateCount();
    $("#reelPrev").addEventListener("click", function () { go(-1); pause(8000); });
    $("#reelNext").addEventListener("click", function () { go(1); pause(8000); });
    reel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); pause(8000); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); pause(8000); }
    });

    var pausedUntil = 0, visible = false, hovering = false, userPaused = false;
    function pause(ms) { pausedUntil = Date.now() + ms; }
    function tick() { if (!userPaused && visible && !hovering && Date.now() > pausedUntil && !document.hidden) go(1); }
    var pauseBtn = $("#reelPause");
    if (reduceMotion) pauseBtn.hidden = true;
    pauseBtn.addEventListener("click", function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
      pauseBtn.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
      pauseBtn.innerHTML = '<i class="ph ' + (userPaused ? "ph-play" : "ph-pause") + '" aria-hidden="true"></i>';
    });
    if (!reduceMotion) {
      ["pointerenter", "focusin"].forEach(function (ev) { reel.parentElement.addEventListener(ev, function () { hovering = true; }); });
      ["pointerleave", "focusout"].forEach(function (ev) { reel.parentElement.addEventListener(ev, function () { hovering = false; }); });
      reel.addEventListener("touchstart", function () { pause(10000); }, { passive: true });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.5 }).observe(reel);
      }
      setInterval(tick, 3500);
    }
  }

  function builderMessage() {
    function list(c) { return picks[c].length ? picks[c].join(", ") : "(still deciding)"; }
    return [
      "Hi BakeHaus! I'd like to book a *grazing table*.", "",
      "Guests: " + guests,
      dateLine(),
      "Savoury: " + list("savoury"),
      "Desserts: " + list("dessert"),
      "Beverage: " + list("beverage"),
      "Estimate: " + rupees(guests * G.pricePerHead) + " (" + rupees(G.pricePerHead) + " per person)", ""
    ].concat(eventLines()).concat(["", "Please confirm availability. Thank you!"]).join("\n");
  }
  // Event details typed into the builder; blank fields stay as prompts to fill in on WhatsApp.
  // Kept in memory only (never stored), since they include an address and phone number.
  function eventLines() {
    return $$(".js-event").map(function (inp) {
      var v = inp.value.trim();
      if (v && inp.type === "time") {
        var p = v.split(":"), h = +p[0];
        v = (h % 12 || 12) + ":" + p[1] + " " + (h < 12 ? "AM" : "PM");
      }
      return inp.dataset.label + ": " + v;
    });
  }

  function setCourse(id, focus) {
    activeCourse = id;
    COURSES.forEach(function (c) {
      var tab = $("#tab-" + c.id), on = c.id === id;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
      $("#panel-" + c.id).hidden = !on;
    });
    if (focus) $("#tab-" + id).focus();
  }

  function renderBuilder() {
    if (!builder) return;
    var noteEl = $("#bsNote");
    COURSES.forEach(function (c) {
      $("#count-" + c.id).textContent = picks[c.id].length + "/" + c.max;
      $("#tab-" + c.id).classList.toggle("is-done", picks[c.id].length === c.max);
    });
    $$(".bpanel .chip").forEach(function (ch) {
      ch.setAttribute("aria-pressed", picks[ch.dataset.course].indexOf(ch.dataset.pick) > -1 ? "true" : "false");
    });
    var all = [].concat(picks.savoury, picks.dessert, picks.beverage);
    $("#bsPicks").innerHTML = all.length
      ? all.map(function (p) { return '<span class="pick">' + esc(p) + "</span>"; }).join("")
      : '<span class="pick-empty">Your picks will show up here.</span>';
    $("#guests").value = guests;
    $("#bsTotal").textContent = rupees(guests * G.pricePerHead);
    $("#bsSend").href = waLink(builderMessage());
    var n = daysUntil(state.date);
    if (n !== null && n < G.leadDays) {
      noteEl.className = "bs-note warn";
      noteEl.textContent = "Your date is less than a week away. Grazing tables need 1 week's notice, so we'll confirm if we can make it.";
    } else if (noteEl.dataset.msg) {
      noteEl.className = "bs-note"; noteEl.textContent = noteEl.dataset.msg;
    } else { noteEl.textContent = ""; }
  }

  if (builder) {
    $("#builderTabs").innerHTML = COURSES.map(function (c) {
      return '<button type="button" class="bstep" role="tab" id="tab-' + c.id + '" aria-controls="panel-' + c.id + '" data-course="' + c.id + '">' +
        esc(c.label) + ' <span class="bcount" id="count-' + c.id + '">0/' + c.max + "</span></button>";
    }).join("");
    $("#builderPanels").innerHTML = COURSES.map(function (c) {
      return '<div class="bpanel" role="tabpanel" id="panel-' + c.id + '" aria-labelledby="tab-' + c.id + '">' + c.groups.map(function (g) {
        return '<div class="bgroup">' + (c.groups.length > 1 ? "<h3>" + esc(g.title) + "</h3>" : "") + '<div class="chips">' + g.items.map(function (name) {
          return '<button type="button" class="chip" aria-pressed="false" data-course="' + c.id + '" data-pick="' + esc(name) + '">' + esc(name) + "</button>";
        }).join("") + "</div></div>";
      }).join("") + "</div>";
    }).join("");

    $("#builderTabs").addEventListener("click", function (e) {
      var b = e.target.closest(".bstep"); if (b) setCourse(b.dataset.course);
    });
    $("#builderTabs").addEventListener("keydown", function (e) {
      var i = COURSES.findIndex(function (c) { return c.id === activeCourse; });
      if (e.key === "ArrowRight") { e.preventDefault(); setCourse(COURSES[(i + 1) % COURSES.length].id, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setCourse(COURSES[(i + COURSES.length - 1) % COURSES.length].id, true); }
      if (e.key === "Home") { e.preventDefault(); setCourse(COURSES[0].id, true); }
      if (e.key === "End") { e.preventDefault(); setCourse(COURSES[COURSES.length - 1].id, true); }
    });
    $("#builderPanels").addEventListener("click", function (e) {
      var ch = e.target.closest(".chip"); if (!ch) return;
      var c = COURSES.filter(function (x) { return x.id === ch.dataset.course; })[0];
      var arr = picks[c.id], idx = arr.indexOf(ch.dataset.pick), noteEl = $("#bsNote");
      noteEl.dataset.msg = "";
      if (idx > -1) arr.splice(idx, 1);
      else if (arr.length >= c.max) {
        if (c.max === 1) { arr[0] = ch.dataset.pick; }
        else {
          ch.classList.remove("is-shake"); void ch.offsetWidth; ch.classList.add("is-shake");
          noteEl.dataset.msg = "You've picked " + c.max + " " + c.label.toLowerCase() + ". Tap one to remove it, or ask for extras in your message.";
        }
      } else {
        arr.push(ch.dataset.pick);
        if (arr.length === c.max) {
          var next = COURSES.filter(function (x) { return picks[x.id].length < x.max; })[0];
          // Keyboard users (detail 0) get focus moved to the next tab so it is not lost with the hidden panel.
          var byKey = e.detail === 0;
          if (next) wait(function () { setCourse(next.id, byKey); }, byKey ? 0 : 420);
        }
      }
      renderBuilder();
    });
    var setGuests = function (v) { guests = Math.max(G.minGuests, Math.min(500, parseInt(v, 10) || G.minGuests)); renderBuilder(); };
    $("#guestsMinus").addEventListener("click", function () { setGuests(guests - 1); });
    $("#guestsPlus").addEventListener("click", function () { setGuests(guests + 1); });
    $("#guests").addEventListener("change", function (e) { setGuests(e.target.value); });
    $$(".js-event").forEach(function (inp) { inp.addEventListener("input", function () { $("#bsSend").href = waLink(builderMessage()); }); });
    setCourse("savoury");
  }

  // =================================================================
  // GALLERY
  // =================================================================
  var masonry = $("#masonry");
  if (masonry) {
    var GALLERY = D.gallery.filter(function (g) { return DW || g.cat !== "festive"; });
    if (DW) $("#galleryFilters").insertAdjacentHTML("beforeend", '<button type="button" class="chip" data-filter="festive" aria-pressed="false"><i class="ph-fill ph-sparkle" aria-hidden="true"></i>' + esc(DW.festival) + "</button>");
    LB_SETS.gallery = GALLERY;
    masonry.innerHTML = GALLERY.map(function (g, i) {
      var d = dims(g.img);
      return '<button type="button" class="m-item reveal" data-cat="' + g.cat + '" data-lb-set="gallery" data-lb-i="' + i + '" aria-label="View photo: ' + esc(g.alt) + '">' +
        '<img src="' + sm(g.img) + '" alt="' + esc(g.alt) + '" loading="lazy" width="' + d[0] + '" height="' + d[1] + '"></button>';
    }).join("");
    $("#galleryFilters").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      $$("#galleryFilters .chip").forEach(function (x) { var on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      var f = b.dataset.filter;
      $$(".m-item", masonry).forEach(function (m) { m.hidden = f !== "all" && m.dataset.cat !== f; m.classList.add("is-in"); });
    });
  }

  // =================================================================
  // TRAY (every page)
  // =================================================================
  var trayEl = $("#tray"), sheet = $("#traySheet"), backdrop = $("#sheetBackdrop");

  function trayFind(key) { for (var i = 0; i < state.tray.length; i++) if (state.tray[i].key === key) return i; return -1; }
  function persistTray() { save("local", "bh-tray", state.tray); renderTray(); }

  function addToTray(key) {
    var ref = ITEMS[key]; if (!ref) return;
    var idx = trayFind(key);
    if (idx > -1) {
      state.tray.splice(idx, 1);
      toast("Removed " + ref.it.name);
    } else {
      state.tray.push({ key: key, qty: minQty(key) });
      toast("Added " + ref.it.name);
      var c = $("#trayCount"); c.classList.remove("is-bump"); void c.offsetWidth; c.classList.add("is-bump");
    }
    persistTray();
  }

  function trayTotal() {
    return state.tray.reduce(function (sum, t) { var r = ITEMS[t.key]; return sum + (r && r.it.price ? r.it.price * t.qty : 0); }, 0);
  }

  // Items without a price (festive hampers) are priced on request, so the total says so instead of showing ₹0.
  function hasRequestItems() { return state.tray.some(function (t) { var r = ITEMS[t.key]; return r && r.it.price == null; }); }
  function totalText() {
    var total = trayTotal(), req = hasRequestItems();
    if (!total) return "Price on request";
    return rupees(total) + (req ? " + items on request" : "");
  }
  function hasStartingItems() { return state.tray.some(function (t) { var r = ITEMS[t.key]; return r && r.it.from; }); }
  function totalLabel() { return hasStartingItems() ? "Starting total" : "Total"; }
  function totalLine() { return totalLabel() + ": " + totalText(); }

  function trayMessage() {
    var lines = ["Hi BakeHaus! I'd like to place an order:", ""];
    state.tray.forEach(function (t, i) {
      var r = ITEMS[t.key]; if (!r) return;
      lines.push((i + 1) + ". *" + r.it.name + "* (" + r.cat.short + ")" + (r.it.size ? ", " + r.it.size : "") + " × " + t.qty + " · " + priceLabel(r.it));
      if (r.it.options) lines.push("    Flavour (" + r.it.options.join(" / ") + "):");
    });
    lines.push("", totalLine(), dateLine());
    if (state.tray.some(function (t) { var r = ITEMS[t.key]; return r && kindOf(r.it, r.cat) === "cake"; })) lines.push("Cake details (weight, design, message):");
    var notes = $("#sheetNotes").value.trim();
    if (notes) lines.push("Notes: " + notes);
    lines.push("Pickup or delivery:", "", "Please confirm availability" + (hasStartingItems() || hasRequestItems() ? " and the final price" : "") + ". Thank you!");
    return lines.join("\n");
  }

  function renderTray() {
    // Keep only items that still exist (the menu may have changed since the last visit).
    state.tray = state.tray.filter(function (t) { return ITEMS[t.key]; });
    var count = state.tray.length;
    trayEl.hidden = count === 0;
    document.body.classList.toggle("has-tray", count > 0);
    $("#trayCount").textContent = count;
    $("#trayLabel").textContent = count === 1 ? "item in your order" : "items in your order";
    $$(".act-add").forEach(function (b) {
      var on = trayFind(b.dataset.add) > -1;
      b.classList.toggle("is-added", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = '<i class="ph ' + (on ? "ph-check" : "ph-plus") + '" aria-hidden="true"></i>';
    });
    $("#sheetList").innerHTML = state.tray.map(function (t) {
      var r = ITEMS[t.key], min = minQty(t.key);
      var meta = [r.cat.title, r.it.size, priceLabel(r.it)].filter(Boolean).join(" · ");
      return '<li><span class="sl-name">' + esc(r.it.name) + '</span><span class="sl-meta">' + esc(meta) + "</span>" +
        '<div class="sl-ctrl"><div class="stepper" role="group" aria-label="Quantity of ' + esc(r.it.name) + '">' +
        '<button type="button" class="step-btn" data-qty="-1" data-key="' + t.key + '" aria-label="Less"><i class="ph ph-minus" aria-hidden="true"></i></button>' +
        '<input type="number" inputmode="numeric" min="' + min + '" value="' + t.qty + '" data-qty-input="' + t.key + '" aria-label="Quantity">' +
        '<button type="button" class="step-btn" data-qty="1" data-key="' + t.key + '" aria-label="More"><i class="ph ph-plus" aria-hidden="true"></i></button></div>' +
        '<button type="button" class="sl-remove" data-remove="' + t.key + '" aria-label="Remove ' + esc(r.it.name) + '"><i class="ph ph-trash" aria-hidden="true"></i></button></div></li>';
    }).join("");
    $("#sheetTotal").textContent = totalText(); $("#sheetTotalLabel").textContent = totalLabel();
    $("#sheetSend").href = waLink(trayMessage());
    if (count === 0 && !sheet.hidden) closeSheet();
  }

  // While a dialog is open, the page behind it is inert (not focusable or readable by screen readers).
  function setInert(on) {
    ["#siteHeader", "main", "#siteFooter", "#tray"].forEach(function (s) { var el = $(s); if (el) el.inert = on; });
  }

  var lastFocus = null;
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = false; backdrop.hidden = false; setInert(true);
    $("#trayOpen").setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    $("#trayClose").focus();
  }
  function closeSheet() {
    sheet.hidden = true; backdrop.hidden = true; setInert(false);
    $("#trayOpen").setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    // If the tray emptied, its button is gone: return focus to the page heading instead.
    var back = lastFocus && lastFocus.offsetParent !== null ? lastFocus : $("main h1");
    if (back && back.focus) back.focus();
  }

  // Keep the order in sync if the site is open in more than one tab.
  window.addEventListener("storage", function (e) { if (e.key === "bh-tray") { state.tray = load("local", "bh-tray", []); renderTray(); } });
  $("#trayOpen").addEventListener("click", openSheet);
  $("#trayClose").addEventListener("click", closeSheet);
  backdrop.addEventListener("click", closeSheet);
  $("#sheetNotes").addEventListener("input", function () { $("#sheetSend").href = waLink(trayMessage()); });
  sheet.addEventListener("click", function (e) {
    var q = e.target.closest("[data-qty]"), rm = e.target.closest("[data-remove]");
    if (q) {
      var i = trayFind(q.dataset.key);
      state.tray[i].qty = Math.max(minQty(q.dataset.key), state.tray[i].qty + Number(q.dataset.qty));
      persistTray();
      var btn = sheet.querySelector('[data-key="' + q.dataset.key + '"][data-qty="' + q.dataset.qty + '"]'); if (btn) btn.focus();
    } else if (rm) {
      state.tray.splice(trayFind(rm.dataset.remove), 1); persistTray();
      var first = sheet.querySelector(".sl-remove") || $("#trayClose"); if (!sheet.hidden) first.focus();
    }
  });
  sheet.addEventListener("change", function (e) {
    var k = e.target.dataset && e.target.dataset.qtyInput; if (!k) return;
    // Update in place (no re-render) so keyboard focus stays where the user tabbed to.
    var i = trayFind(k);
    state.tray[i].qty = Math.max(minQty(k), parseInt(e.target.value, 10) || minQty(k));
    e.target.value = state.tray[i].qty;
    save("local", "bh-tray", state.tray);
    $("#sheetTotal").textContent = totalText(); $("#sheetTotalLabel").textContent = totalLabel();
    $("#sheetSend").href = waLink(trayMessage());
  });

  // =================================================================
  // DATE PLANNER (menu page, grazing builder and order sheet share one date)
  // =================================================================
  var statusEl = $("#plannerStatus");
  // Date boxes show "Tue 13 Oct 2026" whatever the device locale, so Indian and US visitors read the same date.
  // The native input stays underneath (calendar picker, keyboard, accessibility); only its text is hidden.
  $$(".js-date").forEach(function (inp) {
    inp.min = todayISO();
    var wrap = document.createElement("span");
    wrap.className = "date-wrap";
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(inp);
    wrap.insertAdjacentHTML("beforeend", '<span class="date-display" aria-hidden="true"></span>');
    inp.addEventListener("change", function () { setDate(inp.value); });
    inp.addEventListener("input", showDates);
    inp.addEventListener("click", function () { try { if (inp.showPicker) inp.showPicker(); } catch (e) { /* not supported */ } });
  });
  function showDates() {
    $$(".js-date").forEach(function (inp) {
      var disp = inp.parentNode.querySelector(".date-display");
      if (!disp) return;
      disp.textContent = inp.value ? prettyDate(inp.value) : "Select a date";
      disp.classList.toggle("is-empty", !inp.value);
    });
  }

  function renderDate() {
    if (state.date && daysUntil(state.date) < 0) { state.date = ""; save("session", "bh-date", ""); }
    $$(".js-date").forEach(function (inp) { inp.value = state.date || ""; });
    showDates();
    if (statusEl) {
      var n = daysUntil(state.date), msg = "", cls = "";
      if (n === null) msg = "";
      else if (n < D.defaultLeadDays) { cls = "warn"; msg = "That's short notice. Most bakes need " + D.defaultLeadDays + " days, but message us and we'll check what's possible."; }
      else if (n < G.leadDays) { cls = "ok"; msg = "Good for cakes, cookies and desserts. Grazing tables need 1 week, so check with us first."; }
      else { cls = "ok"; msg = "Plenty of time for anything on the menu, grazing tables included."; }
      statusEl.className = "planner-status " + cls;
      statusEl.innerHTML = msg ? '<i class="ph ' + (cls === "warn" ? "ph-warning-circle" : "ph-check-circle") + '" aria-hidden="true"></i><span>' + esc(msg) + "</span>" : "";
    }
    $$('[data-wa="general"]').forEach(function (a) { a.href = waLink(generalMessage()); });
    $$(".act-wa").forEach(function (a) { var ref = ITEMS[a.dataset.key]; if (ref) a.href = waLink(itemMessage(ref.it, ref.cat)); });
    renderTray();
    renderBuilder();
  }
  function setDate(v) { state.date = v || ""; save("session", "bh-date", state.date); renderDate(); }

  // =================================================================
  // LIGHTBOX
  // =================================================================
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbList = [], lbIdx = 0, lbReturn = null;
  function lbVisible() {
    if (lbList !== LB_SETS.gallery || !masonry) return lbList;
    return lbList.filter(function (g, i) { var el = masonry.children[i]; return el && !el.hidden; });
  }
  function lbShow() {
    var list = lbVisible(), item = list[lbIdx];
    lbImg.src = lg(item.img); lbImg.alt = item.alt || "";
    lbCap.textContent = (item.alt || "") + "  " + (lbIdx + 1) + " / " + list.length;
    $("#lbPrev").hidden = $("#lbNext").hidden = list.length < 2;
  }
  function lbOpen(list, idx) {
    lbReturn = document.activeElement; lbList = list;
    var vis = lbVisible(); lbIdx = Math.max(0, vis.indexOf(list[idx]));
    lb.hidden = false; setInert(true); document.body.style.overflow = "hidden"; lbShow(); $("#lbClose").focus();
  }
  function lbClose() { lb.hidden = true; setInert(false); document.body.style.overflow = ""; lbImg.removeAttribute("src"); if (lbReturn) lbReturn.focus(); }
  function lbStep(d) { var n = lbVisible().length; lbIdx = (lbIdx + d + n) % n; lbShow(); }
  $("#lbClose").addEventListener("click", lbClose);
  $("#lbPrev").addEventListener("click", function () { lbStep(-1); });
  $("#lbNext").addEventListener("click", function () { lbStep(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lbClose(); });
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return; var dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
  });

  // ---------- global clicks + keys ----------
  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add]");
    if (add) { addToTray(add.dataset.add); return; }
    var show = e.target.closest("[data-show]");
    if (show && sectionsEl) { e.preventDefault(); showCat(show.dataset.show, true); return; }
    var set = e.target.closest("[data-lb-set]");
    if (set) { lbOpen(LB_SETS[set.dataset.lbSet], Number(set.dataset.lbI) || 0); return; }
    var one = e.target.closest("[data-lb]");
    if (one) { lbOpen([{ img: one.dataset.lb, alt: one.dataset.lbAlt }], 0); }
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.hidden) {
      if (e.key === "Escape") lbClose();
      else if (e.key === "ArrowRight") lbStep(1);
      else if (e.key === "ArrowLeft") lbStep(-1);
      else if (e.key === "Tab") trap(e, lb);
    } else if (!sheet.hidden) {
      if (e.key === "Escape") closeSheet();
      else if (e.key === "Tab") trap(e, sheet);
    }
  });
  function trap(e, root) {
    var f = $$("button:not([hidden]), a[href], input, textarea", root).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ---------- scroll states (IntersectionObserver only) ----------
  if ("IntersectionObserver" in window) {
    var topSentinel = document.createElement("div");
    topSentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;";
    document.body.prepend(topSentinel);
    new IntersectionObserver(function (es) { doc.classList.toggle("is-scrolled", !es[0].isIntersecting); }).observe(topSentinel);

    if (sectionsEl) {
      // Hide the header while browsing the menu list: the category bar takes its place.
      new IntersectionObserver(function (es) {
        doc.classList.toggle("in-menu", es[0].isIntersecting);
      }, { rootMargin: "0px 0px -98% 0px" }).observe(sectionsEl);
    }

    var rev = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); rev.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { rev.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  // ---------- horizontal rows: mouse drag, wheel and edge arrows ----------
  // Touch screens already swipe natively; this gives mouse users the same.
  function dragScroll(el) {
    var down = false, startX = 0, startLeft = 0, moved = false;
    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; el.classList.add("is-dragging"); }
      if (moved) { el.scrollLeft = startLeft - dx; e.preventDefault(); }
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      el.classList.remove("is-dragging");
    });
    // A drag should not also count as a click on the chip under the cursor.
    el.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    el.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  function wheelScroll(el) {
    el.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      var atStart = el.scrollLeft <= 0 && e.deltaY < 0, atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // let the page scroll once the row is at its end
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  function edgeArrows(el) {
    var wrap = document.createElement("div");
    wrap.className = "hscroll";
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    wrap.insertAdjacentHTML("afterbegin", '<button type="button" class="hs-btn hs-prev" tabindex="-1" aria-hidden="true"><i class="ph ph-caret-left"></i></button>');
    wrap.insertAdjacentHTML("beforeend", '<button type="button" class="hs-btn hs-next" tabindex="-1" aria-hidden="true"><i class="ph ph-caret-right"></i></button>');
    function update() {
      var max = el.scrollWidth - el.clientWidth;
      wrap.classList.toggle("can-prev", el.scrollLeft > 2);
      wrap.classList.toggle("can-next", el.scrollLeft < max - 2);
    }
    $(".hs-prev", wrap).addEventListener("click", function () { el.scrollBy({ left: -el.clientWidth * 0.7, behavior: reduceMotion ? "auto" : "smooth" }); wait(update, 400); });
    $(".hs-next", wrap).addEventListener("click", function () { el.scrollBy({ left: el.clientWidth * 0.7, behavior: reduceMotion ? "auto" : "smooth" }); wait(update, 400); });
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update(); wait(update, 600);
  }

  if (catNav) { dragScroll(catNav); wheelScroll(catNav); edgeArrows(catNav); }
  $$(".builder-steps, .picks, .teaser, .grazing-reel").forEach(dragScroll);

  // ---------- misc ----------
  var copyBtn = $("#copyUpi");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var id = D.upi;
      if (navigator.clipboard) navigator.clipboard.writeText(id).then(function () { toast("UPI ID copied"); }, function () { toast(id); });
      else toast(id);
    });
  }

  renderDate();
})();
