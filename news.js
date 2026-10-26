/* Renders news cards from window.NEWS (news-data.js).
   #news-grid  -> full list with tag filter (news.html)
   #home-news  -> latest 3 cards (home page)  */
(function () {
  var all = (window.NEWS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(d) {
    try { return new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); }
    catch (e) { return d; }
  }
  function cards(list) {
    if (!list.length) return '<p class="note">No news yet.</p>';
    return '<div class="news-grid">' + list.map(function (n) {
      return '<a class="news-card" href="news/' + esc(n.slug) + '.html">' +
        '<span class="news-tag">' + esc(n.tag) + '</span>' +
        '<h3>' + esc(n.title) + '</h3>' +
        '<p>' + esc(n.summary) + '</p>' +
        '<span class="news-date">' + esc(fmt(n.date)) + ' · Read →</span></a>';
    }).join('') + '</div>';
  }

  var home = document.getElementById('home-news');
  if (home) home.innerHTML = cards(all.slice(0, 3));

  var grid = document.getElementById('news-grid');
  if (grid) {
    var bar = document.getElementById('news-filter');
    var tags = []; all.forEach(function (n) { if (tags.indexOf(n.tag) < 0) tags.push(n.tag); });
    var current = 'All';
    function draw() {
      grid.innerHTML = cards(current === 'All' ? all : all.filter(function (n) { return n.tag === current; }));
      if (bar) Array.prototype.forEach.call(bar.children, function (b) { b.classList.toggle('on', b.getAttribute('data-tag') === current); });
    }
    if (bar) {
      bar.innerHTML = ['All'].concat(tags).map(function (t) { return '<button type="button" data-tag="' + esc(t) + '">' + esc(t) + '</button>'; }).join('');
      bar.addEventListener('click', function (e) { var t = e.target.getAttribute && e.target.getAttribute('data-tag'); if (t) { current = t; draw(); } });
    }
    draw();
  }
})();
