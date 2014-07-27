jquery.smoothState.js
===============
* [About](#about)
* [Demo](#demo)
* [Options](#options)
	* [prefetch](#prefetch)
	* [blacklist](#blacklist)
	* [loadingBodyClass](#loadingbodyclass)
	* [development](#development)
	* [pageCacheSize](#pagecachesize)
	* [frameDelay](#framedelay)
	* [renderFrame](#renderframe)
	* [alterRequestUrl](#alterrequesturl)
	* [onAfter](#onafter)
	* [onBefore](#onbefore)
* [Show your work!](#show-your-work)
* [Need help?](#need-help)


## About

Hard cuts and white flashes break user focus and create confusion as layouts change or elements rearrange. **We’ve accepted the jankiness of page loads as a personality quirk of the web**, even though there is no technical reason it must exist. We don't need to treat the web like a native app's ugly cousin.

Javascript [SPA frameworks](http://en.wikipedia.org/wiki/Single-page_application), sometimes referred to as MVC frameworks, are a common way to solve this issue. However, these frameworks often **lose the benefits of unobtrusive code**, such as resilience to errors, performance, and accessibility. smoothState.js lets you start adding transitions that eliminate the hard cuts of page loads to improve the beauty of the experience. It does this with:

* **Progressive enhancement** - a technique that exemplifies the principles universal design
* **jQuery** - a library a great many of us are familiar with
* **history.pushState()** - a method that lets us maintain browsing expectations
* **Ajax** - a way for us to  request and store pages on the user's device without refreshing the page

Traditional animators draw out the changes to a scene in an **array of frames** that get swapped out in rapid succession. Likewise, smoothState allows you to define an array of functions that return the markup that gets swapped out on the page. This gives you the freedom to add the HTML scaffolding needed for CSS animations.

## Demo

Checkout the demo site. If you have an example of smoothState.js in the wild, [let me know](https://twitter.com/tayokoart) about it and I'll add a link to it in this file.

## Options
smoothState provides some options that allow you to customize the functionality of the plugin.

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

## Show your work!
I'd love to see how this gets used in the wild. [Tweet me](https://twitter.com/tayokoart) with a link and I'll add it to this page. This repo could use some good demos.

## Need help?
If you find yourself confused, add an issue explaining your problem. Doing so will help me improve the clarity of the documentation and get us thinking about use cases and potential upgrades. I'm all ears.
