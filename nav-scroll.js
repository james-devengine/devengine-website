(function () {
  var style = document.createElement('style');
  style.textContent =
    '@media (min-width: 769px) {' +
      '.nav { transition: transform 0.35s ease; }' +
      '.nav.nav--hidden { transform: translateY(-100%); pointer-events: none; }' +
    '}';
  document.head.appendChild(style);

  var nav = document.querySelector('.nav');
  if (!nav) return;

  var NAV_H = 150; /* matches --nav-h; nav starts sliding back in this many px before the top */

  window.addEventListener('scroll', function () {
    if (window.innerWidth <= 768) return;
    if (window.scrollY > NAV_H) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }
  }, { passive: true });
}());
