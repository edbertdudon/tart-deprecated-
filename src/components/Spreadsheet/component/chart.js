import { h } from './element';
import { cssPrefix } from '../config';

// Box object to hold data
function Box2(chart) {
  this.x = 0;
  this.y = 0;
  this.w = 1; // default width and height?
  this.h = 1;
  this.fill = '#444444';
  this.gctx = chart.gctx;
  this.WIDTH = chart.width;
  this.HEIGHT = chart.height;
  this.mySel = chart.mySel;
  this.mySelColor = chart.mySelColor;
  this.mySelWidth = chart.mySelWidth;
  this.mySelBoxSize = chart.mySelBoxSize;
  this.mySelBoxColor = chart.mySelBoxColor;
  this.selectionHandles = chart.selectionHandles;
}

// New methods on the Box class
Box2.prototype = {
  // we used to have a solo draw function
  // but now each box is responsible for its own drawing
  // mainDraw() will call this with the normal canvas
  // myDown will call this with the ghost canvas with 'black'
  draw: function(context, optionalColor) {
    const {
      gctx, WIDTH, HEIGHT, mySel, mySelColor, mySelWidth,
      mySelBoxSize, mySelBoxColor, selectionHandles
    } = this;
    console.log(gctx)
    if (context === gctx) {
      context.fillStyle = 'black'; // always want black for the ghost canvas
    } else {
      context.fillStyle = this.fill;
    }

    // We can skip the drawing of elements that have moved off the screen:
    if (this.x > WIDTH || this.y > HEIGHT) return;
    if (this.x + this.w < 0 || this.y + this.h < 0) return;

    context.fillRect(this.x,this.y,this.w,this.h);

    // draw selection
    // this is a stroke along the box and also 8 new selection handles
    if (mySel === this) {
      context.strokeStyle = mySelColor;
      context.lineWidth = mySelWidth;
      context.strokeRect(this.x,this.y,this.w,this.h);

      // draw the boxes

      var half = mySelBoxSize / 2;

      // 0  1  2
      // 3     4
      // 5  6  7

      // top left, middle, right
      // selectionHandles[0].x = this.x-half;
      // selectionHandles[0].y = this.y-half;
      //
      // selectionHandles[1].x = this.x+this.w/2-half;
      // selectionHandles[1].y = this.y-half;
      //
      // selectionHandles[2].x = this.x+this.w-half;
      // selectionHandles[2].y = this.y-half;
      //
      // //middle left
      // selectionHandles[3].x = this.x-half;
      // selectionHandles[3].y = this.y+this.h/2-half;
      //
      // //middle right
      // selectionHandles[4].x = this.x+this.w-half;
      // selectionHandles[4].y = this.y+this.h/2-half;
      //
      // //bottom left, middle, right
      // selectionHandles[6].x = this.x+this.w/2-half;
      // selectionHandles[6].y = this.y+this.h-half;
      //
      // selectionHandles[5].x = this.x-half;
      // selectionHandles[5].y = this.y+this.h-half;
      //
      // selectionHandles[7].x = this.x+this.w-half;
      // selectionHandles[7].y = this.y+this.h-half;
      setSelectionHandles(this.x, this.y, this.w, this.h, half)

      context.fillStyle = mySelBoxColor;
      for (var i = 0; i < 8; i ++) {
        var cur = selectionHandles[i];
        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
      }
    }

  } // end draw

}

//Initialize a new Box, add it, and invalidate the canvas
function addRect(x, y, w, h, fill) {
  let { boxes2 } = this;
  var rect = new Box2(this);
  rect.x = x;
  rect.y = y;
  rect.w = w
  rect.h = h;
  rect.fill = fill;
  boxes2.push(rect);
  invalidate.call(this);
}


