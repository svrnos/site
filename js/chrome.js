(function () {
  function init() {
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    var nav = navLinks.closest('nav');
    if (!nav) return;
    var inner = navLinks.parentElement;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      '<svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>';
    inner.appendChild(btn);

    function setNavHeight() {
      // Distance from viewport top to bottom of nav. Accounts for any
      // fixed bars (e.g. the homepage announcement) sitting above nav.
      var b = Math.round(nav.getBoundingClientRect().bottom);
      if (b > 0) document.documentElement.style.setProperty('--svrnos-nav-h', b + 'px');
    }
    setNavHeight();
    window.addEventListener('resize', setNavHeight);

    function close() {
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function open() {
      document.body.classList.add('nav-open');
      btn.setAttribute('aria-expanded', 'true');
      setNavHeight();
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (document.body.classList.contains('nav-open')) close(); else open();
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    var mq = window.matchMedia('(min-width: 761px)');
    function onChange() { if (mq.matches) close(); }
    if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
