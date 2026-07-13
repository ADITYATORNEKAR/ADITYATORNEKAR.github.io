(function () {
   function openModal(id) {
      var dialog = document.getElementById(id);
      if (dialog && typeof dialog.showModal === 'function') {
         dialog.showModal();
      }
   }

   document.addEventListener('click', function (e) {
      var trigger = e.target.closest('a.popup-modal[href^="#modal-"]');
      if (trigger) {
         e.preventDefault();
         openModal(trigger.getAttribute('href').slice(1));
         return;
      }

      var dismiss = e.target.closest('.popup-modal-dismiss');
      if (dismiss) {
         e.preventDefault();
         var dialog = dismiss.closest('dialog');
         if (dialog) dialog.close();
      }
   });

   document.querySelectorAll('dialog.popup-modal').forEach(function (dialog) {
      dialog.addEventListener('click', function (e) {
         if (e.target === dialog) dialog.close();
      });
   });
})();
