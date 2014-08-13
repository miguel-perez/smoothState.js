
/**
 * Checks to see if the url is external
 */
QUnit.test( "smoothStateUtility: isExternal", function( assert ) {
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
        assert.ok( $.smoothStateUtility.isExternal(externalUrls[i]) === true, "External: " + externalUrls[i] );
    }

    // Is not external
    for ( y = internalUrls.length - 1; y >= 0; y--) {
        assert.ok( $.smoothStateUtility.isExternal(internalUrls[y]) === false, "Internal: " + internalUrls[y] );
    }

});


/**
 * Checks to see if we should be loading this URL
 * @todo    Check to see if we even need the isHash function
 */
QUnit.test( "smoothStateUtility: shouldLoad", function( assert ) {
    var blacklist   = ".no-smoothstate, [target]",
        badAnchors  = [
            $("<a href='intex.html' class='no-smoothstate' target='_blank' />"),
            $("<a href='index.html' target='_blank' />"),
            $("<a href='//google.com' />"),
            $("<a href='#hash' />"),
        ],
        goodAnchors = [
            $("<a href='index.html' />"),
            $("<a href='/index.html' />")
        ],
        i, y;

    // Invalid anchors
    for (i = badAnchors.length - 1; i >= 0; i--) {
        assert.ok( $.smoothStateUtility.shouldLoad(badAnchors[i], blacklist) === false, "Bad: " + $('<div/>').append(badAnchors[i]).html() );
    }

    // Valid anchors
    for ( y = goodAnchors.length - 1; y >= 0; y--) {
        assert.ok( $.smoothStateUtility.shouldLoad(goodAnchors[y], blacklist) === true, "Good: " + $('<div/>').append(goodAnchors[y]).html() );
    }

});


/**
 * Prevents jQuery from stripping elements from $(html)
 */
 QUnit.test( "smoothStateUtility: htmlDoc", function( assert ) {
    var html  = '<!doctype html> <html> <head> <meta charset="utf-8"> <title> Home - jQuery.smoothState.js </title> <link href="/stylesheets/all.css" rel="stylesheet" type="text/css" /> <base href="http://www.example.com/"> </head> <body class="index m-scene" id="main"></body> </html>',
        $html = $.smoothStateUtility.htmlDoc(html);

    // Should find html|head|body|title|base|meta
    assert.ok( $html.filter('html').length === 1, "HTML element found!");
    assert.ok( $html.find('head').length === 1, "head element found!");
    assert.ok( $html.find('body').length === 1, "body element found!");
    assert.ok( $html.find('title').length === 1, "title element found!");
    assert.ok( $html.find('base').length === 1, "base element found!");
    assert.ok( $html.find('meta').length === 1, "meta element found!");
});


/**
 * Resets an object if it has too many properties
 */
 QUnit.test( "smoothStateUtility: clearIfOverCapacity", function( assert ) {
    var capacity = 2,
        objOver  = $.smoothStateUtility.clearIfOverCapacity({ '1':1, '2':2, '3':3 }, capacity),
        objEq    = $.smoothStateUtility.clearIfOverCapacity({ '1':1, '2':2 }, capacity),
        objUnder = $.smoothStateUtility.clearIfOverCapacity({ '1':1 }, capacity);

    assert.ok( Object.keys(objOver).length === 0, "Is a blank object" );
    assert.ok( Object.keys(objEq).length === 2, "Returns the same object" );
    assert.ok( Object.keys(objUnder).length === 1, "Returns the same object" );
});


/**
 * Finds the inner content of an element, by an ID, from a jQuery object
 */
QUnit.test( "smoothStateUtility: getContentById", function( assert ) {
    var id                   = "#main",
        $htmlWithIdOnBody    = '<!doctype html> <html> <head> <title></title> </head> <body id="main"> <div> Content </div> </body> </html>',
        $htmlWithIdInContent = '<!doctype html> <html> <head> <title></title> </head> <body> <div id="main"> Content </div> </body> </html>',
        $htmlWithIdOnHtml    = '<!doctype html> <html id="main"> <head> <title></title> </head> <body> <div> Content </div> </body> </html>';

    assert.ok( $.smoothStateUtility.getContentById(id, $htmlWithIdOnBody), "Html with id on the body element" );
    assert.ok( $.smoothStateUtility.getContentById(id, $htmlWithIdInContent), "Html with id on a div inside the body" );
    assert.ok( $.smoothStateUtility.getContentById(id, $htmlWithIdOnHtml), "Html with id on the HTML element" );

});


/**
 * Stores html content as jquery object in given object
 */
QUnit.test( "smoothStateUtility: storePageIn", function( assert ) {
    var url     = window.location.href,
        title   = "Test title " + Math.random(),
        $html   = '<!doctype html> <html> <head> <title>' + title + '</title> </head> <body id="main"> <div> Content </div> </body> </html>',
        cache   = {};

    $.smoothStateUtility.storePageIn(cache, url, $html);

    assert.ok( cache.hasOwnProperty(url), "Correct entry was made" );
    assert.ok( cache[url].title === title, "Title was stored properly" );
    assert.ok( cache[url].status === "loaded", "Status was set to 'loaded'" );
    assert.ok( cache[url].html instanceof jQuery, "Html is a jquery object" );

});

/**
 * Triggers an "allanimationend" event when all animations are complete
 */
QUnit.test( "smoothStateUtility: triggerAllAnimationEndEvent", function( assert ) {
    var $elem       = $('<div/>'),
        triggered   = false;

    $elem.on("allanimationend", function(){
        triggered = true;
    });

    $.smoothStateUtility.triggerAllAnimationEndEvent($elem);
    $elem.trigger("animationstart").trigger("animationend");

    assert.ok( triggered, "allanimationend fired" );
});




