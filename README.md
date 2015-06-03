jquery.smoothstate.js
===============
[![Build Status](https://travis-ci.org/miguel-perez/smoothstate.js.svg?branch=master)](https://travis-ci.org/miguel-perez/smoothstate.js)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/miguel-perez/smoothstate.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

* [About](#about)
* [Options](#options)
* [Methods and properties](#methods-and-properties)
* [Contribute](#contribute)
* [Need help?](#need-help)

## About

smoothstate.js is a jQuery plugin that [progressively enhances](http://www.smashingmagazine.com/2009/04/22/progressive-enhancement-what-it-is-and-how-to-use-it/) page loads to give us control over page transitions. If the [user’s browser](http://caniuse.com/#search=pushstate) does not have the needed features, it quietly fades into the background and never runs. 

### Why add page transitions at all?

Imagine, for a second, how disorienting it would be if touching a doorknob teleported you to the other side of the door. Navigating the web feels like using a teleporting doorknob. Layouts change, elements rearrange or disappear, and it takes time time for the user to adjust. Smooth transitions reduce the effort it takes for users to get settled into a new environment.

Javascript SPA frameworks, sometimes referred to as MVC frameworks, are a common way to solve this issue. However, these frameworks often lose the benefits of unobtrusive code, such as resilience to errors, performance, and accessibility. 

### Hows does smoothstate.js work?

smoothstate.js **gives you hooks** that you can use in order to choreograph how the elements on your page enter and exit the page. It allows you to specify how long your animations take, and it uses the time in between animations to fetch content via Ajax.

This project doesn’t dictate how you should animate things on the page. You can use CSS Animations, or any popular JS Animation libra like [velocity.js](http://julian.com/research/velocity/).

### Design philosophy and requirements

It’s our main goal to allow us to add page transitions without having to add any logic to the backend. We keep things unobtrusive at all times.

smoothstate.js is initialized on **containers, not links**. The containers can be thought of like small window objects within the page, similar to how you would describe an iframe.

1. Every url on your site should return a full layout - not just an HTML fragment
2. The smoothState container needs to have an id - a unique hook to tell us what to update on the page
3. All links and forms on the page should reside within the container

These requirements makes the website more resilient since it allows us to abort and redirect the user if an error occurs. Making each link return a fully qualified page also ensures our page transitions are unobtrusive.

## Options

smoothstate provides some options that allow you to customize the functionality of the plugin. You can change the default options by passing in an object into the smooth state function.
For example:

```js
$(function(){
  ‘use strict’;
  var options = {
        prefetch: true,
        pageCacheSize: 2,
        onStart: {
          duration: 250, // Duration of our animation
          render: function ($container) {
            // Add your CSS animation reversing class
            $container.addClass(‘is-exiting’);
            // Restart your animation
            smoothstate.restartCSSAnimations();
          }
        },
        onReady: {
          duration: 0,
          render: function ($container, $newContent) {
            // Remove your CSS animation reversing class
            $container.removeClass(‘is-exiting’);
            // Inject the new content
            $container.html($newContent);

          }
        }
      },
      smooth state = $(‘#main’).smoothstate(options).data(‘smooth state’);
});
```

### `debug`

* Type: `Boolean`
* Default: `false`

If set to true, smoothstate will log useful debug information instead of aborting. For example, instead of redirecting the user to a page on an error, it might say:

```
No element with an id of “#main” in response from “/about.html”.
```


### `anchors`

* Type: `String`
* Default: `’a’`

A jQuery selector to specify which anchors within the smoothstate element we should listen should bind to.


### `forms`

* Type: `String`
* Default: `’form’`

A jQuery selector to specify which forms within the smoothstate element we should listen should bind to.


### `blacklist`

* Type: `String`
* Default: `’.no-smoothstate’`

A jQuery selector to specify which elements within the smoothstate element we should completely ignore. This will apply for both forms and anchors.


### `prefetch`

* Type: `Boolean`
* Default: `false`

There is a 200ms to 300ms delay between the time that a user hovers over a link and the time they click it. On touch screens, the delay between the `touchstart` and `touchend` is even greater. If the `prefetch` option is set to `true`, smoothstate will begin to preload the contents of the url between that delay.

This technique will increase the perceived performance of your website.


### `cacheLength`

* Type: `Number`
* Default: `0`

smoothstate.js will store pages in memory if cacheLength is set to anything greater than 0. This allows a user to avoid having to request pages more than once.

Pages that are stored will load instantaneously.


### `loadingClass`  

* Type: `String`
* Default: `’is-loading’`

Class that will be applied to the body while the page is loading. We we get the page before the animations are complete, however, the loadingClass will never be added.


### `alterRequest(request)`

* Type: `Function`
* Param: `request` is an `Object` that is currently set to be used to make the ajax request
* Return: The `Object` that will be used to make the request 
* Default:
```js
alterRequest: function (request) {
  return request;
}
```

A function that can be used to alter the [ajax settings](http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings) before it is requested. This is useful when dealing with applications that have layout controls or when needing to invalidate the cache.


### `onBefore($currentTarget, $container)`

* Type: `Function`
* Param: `$currentTarget` is a `jQuery Object` of the element, anchor or form, that triggered the load
* Param: `$container` is a `jQuery Object` of the the current smooth state container
* Default:

```js
alterRequest: function ($currentTarget, $container) {}
```

This function runs before a page load has been activated.


### `onStart(settings)`

* Type: `Object`
* Param: `settings` is a `Object` with two properties, `duration` and `render`
* Default:

```js
onStart: {
	// How long the animation takes
  duration: 0, 
  // A function that dictates the changes on the page
  render: function ($container) {}
}
```

This function runs when a page load has been activated. This is an ideal time to animate elements that exit the page and set up for a loading state.

### `onProgress(settings)`
* Type: `Object`
* Param: `settings` is a `Object` with two properties, `duration` and `render`
* Default:

```js
onProgress: {
	// How long the animation takes
  duration: 0, 
  // A function that dictates the changes on the page
  render: function ($container) {}
}
```

Run only if the page request is still pending and onStart has finished animating. This is a good place to add something like a  loading indicator.

### `onReady(settings)`
* Type: `Object`
* Param: `settings` is a `Object` with two properties, `duration` and `render`
* Default:

```js
onProgress: {
	// How long the animation takes
  duration: 0, 
  // A function that dictates the changes on the page
  render: function ($container, $newContent) {
		// Update the page’s content
    $container.html($newContent);
  }
}
```

Run when requested content is ready to be injected into the page. This is when we’ll want to update the page’s content.

### `onAfter($container, $newContent)`
* Type: `Function`
* Param: `$container` is a `jQuery Object` of the the current smooth state container
* Param: `$newContent` is a `jQuery Object` of the HTML that should replace the existing container’s HTML.
* Default:

```js
alterRequest: function ($currentTarget, $container) {}
```

This function runs when content has been injected and all animations are complete. This is when we want to re-initialize any plugins on the page.

## Methods and properties

smoothstate provides some methods available by accessing the element's data property.

* [href](#href)
* [load](#loadurl)
* [cache](#cache)
* [fetch](#fetchurl)
* [clear](#clearurl)
* [restartCSSAnimations](#restartcssanimations)

```js
var content  = $('#main').smoothstate().data('smoothstate');
content.load('/newPage.html');

```

### `href`
Url of the content that is currently displayed.

### `load(url)`
Loads the contents of a url into our container.

### `cache`
Variable that stores pages after they are requested.

### `fetch(url)`
Fetches the contents of a url and stores it.

### `clear(url)`
Clears a given page from the cache, if no url is provided it will clear the entire cache.

### `restartCSSAnimations()`
Restarts the CSS animations of the smoothstate container.

## Need help?

If you need a little help implementing smoothstate there are a couple things you could do to get some support:

1. Post on stackoverflow using the [smoothstate.js tag](http://stackoverflow.com/tags/smoothstate.js).
2. Join the [Gitter room](https://gitter.im/miguel-perez/smoothstate.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) and talk to some of the contributors.
3. Contact [Miguel](http://miguel-perez.com/), he provides training and consultation services.

Please **avoid creating a Github issue with personal support requests**, we'll want to keep the tracker clear for bugs and pull requests.

## Contribute

We're always looking for:

* Bug reports, especially those with a reduced test case
* Pull requests, features, spelling errors, clarifications, etc
* Ideas for enhancements
* Demos and links to sites built with smoothstate.js
