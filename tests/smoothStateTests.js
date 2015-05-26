;(function ( $, QUnit, window, document, undefined ) {
  'use strict';

  var
    navHtml = $('#page-nav').html(),
    $nav = $(navHtml),
    pageOneUrl = $('a', $nav)[0].href,
    pageTwoUrl = $('a', $nav)[1].href,
    html = {
      pageOne: String($('#page-one').html()).replace('{{nav}}', navHtml),
      pageTwo: String($('#page-two').html()).replace('{{nav}}', navHtml)
    };

  $.mockjax({
    url: pageOneUrl,
    responseText: html.pageOne
  });

  $.mockjax({
    url: pageTwoUrl,
    responseText: html.pageTwo
  });

  QUnit.module('smoothState', {
    beforeEach: function() {
      $('<div id="page"/>').appendTo(document.body);
    },
    afterEach: function() {
      $('#page').remove();
    }
  });

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1);
    assert.ok($(document.body).smoothState, 'smoothState method is defined');
  });

  QUnit.test('Fetches the contents of a url and stores it in the "cache" variable.', function(assert){
    assert.expect(1);
    var done = assert.async();
    var page = $('#page').smoothState({development:true}).data('smoothState');

    page.fetch(pageOneUrl, function(){
      assert.ok(page.cache.hasOwnProperty(pageOneUrl), 'Fetched and stored content properly');
      done();
    });
  });

  QUnit.test('Loads the contents of a url into our container.', function(assert){
    assert.expect(3);
    var done = assert.async();
    var options = {
      development: true,
      callback: function(){
        assert.ok($('#page #page-title').text() === 'Page One', 'Page has been updated with content');
        assert.equal(document.title, page.cache[pageOneUrl].title, 'Title has been updated properly');
        assert.equal(window.location.href, page.href, 'ss container has updated its href');
        done();
      }
    };
    var page = $('#page').smoothState(options).data('smoothState');
    page.load(pageOneUrl);
  });

})(jQuery, QUnit, window, document);
