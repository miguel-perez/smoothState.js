;(function ($) {
    'use strict';
    var $body    = $('html, body'),
        content  = $('#main').smoothState({
            prefetch: true,
            pageCacheSize: 4,
            onStart : function (url, $container, $content) {
                content.toggleAnimationClass('is-exiting');
                $body.animate({
                    'scrollTop': 0
                });
            }
        }).data('smoothState');
})(jQuery);
