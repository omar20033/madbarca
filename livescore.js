/* Live score for the Barcelona vs Real Madrid match. Fills <div id="live-score"> on the home pages.
   Two keyless sources, both queried each refresh:
     1. ESPN public scoreboard (teams are named explicitly, so the score orientation is certain)
     2. The Polymarket event already used by odds.js (score / live / ended fields)
   If ESPN answers it wins; otherwise Polymarket is used. The section only shows from 45 minutes
   before kick-off until 3 hours after, and stays hidden if neither source returns anything usable. */
(function () {
  var box = document.getElementById('live-score');
  var sec = document.getElementById('live-score-section');
  var last_result = document.getElementById('last-result');
  function showLive(on) { sec.hidden = !on; if (last_result) last_result.hidden = on; }
  if (!box || !sec) return;

  var CFG = window.ODDS_CONFIG || {};
  var cd = document.querySelector('.countdown');
  var KICKOFF = new Date((cd && cd.getAttribute('data-target')) || '2027-05-09T21:00:00+02:00').getTime();
  var BEFORE = 45 * 60e3, AFTER = 3 * 3600e3;
  var REFRESH_LIVE = 20000, REFRESH_IDLE = 60000;

  var d = new Date(KICKOFF);
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  var ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=' +
    d.getUTCFullYear() + p2(d.getUTCMonth() + 1) + p2(d.getUTCDate());
  var POLY = CFG.slug ? 'https://gamma-api.polymarket.com/events/slug/' + encodeURIComponent(CFG.slug) : null;

  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var TR = {
    en: { barca: 'Barcelona', madrid: 'Real Madrid', live: 'Live', ht: 'Half-time', ft: 'Full-time', pre: 'Kick-off', comp: 'LaLiga · Santiago Bernabéu', upd: 'Updated', watch: 'Where to watch →', na: 'Live score is unavailable right now.', src: 'Data: ESPN · Polymarket' },
    es: { barca: 'Barcelona', madrid: 'Real Madrid', live: 'En vivo', ht: 'Descanso', ft: 'Final', pre: 'Inicio', comp: 'LaLiga · Santiago Bernabéu', upd: 'Actualizado', watch: 'Dónde verlo →', na: 'El marcador en vivo no está disponible ahora.', src: 'Datos: ESPN · Polymarket' },
    fr: { barca: 'Barcelone', madrid: 'Real Madrid', live: 'En direct', ht: 'Mi-temps', ft: 'Terminé', pre: 'Coup d’envoi', comp: 'Liga · Santiago Bernabéu', upd: 'Mis à jour', watch: 'Où regarder →', na: 'Le score en direct est indisponible pour le moment.', src: 'Données : ESPN · Polymarket' },
    ar: { barca: 'برشلونة', madrid: 'ريال مدريد', live: 'مباشر', ht: 'استراحة', ft: 'انتهت', pre: 'الانطلاق', comp: 'الدوري الإسباني · سانتياغو برنابيو', upd: 'آخر تحديث', watch: 'أين تشاهد ←', na: 'النتيجة المباشرة غير متاحة حالياً.', src: 'البيانات: ESPN · Polymarket' }
  };
  var T = TR[lang] || TR.en;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function getJSON(url, ms) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; reject(new Error('timeout')); } }, ms || 8000);
      fetch(url, { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
        .then(function (j) { if (!done) { done = true; clearTimeout(t); resolve(j); } })
        .catch(function (e) { if (!done) { done = true; clearTimeout(t); reject(e); } });
    });
  }

  // ---- source 1: ESPN ------------------------------------------------------
  function fromEspn(j) {
    var evs = (j && j.events) || [];
    for (var i = 0; i < evs.length; i++) {
      var comp = (evs[i].competitions || [])[0];
      if (!comp) continue;
      var barca = null, madrid = null;
      (comp.competitors || []).forEach(function (c) {
        var n = ((c.team && (c.team.displayName || c.team.name)) || '').toLowerCase();
        if (/barcelona/.test(n) && !/espanyol/.test(n)) barca = c;
        else if (/real madrid/.test(n)) madrid = c;
      });
      if (!barca || !madrid) continue;
      var st = (evs[i].status || comp.status || {});
      var type = st.type || {};
      var state = type.state === 'post' ? 'post' : type.state === 'in' ? 'in' : 'pre';
      if (/HALFTIME/i.test(type.name || '')) state = 'ht';
      var a = parseInt(barca.score, 10), b = parseInt(madrid.score, 10);
      return {
        barca: isNaN(a) ? 0 : a, madrid: isNaN(b) ? 0 : b, state: state,
        clock: state === 'in' ? (st.displayClock || '') : '',
        hasScore: state !== 'pre'
      };
    }
    return null;
  }

  // ---- source 2: Polymarket ------------------------------------------------
  // Event slug lal-bar-rea-… means Barcelona is home ("a-b" = Barça a, Madrid b); lal-rea-bar-… means Madrid is home.
  function fromPoly(ev) {
    if (!ev) return null;
    var m = /(\d+)\s*[-–:]\s*(\d+)/.exec(String(ev.score || ''));
    if (!m) return null;
    var period = String(ev.period || '').toUpperCase();
    var state;
    if (ev.ended === true || /^(FT|FINAL|AET|PEN)/.test(period)) state = 'post';
    else if (/^(HT|HALF)/.test(period)) state = 'ht';
    else if (ev.live === true) state = 'in';
    else state = Date.now() >= KICKOFF ? 'in' : 'pre';
    var el = parseInt(ev.elapsed, 10);
    var madridHome = /lal-rea-bar/.test((CFG.slug || '').toLowerCase());
    return { barca: madridHome ? +m[2] : +m[1], madrid: madridHome ? +m[1] : +m[2], state: state, clock: (state === 'in' && !isNaN(el)) ? el + '’' : '', hasScore: state !== 'pre' };
  }

  function load() {
    var espn = getJSON(ESPN).then(fromEspn).catch(function () { return null; });
    var poly = POLY ? getJSON(POLY).then(fromPoly).catch(function () { return null; }) : Promise.resolve(null);
    return Promise.all([espn, poly]).then(function (r) { return r[0] || r[1] || null; });
  }

  // ---- render --------------------------------------------------------------
  var last = null;
  function timeStr(ms) { return new Date(ms).toLocaleTimeString(document.documentElement.lang || undefined, { hour: '2-digit', minute: '2-digit' }); }

  function render(s) {
    var badge, cls;
    if (s.state === 'in') { cls = 'live'; badge = '<i></i>' + esc(T.live) + (s.clock ? ' · ' + esc(s.clock) : ''); }
    else if (s.state === 'ht') { cls = 'live'; badge = '<i></i>' + esc(T.ht); }
    else if (s.state === 'post') { cls = 'ft'; badge = esc(T.ft); }
    else { cls = 'pre'; badge = esc(T.pre) + ' · ' + esc(timeStr(KICKOFF)); }

    var bump = function (side) { return last && last[side] !== s[side] ? ' ls-bump' : ''; };
    var n1 = s.hasScore ? s.barca : '–', n2 = s.hasScore ? s.madrid : '–';
    box.innerHTML =
      '<div class="ls-card">' +
        '<div class="ls-top"><span class="ls-badge ' + cls + '">' + badge + '</span><span class="ls-comp">' + esc(T.comp) + '</span></div>' +
        '<div class="ls-board">' +
          '<div class="ls-team barca">' + esc(T.barca) + '</div>' +
          (s.hasScore
            ? '<div class="ls-score"><span class="ls-n' + bump('barca') + '">' + n1 + '</span><span class="ls-dash">–</span><span class="ls-n' + bump('madrid') + '">' + n2 + '</span></div>'
            : '<div class="ls-score"><span class="ls-dash">vs</span></div>') +
          '<div class="ls-team madrid">' + esc(T.madrid) + '</div>' +
        '</div>' +
        '<div class="ls-foot"><span>' + esc(T.upd) + ' ' + esc(timeStr(Date.now())) + ' · ' + esc(T.src) + '</span><a href="watch.html">' + esc(T.watch) + '</a></div>' +
      '</div>';
    last = s;
  }

  function renderNA() {
    box.innerHTML = '<div class="ls-card"><div class="ls-na">' + esc(T.na) + ' <a href="watch.html">' + esc(T.watch) + '</a></div></div>';
  }

  // ---- loop ----------------------------------------------------------------
  function inWindow() { var n = Date.now(); return n >= KICKOFF - BEFORE && n <= KICKOFF + AFTER; }

  function tick() {
    if (!inWindow()) { showLive(false); return setTimeout(tick, REFRESH_IDLE); }
    if (document.hidden && last) return setTimeout(tick, REFRESH_LIVE);
    load().then(function (s) {
      showLive(true);
      if (s) render(s); else if (!last) renderNA();
    }).catch(function () {
      showLive(true);
      if (!last) renderNA();
    }).then(function () {
      setTimeout(tick, last && last.state === 'pre' ? REFRESH_IDLE : REFRESH_LIVE);
    });
  }
  tick();
})();
