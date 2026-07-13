(function () {
   var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   var header = document.getElementById('home');
   var bannerText = header ? header.querySelector('.banner-text') : null;

   if (bannerText && !reduceMotion) {
      var ticking = false;

      var updateParallax = function () {
         ticking = false;
         var headerHeight = header.offsetHeight || window.innerHeight;
         var y = window.pageYOffset || document.documentElement.scrollTop;
         var progress = Math.min(Math.max(y / headerHeight, 0), 1);

         bannerText.style.transform = 'translateY(' + (y * 0.4) + 'px)';
         bannerText.style.opacity = String(1 - progress);
      };

      window.addEventListener('scroll', function () {
         if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
         }
      }, { passive: true });

      updateParallax();
   }

   if (!reduceMotion && 'IntersectionObserver' in window) {
      var revealSelectors = ['#about', '#resume', '#portfolio', '#testimonials', '#contact'];
      var revealSections = revealSelectors
         .map(function (selector) { return document.querySelector(selector); })
         .filter(Boolean);

      revealSections.forEach(function (section) {
         section.classList.add('reveal-on-scroll');
      });

      var observer = new IntersectionObserver(function (entries) {
         entries.forEach(function (entry) {
            if (entry.isIntersecting) {
               entry.target.classList.add('in-view');
               observer.unobserve(entry.target);
            }
         });
      }, { threshold: 0.15 });

      revealSections.forEach(function (section) {
         observer.observe(section);
      });
   }
})();