//wipes the canvas context
function clear(c) {
  const { WIDTH, HEIGHT } = this;
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

// Main draw loop.
// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
function mainDraw() {
  const { boxes2, ctx, canvasValid } = this;
  // let { canvasValid } = this;
  if (canvasValid == false) {
    clear.call(this, ctx);

    // Add stuff you want drawn in the background all the time here

    // draw all boxes
    var l = boxes2.length;
    for (var i = 0; i < l; i++) {
      boxes2[i].draw(ctx); // we used to call drawshape, but now each box draws itself
    }

    // Add stuff you want drawn on top all the time here

    // canvasValid = true;
    this.setCanvasValid(true);
  }
}

// Happens when the mouse is moving inside the canvas
function myMove(e){
  const {
    isDrag, mx, my, offsetx, offsety, isResizeDrag,
    mySel, expectResize, selectionHandles, mySelBoxSize,
  } = this;
  if (isDrag) {
    getMouse.call(this, e);

    // mySel.x = mx - offsetx;
    // mySel.y = my - offsety;
    this.setSelectionX(mx - offsetx);
    this.setSelectionY(my - offsety);

    // something is changing position so we better invalidate the canvas!
    invalidate.call(this);
  } else if (isResizeDrag) {
    // time ro resize!
    var oldx = mySel.x;
    var oldy = mySel.y;

    // 0  1  2
    // 3     4
    // 5  6  7
    switch (expectResize) {
      case 0:
        // mySel.x = mx;
        // mySel.y = my;
        // mySel.w += oldx - mx;
        // mySel.h += oldy - my;
        this.setSelectionX(mx - offsetx);
        this.setSelectionY(my - offsety);
        this.setSelectionW(mySel.w + oldx - mx);
        this.setSelectionH(mySel.h + oldy - my);
        break;
      case 1:
        // mySel.y = my;
        // mySel.h += oldy - my;
        this.setSelectionY(my);
        this.setSelectionH(mySel.h + oldy - my);
        break;
      case 2:
        // mySel.y = my;
        // mySel.w = mx - oldx;
        // mySel.h += oldy - my;
        this.setSelectionY(my);
        this.setSelectionW(mx - oldx);
        this.setSelectionH(mySel.h + oldy - my);
        break;
      case 3:
        // mySel.x = mx;
        // mySel.w += oldx - mx;
        this.setSelectionX(mx);
        this.setSelectionW(mySel.w + oldx - mx);
        break;
      case 4:
        // mySel.w = mx - oldx;
        this.setSelectionW(mx - oldx);
        break;
      case 5:
        // mySel.x = mx;
        // mySel.w += oldx - mx;
        // mySel.h = my - oldy;
        this.setSelectionX(mx);
        this.setSelectionW(mySel.w + oldx - mx);
        this.setSelectionH(my - oldy);
        break;
      case 6:
        // mySel.h = my - oldy;
        this.setSelectionH(my - oldy);
        break;
      case 7:
        // mySel.w = mx - oldx;
        // mySel.h = my - oldy;
        this.setSelectionW(mx - oldx);
        this.setSelectionH(my - oldy);
        break;
    }

    invalidate.call(this);
  }

  getMouse.call(this, e);
  // if there's a selection see if we grabbed one of the selection handles
  if (mySel !== null && !isResizeDrag) {
    for (var i = 0; i < 8; i++) {
      // 0  1  2
      // 3     4
      // 5  6  7

      var cur = selectionHandles[i];

      // we dont need to use the ghost context because
      // selection handles will always be rectangles
      if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
          my >= cur.y && my <= cur.y + mySelBoxSize) {
        // we found one!
        // expectResize = i;
        this.setExpectResize(i);
        invalidate.call(this);
        console.log(this.style.cursor)
        switch (i) {
          case 0:
            this.style.cursor='nw-resize';
            break;
          case 1:
            this.style.cursor='n-resize';
            break;
          case 2:
            this.style.cursor='ne-resize';
            break;
          case 3:
            this.style.cursor='w-resize';
            break;
          case 4:
            this.style.cursor='e-resize';
            break;
          case 5:
            this.style.cursor='sw-resize';
            break;
          case 6:
            this.style.cursor='s-resize';
            break;
          case 7:
            this.style.cursor='se-resize';
            break;
        }
        return;
      }

    }
    // not over a selection box, return to normal
    // isResizeDrag = false;
    // expectResize = -1;
    this.style.cursor='auto';
    this.seIsResizeDrag(false);
    this.setExpectResize(-1);
  }

}

