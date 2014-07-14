jquery.smoothState.js
===============
This is jQuery plugin that progressively enhances page loads to behave more like single-page application.

The approach taken here is that of a mix of ajax, pushstate, and a series of render functions that output the scafolding markup needed for CSS animations on an interval. The jquery plugin is run on a container element. This container will listen for links that are interacted with and fetch the content, run the render functions, and update the URL of the page.


Barebones
```
$('#body[data-page]').smoothState();

```

Barebones + prefetching = faster page loads
```
$('#body[data-page]').smoothState({ prefetch: true });

```


Animate page loads
```
$('#body[data-page]').smoothState({
    // Define an array of render functions to set up HTML needed for CSS transitions
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
```
And how the CSS might look like:
```
[data-page] {

    .content {
        position: relative;
        z-index: 1;
    }

    .page {
        background: #eceff1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .page--old {
        animation: fadeOut 0.2s ease;
        opacity: 0;
    }
    .page--new {
        visibility: visible;
        animation: fadeIn 0.4s ease;
    }
}

```
