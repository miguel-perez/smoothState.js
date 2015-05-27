// Contents of functions.js
;(function($) {
  'use strict';
  var $body = $('html, body'),
      $page = $('#main'),
      smoothState = $page.smoothState({
        // Runs when a link has been activated
        onStart: {
          duration: 100, // Duration of our animation
          render: function (url, $container) {
            // Add your CSS animation reversing class
            $page.addClass('is-exiting');

            // Restart your animation
            smoothState.restartCSSAnimations();

            // Scroll user to the top
            $body.animate({
              scrollTop: 0
            });
          }
        },
      onEnd: {
        duration: 0,
        render: function (url, $container, $content) {
          // Remove your CSS animation reversing class
          $page.removeClass('is-exiting');

          // Inject the new content
          $container.html($content);

          // Remove cursor
          $body.css('cursor', 'auto');
          $body.find('a').css('cursor', 'auto');
        }
      }
      }).data('smoothState');
      //.data('smoothState') makes public methods available
})(jQuery);
