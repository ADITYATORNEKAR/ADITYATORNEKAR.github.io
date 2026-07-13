(function () {
   var filterBar = document.getElementById('portfolio-filters');
   if (!filterBar) return;

   var buttons = filterBar.querySelectorAll('.filter-btn');
   var items = document.querySelectorAll('#portfolio-wrapper .portfolio-item');

   function applyFilter(filter) {
      items.forEach(function (item) {
         var tags = (item.getAttribute('data-tags') || '').split(' ');
         var matches = filter === 'all' || tags.indexOf(filter) !== -1;

         if (matches) {
            item.classList.remove('filtered-out');
            window.requestAnimationFrame(function () {
               item.classList.remove('filtering');
            });
         } else {
            item.classList.add('filtering');
            window.setTimeout(function () {
               item.classList.add('filtered-out');
            }, 300);
         }
      });
   }

   buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
         buttons.forEach(function (b) { b.classList.remove('active'); });
         btn.classList.add('active');
         applyFilter(btn.getAttribute('data-filter'));
      });
   });
})();
