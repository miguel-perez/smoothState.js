(function($, QUnit){
  'use strict';

  QUnit.module('utility');

  var util = $.smoothStateUtility;

  /**
   * Checks to see if the url is external
   */
  QUnit.test( 'isExternal', function( assert ) {
    var externalUrls = [
        'http://www.google.com',
        '//www.google.com',
        '//google.com',
        '//google.com#hash'
      ],
      internalUrls = [
        'index.html',
        '/index.html',
        '/index.html#hash',
        '#hash'
      ],
      i, y;

    // Is external
    for (i = externalUrls.length - 1; i >= 0; i--) {
      assert.ok( util.isExternal(externalUrls[i]) === true, 'External: ' + externalUrls[i] );
    }

    // Is not external
    for ( y = internalUrls.length - 1; y >= 0; y--) {
      assert.ok( util.isExternal(internalUrls[y]) === false, 'Internal: ' + internalUrls[y] );
    }

  });

  /**
   * Checks to see if the url is a hash to the same page
   */
  QUnit.test( 'stripHash', function( assert ) {
    var hashes = [
        '/index.html#hash',
        '/index.html'
      ];

    assert.equal( util.stripHash(hashes[0]), hashes[1], 'Stripped the hash from a url' );
    assert.equal( util.stripHash(hashes[1]), hashes[1], 'Url that had no hash stayed the same' );

  });

  /**
   * Checks to see if the url is a hash to the same page
   */
  QUnit.test( 'isHash', function( assert ) {
    var hashes = [
        $('<a href="#foo" />').prop('href'),
        $('<a href="' + window.location.href + '#foo" />').prop('href')
      ],
      nonHashes = [
        $('<a href="/other/page.html" />').prop('href'),
        $('<a href="/other/page.html#foo" />').prop('href'),
        $('<a href="/other/page.html#bar" />').prop('href')
      ],
      i, y;

    // Is external
    for (i = hashes.length - 1; i >= 0; i--) {
      assert.ok( util.isHash(hashes[i]) === true, 'Hash: ' + hashes[i] );
    }

    // Is not external
    for ( y = nonHashes.length - 1; y >= 0; y--) {
      assert.ok( util.isHash(nonHashes[y]) === false, 'Non hash: ' + nonHashes[y] );
    }

    // Passing in current href
    assert.ok( util.isHash(nonHashes[1], nonHashes[0]) === true, 'Passed in current href' );

    // After having clicked on a previous hash
    assert.ok( util.isHash(nonHashes[1], nonHashes[2]) === true, 'Clicked on a hash when a hash is in the current url' );

  });

  /**
   * Translates a url string into a $.ajax settings obj
   */
  QUnit.test( 'translate', function( assert ) {
    var expectedObject = JSON.stringify({
          dataType: 'html',
          type: 'GET',
          url: 'hello.html'
        });
    assert.equal( JSON.stringify(util.translate('hello.html')), expectedObject, 'Turned string into request object' );
    assert.equal( JSON.stringify(util.translate({ url: 'hello.html' })), expectedObject, 'Maintained original request object' );
    assert.notEqual( JSON.stringify(util.translate({ url: 'hello.html', type: 'POST' })), expectedObject, 'Does not override set params' );

  });

  /**
   * Checks to see if we should be loading this URL
   */
  QUnit.test( 'shouldLoadAnchor', function( assert ) {
    var blacklist   = '.no-smoothState, [target]',
      badAnchors  = [
        $('<a href="intex.html" class="no-smoothState"/>'),
        $('<a href="index.html" target="_blank" />'),
        $('<a href="//google.com" />'),
        $('<a href="#hash" />'),
        $('<a href="' + window.location.href + '#hash" />')
      ],
      goodAnchors = [
        $('<a href="index.html" />'),
        $('<a href="/index.html#foo" />'),
        $('<a href="/index.html" />')
      ],
      i, y;

    // Invalid anchors
    for (i = badAnchors.length - 1; i >= 0; i--) {
      assert.ok( util.shouldLoadAnchor(badAnchors[i], blacklist) === false, 'Bad: ' + $('<div/>').append(badAnchors[i]).html() );
    }

    // Valid anchors
    for ( y = goodAnchors.length - 1; y >= 0; y--) {
      assert.ok( util.shouldLoadAnchor(goodAnchors[y], blacklist) === true, 'Good: ' + $('<div/>').append(goodAnchors[y]).html() );
    }

  });

  /**
   * Resets an object if it has too many properties
   */
   QUnit.test( 'clearIfOverCapacity', function( assert ) {
    var capacity = 2,
      objOver  = util.clearIfOverCapacity({ '1':1, '2':2, '3':3 }, capacity),
      objEq    = util.clearIfOverCapacity({ '1':1, '2':2 }, capacity),
      objUnder = util.clearIfOverCapacity({ '1':1 }, capacity);

    assert.ok( Object.keys(objOver).length === 0, 'Is a blank object' );
    assert.ok( Object.keys(objEq).length === 2, 'Returns the same object' );
    assert.ok( Object.keys(objUnder).length === 1, 'Returns the same object' );
  });

  /**
   * Stores html content as jquery object in given object
   */
  QUnit.test( 'storePageIn', function( assert ) {
    var url     = window.location.href,
      title   = 'Test title ' + Math.random(),
      $html   = '<!doctype html> <html> <head> <title>' + title + '</title> </head> <body id="main"> <div> Content <svg><title>svg title</title></svg></div> </body> </html>',
      cache   = {};

    util.storePageIn(cache, url, $html);

    assert.ok( cache.hasOwnProperty(url), 'Correct entry was made' );
    assert.ok( cache[url].title === title, 'Title was stored properly' );
    assert.ok( cache[url].status === 'loaded', 'Status was set to "loaded"' );
    assert.ok( cache[url].html instanceof jQuery, 'Html is a jquery object' );

  });

  /**
   * Triggers an 'allanimationend' event when all animations are complete
   */
  QUnit.test( 'triggerAllAnimationEndEvent', function( assert ) {
    var $elem       = $('<div/>'),
      triggered   = false;

    $elem.on('allanimationend', function(){
      triggered = true;
    });

    util.triggerAllAnimationEndEvent($elem);
    $elem.trigger('animationstart').trigger('animationend');

    assert.ok( triggered, 'allanimationend fired' );
  });

})(jQuery, QUnit);
