//
// http://jsfiddle.net/398dtj5q/6/
//
import { h } from './element';
import { cssPrefix } from '../config';
import chartpng from './chart.png'

let charts = [];
// the selection handles will be in this order:
// 0  1  2
// 3     4
// 5  6  7
let selectionHandles = [];
let canvas;
let ctx;
let WIDTH;
let HEIGHT;
let isDrag = false;
let isResizeDrag = false;
let expectResize = -1;
let mx, my;
let isValid = false;
let mySel = null;
let mySelColor = 'rgb(78,125,255)';
let mySelWidth = 2;
let mySelBoxColor = 'rgb(78,125,255)';
let mySelBoxSize = 6;
let ghostcanvas;
let gctx;
let offsetx, offsety;
let stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
let firstLoad = true;

class Chart {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 150;
    this.h = 150;
    this.fill = '#444444';
    this.image = h('img', `${cssPrefix}-chart-image`)
      .attr('src', chartpng)
  }

  draw(context, optionalColor) {
    // if (context === gctx) {
    //   context.fillStyle = 'black';
    // } else {
    //   context.fillStyle = this.fill;
    // }

    if (this.x > WIDTH || this.y > HEIGHT) return;
    if (this.x + this.w < 0 || this.y + this.h < 0) return;

    // context.fillRect(this.x,this.y,this.w,this.h);
    if (firstLoad) {
      this.image.el.addEventListener('load', e => {
        context.drawImage(this.image.el, this.x, this.y, this.w, this.h);
      });
      firstLoad = false;
    } else {
      context.drawImage(this.image.el, this.x, this.y, this.w, this.h);
    }
    if (mySel === this) {
      context.strokeStyle = mySelColor;
      context.lineWidth = mySelWidth;
      context.strokeRect(this.x,this.y,this.w,this.h);

      let half = mySelBoxSize / 2;

      // top left, middle, right
      selectionHandles[0].x = this.x-half;
      selectionHandles[0].y = this.y-half;

      selectionHandles[1].x = this.x+this.w/2-half;
      selectionHandles[1].y = this.y-half;

      selectionHandles[2].x = this.x+this.w-half;
      selectionHandles[2].y = this.y-half;

      //middle left
      selectionHandles[3].x = this.x-half;
      selectionHandles[3].y = this.y+this.h/2-half;

      //middle right
      selectionHandles[4].x = this.x+this.w-half;
      selectionHandles[4].y = this.y+this.h/2-half;

      //bottom left, middle, right
      selectionHandles[6].x = this.x+this.w/2-half;
      selectionHandles[6].y = this.y+this.h-half;

      selectionHandles[5].x = this.x-half;
      selectionHandles[5].y = this.y+this.h-half;

      selectionHandles[7].x = this.x+this.w-half;
      selectionHandles[7].y = this.y+this.h-half;

      context.fillStyle = mySelBoxColor;
      context.strokeStyle = '#ffffff';
      for (let i=0; i<8; i ++) {
        let cur = selectionHandles[i];
        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
        context.strokeRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
      }
    }
  }
}

function addRect(x, y, w, h, fill) {
  let rect = new Chart;
  rect.x = x;
  rect.y = y;
  rect.w = w
  rect.h = h;
  rect.fill = fill;
  charts.push(rect);
  invalidate();
}

function chartInitEvents(vRect) {
  canvas = document.getElementById(`${cssPrefix}-chart`);
  HEIGHT = vRect.height-25;
  WIDTH = vRect.width-30;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = HEIGHT;
  ghostcanvas.width = WIDTH;
  gctx = ghostcanvas.getContext('2d');

  canvas.onselectstart = function () { return false; }

  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
  }

  setInterval(mainDraw, 20);

  for (let i=0; i<8; i ++) {
    let rect = new Chart;
    selectionHandles.push(rect);
  }

  addRect(0, 0, 500, 500, 'rgba(0,205,0,0.7)');
}