// Happens when the mouse is clicked in the canvas
function myDown(e) {
  const {
    expectResize, gctx, boxes2, mx,
    my, mySel, offsetx, offsety,
  } = this;
  getMouse.call(this, e);

  //we are over a selection box
  if (expectResize !== -1) {
    // isResizeDrag = true;
    this.seIsResizeDrag(true);
    return;
  }

  clear.call(this, gctx);
  var l = boxes2.length;
  for (var i = l-1; i >= 0; i--) {
    // draw shape onto ghost context
    boxes2[i].draw(gctx, 'black');

    // get image data at the mouse x,y pixel
    var imageData = gctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;

    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      // mySel = boxes2[i];
      // offsetx = mx - mySel.x;
      // offsety = my - mySel.y;
      // mySel.x = mx - offsetx;
      // mySel.y = my - offsety;
      // isDrag = true;
      this.setSelection(boxes2[i]);
      this.setOffset(mx - mySel.x, my - mySel.y)
      this.setSelectionX(mx - offsetx);
      this.setSelectionY(my - offsety);
      this.setIsDrag(true);

      invalidate.call(this);
      clear.call(this, gctx);
      return;
    }

  }
  // havent returned means we have selected nothing
  // mySel = null;
  this.setSelection(null)
  // clear the ghost canvas for next time
  clear.call(this, gctx);
  // invalidate because we might need the selection border to disappear
  invalidate.call(this);
}

function myUp() {
  // let { isDrag, isResizeDrag, expectResize } = this;
  // isDrag = false;
  // isResizeDrag = false;
  // expectResize = -1;
  this.setIsDrag(false);
  this.seIsResizeDrag(false);
  this.setExpectResize(-1);
}

// adds a new node
function myDblClick(e) {
  const { mx, my } = this;
  getMouse.call(this, e);
  // for this method width and height determine the starting X and Y, too.
  // so I left them as vars in case someone wanted to make them args for something and copy this code
  var width = 20;
  var height = 20;
  addRect.call(this, mx - (width / 2), my - (height / 2), width, height, 'rgba(220,205,65,0.7)');
}


function invalidate() {
  // let { canvasValid } = this;
  // canvasValid = false;
  this.setCanvasValid(false);
}

// Sets mx,my to the mouse position relative to the canvas
// unfortunately this can be tricky, we have to worry about padding and borders
function getMouse(e) {
  const {
    stylePaddingLeft, stylePaddingTop,
    styleBorderLeft, styleBorderTop
  } = this;
  const { el } = this.el;
  var element = el, offsetX = 0, offsetY = 0;

  if (element.offsetParent) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  offsetX += stylePaddingLeft;
  offsetY += stylePaddingTop;

  offsetX += styleBorderLeft;
  offsetY += styleBorderTop;

  // mx = e.pageX - offsetX;
  // my = e.pageY - offsetY;
  this.setMouseCoordinates(e.pageX - offsetX, e.pageY - offsetY);
}

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();
// window.init2 = init2;
// })(window);

// Andy added, as a replacement for
// <body onLoad="init2()">
// $(document).ready(function(){
  // Your code here
  // init2();
// });

