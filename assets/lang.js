// Shows the page in one language: #tr / #en in the address, then the visitor's last choice,
// then the browser language. Without JavaScript both languages stay visible.
(function () {
  var root = document.documentElement;

  function stored() {
    try {
      return localStorage.getItem('shiftino.lang');
    } catch (error) {
      return null;
    }
  }

  function pick() {
    var hash = location.hash.replace('#', '');
    if (hash === 'tr' || hash === 'en') return hash;
    var saved = stored();
    if (saved === 'tr' || saved === 'en') return saved;
    var browser = (navigator.language || 'tr').toLowerCase();
    return browser.indexOf('tr') === 0 ? 'tr' : 'en';
  }

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang;
    var title = root.getAttribute('data-title-' + lang);
    if (title) document.title = title;
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-set-lang') === lang));
    }
  }

  apply(pick());

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-lang'));
  });

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-set-lang]');
    if (!button) return;
    var lang = button.getAttribute('data-set-lang');
    try {
      localStorage.setItem('shiftino.lang', lang);
    } catch (error) {
      // Private mode: the choice lasts for this page only.
    }
    apply(lang);
  });
})();
