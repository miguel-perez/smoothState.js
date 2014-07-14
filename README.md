jquery.smoothState.js
===============
This is jQuery plugin that progressively enhances page loads to behave more like single-page application.

The approach taken here is that of a mix of ajax, pushstate, and a series of render functions that output the scafolding markup needed for CSS animations on an interval. The jquery plugin is run on a container element. This container will listen for links that are interacted with and fetch the content, run the render functions, and update the URL of the page.

