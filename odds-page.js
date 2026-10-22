/* Full odds page: match result, both teams to score, total goals, exact score.
   Reads one Polymarket event (public Gamma API). Hides any market that is missing or too thin. */
(function () {
  var CFG = window.ODDS_CONFIG || {};
  var SLUG = CFG.slug, REF = CFG.ref || 'tothewin', MIN_VOL = CFG.minVol == null ? 500 : CFG.minVol;
  var API = 'https://gamma-api.polymarket.com';
  var lang = (document.documentElement.lang || 'en').slice(0, 2);

  var L = {
    en: { barca: 'Barcelona', draw: 'Draw', madrid: 'Real Madrid', yes: 'Yes', no: 'No', over: 'Over', under: 'Under', goals: 'goals', vol: 'Volume', updated: 'Updated', other: 'Any other score', via: 'Live market odds via Polymarket', view: 'Trade this match on Polymarket →', unavailable: 'Live odds are unavailable right now. Please try again shortly.' },
    es: { barca: 'Barcelona', draw: 'Empate', madrid: 'Real Madrid', yes: 'Sí', no: 'No', over: 'Más de', under: 'Menos de', goals: 'goles', vol: 'Volumen', updated: 'Actualizado', other: 'Cualquier otro resultado', via: 'Cuotas en vivo de Polymarket', view: 'Opera este partido en Polymarket →', unavailable: 'Las cuotas en vivo no están disponibles ahora. Inténtalo de nuevo en unos minutos.' },
    fr: { barca: 'Barcelone', draw: 'Nul', madrid: 'Real Madrid', yes: 'Oui', no: 'Non', over: 'Plus de', under: 'Moins de', goals: 'buts', vol: 'Volume', updated: 'Mis à jour', other: 'Autre score', via: 'Cotes en direct via Polymarket', view: 'Trader ce match sur Polymarket →', unavailable: 'Les cotes en direct sont indisponibles pour le moment. Réessayez dans un instant.' },
    ar: { barca: 'برشلونة', draw: 'تعادل', madrid: 'ريال مدريد', yes: 'نعم', no: 'لا', over: 'أكثر من', under: 'أقل من', goals: 'أهداف', vol: 'حجم التداول', updated: 'آخر تحديث', other: 'أي نتيجة أخرى', via: 'احتمالات مباشرة من Polymarket', view: 'تداول هذه المباراة على Polymarket ←', unavailable: 'الاحتمالات المباشرة غير متاحة حالياً. حاول مرة أخرى بعد قليل.' }
  };
  var T = L[lang] || L.en;

  function $(id) { return document.getElementById(id); }
  function arr(v) { if (Array.isArray(v)) return v; try { return JSON.parse(v) || []; } catch (e) { return []; } }
  function low(s) { return String(s || '').toLowerCase(); }
  function txt(m) { return low(m.question) + ' ' + low(m.groupItemTitle); }
  function vol(m) { return parseFloat(m.volume != null ? m.volume : m.volumeNum) || 0; }
  function price(m, label) {
    var o = arr(m.outcomes).map(low), p = arr(m.outcomePrices);
    var i = o.indexOf(label);
    if (i < 0) return null;
    var v = parseFloat(p[i]);
    return isNaN(v) ? null : v;
  }
  function yes(m) { var v = price(m, 'yes'); if (v !== null) return v; var p = parseFloat(arr(m.outcomePrices)[0]); return isNaN(p) ? null : p; }
  function pct(p) { return p === null ? '–' : Math.round(p * 100) + '%'; }
  function dec(p) { return p && p > 0.01 ? (1 / p).toFixed(2) : '–'; }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  var RE_B = /barcelona|barça|barca/, RE_M = /madrid/;
  var RE_HALF = /half|1h|2h|45 min/, RE_CORNER = /corner/;
  var RE_SIDE = /half|1h|2h|45|corner|score|goal|spread|total|o\/u|over|under|margin| by \d|first|exact/;

  function cell(cls, label, p, small) {
    var w = p === null ? 0 : Math.round(p * 100);
    return '<div class="odds-cell ' + cls + '"><div class="odds-label">' + label + '</div>' +
      '<div class="odds-pct">' + pct(p) + '</div><div class="odds-dec">' + dec(p) + '</div>' +
      '<div class="odds-bar"><span style="width:' + w + '%"></span></div></div>';
  }
  function show(id, html) { var el = $(id); if (!el) return; if (html) { el.querySelector('.odds-body').innerHTML = html; el.hidden = false; } else el.hidden = true; }
  function volNote(v) { return v > 0 ? '<p class="odds-volnote">' + T.vol + ' ' + money(v) + '</p>' : ''; }

  function build(ev) {
    var ms = (ev.markets || []).filter(function (m) { return !m.closed && m.active !== false; });

    // 1) Match result
    var r = { barca: null, draw: null, madrid: null }, rv = 0, strictMain = ms.filter(function (m) { return m.sportsMarketType === 'moneyline'; });
    (strictMain.length ? strictMain : ms.filter(function (m) { return !RE_SIDE.test(txt(m)); })).forEach(function (m) {
      var t = txt(m), p = yes(m); if (p === null) return;
      if (/draw/.test(t)) r.draw = p; else if (RE_B.test(t) && !RE_M.test(t)) r.barca = p; else if (RE_M.test(t) && !RE_B.test(t)) r.madrid = p; else return;
      rv += vol(m);
    });
    show('o-result', (r.barca !== null && r.madrid !== null) ?
      '<div class="odds-grid">' + cell('barca', T.barca, r.barca) + cell('draw', T.draw, r.draw) + cell('madrid', T.madrid, r.madrid) + '</div>' + volNote(rv) : '');

    // 2) Both teams to score
    var bt = ms.filter(function (m) { var t = txt(m); return (/both_teams|btts/.test(low(m.sportsMarketType)) || /both teams to score|btts/.test(t)) && !RE_HALF.test(t) && vol(m) >= MIN_VOL; })[0];
    if (bt) {
      var by = price(bt, 'yes'), bn = price(bt, 'no');
      show('o-btts', '<div class="odds-grid two">' + cell('barca', T.yes, by) + cell('madrid', T.no, bn) + '</div>' + volNote(vol(bt)));
    } else show('o-btts', '');

    // 3) Total goals
    var rows = [];
    ms.forEach(function (m) {
      var t = txt(m);
      var isTot = m.sportsMarketType === 'totals' || /o\/u|over\/under|total/.test(t);
      if (!isTot || RE_HALF.test(t) || RE_CORNER.test(t) || vol(m) < MIN_VOL) return;
      if (m.sportsMarketType !== 'totals' && !(RE_B.test(t) && RE_M.test(t))) return; // skip single-team totals
      var line = m.line != null ? parseFloat(m.line) : parseFloat((t.match(/(\d+(?:\.\d+)?)\s*$/) || t.match(/(\d+\.5)/) || [])[1]);
      var ov = price(m, 'over'), un = price(m, 'under');
      if (isNaN(line) || ov === null) return;
      if (un === null) un = 1 - ov;
      rows.push({ line: line, over: ov, under: un, vol: vol(m) });
    });
    rows = rows.filter(function (x) { return x.line >= 1.5 && x.line <= 4.5; }).sort(function (a, b) { return a.line - b.line; });
    if (rows.length) {
      var th = '<div class="odds-table">' + rows.map(function (x) {
        return '<div class="odds-row"><div class="odds-line">' + x.line + ' ' + T.goals + '</div>' +
          '<div class="odds-duo"><span class="o">' + T.over + ' <b>' + pct(x.over) + '</b></span>' +
          '<span class="bar"><i style="width:' + Math.round(x.over * 100) + '%"></i></span>' +
          '<span class="u">' + T.under + ' <b>' + pct(x.under) + '</b></span></div></div>';
      }).join('') + '</div>';
      show('o-totals', th + volNote(rows.reduce(function (a, x) { return a + x.vol; }, 0)));
    } else show('o-totals', '');

    // 4) Exact score (only if enough markets are liquid)
    var sc = [];
    ms.forEach(function (m) {
      var t = txt(m);
      if (!(m.sportsMarketType === 'correct_score' || /exact score|correct score/.test(t)) || RE_HALF.test(t) || vol(m) < MIN_VOL) return;
      var mm = (m.groupItemTitle || '').match(/(\d+)\s*[-–:]\s*(\d+)/) || t.match(/(\d+)\s*[-–:]\s*(\d+)/);
      var p = yes(m); if (p === null) return;
      sc.push({ label: mm ? mm[1] + ' – ' + mm[2] : T.other, p: p, vol: vol(m) });
    });
    sc.sort(function (a, b) { return b.p - a.p; });
    sc = sc.filter(function (x) { return x.label !== T.other; }).slice(0, 4);
    show('o-exact', sc.length >= 3 ?
      '<div class="odds-grid four">' + sc.map(function (x) { return cell('draw', x.label, x.p); }).join('') + '</div>' + volNote(sc.reduce(function (a, x) { return a + x.vol; }, 0)) : '');
  }

  function foot(ev) {
    var f = $('o-foot'); if (!f) return;
    var time = new Date().toLocaleTimeString(document.documentElement.lang || undefined, { hour: '2-digit', minute: '2-digit' });
    f.innerHTML = '<span class="odds-live"><i></i>' + T.via + '</span><span>' + T.updated + ' ' + time + '</span>';
    var cta = $('o-cta'); if (cta) cta.href = 'https://polymarket.com/event/' + encodeURIComponent(ev.slug || SLUG) + '?r=' + encodeURIComponent(REF);
    f.hidden = false;
  }

  var loaded = false;
  function getJSON(u) { return fetch(u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }

  // Polymarket often splits one match into several events (main lines, "more markets", exact score...).
  // Fetch the main event, likely companions, and any search hit whose slug starts with the main slug; merge all markets.
  function loadMatch() {
    var enc = encodeURIComponent, base = API + '/events/slug/';
    var tries = ['', '-more-markets', '-exact-score', '-halftime-result'].map(function (x) { return getJSON(base + enc(SLUG + x)); });
    tries.push(getJSON(API + '/public-search?q=' + enc('Barcelona Real Madrid') + '&events_status=active&limit_per_type=40'));
    return Promise.all(tries).then(function (res) {
      var evs = [];
      res.slice(0, 4).forEach(function (e) { if (e && e.markets && e.slug) evs.push(e); });
      var found = (res[4] && res[4].events) || [];
      found.forEach(function (e) {
        if (e && e.slug && e.slug.indexOf(SLUG) === 0 && !evs.some(function (x) { return x.slug === e.slug; })) evs.push(e);
      });
      if (!evs.length) return null;
      var seen = {}, markets = [];
      evs.forEach(function (e) {
        (e.markets || []).forEach(function (m) {
          var k = m.id || m.conditionId || m.slug || m.question;
          if (!seen[k]) { seen[k] = 1; markets.push(m); }
        });
      });
      return { slug: evs[0].slug, markets: markets, events: evs };
    });
  }

  function debug(ev) {
    if (!/[?&]debug=1/.test(location.search)) return;
    var pre = $('o-debug');
    if (!pre) { pre = document.createElement('pre'); pre.id = 'o-debug'; pre.style.cssText = 'max-width:100%;overflow:auto;font-size:11px;padding:12px;margin:20px auto;border:1px solid var(--line);'; document.body.appendChild(pre); }
    pre.textContent = 'EVENTS: ' + ev.events.map(function (e) { return e.slug + ' (' + (e.markets || []).length + ')'; }).join(', ') + '\n\n' +
      ev.markets.map(function (m) { return [m.sportsMarketType || '-', m.question, 'vol=' + Math.round(vol(m)), 'line=' + (m.line == null ? '-' : m.line), 'out=' + arr(m.outcomes).join('/')].join(' | '); }).join('\n');
  }

  function load() {
    loadMatch().then(function (ev) {
      if (!ev || !ev.markets.length) throw new Error('no event');
      build(ev); foot(ev); debug(ev); loaded = true;
      var s = $('o-status'); if (s) s.hidden = true;
    }).catch(function () {
      if (!loaded) { var s = $('o-status'); if (s) { s.textContent = T.unavailable; s.hidden = false; } }
    });
  }
  load();
  setInterval(function () { if (!document.hidden) load(); }, 30000);
})();
