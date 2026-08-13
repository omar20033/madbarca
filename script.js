document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.primary');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
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
