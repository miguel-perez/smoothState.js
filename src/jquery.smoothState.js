/**
 * smoothState.js is a jQuery plugin to stop page load jank.
 *
 * This jQuery plugin progressively enhances page loads to
 * behave more like a single-page application.
 *
 * @author  Miguel Ángel Pérez   reachme@miguel-perez.com
 * @see     https://github.com/miguel-perez/jquery.smoothState.js
 *
 */
;(function ( $, window, document, undefined ) {
  'use strict';

  /** Abort plugin if browser does not suppost pushState */
  if(!window.history.pushState) {
    // setup a dummy fn, but don't intercept on link clicks
    $.fn.smoothState = function() { return this; };
    $.fn.smoothState.options = {};
    return;
  }

  /** Abort if smoothstate is already present **/
  if($.fn.smoothState) { return; }

  var
    /** Used later to scroll page to the top */
    $body = $('html, body'),

    /** Used in development mode to console out useful warnings */
    consl = (window.console || false),

    /** Plugin default options, will be exposed as $fn.smoothState.options */
    defaults = {

      /** jquery selector to specify which anchors smoothstate should bind to */
      anchors: 'a',

      /** jquery selector to specify which forms smoothstate should bind to */
      forms: 'form',

      /** If set to true, smoothState will prefetch a link's contents on hover */
      prefetch: false,

      /** A selecor that deinfes with links should be ignored by smoothState */
      blacklist: '.no-smoothstate, [target]',

      /** If set to true, smoothState will log useful debug information instead of aborting */
      development: false,

      /** The number of pages smoothState will try to store in memory and not request again */
      pageCacheSize: 0,

      /** A function that can be used to alter urls before they are used to request content */
      alterRequestUrl: function (url) {
        return url;
      },

      /**
       * Run when a link has been activated
       * @param   {string}    url - url being evaluated
       * @param   {jquery}    $container - smoothState container
       *
       */
      onStart: {
        duration: 0,
        render: function () {
          $body.scrollTop(0);
        }
      },

      /**
       * Run if the page request is still pending and onStart has finished animating
       * @param   {string}    url - url being evaluated
       * @param   {jquery}    $container - smoothState container
       *
       */
      onProgress: {
        duration: 0,
        render: function () {
          $body.css('cursor', 'wait');
          $body.css('pointer-events', 'none');
        }
      },

      /** Run when requested content is ready to be injected into the page  */
      onEnd: {
        duration: 0,
        render: function (url, $container, $content) {
          $body.css('cursor', 'auto');
          $body.css('pointer-events', 'auto');
          $container.html($content);
        }
      },

      /**
       * Run when content has been injected and all animations are complete
       * @param   {string}    url - url being evaluated
       * @param   {jquery}    $container - smoothState container
       * @param   {jquery}    $content - new container contents
       * @param   {jquery}    $html - entire page
       *
       */
      callback: function() {

      }
    },

    /** Utility functions that are decoupled from SmoothState */
    utility = {

      /**
       * Checks to see if the url is external
       * @param   {string}    url - url being evaluated
       * @see     http://stackoverflow.com/questions/6238351/fastest-way-to-detect-external-urls
       *
       */
      isExternal: function (url) {
        var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
        if (typeof match[1] === 'string' && match[1].length > 0 && match[1].toLowerCase() !== window.location.protocol) {
          return true;
        }
        if (typeof match[2] === 'string' &&
          match[2].length > 0 &&
          match[2].replace(new RegExp(':(' + {'http:': 80, 'https:': 443}[window.location.protocol] +
            ')?$'), '') !== window.location.host) {
          return true;
        }
        return false;
      },

      /**
       * Strips the hash from a url and returns the new href
       * @param   {string}    href - url being evaluated
       *
       */
      stripHash: function(href) {
        return href.replace(/#.*/, '');
      },

      /**
       * Checks to see if the url is an internal hash
       * @param   {string}    href - url being evaluated
       * @param   {string}    prev - previous url (optional)
       *
       */
      isHash: function (href, prev) {
        prev = prev || window.location.href;

        var hasHash = (href.indexOf('#') > -1) ? true : false,
          samePath = (utility.stripHash(href) === utility.stripHash(prev)) ? true : false;

        return (hasHash && samePath);
      },

      /**
       * Checks to see if we should be loading this URL
       * @param   {string}    url - url being evaluated
       * @param   {string}    blacklist - jquery selector
       *
       */
      shouldLoad: function ($anchor, blacklist) {
        var href = $anchor.prop('href');
        // URL will only be loaded if it's not an external link, hash, or blacklisted
        return (!utility.isExternal(href) && !utility.isHash(href) && !$anchor.is(blacklist));
      },

      /**
       * Resets an object if it has too many properties
       *
       * This is used to clear the 'cache' object that stores
       * all of the html. This would prevent the client from
       * running out of memory and allow the user to hit the
       * server for a fresh copy of the content.
       *
       * @param   {object}    obj
       * @param   {number}    cap
       *
       */
      clearIfOverCapacity: function (cache, cap) {
        // Polyfill Object.keys if it doesn't exist
        if (!Object.keys) {
          Object.keys = function (obj) {
            var keys = [],
              k;
            for (k in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
              }
            }
            return keys;
          };
        }

        if (Object.keys(cache).length > cap) {
          cache = {};
        }

        return cache;
      },

      /**
       * Stores a document fragment into an object
       * @param   {object}    object - object where it will be sotred
       * @param   {string}    url - name of the entry
       * @param   {string|document}    doc - entire html
       * @param   {string}    id - the id of the fragment
       *
       */
      storePageIn: function (object, url, doc, id) {
        var newDoc;

        if(doc instanceof HTMLDocument) {
          newDoc = doc;
        } else {
          newDoc = document.implementation.createHTMLDocument('');
          newDoc.open();
          newDoc.write(doc);
          newDoc.close();
        }

        object[url] = { // Content is indexed by the url
          status: 'loaded',
          // Stores the title of the page, .first() prevents getting svg titles
          title: newDoc.title,
          html: $(newDoc.getElementById(id)), // Stores the contents of the page
        };
        return object;
      },

      /**
       * Triggers an 'allanimationend' event when all animations are complete
       * @param   {object}    $element - jQuery object that should trigger event
       * @param   {string}    resetOn - which other events to trigger allanimationend on
       *
       */
      triggerAllAnimationEndEvent: function ($element, resetOn) {

        resetOn = ' ' + resetOn || '';

        var animationCount = 0,
          animationstart = 'animationstart webkitAnimationStart oanimationstart MSAnimationStart',
          animationend = 'animationend webkitAnimationEnd oanimationend MSAnimationEnd',
          eventname = 'allanimationend',
          onAnimationStart = function (e) {
            if ($(e.delegateTarget).is($element)) {
              e.stopPropagation();
              animationCount++;
            }
          },
          onAnimationEnd = function (e) {
            if ($(e.delegateTarget).is($element)) {
              e.stopPropagation();
              animationCount--;
              if(animationCount === 0) {
                $element.trigger(eventname);
              }
            }
          };

        $element.on(animationstart, onAnimationStart);
        $element.on(animationend, onAnimationEnd);

        $element.on('allanimationend' + resetOn, function(){
          animationCount = 0;
          utility.redraw($element);
        });
      },

      /** Forces browser to redraw elements */
      redraw: function ($element) {
        $element.height();
      }

    }, // eo utility

    /** Handles the popstate event, like when the user hits 'back' */
    onPopState = function ( e ) {
      if(e.state !== null) {
        var url = window.location.href,
          $page = $('#' + e.state.id),
          page = $page.data('smoothState');

        if(page.href !== url && !utility.isHash(url, page.href)) {
          page.load(url, false);
        }
      }
    },

    /** Constructor function */
    SmoothState = function ( element, options ) {
      var
        /** Container element smoothState is run on */
        $container = $(element),

        elementId = $container.prop('id'),

        /** If a hash was clicked, we'll store it here so we
         *  can scroll to it once the new page has been fully
         *  loaded.
         */
        targetHash = null,

        /** Used to prevent fetching while we transition so
         *  that we don't mistakenly override a cache entry
         *  we need.
         */
        isTransitioning = false,

        /** Variable that stores pages after they are requested */
        cache = {},

        /** Url of the content that is currently displayed */
        currentHref = window.location.href,

        /**
         * Clears a given page from the cache, if no url is provided
         * it will clear the entire cache.
         * @param  {String} url entry that is to be deleted.
         * @return {[type]}     [description]
         */
        clear = function(url) {
          url = url || false;
          if(url && cache.hasOwnProperty(url)) {
            delete cache[url];
          } else {
            cache = {};
          }
          $container.data('smoothState').cache = cache;
        },

        /**
         * Fetches the contents of a url and stores it in the 'cache' varible
         * @param   {string}    url
         *
         */
        fetch = function (settings, callback) {
          callback = callback || null;

          var defaults = {
            dataType: 'html',
            type: 'GET'
          };

          // Checks if we're only passing in a url
          if(typeof settings === 'string') {
            settings = $.extend({}, defaults, { url: settings });
          } else {
            settings = $.extend({}, defaults, settings);
          }

          // Don't fetch we have the content already
          if(cache.hasOwnProperty(settings.url) && settings.type === 'GET') {
            return;
          }

          cache = utility.clearIfOverCapacity(cache, options.pageCacheSize);

          cache[settings.url] = { status: 'fetching' };

          settings.url = options.alterRequestUrl(settings.url) || settings.url;

          var request = $.ajax(settings);

          // Store contents in cache variable if successful
          request.success(function (html) {
            // Clear cache varible if it's getting too big
            utility.storePageIn(cache, settings.url, html, elementId);
            $container.data('smoothState').cache = cache;
          });

          // Mark as error
          request.error(function () {
            cache[settings.url].status = 'error';
          });

          if(callback) {
            request.complete(callback);
          }
        },

        /** Updates the contents from cache[url] */
        updateContent = function (url) {
          // If the content has been requested and is done:
          var containerId = '#' + elementId,
              $content = cache[url] ? $(cache[url].html.html()) : null;

          if($content) {

            document.title = cache[url].title;

            $container.data('smoothState').href = url;

            // Call the onEnd callback and set trigger
            options.onEnd.render(url, $container, $content, cache[url].html);

            $container.one('ss.onEndEnd', function(){
              isTransitioning = false;

              options.callback(url, $container, $content, cache[url].html);

              if(targetHash) {
                var $targetHashEl = $(targetHash, $container),
                    newPosition = $targetHashEl.offset().top;
                $body.animate({
                  scrollTop: newPosition
                }, 250);
                targetHash = null;
              }
            });

            window.setTimeout(function(){
              $container.trigger('ss.onEndEnd');
            }, options.onEnd.duration);

          } else if (!$content && options.development && consl) {
            // Throw warning to help debug in development mode
            consl.warn('No element with an id of ' + containerId + ' in response from ' + url + ' in ' + cache);
          } else {
            // No content availble to update with, aborting...
            window.location = url;
          }
        },

        /**
         * Loads the contents of a url into our container
         *
         * @param   {string}    url
         * @param   {bool}      push - used to determine if whe should
         *                      add a new item into the history object
         *
         */
        load = function (settings, push) {

          var defaults = {
            dataType: 'html',
            type: 'GET'
          };

          // Checks if we're only passing in a url
          if(typeof settings === 'string') {
            settings = $.extend({}, defaults, { url: settings });
          } else {
            settings = $.extend({}, defaults, settings);
          }

          /** Makes this an optional variable by setting a default */
          if(typeof push === 'undefined'){
            push = true;
          }

          var
            /** Used to check if the onProgress function has been run */
            hasRunCallback = false,

            callbBackEnded = false,

            /** List of responses for the states of the page request */
            responses = {

              /** Page is ready, update the content */
              loaded: function() {
                var eventName = hasRunCallback ? 'ss.onProgressEnd' : 'ss.onStartEnd';

                if(!callbBackEnded || !hasRunCallback) {
                  $container.one(eventName, function(){
                    updateContent(settings.url);
                  });
                } else if(callbBackEnded) {
                  updateContent(settings.url);
                }

                if(push) {
                  window.history.pushState({ id: elementId }, cache[settings.url].title, settings.url);
                }
              },

              /** Loading, wait 10 ms and check again */
              fetching: function() {

                if(!hasRunCallback) {

                  hasRunCallback = true;

                  // Run the onProgress callback and set trigger
                  $container.one('ss.onStartEnd', function(){
                    options.onProgress.render(settings.url, $container, null);

                    window.setTimeout(function(){
                      $container.trigger('ss.onProgressEnd');
                      callbBackEnded = true;
                    }, options.onProgress.duration);

                  });
                }

                window.setTimeout(function () {
                  // Might of been canceled, better check!
                  if(cache.hasOwnProperty(settings.url)){
                    responses[cache[settings.url].status]();
                  }
                }, 10);
              },

              /** Error, abort and redirect */
              error: function(){
                if(options.development && consl) {
                  consl.log('There was an error loading: ' + settings.url);
                } else {
                  window.location = settings.url;
                }
              }
            };

          if (!cache.hasOwnProperty(settings.url)) {
            fetch(settings);
          }

          // Run the onStart callback and set trigger
          options.onStart.render(settings.url, $container, null);
          window.setTimeout(function(){
            $container.trigger('ss.onStartEnd');
          }, options.onStart.duration);

          // Start checking for the status of content
          responses[cache[settings.url].status]();

        },

        /**
         * Binds to the hover event of a link, used for prefetching content
         *
         * @param   {object}    event
         *
         */
        hoverAnchor = function (event) {
          var $anchor = $(event.currentTarget);
          if (utility.shouldLoad($anchor, options.blacklist) && !isTransitioning) {
            event.stopPropagation();
            fetch($anchor.prop('href'));
          }
        },

        /**
         * Binds to the click event of a link, used to show the content
         *
         * @param   {object}    event
         *
         */
        clickAnchor = function (event) {
          var $anchor = $(event.currentTarget),
              url = $anchor.prop('href');

          // Ctrl (or Cmd) + click must open a new tab
          if (!event.metaKey && !event.ctrlKey && utility.shouldLoad($anchor, options.blacklist)) {
            // stopPropagation so that event doesn't fire on parent containers.
            isTransitioning = true;
            event.stopPropagation();
            event.preventDefault();
            targetHash = $anchor.prop('hash');
            load(url);
          }
        },

        /**
         * Binds to form submissions
         * @param  {Event} event
         */
        submitForm = function (event) {

          event.preventDefault();
          event.stopPropagation();

          var $form = $(event.currentTarget),
              action = $form.prop('action'),
              method = $form.prop('method'),
              data = $form.serialize(),
              settings = {};

            if(method === 'get') {
              settings.url = action + '?' + data;
            } else {
              settings.url = action;
              settings.data = data;
              settings.type = 'POST';
            }

            isTransitioning = true;
            load(settings);
        },

        /**
         * Binds all events and inits functionality
         *
         * @param   {object}    event
         *
         */
        bindEventHandlers = function ($element) {
          $element.on('click', options.anchors, clickAnchor);

          $element.on('submit', options.forms, submitForm);

          if (options.prefetch) {
            $element.on('mouseover touchstart', options.anchors, hoverAnchor);
          }

        },

        /** DEPRECATED: use restartCSSAnimations instead */
        toggleAnimationClass = function (classname) {
          var classes = $container.addClass(classname).prop('class');

          $container.removeClass(classes);

          window.setTimeout(function(){
            $container.addClass(classes);
          }, 0);

          $container.one('ss.onStartEnd ss.onProgressEnd ss.onEndEnd', function(){
            $container.removeClass(classname);
          });

        },

        /** Restart the container's css animations */
        restartCSSAnimations = function () {
          var classes = $container.prop('class');
          $container.removeClass(classes);
          utility.redraw($container);
          $container.addClass(classes);
        };

      /** Merge defaults and global options into current configuration */
      options = $.extend( {}, $.fn.smoothState.options, options );

      /** Sets a default state */
      if(window.history.state === null) {
        window.history.replaceState({ id: elementId }, document.title, currentHref);
      }

      /** Stores the current page in cache variable */
      utility.storePageIn(cache, currentHref, document.documentElement.outerHTML, elementId);

      /** Bind all of the event handlers on the container, not anchors */
      utility.triggerAllAnimationEndEvent($container, 'ss.onStartEnd ss.onProgressEnd ss.onEndEnd');

      /** Bind all of the event handlers on the container, not anchors */
      bindEventHandlers($container);

      /** Public methods */
      return {
        href: currentHref,
        cache: cache,
        clear: clear,
        load: load,
        fetch: fetch,
        toggleAnimationClass: toggleAnimationClass,
        restartCSSAnimations: restartCSSAnimations
      };
    },

    /** Returns elements with SmoothState attached to it */
    declareSmoothState = function ( options ) {
      return this.each(function () {
        // Checks to make sure the smoothState element has an id and isn't already bound
        if(this.id && !$.data(this, 'smoothState')) {
          // Makes public methods available via $('element').data('smoothState');
          $.data(this, 'smoothState', new SmoothState(this, options));
        } else if (!this.id && consl) {
          // Throw warning if in development mode
          consl.warn('Every smoothState container needs an id but the following one does not have one:', this);
        }
      });
    };

  /** Sets the popstate function */
  window.onpopstate = onPopState;

  /** Makes utility functions public for unit tests */
  $.smoothStateUtility = utility;

  /** Defines the smoothState plugin */
  $.fn.smoothState = declareSmoothState;

  /* expose the default options */
  $.fn.smoothState.options = defaults;

})(jQuery, window, document);
