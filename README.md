jquery.smoothState.js
===============
This is jQuery plugin that progressively enhances pages to behave more like single-page application.


## Usage

smoothState.js was built to allow you to achive really neat page transitions on your site, such as what you might see on [Coddrops](http://tympanus.net/codrops/2013/05/07/a-collection-of-page-transitions/) or [AprilZero](http://aprilzero.com/). In order to achive this on a production site, we need to handle less obvious issues as not to break a user's browsing expectations. By default, smoothState will handle few problems for you:

* Updating your user's URL with [popState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history)
* Fetching content from your server via AJAX
* Replacing the content on your page with the new content


### The basics
To achive this barebones functionallity, you can run:
```JavaScript
$('#body').smoothState();
```
This line of code will cause our page to update with the contents of any links inside of the `#body` container without reloading the page.

### Additing page transitions

In traditional animation, the changes to a scene need to be drawn out in an array of frames that get swapped out in rapid succession. Likewise, smoothState allows you to define an array of functions that return the markup that gets swapped out on the page. This is useful because it allows you to add the needed HTML scaffolding to achive CSS animations. Here's a basic example of a simple fade effect:

**Javascript:**
```Javascript
$('#body').smoothState({
  renderFrame: [
    // Frame 1: sets up scafolding needed for CSS animations
    function ($content, $container) {
      var currentHTML = $container.html(),
          newHTML     = $('<div/>').append($content).html(),
          html        = [
            '<div class=\'content\' style=\'height:' + $container.height() +  'px;\'>',
            '<div class=\'page page--old\'>' + currentHTML + '</div>',
            '<div class=\'page page--new\'>' + newHTML + '</div>',
            '</div>'
          ].join('');
      return html;
    },
    // Frame 2: cleans up extra markup added for CSS animations
    function ($content) {
      return $('<div/>').append($content).html();
    }
  ]
});
```

**CSS:**
```CSS

/* Page transitions - simple fade effect
------------------------------------------------- */
#body .content {
  position: relative;
  z-index: 1;
}

#body .page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

#body .page--old {
  animation: fadeOut 0.1s ease; /* Don't forget to add vendor prefixes! */
  opacity: 0;
  z-index: 1;
}

#body .page--new {
  visibility: visible;
  animation: fadeIn 0.4s ease;
  z-index: 2;
}


/* Animations classes
------------------------------------------------- */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 2;
  }
}

```






