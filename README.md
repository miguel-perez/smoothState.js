jquery.smoothState.js
===============
[Checkout the demo site](http://miguel-perez.github.io/jquery.smoothState.js/index.html) for examples and tutorials. [Let me know](https://twitter.com/tayokoart) if you have any questions.

* [About](#about)
* [Options](#options)
	* [prefetch](#prefetch)
	* [blacklist](#blacklist)
	* [development](#development)
	* [pageCacheSize](#pagecachesize)
	* [alterRequestUrl](#alterrequesturl)
* [Callbacks](#callbacks)
	* [onStart](#onstart)
	* [onProgress](#onprogress)
	* [onEnd](#onend)
	* [callback](#callback)
* [Methods and properties](#methods-and-properties)
	* [href](#href)
	* [cache](#cache)
	* [load](#loadurl)
	* [fetch](#fetchurl)
	* [toggleAnimationClass](#toggleanimationclassclassname)
* [Show your work!](#show-your-work)
* [Need help?](#need-help)


## About

Hard cuts and white flashes break user focus and create confusion as layouts change or elements rearrange. **We’ve accepted the jankiness of page loads as a personality quirk of the web**, even though there is no technical reason it must exist. We don't need to treat the web like a native app's ugly cousin.

Javascript [SPA frameworks](http://en.wikipedia.org/wiki/Single-page_application), sometimes referred to as MVC frameworks, are a common way to solve this issue. However, these frameworks often **lose the benefits of unobtrusive code**, such as resilience to errors, performance, and accessibility. smoothState.js lets you start adding transitions that eliminate the hard cuts of page loads to improve the beauty of the experience. It does this with:

* **Progressive enhancement** - a technique that exemplifies the principles universal design
* **jQuery** - a library a great many of us are familiar with
* **history.pushState()** - a method that lets us maintain browsing expectations
* **Ajax** - a way for us to  request and store pages on the user's device without refreshing the page

smoothState.js will [unobtrusively enhance](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript) your website's page loads to behave more like a single-page application framework. This allows you to add page transitions and create a nicer experince for your users.

## Options
smoothState provides some options that allow you to customize the functionality of the plugin.

### `prefetch`
There is a 200ms to 300ms delay between the time that a user hovers over a link and the time they click it. On touch screens, the delay between the touchstart and touchend is even greater. If the prefetch option is set to true, smoothState will begin to preload the contents of the url between that delay.

This technique will dramatically increase the speed of your website.

### `blacklist`
A string that is used as a jQuery selector to ignore certain links. By default smoothState will ignore any links that match `".no-smoothstate, [target]"`.

### `development`
A boolean, default being `false`, that will tell smoothState to output useful debug info when something goes wrong in console instead of trying to abort and reload the page. 

### `pageCacheSize`
smoothState.js will store pages in memory if pageCacheSize is set to anything greater than 0. This allows a user to avoid having to request pages more than once. Pages that are stored in memory will load instantaneously.

### `alterRequestUrl`
A function that defines any alterations needed on the URL that is used to request content from the server. The function should return a string that is a valid URL. This is useful when dealing with applications that have layout controls or when needing to inavlidate the cache.

## Callbacks

### `onStart`
Ran when a link has been activated, a "click". Default:

```Javanscript
onStart : {
    duration: 0, // Duration of the animations, if any.
    render: function (url, $container) {
        $body.scrollTop(0);
    }
},
```

### `onProgress`
Ran if the page request is still pending and onStart has finished animating.Default:
```Javanscript
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
```Javanscript
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
```Javanscript
callback : function(url, $container, $content) {

}
```

## Methods and properties
smoothState provides some methods available by accessing the element's data property.

```javascript
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
Fetches the contents of a url and stores it in the 'cache' varible.

### `toggleAnimationClass(classname)`
Used to restart css animations with a class.


## Show your work!
I'd love to see how this gets used in the wild. [Tweet me](https://twitter.com/tayokoart) with a link and I'll add it to this page. This repo could use some good demos.


## Need help?
If you find yourself confused, add an issue explaining your problem. Doing so will help me improve the clarity of the documentation and get us thinking about use cases and potential upgrades. I'm all ears.
