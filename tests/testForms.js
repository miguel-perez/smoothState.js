/**
* Forms
*/

$(function() {
  'use strict';

  QUnit.smoothStateModule('form');

  QUnit.test('Submit a form using get', function(assert){
    assert.expect(3);
    var frameWin = this.frameWin,
        frameDoc = frameWin.document,
        _$ = frameWin.jQuery,
        $form = _$('#form-get'),
        url = $form.prop('action') + '?' + $form.serialize(),
        $submit = _$('#submit-get'),
        done = assert.async(),
        options = {
          development: true,
          onAfter: function(){
            assert.ok(_$('#page-title').text() === 'Submitted', 'Updates the title of the page');
            assert.equal(frameDoc.title, 'Submit - My Site', 'Replaces the contents of the page');
            assert.equal(frameWin.location.href, url, 'Updates the url');
            done();
          }
        };

    _$('#main').smoothState(options);
    $submit.click();
  });

  QUnit.test('Submit a form using post', function(assert){
    assert.expect(3);
    var frameWin = this.frameWin,
        frameDoc = frameWin.document,
        _$ = frameWin.jQuery,
        $form = _$('#form-post'),
        url = $form.prop('action'),
        $submit = _$('#submit-post'),
        done = assert.async(),
        options = {
          development: true,
          onAfter: function(){
            assert.ok(_$('#page-title').text() === 'Submitted', 'Updates the title of the page');
            assert.equal(frameDoc.title, 'Submit - My Site', 'Replaces the contents of the page');
            assert.equal(frameWin.location.href, url, 'Updates the url');
            done();
          }
        };

    _$('#main').smoothState(options);
    $submit.click();
  });
});
