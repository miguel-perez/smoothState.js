;(function ($) {
    'use strict';
    var $body    = $('html, body'),
        content  = $('#main').smoothState({
            onStart : function (url, $container, $content) {
                // toggleAnimationClass() is a public method for restarting css animations with a class
                content.toggleAnimationClass('is-exiting');
                $body.animate({
                    'scrollTop': 0
                });
            }
        }).data('smoothState'); // .data('smoothState') makes public methods available
})(jQuery);