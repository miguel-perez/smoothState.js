/**
 * API
 */

$(function() {
  'use strict';

  QUnit.smoothStateModule('apiBody', './views/homeBody.html');

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1);
    assert.ok(this.frameWin.jQuery.fn.smoothState, 'smoothState method is defined');
  });

  QUnit.test('load(url)', function (assert){
    assert.expect(3);
    var frameWin = this.frameWin,
        frameDoc = frameWin.document,
        _$ = frameWin.jQuery,
        url = _$('#page-about').prop('href'),
        done = assert.async(),
        testContent = function(){
          assert.ok(_$('#page-title').text() === 'About', 'Should update the title of the page');
          assert.equal(frameDoc.title, 'About - My Site', 'Should replace the contents of the page');
          assert.equal(frameWin.location.href, url, 'Should update the window url');
          done();
        },
        options = {
          development: true,
          callback: testContent
        },
        smoothState = _$('#main').smoothState(options).data('smoothState');

    smoothState.load(url);
  });

  QUnit.smoothStateModule('api');

  QUnit.test('load(requestObject), onProgress, onStart, onEnd', function (assert){
    assert.expect(18);
    var time,
        duration = 50,
        frameWin = this.frameWin,
        frameDoc = frameWin.document,
        _$ = frameWin.jQuery,
        url = _$('#page-about').prop('href'),
        done = assert.async(),
        testOnStart = {
          duration: duration,
          render: function(targetUrl, $container) {
            time = Date.now();

            assert.equal(url, targetUrl, 'Target url is passed into onStart');
            assert.ok($container.is($main) && $container instanceof _$, 'Container is passed into onStart and is jQuery');
          }
        },
        testOnProgress = {
          duration: duration,
          render: function(targetUrl, $container) {
            var currTime = Date.now();

            assert.ok(currTime > time + duration, 'onStart waited duration ms');
            time = currTime;

            assert.equal(url, targetUrl, 'Target url is passed into onProgress');
            assert.ok($container.is($main) && $container instanceof _$, 'Container is passed into onProgress and is jQuery');
          }
        },
        testOnEnd = {
          duration: duration,
          render: function(targetUrl, $container, $content, $newContainer) {
            var currTime = Date.now();

            assert.ok(currTime > time + duration, 'onProgress waited duration ms');
            time = currTime;

            $container.html($content);

            assert.equal(url, targetUrl, 'Target url is passed into onEnd');
            assert.ok($container.is($main) && $container instanceof _$, 'Container is passed into onEnd and is jQuery');
            assert.ok($content instanceof _$, 'Content is passed into onEnd and is jQuery');
            assert.ok($newContainer instanceof _$, '$newContainer is passed into onEnd and is jQuery');
          }
        },
        testCallback = function(targetUrl, $container, $content, $newContainer){
          var currTime = Date.now();

          assert.ok(currTime > time + duration, 'onEnd waited duration ms');

          assert.equal(url, targetUrl, 'Target url is passed into callback');
          assert.ok($container.is($main) && $container instanceof _$, 'Container is passed into callback and is jQuery');
          assert.ok($content instanceof _$, 'Content is passed into callback and is jQuery');
          assert.ok($newContainer instanceof _$, '$newContainer is passed into callback and is jQuery');

          assert.ok(_$('#page-title').text() === 'About', 'Should update the title of the page');
          assert.equal(frameDoc.title, 'About - My Site', 'Should replace the contents of the page');
          assert.equal(frameWin.location.href, url, 'Should update the window url');

          done();
        },
        options = {
          development: true,
          onStart: testOnStart,
          onProgress: testOnProgress,
          onEnd: testOnEnd,
          callback: testCallback
        },
        requestObject = {
          url: url,
          type: 'POST',
          data: {
            foo:'bar'
          }
        },
        $main = _$('#main'),
        smoothState = $main.smoothState(options).data('smoothState');

    smoothState.load(requestObject);
  });

  QUnit.test('fetch(request, callback)', function (assert){
    assert.expect(5);
    var frameWin = this.frameWin,
        _$ = frameWin.$,
        url = _$('#page-about').prop('href'),
        done = assert.async(),
        options = {
          development: true,
        },
        callback = function(){
          assert.ok(smoothState.cache[url], 'Stores contents in cache[url]');
          assert.equal(smoothState.cache[url].title, 'About - My Site', 'Stores the title of the page in cache[url].title');
          assert.ok(smoothState.cache[url].html instanceof frameWin.jQuery, 'Stores contents as a jquery object in cache[url].html');
          assert.ok(smoothState.cache[url].html.is('#main'), 'Stores only the smoothState container in cache[url].html');
          assert.ok(smoothState.cache[url].html.find('#page-about'), 'Stores new contents in cache[url].html');
          done();
        },
        smoothState = _$('#main').smoothState(options).data('smoothState');

    smoothState.fetch(url, callback);
  });

  QUnit.test('cache.clear(url)', function (assert){
    assert.expect(2);
    var frameWin = this.frameWin,
        _$ = frameWin.$,
        url = _$('#page-about').prop('href'),
        done = assert.async(),
        options = {
          development: true,
          pageCacheSize: 2
        },
        secondCallback = function(){
          smoothState.clear();
          assert.ok($.isEmptyObject(smoothState.cache), 'Clears the entire cache when no url provided');
          done();
        },
        firstCallback = function(){
          smoothState.clear(url);
          assert.notOk(smoothState.cache[url], 'Clears contents in cache[url]');
          smoothState.fetch(url, secondCallback);
        },
        smoothState = _$('#main').smoothState(options).data('smoothState');

    smoothState.fetch(url, firstCallback);
  });

});
