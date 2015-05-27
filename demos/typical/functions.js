;(function ($) {
    'use strict';
    var $body = $('html, body'),
        $main = $('#main'),
        options = {
            prefetch: true,
            pageCacheSize: 4,
            onStart: {
                duration: 250,
                render: function (url, $container) {
                    $body.animate({
                        scrollTop: 0
                    });
                    $main.addClass('is-exiting');
                    smoothState.restartCSSAnimations();
                }
            },
            onEnd: {
                duration: 0,
                render: function (url, $container, $content) {
                    $main.removeClass('is-exiting');
                    $main.html($content);
                    $body.css('cursor', 'auto');
                    $body.find('a').css('cursor', 'auto');
                }
            }
        },
        smoothState = $main.smoothState(options).data('smoothState');
})(jQuery);
