;(function ($) {
    // Initialize smoothState on a container that has an id
    $('#main').smoothState({
        frameDelay: 300,
        renderFrame: [
            // Frame 01: sets up scafolding needed for CSS animations
            function($content, $container){
                var currentHTML = $container.html(),
                    newHTML     = $('<div/>').append($content).html(),
                    html        = [
                        "<div class='content' style='height:" + $container.height() +  "px;'>",
                            "<div class='page page--old'>" + currentHTML + "</div>",
                            "<div class='page page--new'>" + newHTML + "</div>",
                        "</div>"
                    ].join('');
                return html;
            },
            // Frame 02: cleans up extra markup added for CSS animations
            function($content, $container) {
                return $('<div/>').append($content).html();
            }
        ]
    });
})(jQuery);