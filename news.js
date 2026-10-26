/* Renders news cards from window.NEWS_I18N (news-data.js), in the language of the page (<html lang>).
   #news-grid  -> full list with tag filter (news.html)
   #home-news  -> latest 3 cards (home page)  */
(function () {
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var I = window.NEWS_I18N || {};
  var list = (I[lang] || I.en || window.NEWS || []).slice();
  var S = {
    en: { read: 'Read →', all: 'All', none: 'No news yet.', loc: 'en-GB' },
    es: { read: 'Leer →', all: 'Todas', none: 'Aún no hay noticias.', loc: 'es-ES' },
    fr: { read: 'Lire →', all: 'Toutes', none: 'Pas encore d’actualités.', loc: 'fr-FR' },
    ar: { read: 'اقرأ ←', all: 'الكل', none: 'لا توجد أخبار بعد.', loc: 'ar-u-nu-latn' }
  }[lang] || { read: 'Read →', all: 'All', none: 'No news yet.', loc: 'en-GB' };
  var all = list.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(d) {
    try { return new Date(d + 'T12:00:00Z').toLocaleDateString(S.loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); }
    catch (e) { return d; }
  }
  function cards(items) {
    if (!items.length) return '<p class="note">' + S.none + '</p>';
    return '<div class="news-grid">' + items.map(function (n) {
      return '<a class="news-card" href="news/' + esc(n.slug) + '.html">' +
        '<span class="news-tag">' + esc(n.tag) + '</span>' +
        '<h3>' + esc(n.title) + '</h3>' +
        '<p>' + esc(n.summary) + '</p>' +
        '<span class="news-date">' + esc(fmt(n.date)) + ' · ' + S.read + '</span></a>';
    }).join('') + '</div>';
  }

  var home = document.getElementById('home-news');
  if (home) home.innerHTML = cards(all.slice(0, 3));

  var grid = document.getElementById('news-grid');
  if (grid) {
    var bar = document.getElementById('news-filter');
    var tags = []; all.forEach(function (n) { if (tags.indexOf(n.tag) < 0) tags.push(n.tag); });
    var current = '';
    function draw() {
      grid.innerHTML = cards(current ? all.filter(function (n) { return n.tag === current; }) : all);
      if (bar) Array.prototype.forEach.call(bar.children, function (b) { b.classList.toggle('on', (b.getAttribute('data-tag') || '') === current); });
    }
    if (bar) {
      bar.innerHTML = '<button type="button" data-tag="">' + esc(S.all) + '</button>' +
        tags.map(function (t) { return '<button type="button" data-tag="' + esc(t) + '">' + esc(t) + '</button>'; }).join('');
      bar.addEventListener('click', function (e) { var t = e.target.getAttribute && e.target.getAttribute('data-tag'); if (t !== null && t !== undefined) { current = t; draw(); } });
    }
    draw();
  }
})();
