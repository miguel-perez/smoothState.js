# Demo: Different page transitions based on clicked anchor with smoothState.js

This demo shows how to switch transitions based on initiating link with [smoothState.js](https://github.com/miguel-perez/smoothState.js). This solution has been inspired by [@pudgereyem's comment](https://github.com/miguel-perez/smoothState.js/issues/143#issuecomment-84967896) on [smoothState.js #143](https://github.com/miguel-perez/smoothState.js/issues/143).

You can [view the demo here](https://rawgit.com/bfncs/90ae0de3174e608465f6/raw/index.html).

The demo implements a crude idea of viewports that are horizontally aligned to determine the needed animation: every anchor has a numeric `data-target` paramter that represents the needed viewport while every scene element provides a numeric `data-viewport` parameter that reprents the current viewport. If the viewport requested for the clicked target is larger then the current viewport, the scene element is moved to the left, else to the right.

The logic to determine the wanted animation is implemented in the `onBefore` callback, the animations themselves are defined as pure CSS animations. Please feel free to take this as a starting point to implement you own animation logic.

## Install

To install this demo, copy all files to the root of your local webserver.

Alternatively, you can use the builtin static webserver.

1. Install Node.js dependencies: `npm install`
2. Start webserver `npm start`
3. You can now access the demo site under [`http://localhost:8080`](http://localhost:8080)

If you need to change the used port to `PORT`, try `npm config set smoothstate-transitions-demo:port PORT`.