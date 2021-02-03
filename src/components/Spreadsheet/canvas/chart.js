//
// http://jsfiddle.net/398dtj5q/6/
//
import { h } from '../component/element';
import { cssPrefix } from '../config';
import chartpng from './chart.png';

// global var
// the selection handles will be in this order:
// 0  1  2
// 3     4
// 5  6  7
const INTERVAL = 20;
const HANDLE_COLOR = 'rgb(78,125,255)';
const HANDLE_WIDTH = 2;
const HANDLE_BOX_SIZE = 6;
const HANDLE_BOX_COLOR = 'rgb(78,125,255)';

const charts = [];
const selectionHandles = [];
let canvas;
let ctx;
let WIDTH;
let HEIGHT;
let isDrag = false;
let isResizeDrag = false;
let expectResize = -1;
let mx;
let my;
let isValid = false;
let chartSelect = null;
let ghostcanvas;
let gctx;
let offsetx;
let offsety;
let stylePaddingLeft;
let stylePaddingTop;
let styleBorderLeft;
let styleBorderTop;
let firstLoad = true;

class Handle {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 1;
    this.h = 1;
    this.fill = '#444444';
  }
}

class ChartBox {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 500;
    this.h = 500;
    this.fill = '#444444';
    this.range = '';
    this.firstrow = true;
    this.types = [];
    this.variablex = null;
    this.variabley = null;
    this.image = h('img', `${cssPrefix}-chart-image`);
    // .attr('src', chartpng);
    this.sparkuri = '';
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
      this.image.el.addEventListener('load', (e) => {
        context.drawImage(this.image.el, this.x, this.y, this.w, this.h);
      });
      firstLoad = false;
    } else {
      context.drawImage(this.image.el, this.x, this.y, this.w, this.h);
    }

    if (chartSelect === this) {
      context.strokeStyle = HANDLE_COLOR;
      context.lineWidth = HANDLE_WIDTH;
      context.strokeRect(this.x, this.y, this.w, this.h);

      const half = HANDLE_BOX_SIZE / 2;

      // top left, middle, right
      selectionHandles[0].x = this.x - half;
      selectionHandles[0].y = this.y - half;

      selectionHandles[1].x = this.x + this.w / 2 - half;
      selectionHandles[1].y = this.y - half;

      selectionHandles[2].x = this.x + this.w - half;
      selectionHandles[2].y = this.y - half;

      // middle left
      selectionHandles[3].x = this.x - half;
      selectionHandles[3].y = this.y + this.h / 2 - half;

      // middle right
      selectionHandles[4].x = this.x + this.w - half;
      selectionHandles[4].y = this.y + this.h / 2 - half;

      // bottom left, middle, right
      selectionHandles[6].x = this.x + this.w / 2 - half;
      selectionHandles[6].y = this.y + this.h - half;

      selectionHandles[5].x = this.x - half;
      selectionHandles[5].y = this.y + this.h - half;

      selectionHandles[7].x = this.x + this.w - half;
      selectionHandles[7].y = this.y + this.h - half;

      context.fillStyle = HANDLE_BOX_COLOR;
      context.strokeStyle = '#ffffff';
      for (let i = 0; i < 8; i++) {
        const cur = selectionHandles[i];
        context.fillRect(cur.x, cur.y, HANDLE_BOX_SIZE, HANDLE_BOX_SIZE);
        context.strokeRect(cur.x, cur.y, HANDLE_BOX_SIZE, HANDLE_BOX_SIZE);
      }
    }
  }
}

// function addRect(x, y, w, h, fill, charts) {
//   const rect = new Chart();
//   rect.x = x;
//   rect.y = y;
//   rect.w = w;
//   rect.h = h;
//   rect.fill = fill;
//   charts.push(rect);
//   invalidate();
// }

function addRect(chart) {
  charts.push(chart);
  invalidate();
}

function changeRect(i, chart) {
  charts.splice(i, 1, chart);
  invalidate();
}

function deleteRect(i) {
  charts.splice(i, 1);
  invalidate();
}

function setChartSelect(chart) {
  chartSelect = chart;
  invalidate();
}

function chartInitEvents() {
  const vRect = this.getRect();
  canvas = document.getElementById(`${cssPrefix}-chart`);
  HEIGHT = vRect.height - 25;
  WIDTH = vRect.width - 30;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = HEIGHT;
  ghostcanvas.width = WIDTH;
  gctx = ghostcanvas.getContext('2d');

  canvas.onselectstart = function () { return false; };

  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingLeft, 10) || 0;
    stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingTop, 10) || 0;
    styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null).borderLeftWidth, 10) || 0;
    styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null).borderTopWidth, 10) || 0;
  }

  setInterval(mainDraw, INTERVAL, this.data);

  for (let i = 0; i < 8; i++) {
    const rect = new Handle();
    selectionHandles.push(rect);
  }

  // addRect(0, 0, 500, 500, 'rgba(0,205,0,0.7)', charts);
  // this.data.charts.forEach((chart) => addRect(chart));
}

