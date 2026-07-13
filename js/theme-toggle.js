(function () {
   var root = document.documentElement;
   var toggle = document.getElementById('theme-toggle');
   if (!toggle) return;

   toggle.addEventListener('click', function () {
      var isLight = root.getAttribute('data-theme') === 'light';

      if (isLight) {
         root.removeAttribute('data-theme');
         localStorage.setItem('theme', 'dark');
      } else {
         root.setAttribute('data-theme', 'light');
         localStorage.setItem('theme', 'light');
      }
   });
})();
