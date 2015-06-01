$(function() {
  'use strict';

  var smoothStateModule = function(name, view){
    view = view || './views/home.html';
    QUnit.module(name, {
      beforeEach: function(assert) {
        var id = 'frame-' + new Date().getTime(),
            test = this,
            done = assert.async(),
            frameReady = function() {
              var frame = document.getElementById(id);
              test.frameWin = frame.contentWindow;
              window.frameReady = $.noop;
              done();
            };
        window.frameReady = frameReady;
        $('#qunit-fixture').append('<iframe id="' + id + '" src="' + view + '" onload="frameReady()">');
      },
      afterEach: function(assert) {
        delete window.frameReady;
      }
    });
  };

  QUnit.extend(QUnit, { smoothStateModule: smoothStateModule });
});
