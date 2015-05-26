jquery.smoothState.js
===============
[![Build Status](https://travis-ci.org/miguel-perez/smoothState.js.svg?branch=master)](https://travis-ci.org/miguel-perez/smoothState.js)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/miguel-perez/smoothState.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

* [About](#about)
* [Options](#options)
* [Callbacks](#callbacks)
* [Methods and properties](#methods-and-properties)
* [Contribute](#contribute)
* [Need help?](#need-help)

## About

smoothState.js is a jQuery plugin that progressively enhances page loads to give you control over page transitions.

* [Checkout the demo site]( http://miguel-perez.github.io/smoothState.js) for examples and tutorials.
* Learn [How To Add Page Transitions with CSS and smoothState.js](https://css-tricks.com/add-page-transitions-css-smoothstate-js/) on CSSTricks
* Post sites you've created with smoothState on [/r/smoothState](http://www.reddit.com/r/smoothstate/)

## Options

smoothState provides some options that allow you to customize the functionality of the plugin.

* [prefetch](#prefetch)
* [blacklist](#blacklist)
* [development](#development)
* [pageCacheSize](#pagecachesize)
* [alterRequestUrl](#alterrequesturl)

### `prefetch`
There is a 200ms to 300ms delay between the time that a user hovers over a link and the time they click it. On touch screens, the delay between the touchstart and touchend is even greater. If the prefetch option is set to true, smoothState will begin to preload the contents of the url between that delay.

This technique will dramatically increase the speed of your website.

### `blacklist`
A string that is used as a jQuery selector to ignore certain links. By default smoothState will ignore any links that match `".no-smoothstate, [target]"`.

### `development`
A boolean, default being `false`, that will tell smoothState to output useful debug info when something goes wrong in console instead of trying to abort.

### `pageCacheSize`
smoothState.js will store pages in memory if pageCacheSize is set to anything greater than 0. This allows a user to avoid having to request pages more than once. Pages that are stored in memory will load instantaneously.

### `alterRequestUrl`
A function that defines any alterations needed on the URL that is used to request content from the server. The function should return a string that is a valid URL. This is useful when dealing with applications that have layout controls or when needing to invalidate the cache.

## Callbacks

Callbacks allow you to choreograph how elements enter and exit your page.

* [onStart](#onstart)
* [onProgress](#onprogress)
* [onEnd](#onend)
* [callback](#callback)

### `onStart`
Ran when a link has been activated, a "click". Default:

```js
onStart : {
    duration: 0, // Duration of the animations, if any.
    render: function (url, $container) {
        $body.scrollTop(0);
    }
},
```

### `onProgress`
Ran if the page request is still pending and onStart has finished animating.Default:
```js
onProgress : {
    duration: 0, // Duration of the animations, if any.
    render: function (url, $container) {
        $body.css('cursor', 'wait');
        $body.find('a').css('cursor', 'wait');
    }
},
```

### `onEnd`
Ran when requested content is ready to be injected into the page
```js
onEnd : {
    duration: 0, // Duration of the animations, if any.
    render: function (url, $container, $content) {
        $body.css('cursor', 'auto');
        $body.find('a').css('cursor', 'auto');
        $container.html($content);
    }
},
```

### `callback`
Ran after the new content has been injected into the page
```js
callback : function(url, $container, $content) {

}
```

## Methods and properties

smoothState provides some methods available by accessing the element's data property.

* [href](#href)
* [cache](#cache)
* [load](#loadurl)
* [fetch](#fetchurl)
* [toggleAnimationClass](#toggleanimationclassclassname)
* [restartCSSAnimations](#restartcssanimations)

```js
var content  = $('#main').smoothState().data('smoothState');
content.load('/newPage.html');

```

### `href`
Url of the content that is currently displayed.

### `cache`
Variable that stores pages after they are requested.

### `load(url)`
Loads the contents of a url into our container.

### `fetch(url)`
Fetches the contents of a url and stores it in the 'cache' variable.

### `toggleAnimationClass(classname)`
This method is **deprecated** and will be removed in version 0.6.0. It was used to restart css animations while toggling a specific class, such as `.is-existing`. This proved to be an unreliable way to handle restarting css animtions since there's no way to define when we want the class to be removed. Use `restartCSSAnimations()` instead, and add or remove the animation classes on the appropiate callbacks.

### `restartCSSAnimations()`
Restarts the CSS animations of the smoothState container.

```js
var smoothState = $page.smoothState({
    onStart: {
      duration: 250,
      render: function (url, $container) {
        // Add your CSS animation reversing class
        $page.addClass('is-exiting');

        // Restart your animation
        smoothState.restartCSSAnimations();

        // anything else
      }
    },
    onEnd: {
      duration: 0,
      render: function (url, $container, $content) {
        // Remove your CSS animation reversing class
        $page.removeClass('is-exiting');

        // Inject the new content
        $container.html($content);
      }
    }
  }).data('smoothState');
```

## Need help?

If you need a little help implementing smoothState there are a couple things you could do to get some support:

1. Post on stackoverflow using the [smoothstate.js tag](http://stackoverflow.com/tags/smoothstate.js).
2. Join the [Gitter room](https://gitter.im/miguel-perez/smoothState.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) and talk to some of the contributors.
3. Contact [Miguel](http://miguel-perez.com/), he provides training and consultation services.

Please **avoid creating a github issue with personal support requests**, we'll want to keep the tracker clear for bugs and pull requests.

## Contribute

We're always looking for:

* Bug reports, especially those with a reduced test case
* Pull requests, features, spelling errors, clarifications, etc
* Ideas for enhacements
* Demos of sites built with smoothState
