/* Live El Clásico odds from Polymarket (public Gamma API, no key needed).
   Fills <div id="live-odds"> on the home page. Fails quietly if nothing is found. */
(function () {
  var root = document.getElementById('live-odds');
  if (!root) return;

  // OPTIONAL: paste the exact Polymarket event slug here for the most reliable result,
  // e.g. 'la-liga-barcelona-vs-real-madrid-2026-10-25'. Leave '' to auto-search.
  var CFG = window.ODDS_CONFIG || {};
  var EVENT_SLUG = CFG.slug || '';
  var API = 'https://gamma-api.polymarket.com';
  var REFRESH_MS = 30000;
  var REF = CFG.ref || 'tothewin';

  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var T = {
    en: { barca: 'Barcelona', draw: 'Draw', madrid: 'Real Madrid', updated: 'Updated', vol: 'Volume', via: 'Live market odds via Polymarket', unavailable: 'Live odds are unavailable right now.', view: 'View on Polymarket →', more: 'More odds →', note: 'Market-implied probabilities, not betting advice. The Polymarket link is a referral link.' },
    es: { barca: 'Barcelona', draw: 'Empate', madrid: 'Real Madrid', updated: 'Actualizado', vol: 'Volumen', via: 'Cuotas en vivo de Polymarket', unavailable: 'Las cuotas en vivo no están disponibles ahora.', view: 'Ver en Polymarket →', more: 'Más cuotas →', note: 'Probabilidades implícitas del mercado, no es un consejo de apuestas. El enlace a Polymarket es un enlace de referido.' },
    fr: { barca: 'Barcelone', draw: 'Nul', madrid: 'Real Madrid', updated: 'Mis à jour', vol: 'Volume', via: 'Cotes en direct via Polymarket', unavailable: 'Les cotes en direct sont indisponibles pour le moment.', view: 'Voir sur Polymarket →', more: 'Plus de cotes →', note: 'Probabilités implicites du marché, pas un conseil de pari. Le lien Polymarket est un lien de parrainage.' },
    ar: { barca: 'برشلونة', draw: 'تعادل', madrid: 'ريال مدريد', updated: 'آخر تحديث', vol: 'حجم التداول', via: 'احتمالات مباشرة من Polymarket', unavailable: 'الاحتمالات المباشرة غير متاحة حالياً.', view: 'عرض على Polymarket ←', more: 'المزيد من الاحتمالات ←', note: 'احتمالات مستنتجة من السوق وليست نصيحة مراهنة. رابط Polymarket هو رابط إحالة.' }
  }[lang] || null;
  if (!T) T = { barca: 'Barcelona', draw: 'Draw', madrid: 'Real Madrid', updated: 'Updated', vol: 'Volume', via: 'Live market odds via Polymarket', unavailable: 'Live odds are unavailable right now.', view: 'View on Polymarket →', more: 'More odds →', note: 'Market-implied probabilities, not betting advice. The Polymarket link is a referral link.' };

  function parseJSON(v) { if (Array.isArray(v)) return v; try { return JSON.parse(v); } catch (e) { return []; } }
  function has(s, re) { return re.test((s || '').toLowerCase()); }
  var RE_BARCA = /barcelona|barça|barca/, RE_MADRID = /real madrid|madrid/, RE_DRAW = /draw/;

  function yesPrice(m) {
    var outs = parseJSON(m.outcomes), px = parseJSON(m.outcomePrices);
    var i = outs.map(function (o) { return String(o).toLowerCase(); }).indexOf('yes');
    var p = parseFloat(px[i >= 0 ? i : 0]);
    return isNaN(p) ? null : p;
  }

  // Is this the plain full-time winner/draw market (not halves, goals, corners...)?
  var RE_OTHER = /half|1h|2h|45|corner|score|goal|spread|total|o\/u|over|under|margin| by \d|first|exact/;
  function isMain(m, strict) {
    var t = ((m.question || '') + ' ' + (m.groupItemTitle || '')).toLowerCase();
    if (strict) return (m.sportsMarketType || '') === 'moneyline';
    return !RE_OTHER.test(t);
  }

  // Turn an event into {barca, draw, madrid, volume} (probabilities 0..1)
  function extractWith(ev, strict) {
    var r = { barca: null, draw: null, madrid: null, volume: 0 };
    (ev.markets || []).forEach(function (m) {
      if (m.closed || m.active === false || !isMain(m, strict)) return;
      var txt = (m.groupItemTitle || '') + ' ' + (m.question || '');
      var p = yesPrice(m);
      if (p === null) return;
      if (has(txt, RE_DRAW)) r.draw = p;
      else if (has(txt, RE_BARCA) && !has(txt, RE_MADRID)) r.barca = p;
      else if (has(txt, RE_MADRID) && !has(txt, RE_BARCA)) r.madrid = p;
      r.volume += parseFloat(m.volume) || 0;
    });
    return (r.barca !== null && r.madrid !== null) ? r : null;
  }
  function extract(ev) { return extractWith(ev, true) || extractWith(ev, false); }

  function findEvent() {
    if (EVENT_SLUG) {
      return fetch(API + '/events/slug/' + encodeURIComponent(EVENT_SLUG)).then(function (r) { return r.json(); })
        .then(function (ev) { return ev && ev.markets ? ev : null; });
    }
    var url = API + '/public-search?q=' + encodeURIComponent('Barcelona Real Madrid') + '&events_status=active&limit_per_type=20';
    return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var now = Date.now();
      var evs = (data.events || []).filter(function (e) {
        var t = (e.title || '') + ' ' + (e.slug || '');
        return !e.closed && has(t, RE_BARCA) && has(t, RE_MADRID) && extract(e) && e.markets.some(function (m) { return has((m.groupItemTitle || '') + (m.question || ''), RE_DRAW); });
      });
      // soonest upcoming first
      evs.sort(function (a, b) {
        var da = new Date(a.endDate || a.startDate || 0).getTime(), db = new Date(b.endDate || b.startDate || 0).getTime();
        var fa = da >= now - 864e5 ? da : Infinity, fb = db >= now - 864e5 ? db : Infinity;
        return fa - fb;
      });
      return evs[0] || null;
    });
  }

  var currentSlug = null;
  function pct(p) { return p === null ? '–' : Math.round(p * 100) + '%'; }
  function dec(p) { return p && p > 0.01 ? (1 / p).toFixed(2) : '–'; }

  function cell(cls, label, p) {
    var w = p === null ? 0 : Math.round(p * 100);
    return '<div class="odds-cell ' + cls + '"><div class="odds-label">' + label + '</div>' +
      '<div class="odds-pct">' + pct(p) + '</div>' +
      '<div class="odds-dec">' + dec(p) + '</div>' +
      '<div class="odds-bar"><span style="width:' + w + '%"></span></div></div>';
  }

  function render(ev, o) {
    currentSlug = ev.slug;
    var time = new Date().toLocaleTimeString(document.documentElement.lang || undefined, { hour: '2-digit', minute: '2-digit' });
    var vol = o.volume > 0 ? ' · ' + T.vol + ' $' + Math.round(o.volume).toLocaleString('en-US') : '';
    root.innerHTML =
      '<div class="odds-grid">' + cell('barca', T.barca, o.barca) + cell('draw', T.draw, o.draw) + cell('madrid', T.madrid, o.madrid) + '</div>' +
      '<div class="odds-foot"><span class="odds-live"><i></i>' + T.via + '</span>' +
      '<span>' + T.updated + ' ' + time + vol + '</span>' +
      '<a href="odds.html" class="odds-more">' + T.more + '</a>' +
      '<a href="https://polymarket.com/event/' + encodeURIComponent(ev.slug) + '?r=' + REF + '" target="_blank" rel="noopener sponsored">' + T.view + '</a></div>' +
      '<p class="odds-note">' + T.note + '</p>';
    root.hidden = false;
  }

  function fail() {
    if (!currentSlug) { root.innerHTML = '<p class="odds-note">' + T.unavailable + '</p>'; root.hidden = false; }
  }

  function load() {
    findEvent().then(function (ev) {
      var o = ev && extract(ev);
      if (o) render(ev, o); else fail();
    }).catch(fail);
  }

  load();
  setInterval(function () { if (!document.hidden) load(); }, REFRESH_MS);
})();
