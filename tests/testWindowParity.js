/**
* Window behavior
* @todo clicking back while loading cancels XHR
* @todo scrolls to top of page once the target page is loaded (optional)
* @todo sets title to first response title (double/nested titles)
* @todo can alter request url
* @todo bad/timedout request falls back to full load
* @todo evals scripts
* @todo preserves query string on GET request
* @todo popstate going back/forward in history
* @todo popstate restores original scroll position
* @todo hitting the back button obeys cacheLength
* @todo hitting the forward button obeys cacheLength
* @todo sets initial popstate
* @todo handles going back to page after loading an error page
*
*/
$(function() {
  'use strict';
  QUnit.smoothStateModule('window parity');
});
