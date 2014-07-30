;(function ($) {
    'use strict';
    var $main = $('#main'),
        $body = $('html, body');
    $main.smoothState({
        renderFrame: [
            function ($content, $container) {
                $container.addClass('is-exiting');
                return $container.html();
            },
            function ($content, $container) {
                $container.removeClass('is-exiting');
                return $('<div/>').append($content).html();
            }
        ],
        frameDelay: 500,
        prefetch: true,
        pageCacheSize: 10,
        onBefore: function () {
            $body.animate({
                scrollTop: 0
            });
        }
    });
})(jQuery);
