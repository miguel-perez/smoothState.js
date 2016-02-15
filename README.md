jquery.smoothState.js
===============
[![Build Status](https://travis-ci.org/miguel-perez/smoothState.js.svg?branch=master)](https://travis-ci.org/miguel-perez/smoothState.js)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/miguel-perez/smoothState.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

* [Built with smoothState.js](#built-with-smoothstatejs)
* [About](#about)
* [Options](#options)
* [Methods and properties](#methods-and-properties)
* [Need help?](#need-help)
* [FAQ](#faq)
* [Contribute](#contribute)


## Built with smoothState.js

Below are some really cool sites built with smoothState.js. Feel free to submit a pull request with your own site, or [tweet me](https://twitter.com/tayokoart) with a link.

* [Rock Werchter](http://www.rockwerchter.be/en)
* [Twitch Conf](http://www.twitchcon.com/) by [Alexis Gallisá](https://twitter.com/alexisg)
* [Refune](http://refune.com/) by [Victor Meyer](https://twitter.com/pudgereyem)
* [Beau Han Xu London](http://beauhanxu.com/) by [Lawrence Gosset](https://twitter.com/gosseti)


## About

smoothState.js is a jQuery plugin that [progressively enhances](http://www.smashingmagazine.com/2009/04/22/progressive-enhancement-what-it-is-and-how-to-use-it/) page loads to give us control over page transitions. If the user's browser doesn't have the [required features](http://caniuse.com/#search=pushstate), smoothState.js fades into the background and never runs.


### Why add page transitions at all?

Imagine, for a second, how disorienting it would be if touching a doorknob teleported you to the other side of the door. Navigating the web feels like using a teleporting doorknob. Layouts change, elements rearrange or disappear, and it takes time for the user to adjust. Smooth transitions reduce the effort it takes for users to get settled into a new environment.

Javascript SPA frameworks, sometimes referred to as MVC frameworks, are a common way to solve this issue. These frameworks often lose the benefits of unobtrusive code. Writing unobtrusive javascript gives us more resilience to errors, and improved performance and accessibility.

### How does smoothState.js work?

smoothState.js **provides hooks** that can be used to choreograph how elements enter and exit the page during navigation. It uses the time the animations are running to fetch content via AJAX to inject into the page.

smoothState.js doesn't dictate how things on the page should be animated. It supports CSS animations, as well as JS animation libraries like [velocity.js](http://julian.com/research/velocity/).

### Design philosophy and requirements

The project's main goal is to allow developers to add page transitions without having to add any logic to the backend. We keep things unobtrusive at all times.

**smoothState.js initializes on containers, not links.** Think of a container as a small window object embedded in the page.

1. Every URL on your site should return a full layout - not just an HTML fragment
2. The smoothState container needs to have an `id` set - a unique hook to tell us what to update on the page
3. All links and forms on the page should live within the container

These requirements makes the website resilient, since it smoothState.js can abort and simply redirect the user if an error occurs. Making each link return a full page also ensures that pages are created with progressive enhancement in mind.

## Getting started

All we need to do to get started is:

1. Include a copy of jQuery and jQuery.smoothState.js on your page
2. Add a container with an id of `#main` and include some links inside of it
3. Create a new js file and run `$('#main').smoothState()`

```js
$(function() {
  $('#main').smoothState();
});
```

By default, smoothState.js will:
* Prevent links and forms from triggering a full page load, if possible
* Use AJAX to request pages and replace the content appropriately
* Update URLs and browsing history so that browsing expectations aren't broken

smoothState.js **will not** add page transitions to pages. You'll need to define the animations you want to run using the hooks smoothState.js provides.

* [`onBefore`](#onbefore) - Runs before a page load has been started
* [`onStart`](#onstart) - Runs once a page load has been activated
* [`onProgress`](#onprogress) - Runs if the page request is still pending and the `onStart` animations have finished
* [`onReady`](#onready) - Run once the requested content is ready to be injected into the page and the previous animations have finished
* [`onAfter`](#onafter) - Runs after the new content has been injected into the page and all animations are complete

## Options

smoothState.js provides some options that allow customization of the plugin's functionality. The default options are overridden by passing an object into the `smoothState` function.

#### Options example

```js
$(function(){
  'use strict';
  var options = {
    prefetch: true,
    cacheLength: 2,
    onStart: {
      duration: 250, // Duration of our animation
      render: function ($container) {
        // Add your CSS animation reversing class
        $container.addClass('is-exiting');

        // Restart your animation
        smoothState.restartCSSAnimations();
      }
    },
    onReady: {
      duration: 0,
      render: function ($container, $newContent) {
        // Remove your CSS animation reversing class
        $container.removeClass('is-exiting');

        // Inject the new content
        $container.html($newContent);

      }
    }
  },
  smoothState = $('#main').smoothState(options).data('smoothState');
});
```

### `debug`

If set to `true`, smoothState.js will log useful debug information to the console, instead of aborting. For example, instead of redirecting the user to a page on an error, it might log:

```
No element with an id of “#main” in response from “/about.html”.
```

```js
// Default
$('#main').smoothState({ debug: false });
```

### `anchors`

A jQuery selector specifying which anchors within the `smoothState` element should be bound.

```js
// Default
$('#main').smoothState({ anchors: 'a' });
```

### `hrefRegex`

A regular expression to specify which anchor with a specific href property based on the regex smoothState should bind to. If empty, every href will be permitted.

```js
// Default
$('#main').smoothState({ hrefRegex: '' });
```


### `forms`

A jQuery selector specifying which forms within the `smoothState` element should be bound.

```js
// Default
$('#main').smoothState({ forms: 'form' });
```

### `allowFormCaching`

Controls whather or not form submission responses are preserved in the cache. If set to true, smoothState will store form responses in the cache. This should be set to false unless you understand how caching form results will affect your website's behaviour very well.

```js
// Default
$('#main').smoothState({ allowFormCaching: false });
```

### `repeatDelay`

The minimum number of milliseconds between click/submit events. User events ignored beyond this rate are ignored. This can be used to ignore double-clicks so that the user's browser history won't become cluttered by incompleted page loads.

```js
// Default
$('#main').smoothState({ repeatDelay: 500 });
```

### `blacklist`

A jQuery selector specifying which elements within the `smoothState` element should be ignored. This includes both form and anchor elements.

```js
// Default
$('#main').smoothState({ blacklist: '.no-smoothState' });
```

### `prefetch`

There is a 200ms to 300ms delay between the time that a user hovers over a link and the time they click it. On touch screens, the delay between the `touchstart` and `touchend` is even greater. If the `prefetch` option is set to `true`, smoothState.js will begin to preload the contents of the URL during that delay. This technique will increase the perceived performance of the site.

```js
// Default
$('#main').smoothState({ prefetch: false });
```

### `prefetchOn`

The name of the events to listen to from anchors when prefetching.

```js
// Default
$('#main').smoothState({ prefetchOn: 'mouseover touchstart' });
```

If you would like to throttle the prefetch, do so by firing custom events.

Libraries like @tristen's [hoverintent](https://github.com/tristen/hoverintent) can be used to throttle prefetching based on the user's intent, by triggering a custom `intent` event. To use it with smoothState.js, set `intent` as the `prefetchOn` option.

```js
$('#main').smoothState({ prefetchOn: 'intent' });
```

Or, for the opposite effect, use something like @cihadturhan's [jQuery.aim](https://github.com/cihadturhan/jquery-aim) and add spider sense-like prefetching to smoothState.js.

```js
$('#main').smoothState({ prefetchOn: 'aim' });
```

### `cacheLength`

The number of pages to cache. smoothState.js can cache pages in memory, avoiding the user having to request pages more than once. Cached pages will load instantaneously.

```js
// Default
$('#main').smoothState({ cacheLength: 0 });
```

### `loadingClass`

The class to apply to the `body` while a page is still loading, unless the page is received before the animations are complete.

```js
// Default
$('#main').smoothState({ loadingClass: 'is-loading' });
```

### `scroll`

Scroll to top after onStart and scroll to hash after onReady. This is default behavior, if you want to implement your own scroll behavior, set `scroll: false`

```js
// Default
$('#main').smoothState({ scroll: true });
```

### `alterRequest`

A function to alter a request's [AJAX settings](http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings) before it is called. This can be used to alter the requested URL, for example.

```js
// Default
$('#main').smoothState({
  // Param `request` is an `Object` that is currently set to be used
  alterRequest: function(request) {
    // Must return and `Object` that will be used to make the request
    return request;
  }
});
```

### `alterChangeState`

A function to alter a history entry's state object before it is modified or added to the browser's history. This can be used to attach serializable data to the history entry, for example.

```js
// Default
$('#main').smoothState({
  // Param `state` is an `Object` that contains the container ID, by default
  alterChangeState: function(state) {
    // Must return a serializable `Object` that is associated with the history entry
    return state;
  }
});
```

### `onBefore`

The function to run before a page load is started.

```js
// Default
$('#main').smoothState({
  // `$currentTarget` is a `jQuery Object` of the element, anchor or form, that triggered the load
  // `$container` is a `jQuery Object` of the the current smoothState container
  onBefore: function($currentTarget, $container) {}
});
```

### `onStart`

The function to run once a page load has been activated. This is an ideal time to animate elements that exit the page and set up for a loading state.

```js
// Default
$('#main').smoothState({
  onStart: {
    // How long this animation takes
    duration: 0,
    // A function that dictates the animations that take place
    render: function ($container) {}
  }
});
```

### `onProgress`

The function to run only if the page request is still pending and `onStart` has finished animating. This is a good place to add something like a loading indicator.

```js
// Default
$('#main').smoothState({
  onProgress: {
    // How long this animation takes
    duration: 0,
    // A function that dictates the animations that take place
    render: function ($container) {}
  }
});
```

### `onReady`

The function to run when the requested content is ready to be injected into the page. This is when the page's contents should be updated.

```js
// Default
$('#main').smoothState({
  onReady: {
    duration: 0,
    // `$container` is a `jQuery Object` of the the current smoothState container
    // `$newContent` is a `jQuery Object` of the HTML that should replace the existing container's HTML.
    render: function ($container, $newContent) {
      // Update the HTML on the page
      $container.html($newContent);
    }
  }
});
```

### `onAfter`

The function to run when the new content has been injected into the page and all animations are complete. This is when to re-initialize any plugins needed by the page.

```js
// Default
$('#main').smoothState({
  onAfter: function($container, $newContent) {}
});
```

## Methods and properties

`smoothState` provides some methods and properties, made accessible through the element's `data` property.

```js
// Access smoothState
var smoothState = $('#main').smoothState().data('smoothState');

// Run method
smoothState.load('/newPage.html');
```

### Properties

* [`href`](#href)
* [`cache`](#cache)

#### `href`

The URL of the content that is currently displayed.

#### `cache`

An object containing the cached pages after they are requested.

### Methods

* [`load`](#loadurl)
* [`fetch`](#fetchurl)
* [`clear`](#clearurl)
* [`restartCSSAnimations`](#restartcssanimations)

#### `load(url)`

This loads the contents of a URL into our container.

#### `fetch(url)`

This fetches the contents of a URL and caches it.

#### `clear(url)`

This clears a given page from the cache. If no URL is provided it will clear the entire cache.

#### `restartCSSAnimations()`

This restarts any CSS animations applying to elements within the `smoothState` container.

## Need help?

If you need a little help implementing smoothState there are a couple things you could do to get some support:

1. Post on stackoverflow using the [smoothState.js tag](http://stackoverflow.com/tags/smoothState.js).
2. Join the [Gitter room](https://gitter.im/miguel-perez/smoothState.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) and talk to some of the contributors.
3. Contact [Miguel](http://miguel-perez.com/). He provides training and consultation services.

Please **avoid creating a Github issue** with personal support requests, to keep the tracker clear for bugs and pull requests.

## FAQ

> Help! My `$(document).ready()` plugins work fine when I refresh but break on the second page load.

smoothState.js provides the [`onAfter`](https://github.com/miguel-perez/smoothState.js#onafter) callback function that allows you to re-run your plugins. This can be tricky if you're unfamiliar with how AJAX works.

When you run a plugin on `$(document).ready()`, it's going to register *only* on elements that are currently on the page. Since we're injecting new elements every load, we need to run the plugins again, scoping it to *just* the new stuff. 

A good way to do this is to wrap your plugin initializations in a function that we call on both `$.fn.ready()` and `onAfter`. You'll want to specify the [context](http://api.jquery.com/jQuery/#jQuery-selector-context) each time you initialize the plugins so that you don't double-bind them. This is called a "module execution controller".

## Contribute

We're always looking for:

* Bug reports, especially those for aspects with a reduced test case
* Pull requests for features, spelling errors, clarifications, etc.
* Ideas for enhancements
* Demos and links to sites built with smoothState.js


