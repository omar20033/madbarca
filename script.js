document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.primary');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Animate duel bar fills in from center on scroll into view
  var fills = document.querySelectorAll('.duel-bars .fill');
  if ('IntersectionObserver' in window && fills.length) {
    fills.forEach(function (el) {
      el.dataset.target = el.style.width || getComputedStyle(el).width;
      el.style.width = '0%';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          requestAnimationFrame(function () {
            el.style.transition = 'width .7s cubic-bezier(.2,.7,.2,1)';
            el.style.width = el.dataset.target;
          });
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(function (el) { io.observe(el); });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Countdown to next Clasico
  var cd = document.querySelector('.countdown');
  if (cd && cd.dataset.target) {
    var target = new Date(cd.dataset.target).getTime();
    var dEl = cd.querySelector('.cd-days'),
        hEl = cd.querySelector('.cd-hours'),
        mEl = cd.querySelector('.cd-mins'),
        sEl = cd.querySelector('.cd-secs');
    function tick() {
      var now = new Date().getTime();
      var diff = target - now;
      if (diff <= 0) {
        [dEl, hEl, mEl, sEl].forEach(function (el) { if (el) el.textContent = '00'; });
        return;
      }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      var pad = function (n) { return String(n).padStart(2, '0'); };
      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(mins);
      if (sEl) sEl.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  }

  // Clasico match search/filter table
  var search = document.getElementById('match-search');
  var compFilter = document.getElementById('match-filter-comp');
  var rows = document.querySelectorAll('.match-row');
  var countEl = document.getElementById('filter-count');
  function applyFilter() {
    if (!rows.length) return;
    var term = search ? search.value.trim().toLowerCase() : '';
    var comp = compFilter ? compFilter.value : 'all';
    var shown = 0;
    rows.forEach(function (row) {
      var text = row.textContent.toLowerCase();
      var rowComp = row.dataset.comp || '';
      var matchesTerm = !term || text.indexOf(term) !== -1;
      var matchesComp = comp === 'all' || rowComp === comp;
      var visible = matchesTerm && matchesComp;
      row.hidden = !visible;
      if (visible) shown++;
    });
    if (countEl) countEl.textContent = shown + ' of ' + rows.length + ' meetings shown';
  }
  if (search) search.addEventListener('input', applyFilter);
  if (compFilter) compFilter.addEventListener('change', applyFilter);
  if (search || compFilter) applyFilter();
});
