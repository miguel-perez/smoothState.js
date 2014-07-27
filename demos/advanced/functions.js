;(function ($) {
    'use strict';
    var $main = $('#main'),
        $body = $('body');
    $main.smoothState({
        renderFrame: [
            function ($content, $container) {
                $container.addClass('is-unloading');
                return $container.html();
            },
            function ($content, $container) {
                $container.removeClass('is-unloading');
                return $('<div/>').append($content).html();
            }
        ],
        frameDelay: 400,
        prefetch: true,
        onBefore: function () {
            $body.animate({
                scrollTop: 0
            });
        }
    });
})(jQuery);