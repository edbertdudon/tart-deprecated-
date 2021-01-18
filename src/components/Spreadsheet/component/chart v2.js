import { h } from './element';
import { bind, unbind } from './event';
import { cssPrefix } from '../config';
import chartpng from './chart.png';

let isValid = false;
let isDrag = false;
let mx = 0;
let my = 0;
let mySel = null;
let offsetx = 0;
let offsety = 0;

class Chart {
  constructor(el) {
    this.el = el;
    this.ctx = el.getContext('2d');
    // this.x = 0;
    // this.y = 0;
    this.w = 300;
    this.h = 150;
    // this.isDrag = false;
    this.ghost = document.createElement('canvas');
    this.ghost.width = this.w;
    this.ghost.height = this.h;
    this.gctx = this.ghost.getContext('2d');
    // this.offsetx = 0;
    // this.offsety = 0;
    if (document.defaultView && document.defaultView.getComputedStyle) {
      const computedStyle = document.defaultView.getComputedStyle(el, null);
      this.stylePaddingLeft = parseInt(computedStyle.paddingLeft, 10);
      this.stylePaddingTop = parseInt(computedStyle.paddingTop, 10);
      this.styleBorderLeft = parseInt(computedStyle.borderLeftWidth, 10);
      this.styleBorderTop = parseInt(computedStyle.borderTopWidth, 10);
    }
    this.fill = '#444444';
    // this.image = h('img', `${cssPrefix}-chart-image`)
    //   .attr('src', chartpng)
    //   .on('load', () => {
    //     setInterval(this.draw(), 20);
    //   })
    // this.image.width = 150;
    // this.image.height = 150;
    // this.charts = [this.image];
    this.charts = [];
    // this.isValid = false;
    // this.selection = this.charts[0];
    mySel = this.charts[0];
    this.color = '#CC0000';
    this.lineWidth = 2;

    this.clear = this.clear.bind(this);
    this.invalidate = this.invalidate.bind(this);
    this.getMouse = this.getMouse.bind(this);
    this.boundMousemove = this.mouseMove.bind(this);
  }

  draw() {
    const {
      charts, ctx, color, lineWidth,
    } = this;
    const { width, height } = mySel;
    const { x, y } = mySel.el;
    console.log(isValid);
    if (isValid == false) {
      this.clear(ctx);
      for (let i = 0; i < charts.length; i++) {
        ctx.drawImage(charts[i].el, 0, 0, width, height);
      }
      console.log(mySel);
      if (mySel != null) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
      }
      isValid = true;
    }
  }

  mouseDown(e) {
    const {
      gctx, charts, ctx, getMouse, clear,
      invalidate, boundMousemove,
    } = this.chart;
    const { width, height } = mySel;
    getMouse(e);
    clear(gctx);
    for (let i = 0; i < charts.length; i++) {
      gctx.drawImage(charts[i].el, 0, 0, width, height);
      const imageData = gctx.getImageData(mx, my, 1, 1);
      // const index = (x + y * imageData.width) * 4;
      if (imageData.data[3] > 0) {
        mySel = charts[i];
        offsetx = mx - mySel.x;
        offsety = my - mySel.y;
        mySel.x = mx - offsetx;
        mySel.y = my - offsety;
        isDrag = true;
        // bind(this.overlayerEl.el, 'mousemove', boundMousemove);
        bind(this.chartEl.el, 'mousemove', boundMousemove);
        invalidate();
        clear(gctx);
        return true;
      }
    }
    mySel = null;
    clear(gctx);
    invalidate();
    return false;
  }

  mouseUp(e) {
    const { el, boundMousemove } = this.chart;
    isDrag = false;
    // unbind(this.overlayerEl.el, 'mousemove', boundMousemove);
    unbind(this.chartEl.el, 'mousemove', boundMousemove);
  }

  mouseMove(e) {
    const { getMouse, invalidate } = this;
    if (isDrag) {
      getMouse(e);
      mySel.x = mx - offsetx;
      mySel.y = my - offsety;
      invalidate();
    }
  }

  getMouse(e) {
    let {
      el, stylePaddingLeft, stylePaddingTop,
      styleBorderLeft, styleBorderTop,
    } = this;
    let offsetX = 0; let
      offsetY = 0;
    if (el.offsetParent) {
      do {
        offsetX += el.offsetLeft;
        offsetY += el.offsetTop;
      } while ((el = el.offsetParent));
    }
    offsetX += stylePaddingLeft;
    offsetY += stylePaddingTop;

    offsetX += styleBorderLeft;
    offsetY += styleBorderTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
  }

  clear(ctx) {
    ctx.clearRect(0, 0, this.w, this.h);
  }

  invalidate() {
    isValid = false;
  }
}

export default Chart;
// export {
//   chartMousedown,
//   chartMouseup
// };