class Chart {
  constructor() {
    this.el = h('canvas', `${cssPrefix}-chart`)
      .on('selectstart', () => {
        return false;
      })
      .on('mousedown', (evt) => {
        myDown.call(this, evt);
      })
      .on('mouseup', (evt) => {
        myUp.call(this, evt);
      })
      // .on('dblclick', (evt) => {
      //   myDblClick.call(this, evt);
      // })
      .on('onmousemove', (evt) => {
        myMove.call(this, evt);
      });
    this.boxes2 = [];
    this.selectionHandles = [];
    this.ctx = this.el.el.getContext('2d');
    this.WIDTH = this.el.el.width;
    this.HEIGHT = this.el.el.height;
    this.INTERVAL = 20;
    this.isDrag = false;
    this.isResizeDrag = false;
    this.expectResize = -1;
    this.mx = null;
    this.my = null;
    this.canvasValid = false;
    this.mySel = null;
    this.mySelColor = '#CC0000';
    this.mySelWidth = 2;
    this.mySelBoxColor = 'darkred';
    this.mySelBoxSize = 6;
    this.ghostcanvas = h('canvas', `${cssPrefix}-ghostcanvas`);
    this.gctx = this.ghostcanvas.el.getContext('2d');
    this.offsetx = null;
    this.offsety = null;
    if (document.defaultView && document.defaultView.getComputedStyle) {
      this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.el.el, null)['paddingLeft'], 10)     || 0;
      this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(this.el.el, null)['paddingTop'], 10)      || 0;
      this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(this.el.el, null)['borderLeftWidth'], 10) || 0;
      this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(this.el.el, null)['borderTopWidth'], 10)  || 0;
    }
    this.x = 0;
    this.y = 0;
    this.w = 1; // default width and height?
    this.h = 1;
    this.fill = '#444444';
  }

  setSelectionHandles(x, y, w, h, half) {
    this.selectionHandles[0].x = x-half;
    this.selectionHandles[0].y = y-half;

    this.selectionHandles[1].x = x+w/2-half;
    this.selectionHandles[1].y = y-half;

    this.selectionHandles[2].x = x+w-half;
    this.selectionHandles[2].y = y-half;

    //middle left
    this.selectionHandles[3].x = x-half;
    this.selectionHandles[3].y = y+h/2-half;

    //middle right
    this.selectionHandles[4].x = x+w-half;
    this.selectionHandles[4].y = y+h/2-half;

    //bottom left, middle, right
    this.selectionHandles[6].x = x+w/2-half;
    this.selectionHandles[6].y = y+h-half;

    this.selectionHandles[5].x = x-half;
    this.selectionHandles[5].y = y+h-half;

    this.selectionHandles[7].x = x+w-half;
    this.selectionHandles[7].y = y+h-half;
  }

  setCanvasValid(canvasValid) {
    this.canvasValid = canvasValid;
  }

  setMouseCoordinates(mx, my) {
    this.mx = mx;
    this.my = my;
  }

  setSelection(mySel) {
    this.mySel = mySel;
  }

  setOffset(offsetx, offsety) {
    this.offsetx = offsetx;
    this.offsety = offsety;
  }

  setSelectionX(x) {
    this.mySel.x = x
  }

  setSelectionY(y) {
    this.mySel.y = y
  }

  setSelectionW(w) {
    this.mySel.w = w;
  }

  setSelectionH(h) {
    this.mySel.h = h;
  }

  setIsDrag(isDrag) {
    this.isDrag = isDrag
  }

  seIsResizeDrag(isResizeDrag) {
    this.isResizeDrag = false;
  }

  setExpectResize(i) {
    this.expectResize = i;
  }

  render() {
    // initialize our canvas, add a ghost canvas, set draw loop
    // then add everything we want to intially exist on the canvas
    this.ghostcanvas.height = this.HEIGHT;
    this.ghostcanvas.width = this.WIDTH;
    // //fixes a problem where double clicking causes text to get selected on the canvas
    // el.onselectstart = function () { return false; }

    // fixes mouse co-ordinate problems when there's a border or padding
    // see getMouse for more detail
    // if (document.defaultView && document.defaultView.getComputedStyle) {
    //   var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(el, null)['paddingLeft'], 10)     || 0;
    //   var stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(el, null)['paddingTop'], 10)      || 0;
    //   var styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(el, null)['borderLeftWidth'], 10) || 0;
    //   var styleBorderTop   = parseInt(document.defaultView.getComputedStyle(el, null)['borderTopWidth'], 10)  || 0;
    // }

    // make mainDraw() fire every INTERVAL milliseconds
    setInterval(mainDraw.call(this), this.INTERVAL);

    // set our events. Up and down are for dragging,
    // double click is for making new boxes
    // this.el.onmousedown = myDown;
    // this.el.onmouseup = myUp;
    // this.el.ondblclick = myDblClick;
    // this.el.onmousemove = myMove;

    // set up the selection handle boxes
    for (var i = 0; i < 8; i ++) {
      var rect = new Box2(this);
      this.selectionHandles.push(rect);
    }

    // add custom initialization here:

    // add a large green rectangle
    addRect.call(this, 260, 70, 60, 65, 'rgba(0,205,0,0.7)');
    // addRect(260, 70, 60, 65, 'rgba(0,205,0,0.7)');

    // // add a green-blue rectangle
    // addRect(240, 120, 40, 40, 'rgba(2,165,165,0.7)');
    //
    // // add a smaller purple rectangle
    // addRect(45, 60, 25, 25, 'rgba(150,150,250,0.7)');
  }
}

export default Chart
