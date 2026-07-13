(function () {
   var slider = document.querySelector('.flexslider');
   if (!slider) return;

   var prev = document.querySelector('.flex-prev');
   var next = document.querySelector('.flex-next');

   function scrollByCard(direction) {
      var card = slider.querySelector('.slides > li');
      var amount = card ? card.getBoundingClientRect().width : slider.clientWidth;
      slider.scrollBy({ left: direction * amount, behavior: 'smooth' });
   }

   if (prev) prev.addEventListener('click', function () { scrollByCard(-1); });
   if (next) next.addEventListener('click', function () { scrollByCard(1); });
})();