function clear(c) {
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

function mainDraw(data) {
  if (isValid == false) {
    // const { chartSelect } = data;
    // const { charts, chartSelect } = data;
    clear(ctx);
    for (let i = 0; i < charts.length; i++) {
      charts[i].draw(ctx, null, chartSelect);
    }
    isValid = true;
  }
}

function chartMousemove(e) {
  // const { chartSelect } = this.data;
  if (isDrag) {
    getMouse(e);
    chartSelect.x = mx - offsetx;
    chartSelect.y = my - offsety;
    invalidate();
  } else if (isResizeDrag) {
    const oldx = chartSelect.x;
    const oldy = chartSelect.y;
    switch (expectResize) {
      case 0:
        // Still Wrong
        // chartSelect.x = mx;
        chartSelect.x = my;
        chartSelect.y = my;
        // chartSelect.w += oldx - mx;
        chartSelect.w += oldy - my;
        chartSelect.h += oldy - my;
        console.log(chartSelect);
        break;
      case 1:
        chartSelect.y = my;
        chartSelect.h += oldy - my;
        break;
      case 2:
        chartSelect.y = my;
        // chartSelect.w = mx - oldx;
        chartSelect.w += oldy - my;
        chartSelect.h += oldy - my;
        break;
      case 3:
        chartSelect.x = mx;
        chartSelect.w += oldx - mx;
        break;
      case 4:
        chartSelect.w = mx - oldx;
        break;
      case 5:
        chartSelect.x = mx;
        chartSelect.w += oldx - mx;
        chartSelect.h += oldx - mx;
        // chartSelect.h = my - oldy;
        break;
      case 6:
        chartSelect.h = my - oldy;
        break;
      case 7:
        chartSelect.w = mx - oldx;
        chartSelect.h = mx - oldx;
        // chartSelect.h = my - oldy;
        break;
    }
    this.data.chartSelect = chartSelect;
    invalidate();
  }
  getMouse(e);
  const { overlayerEl } = this;
  if (chartSelect !== null && !isResizeDrag) {
    for (let i = 0; i < 8; i++) {
      const cur = selectionHandles[i];
      if (mx >= cur.x && mx <= cur.x + HANDLE_BOX_SIZE
        && my >= cur.y && my <= cur.y + HANDLE_BOX_SIZE) {
        expectResize = i;
        invalidate();
        switch (i) {
          case 0:
            overlayerEl.el.style.cursor = 'nw-resize';
            break;
          case 1:
            overlayerEl.el.style.cursor = 'n-resize';
            break;
          case 2:
            overlayerEl.el.style.cursor = 'ne-resize';
            break;
          case 3:
            overlayerEl.el.style.cursor = 'w-resize';
            break;
          case 4:
            overlayerEl.el.style.cursor = 'e-resize';
            break;
          case 5:
            overlayerEl.el.style.cursor = 'sw-resize';
            break;
          case 6:
            overlayerEl.el.style.cursor = 's-resize';
            break;
          case 7:
            overlayerEl.el.style.cursor = 'se-resize';
            break;
        }
        return true;
      }
    }
    isResizeDrag = false;
    expectResize = -1;
    overlayerEl.el.style.cursor = 'auto';
  }

  if (isDrag || isResizeDrag) {
    return true;
  }
  return false;
}

function chartMousedown(e) {
  getMouse(e);
  if (expectResize !== -1) {
    isResizeDrag = true;
    return true;
  }
  clear(gctx);
  // const { charts } = this.data;
  const l = charts.length;
  for (let i = l - 1; i >= 0; i--) {
    // charts[i].draw(gctx, 'black', this.data.chartSelect);
    charts[i].draw(gctx, 'black');
    this.data.charts[i] = charts[i];
    const imageData = gctx.getImageData(mx, my, 1, 1);
    if (imageData.data[3] > 0) {
      chartSelect = charts[i];
      offsetx = mx - chartSelect.x;
      offsety = my - chartSelect.y;
      chartSelect.x = mx - offsetx;
      chartSelect.y = my - offsety;
      this.data.chartSelect = chartSelect;
      isDrag = true;
      invalidate();
      clear(gctx);
      return true;
    }
  }
  chartSelect = null;
  this.data.chartSelect = null;
  clear(gctx);
  invalidate();
  return false;
}

function chartMouseup() {
  isDrag = false;
  isResizeDrag = false;
  expectResize = -1;
}

function chartScrollVertical(top) {
  const { charts } = this.data;
  const l = charts.length;
  for (let i = l - 1; i >= 0; i--) {
    charts[i].y = charts[i].y - top;
    invalidate();
  }
}

function chartScrollHorizontal(left) {
  const { charts } = this.data;
  const l = charts.length;
  for (let i = l - 1; i >= 0; i--) {
    charts[i].x = charts[i].x + left;
    invalidate();
  }
}

function invalidate() {
  isValid = false;
}

function getMouse(e) {
  let element = canvas; let offsetX = 0; let
    offsetY = 0;
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
  my = e.pageY - offsetY;
}

export {
  ChartBox,
  addRect,
  changeRect,
  deleteRect,
  setChartSelect,
  chartInitEvents,
  mainDraw,
  invalidate,
  chartMousedown,
  chartMouseup,
  chartMousemove,
  chartScrollVertical,
  chartScrollHorizontal,
};
