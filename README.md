jquery.smoothState.js
===============
This is jQuery plugin that progressively enhances pages to behave more like a single-page application.

## Usage
smoothState.js was built to allow you to achieve really neat page transitions on your site, such as what you might see on [Codrops](http://tympanus.net/codrops/2013/05/07/a-collection-of-page-transitions/) or [AprilZero](http://aprilzero.com/). In order to achieve this on a production site, we need to handle less obvious issues as not to break a user's browsing expectations. By default, smoothState will handle few problems for you:

* Updating your user's URL with [popState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history)
* Fetching content from your server via AJAX
* Replacing the content on your page with the new content

### The basics
To achieve this barebones functionality, you can run:
```JavaScript
$('#body').smoothState();
```
This line of code will cause our page to update with the contents of any links inside of the `#body` container without reloading the page.

### Adding page transitions
In traditional animation, the changes to a scene need to be drawn out in an array of frames that get swapped out in rapid succession. Likewise, smoothState allows you to define an array of functions that return the markup that gets swapped out on the page. This is useful because it allows you to add the needed HTML scaffolding to achieve CSS animations. Here's a basic example of a simple fade effect:

**Javascript:**
```Javascript
$('#body').smoothState({
  renderFrame: [
    // Frame 1: sets up scaffolding needed for CSS animations
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

You can see a [demo](http://miguel-perez.com/) of this simple fade effect on my own site.

## Options
smoothState provides some options that allow you to customize the functionality of the plugin.

### `innerPageSelector`
A string that is used as a jQuery selector to define sections within the main content that should be treated as it's own page. By default this is set to an empty string. This is useful when dealing to C-layouts where the inner content doesn't effect outer content.

### `prefetch`
A boolean, default being `false`, that determines weather or not the plugin should try to prefetch the contents of the page. This is an excellent way to improve perceived performance. I wrote a [blog post](http://miguel-perez.com/articles/hong-kong-gui/) explaining ways you can take advantage of this to make your page feel instant. If you're dealing with a complex database-driven application and you're not using any type of caching, don't try to use this. It will likely destroy your app server since it will increase the number of request each user makes to the server.

### `blacklist`
A string that is used as a jQuery selector to ignore certain links. By default smoothState will ignore any links that match `".no-smoothstate, [rel='nofollow'], [target]"`. This is useful when defining certain links you always want a page referch for. Such as [deep web links](http://en.wikipedia.org/wiki/Deep_Web), or links with custom javascript functionality around them.

### `loadingBodyClass`
This is the class that will get applied to the body element when there is a noticeable delay between the time when a user activates a link and when the AJAX request is complete. This can be used to show the user a loading indicator and give the user some feedback that the UI is working. By default it will apply a class of `loading-cursor` to the body. Here's a bit of CSS to go along with it:

```CSS
.loading-cursor,
.loading-cursor a{
  cursor: progress;
}
```

### `development`
A boolean, default being `false`, that will tell smoothState to output useful debug info when something goes wrong in console instead of trying to abort and reload the page. 

### `pageCacheSize`
A number, default being `5`, that defines the maximum number of pages to store locally in memory. smoothState will store the HTML it requested from the server in a variable for the purpose of avoiding unnecessary requests and improving page load speed. Setting a limit to this is useful for conserving the memory of less capable devices.

### `frameDelay`
A number, default being `400`, that defines the number of milliseconds smoothState will wait in between each render function inside of the array `renderFrame`. This number should match the delay in your CSS transition.

### `renderFrame`
An array of functions that return the HTML that will be swapped out. By default smoothState just removes the old content and replaces it with the new content. smoothState will always pass in two jQuery objects to this function as arguments, $content and $container.

```Javascript
var html = options.renderFrame[i]($content, $container);
$container.html(html);
```

### `alterRequestUrl`
A function that defines any alterations needed on the URL that is used to request content from the server. The function should return a string that is a valid URL. This is useful when dealing with applications that have layout controls. You could, for example, append the query parameter of `layout=true` in order to force an application to give you the entire page. smoothState will pass in the URL as an argument to this function.

### `onAfter`
A function that runs after the content has been replaced. smoothState will pass in two parameters to this function:
```Javascript
if (isLastFrame) {
  options.onAfter($content, $container);
}
```

### `onBefore`
A function that runs before the content is replaced. smoothState will pass in two parameters to this function:
```Javascript
options.onBefore(url, $container);
```