// function chartInitEvents() {
//   const { el, vRect } = this;
//   HEIGHT = vRect.height-25;
//   WIDTH = vRect.width-30;
//   ctx = el.getContext('2d');
//   ghostcanvas = document.createElement('canvas');
//   ghostcanvas.height = HEIGHT;
//   ghostcanvas.width = WIDTH;
//   gctx = ghostcanvas.getContext('2d');
//
//   el.onselectstart = function () { return false; }
//
//   if (document.defaultView && document.defaultView.getComputedStyle) {
//     stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(el, null)['paddingLeft'], 10)     || 0;
//     stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(el, null)['paddingTop'], 10)      || 0;
//     styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(el, null)['borderLeftWidth'], 10) || 0;
//     styleBorderTop   = parseInt(document.defaultView.getComputedStyle(el, null)['borderTopWidth'], 10)  || 0;
//   }
//
//   setInterval(mainDraw, 20);
//
//   for (let i=0; i<8; i ++) {
//     let rect = new Chart;
//     selectionHandles.push(rect);
//   }
//
//   addRect(0, 0, 500, 500, 'rgba(0,205,0,0.7)');
// }

function clear(c) {
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

function mainDraw() {
  if (isValid == false) {
    clear(ctx);
    for (let i=0; i<charts.length; i++) {
      charts[i].draw(ctx);
    }
    isValid = true;
  }
}

function chartMousemove(e) {
  if (isDrag) {
    getMouse(e);
    mySel.x = mx - offsetx;
    mySel.y = my - offsety;
    invalidate();
  } else if (isResizeDrag) {
    let oldx = mySel.x;
    let oldy = mySel.y;
    switch (expectResize) {
      case 0:
        // Still Wrong
        // mySel.x = mx;
        mySel.x = my;
        mySel.y = my;
        // mySel.w += oldx - mx;
        mySel.w += oldy - my;
        mySel.h += oldy - my;
        console.log(mySel)
        break;
      case 1:
        mySel.y = my;
        mySel.h += oldy - my;
        break;
      case 2:
        mySel.y = my;
        // mySel.w = mx - oldx;
        mySel.w += oldy - my;
        mySel.h += oldy - my;
        break;
      case 3:
        mySel.x = mx;
        mySel.w += oldx - mx;
        break;
      case 4:
        mySel.w = mx - oldx;
        break;
      case 5:
        mySel.x = mx;
        mySel.w += oldx - mx;
        mySel.h += oldx - mx;
        // mySel.h = my - oldy;
        break;
      case 6:
        mySel.h = my - oldy;
        break;
      case 7:
        mySel.w = mx - oldx;
        mySel.h = mx - oldx;
        // mySel.h = my - oldy;
        break;
    }
    invalidate();
  }
  getMouse(e);
  if (mySel !== null && !isResizeDrag) {
    for (let i=0; i<8; i++) {
      let cur = selectionHandles[i];
      if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
        my >= cur.y && my <= cur.y + mySelBoxSize) {
        expectResize = i;
        invalidate();
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
        return true;
      }
    }
    isResizeDrag = false;
    expectResize = -1;
    this.style.cursor='auto';
  }
  return false
}

function chartMousedown(e) {
  getMouse(e);
  if (expectResize !== -1) {
    isResizeDrag = true;
    return true;
  }
  clear(gctx);
  let l = charts.length;
  for (let i = l-1; i >= 0; i--) {
    charts[i].draw(gctx, 'black');
    let imageData = gctx.getImageData(mx, my, 1, 1);
    if (imageData.data[3] > 0) {
      mySel = charts[i];
      offsetx = mx - mySel.x;
      offsety = my - mySel.y;
      mySel.x = mx - offsetx;
      mySel.y = my - offsety;
      isDrag = true;
      invalidate();
      clear(gctx);
      return true;
    }
  }
  mySel = null;
  clear(gctx);
  invalidate();
  return false
}

function chartMouseup() {
  isDrag = false;
  isResizeDrag = false;
  expectResize = -1;
}

function invalidate() {
  isValid = false;
}

function getMouse(e) {
  // const { el } = this;
  let element = canvas, offsetX = 0, offsetY = 0;
  if (element.offsetParent) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  offsetX += stylePaddingLeft;
  offsetY += stylePaddingTop;

  offsetX += styleBorderLeft;
  offsetY += styleBorderTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY
}

// class Chart {
//   constructor(el, vRect) {
//     this.el = el;
//     this.vRect = vRect;
//     chartInitEvents.call(this);
//   }
// }

export default Chart
export {
  chartInitEvents,
  chartMousedown,
  chartMouseup,
  chartMousemove
}
