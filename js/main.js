/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'panificio-betlemme-san-vito',
    /* nessun WhatsApp pubblicato: solo il telefono */
    whatsapp: { number: '', message: '', ids: [] },
    /* pannello Google (30/9/2026): lunedì–venerdì 7–19, sabato 7–17, domenica chiuso */
    hours: {
      0: [], 1: [['07:00', '19:00']], 2: [['07:00', '19:00']], 3: [['07:00', '19:00']],
      4: [['07:00', '19:00']], 5: [['07:00', '19:00']], 6: [['07:00', '17:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Panificio Betlemme: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.focacce": "Focaccia",
      "n.banco": "The counter",
      "n.negozio": "The shop",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Bakery · Via San Vito 5, corner of Via Celestino IV, Milan",
      "h.titolo": "Our delicious little focaccias and mini pizzas.",
      "h.testo": "The bakery on Via San Vito, between Via Torino and the Carrobbio: bread, focaccia by the slice, mini pizzas and baked sweets, made here. Monday to Friday from 7 am to 7 pm, Saturday from 7 am to 5 pm.",
      "h.chi": "Alessandro Laghezza, in a review on Google (in Italian: «this honest bakery, the last of the “neighbourhood shops”»)",
      "h.google": "on Google, 264 reviews",
      "p.titolo": "The peel in the deck oven",
      "p.desc": "The deck oven seen from the side, in cross-section. In the middle deck the door lifts, the wooden peel goes in with the raw tray, leaves it on the stone and comes out; the door closes, the heating elements glow and the dough rises and turns golden; then the peel pulls it out and the steam rises. In the other decks, the sesame loaves and the tin loaves, as in their photo. On the wall, their red sign. Three products from their photos: Genoese focaccia, mini pizzas, the ciabatta.",
      "p.d0": "Genoese focaccia: the first on their sign of focaccias.",
      "p.d1": "Mini pizzas, on the black tray: among the most mentioned in the reviews.",
      "p.d2": "The ciabatta, dusted with flour: a photo from their Instagram.",
      "p.modi": "What to bake",
      "p.b0": "Genoese focaccia",
      "p.b1": "Mini pizzas",
      "p.b2": "The ciabatta",
      "p.nota": "We drew the deck oven from their photo taken inside the oven; the three products come from their sign and their Instagram.",
      "f.etichetta": "Focaccia",
      "f.titolo": "The ones on the red sign, and the others",
      "f.sul": "On the sign on the pillar",
      "f.mignon": "Little focaccias and mini pizzas",
      "f.ig": "On their Instagram",
      "f.pelato": "Focaccia with tomato, anchovies, black olives and garlic",
      "f.patate": "Focaccia with potatoes and scamorza",
      "f.verdure": "Focaccia with grilled vegetables and balsamic glaze",
      "f.piede": "«carefully selected, guaranteed ingredients»",
      "a.vetrina": "The focaccia display: with cherry tomatoes and basil, and the Genoese one with its dimples.",
      "k.vetrina": "The focaccia display, in a customer's photo.",
      "a.pizzette": "Mini pizzas in the black tray.",
      "k.pizzette": "«Pizzette» (mini pizzas).",
      "a.pelato": "Focaccia with tomato, anchovies and black olives.",
      "k.pelato": "With tomato, anchovies and black olives.",
      "a.verdure": "Focaccia with grilled vegetables and balsamic glaze.",
      "k.verdure": "With grilled vegetables.",
      "a.pizzette2": "Mini pizzas on the black tray, at the counter.",
      "k.pizzette2": "At the counter, in a customer's photo.",
      "f.nota": "The reviews also mention the focaccia with onions, with cherry tomatoes, the Valdostana, the five-cheese one, the Altamura one, the parigina. The counter changes from day to day: to know what is on, give them a call.",
      "b.etichetta": "The counter",
      "b.titolo": "Bread on the shelves, sweets below",
      "b.sotto": "One box for each thing, with the names they write themselves. The photos are theirs, from their Instagram and their Facebook page: the counter changes with the days and the seasons.",
      "a.ciabatta": "Ciabatta loaves dusted with flour on the rack.",
      "c.ciabatta": "The ciabatta",
      "a.baguette": "Baguettes in the perforated tray.",
      "a.meino": "Pan meino with icing sugar.",
      "a.forno": "Inside the deck oven: the sesame loaves and the tin loaves.",
      "c.forno": "Tin loaves, in the oven",
      "a.trecce": "Ricotta and chocolate braids.",
      "c.trecce": "Ricotta and chocolate braids",
      "a.sbrisolona": "Sbrisolona in round tins.",
      "a.crostata": "The fresh fruit tart.",
      "c.crostata": "Fruit tart",
      "a.crostatine": "Little tarts in their tins, just out of the oven.",
      "c.crostatine": "«Just out of the oven»",
      "a.millefoglie": "Millefoglie squares.",
      "c.millefoglie": "Our «millefoglie»",
      "a.esse": "S-shaped biscuits in the tray.",
      "c.esse": "Our «esse» biscuits",
      "a.nonna": "The torta della nonna.",
      "c.nonna": "Torta della nonna",
      "a.cannoli": "Cannoli.",
      "c.cannoli": "Cannoli",
      "a.natale": "Panettoni and pandori wrapped with ribbon and the oval «Panificio Betlemme» label.",
      "n2.titolo": "At Christmas",
      "n2.testo": "«Panettoni, pandori and veneziane», wrapped with the bakery's oval label, and struffoli in cellophane with red ribbons.",
      "a.struffoli": "Struffoli in cellophane with red ribbons.",
      "g.etichetta": "The shop",
      "g.titolo": "Under the red sign, on the corner",
      "a.porta": "The door under the arch with the red «Rizzardi Zerbino» sign and the red boards at the sides.",
      "k.porta": "The door under the sign, in one of their photos.",
      "g.testo": "On the corner of Via San Vito and Via Celestino IV, a short walk from Via Torino and the Carrobbio: the door under the arch with the red «Rizzardi Zerbino» sign, the wood and marble counter with the focaccia by the slice, and the deck oven behind it.",
      "g.casa": "in Hebrew means «house of bread».",
      "a.banco": "The wood and marble counter with focaccia by the slice, the breadstick baskets, bread on the shelves and the deck oven behind.",
      "k.banco": "The counter, in a customer's photo (the price boards are blurred).",
      "d.etichetta": "Reviews",
      "d.titolo": "Wrapped in the checked paper",
      "d.google": "on Google, 264 reviews",
      "d.g4m": "Google, 4 months ago",
      "d.g5m": "Google, 5 months ago",
      "d.g11m": "Google, 11 months ago",
      "d.g2a": "Google, 2 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […]. The line at the top also comes from a review on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "From 7 in the morning, closed on Sunday",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.chiuso": "Closed",
      "o.nota": "Hours from their Google listing (September 2026). Some guides give 7:30 pm as closing time and a break on Saturday: if in doubt, give them a call.",
      "o.mappa": "Map: Panificio Betlemme, Via San Vito 5, Milan",
      "o.dove": "Where",
      "o.dovev": "Via San Vito 5, corner of Via Celestino IV, 20123 Milan: between Via Torino and the Carrobbio",
      "o.tram": "By tram",
      "o.tramv": "3, Carrobbio and Via Torino / Via Santa Maria Valle stops, about 120–150 metres away",
      "o.metro": "By metro",
      "o.metrov": "M4 Vetra, about 260 metres away; M3 Missori, about 510",
      "o.bus": "By bus",
      "o.busv": "96 and 97, Colonne di San Lorenzo stop, about 280 metres away",
      "o.tel": "Phone",
      "o.social": "Social",
      "q.etichetta": "Questions",
      "q.titolo": "Before you drop by",
      "q.1": "Are you open on Sunday?",
      "q.1r": "No, the bakery is closed on Sunday. Monday to Friday it is open from 7 am to 7 pm, Saturday from 7 am to 5 pm (hours from their Google listing).",
      "q.2": "What is most popular?",
      "q.2r": "The little focaccias and the mini pizzas, as their sign says, and the focaccia by the slice: the reviews keep mentioning the Genoese one, the one with onions, with cherry tomatoes, the Valdostana, the five-cheese one, the Altamura one.",
      "q.3": "Do they make sweets too?",
      "q.3r": "Yes: on their pages there are ricotta and chocolate braids, sbrisolona, tarts, millefoglie, «esse» biscuits, torta della nonna, cannoli; at Christmas panettoni, pandori, veneziane and struffoli.",
      "q.4": "Can I order for a lunch or a party?",
      "q.4r": "For orders and large quantities, ask them on the phone, on 389 787 5575.",
      "q.5": "How do I get there?",
      "q.5r": "On foot from Via Torino in a couple of minutes; tram 3 to the Carrobbio and Via Torino stops, M4 Vetra about 260 metres away, M3 Missori about 510.",
      "f2.orario": "Monday–Friday 7 am–7 pm · Saturday 7 am–5 pm · closed on Sunday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos come from their Instagram and Facebook pages and from Google reviews; hours and reviews from their Google listing (September 2026). We drew the deck oven ourselves, from their photo.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PANIFICIO BETLEMME — Via San Vito 5 ══════════
     la FIRMA — «la pala nel forno a piani»: il forno visto di fianco. La porta si alza, la pala entra con la teglia cruda, la lascia
     sulla pietra ed esce; la porta si chiude, le resistenze si accendono, l'impasto lievita e si dora; la porta si riapre, la pala lo
     tira fuori e sale il vapore. Lo stato è M (il prodotto), T (0…1) e V (0 al suo posto; fino a 1 la pala col prodotto sfornato scivola
     via a destra; da −1 a 0 arriva quella col prodotto nuovo, crudo). Senza JS e alla fine: focaccia genovese, T = 1, V = 0 (l'HTML).
     L'attesa (classe nell'head): la teglia cruda sulla pala, le resistenze spente. Reduced-motion: tutto subito. rAF a tempo, guardia
     1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[640,470],"centro":160,"base":250,"fuori":330,"via":360,"s0":0.45,"porta":{"x":323,"y":104,"aperta":-100},"fasi":{"apre":{"t":0,"d":0.06},"entra":{"t":0.04,"d":0.16},"lascia":{"t":0.2,"d":0.1},"chiude":{"t":0.3,"d":0.05},"cuoce":{"t":0.35,"d":0.43},"riapre":{"t":0.78,"d":0.05},"rientra":{"t":0.81,"d":0.06},"sforna":{"t":0.87,"d":0.08},"richiude":{"t":0.93,"d":0.05},"vapore":{"t":0.9,"d":0.1}},"tempi":{"inizio":300,"infornata":5200,"servi":420,"arriva":460,"infornataV":4400},"prodotti":[{"nome":"Focaccia genovese"},{"nome":"Pizzette mignon"},{"nome":"La ciabatta"}]};
  /* la pala nel forno a (M, T, V) — una sola fonte: la usa main.js (via pbt_main.cjs) e la prova (firma-prova.mjs).
     T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS .firma-attesa). */
  function creaForno(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r2 = function (n) { return Math.round(n * 100) / 100; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var porta = svg.querySelector('.porta'), pala = svg.querySelector('.pala'), calore = svg.querySelector('.calore');
    var P = D.prodotti.map(function (_, m) {
      var g = svg.querySelector('.prodotto[data-m="' + m + '"]');
      return g ? { g: g, lievito: g.querySelector('.lievito'), cotto: g.querySelector('.cotto'), vapore: g.querySelector('.vapore'), fili: [].slice.call(g.querySelectorAll('.vapore > path')) } : null;
    });
    function disegna(m, t, v) {
      var F = D.fasi, q = P[m];
      /* la porta: si alza per infornare, si chiude, si rialza per sfornare, si richiude */
      var a = dolce(fase(t, F.apre)) - dolce(fase(t, F.chiude)) + dolce(fase(t, F.riapre)) - dolce(fase(t, F.richiude));
      porta.setAttribute('transform', 'rotate(' + r2(D.porta.aperta * a) + ' ' + D.porta.x + ' ' + D.porta.y + ')');
      /* la pala e il prodotto: entrano insieme, la pala esce da sola, rientra, escono insieme */
      var px, qx;
      if (t < F.lascia.t) { px = D.fuori * (1 - dolce(fase(t, F.entra))); qx = px; }
      else if (t < F.rientra.t) { px = D.fuori * dolce(fase(t, F.lascia)); qx = 0; }
      else if (t < F.sforna.t) { px = D.fuori * (1 - dolce(fase(t, F.rientra))); qx = 0; }
      else { px = D.fuori * dolce(fase(t, F.sforna)); qx = px; }
      /* col V la pala (e il prodotto che porta) scivola ancora a destra */
      var extra = D.via * Math.abs(v);
      pala.setAttribute('transform', 'translate(' + r2(px + extra) + ' 0)');
      q.g.setAttribute('transform', 'translate(' + r2(D.centro + qx + (qx > 0 ? extra : 0)) + ' ' + D.base + ')');
      q.g.setAttribute('opacity', String(v > 0 ? r3(1 - v) : 1));
      /* la cottura: le resistenze si accendono presto, l'impasto lievita e si dora */
      var k = fase(t, F.cuoce);
      calore.setAttribute('opacity', String(r3(Math.min(1, k * 3))));
      q.lievito.setAttribute('transform', 'scale(1 ' + r3(D.s0 + (1 - D.s0) * dolce(k)) + ')');
      q.cotto.setAttribute('opacity', String(r3(k)));
      /* il vapore sale dal prodotto sfornato */
      var pv = fase(t, F.vapore);
      q.vapore.setAttribute('opacity', String(r3(pv)));
      q.fili.forEach(function (f) { f.setAttribute('stroke-dashoffset', String(r3(1 - pv))); });
    }
    var completo = !!porta && !!pala && !!calore && P.length === D.prodotti.length && P.every(function (q) { return q && q.lievito && q.cotto && q.vapore && q.fili.length === 3; });
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('fornata-firma'), svgF = prendi('fornoSvg'), leggiF = prendi('fornoLeggi');
  var FORNO = svgF ? creaForno(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.fornata__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.fornata__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    FORNO.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* i prodotti nascosti tornano come nell'HTML (#257) */
    DATI.prodotti.forEach(function (_, k) { if (k !== destinazioneF.m) FORNO.disegna(k, 1, 0); });
    FORNO.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la teglia cruda sulla pala */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la teglia cruda sulla pala */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.infornata, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.infornata });
  }
  /* il gesto: scegliere cosa infornare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è, la pala scivola
     via, arriva quella col prodotto nuovo e si inforna da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.infornataV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && FORNO && FORNO.completo && BOTTONI.length === DATI.prodotti.length) {
    try { clearTimeout(window.__attesaForno); } catch (e) {}
    window.__forno = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__forno.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la teglia cruda sulla pala */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__forno.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
