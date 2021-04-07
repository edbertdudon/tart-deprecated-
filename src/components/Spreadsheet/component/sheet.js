/* global window */
import { h } from './element';
import { bind, mouseMoveUp, bindTouch } from './event';
import Resizer from './resizer';
import Scrollbar from './scrollbar';
import Selector from './selector';
import Editor from './editor';
// import Print from './print';
import ContextMenu from './contextmenu';
import Table from './table';
import {
  chartInitEvents, chartMousedown, chartMouseup, chartMousemove,
  chartSetVertical, chartSetHorizontal, invalidate,
} from '../canvas/chart';
import Toolbar from './toolbar/index';
import ModalValidation from './modal_validation';
import SortFilter from './sort_filter';
import { xtoast } from './message';
import { cssPrefix } from '../config';
// import { formulas } from '../core/formula';
import { formulas } from '../cloudr/formula';
import { options } from '../options';
import {
  OPERATORS_REGEX, getRange, getRangeIndex, getRangeIndexes,
  getTextWidth, getTextHeight, getTextsFromColumn, getTextsFromRows,
} from '../../../functions';
import { defaultSettings } from '../core/data_proxy';

const INTERVAL_WAIT = 100;
let isResize = false;
let addingCellRef = false;
// let addedCellRef = false;

/**
 * @desc throttle fn
 * @param func function
 * @param wait Delay in milliseconds
 */
function throttle(func, wait) {
  let timeout;
  return (...arg) => {
    const that = this;
    const args = arg;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(that, args);
      }, wait);
    }
  };
}

function scrollbarMove() {
  const {
    data, verticalScrollbar, horizontalScrollbar,
  } = this;
  const {
    l, t, left, top, width, height,
  } = data.getSelectedRect();
  const tableOffset = this.getTableOffset();
  // console.log(',l:', l, ', left:', left, ', tOffset.left:', tableOffset.width);
  if (Math.abs(left) + width > tableOffset.width) {
    // chartScrollHorizontal.call(this, -width);
    horizontalScrollbar.move({ left: l + width - tableOffset.width });
  } else {
    const fsw = data.freezeTotalWidth();
    if (left < fsw) {
      // chartScrollHorizontal.call(this, width);
      horizontalScrollbar.move({ left: l - 1 - fsw });
    }
  }
  // console.log('top:', top, ', height:', height, ', tof.height:', tableOffset.height);
  if (Math.abs(top) + height > tableOffset.height) {
    // chartScrollVertical.call(this, height);
    verticalScrollbar.move({ top: t + height - tableOffset.height - 1 });
  } else {
    const fsh = data.freezeTotalHeight();
    if (top < fsh) {
      // chartScrollVertical.call(this, -height);
      verticalScrollbar.move({ top: t - 1 - fsh });
    }
  }
}

function canAddCellRef(cell, cellRef) {
  if (!(cell && 'text' in cell && cell.text.startsWith('='))) {
    return false;
  }

  const v = this.editor.inputText;
  const start = v.lastIndexOf('=');
  // if (start !== -1 && v.length >= 1) {
  const nv = v.substring(start + 1).split(OPERATORS_REGEX);
  const lastnv = nv[nv.length - 1];
  return lastnv.length === 0 || lastnv === cellRef;
}

function createCellText(inputText, cellRef) {
  let text = inputText;
  const nv = text.split(OPERATORS_REGEX);
  const lastnv = nv[nv.length - 1];
  if (lastnv !== '=' && lastnv.length !== 0) {
    text = text.slice(0, -lastnv.length);
  }
  return text + cellRef;
}

function selectorSet(multiple, ri, ci, indexesUpdated = true, moving = false) {
  if (ri === -1 && ci === -1) return;
  const {
    table, selector, toolbar, data, contextMenu, editor,
  } = this;
  selector.removeCellRefs();
  contextMenu.setMode((ri === -1 || ci === -1) ? 'row-col' : 'range');
  const cell = data.getCell(ri, ci);

  const { prev } = data;
  const previousCell = data.getCell(prev.ri, prev.ci);
  const range = {
    sri: ri, sci: ci, eri: ri, eci: ci,
  };
  const cellRef = getRange(range, data.rows.len);
  const addingorWillAdd = this.editor.el.css('display') === 'block'
    && (addingCellRef || canAddCellRef.call(this, previousCell, cellRef));

  if (addingorWillAdd) {
    this.addingFormula = true;
  } else {
    this.addingFormula = false;
  }

  const text = createCellText.call(this, editor.inputText, cellRef);
  if (multiple) {
    selector.setEnd(ri, ci, moving);
    if (addingorWillAdd) {
      this.trigger('cells-selected', { text }, {
        sri: prev.ri, sci: prev.ci, eri: prev.ri, eci: prev.ci,
      });
    } else {
      this.trigger('cells-selected', cell, selector.range);
    }
  } else {
    // trigger click event
    selector.set(ri, ci, indexesUpdated);
    if (addingorWillAdd) {
      this.trigger('cell-selected', { text }, prev.ri, prev.ci);
    } else {
      this.trigger('cell-selected', cell, ri, ci);
    }
  }
  toolbar.reset();
  table.render();
}

// function formulaSelectorSet(multiple, ri, ci, indexesUpdated = true, moving = false) {
//   if (ri === -1 && ci === -1) return;
//   const {
//     table, formulaSelector, toolbar,
//   } = this;
//   formulaSelector.removeCellRefs();
//   if (multiple) {
//     formulaSelector.setEnd(ri, ci, moving);
//   } else {
//     // trigger click event
//     formulaSelector.set(ri, ci, indexesUpdated);
//   }
//   toolbar.reset();
//   table.render();
// }

function setGroup(cell, ri, ci, nrows, ncols) {
  const { selector, toolbar, table } = this;
  selector.setGroup(ri, ci, nrows, ncols);
  this.trigger('cell-selected', cell, ri, ci);
  toolbar.reset();
  table.render();
}

function selectorSetGroup(ri, ci) {
  if (ri === -1 && ci === -1) return;
  const {
    selector, data, contextMenu,
  } = this;
  contextMenu.setMode((ri === -1 || ci === -1) ? 'row-col' : 'range');
  const cell = data.getCell(ri, ci);
  const {
    sri, sci, eri, eci,
  } = selector.range;
  setGroup.call(this, cell, ri, ci, eri - sri, eci - sci);
  // selector.setGroup(ri, ci, eri - sri, eci - sci);
  // this.trigger('cell-selected', cell, ri, ci);
  // toolbar.reset();
  // table.render();
}

// multiple: boolean
// direction: left | right | up | down | row-first | row-last | col-first | col-last
export function selectorMove(multiple, direction) {
  const {
    selector, data,
  } = this;
  const { rows, cols, prev } = data;
  let [ri, ci] = selector.indexes;
  if (addingCellRef && (prev.ri !== ri || prev.ci !== ci)) {
    ri = prev.ri;
    ci = prev.ci;
    // addedCellRef = true;
  }
  const { eri, eci } = selector.range;
  if (multiple) {
    [ri, ci] = selector.moveIndexes;
  }
  // console.log('selector.move:', ri, ci);
  if (direction === 'left') {
    if (ci > 0) ci -= 1;
  } else if (direction === 'right') {
    if (eci !== ci && !addingCellRef) ci = eci;
    if (ci < cols.len - 1) ci += 1;
  } else if (direction === 'up') {
    if (ri > 0) ri -= 1;
  } else if (direction === 'down') {
    if (eri !== ri && !addingCellRef) ri = eri;
    if (ri < rows.len - 1) ri += 1;
  } else if (direction === 'row-first') {
    ci = 0;
  } else if (direction === 'row-last') {
    ci = cols.len - 1;
  } else if (direction === 'col-first') {
    ri = 0;
  } else if (direction === 'col-last') {
    ri = rows.len - 1;
  }
  if (multiple) {
    selector.moveIndexes = [ri, ci];
  }
  selectorSet.call(this, multiple, ri, ci);
  scrollbarMove.call(this);
  addingCellRef = false;
}

// export function selectorMoveSelected(multiple, direction, nri, nci) {
//   const {
//     selector, data,
//   } = this;
//   const { rows, cols } = data;
//   let ri = nri;
//   let ci = nci;
//   // let [ri, ci] = selector.indexes;
//   const { eri, eci } = selector.range;
//   // if (multiple) {
//   //   [ri, ci] = selector.moveIndexes;
//   // }
//   // console.log('selector.move:', ri, ci);
//   if (direction === 'left') {
//     if (ci > 0) ci -= 1;
//   } else if (direction === 'right') {
//     if (eci !== ci) ci = eci;
//     if (ci < cols.len - 1) ci += 1;
//   } else if (direction === 'up') {
//     if (ri > 0) ri -= 1;
//   } else if (direction === 'down') {
//     if (eri !== ri) ri = eri;
//     if (ri < rows.len - 1) ri += 1;
//   } else if (direction === 'row-first') {
//     ci = 0;
//   } else if (direction === 'row-last') {
//     ci = cols.len - 1;
//   } else if (direction === 'col-first') {
//     ri = 0;
//   } else if (direction === 'col-last') {
//     ri = rows.len - 1;
//   }
//   // if (multiple) {
//   //   selector.moveIndexes = [ri, ci];
//   // }
//   selectorSet.call(this, multiple, ri, ci);
//   scrollbarMove.call(this);
// }

// private methods
function overlayerMousemove(evt) {
  isResize = chartMousemove.call(this, evt);
  if (isResize) return;
  // console.log('x:', evt.offsetX, ', y:', evt.offsetY);
  if (evt.buttons !== 0) return;
  if (evt.target.className === `${cssPrefix}-resizer-hover`) return;
  const { offsetX, offsetY } = evt;
  const {
    rowResizer, colResizer, tableEl, data,
  } = this;
  const { rows, cols } = data;
  if (offsetX > cols.indexWidth && offsetY > rows.height) {
    rowResizer.hide();
    colResizer.hide();
    return;
  }
  const tRect = tableEl.box();
  const cRect = data.getCellRectByXY(evt.offsetX, evt.offsetY);
  if (cRect.ri >= 0 && cRect.ci === -1) {
    cRect.width = cols.indexWidth;
    rowResizer.show(cRect, {
      width: tRect.width,
    });
    if (rows.isHide(cRect.ri - 1)) {
      rowResizer.showUnhide(cRect.ri);
    } else {
      rowResizer.hideUnhide();
    }
  } else {
    rowResizer.hide();
  }
  if (cRect.ri === -1 && cRect.ci >= 0) {
    cRect.height = rows.height;
    colResizer.show(cRect, {
      height: tRect.height,
    });
    if (cols.isHide(cRect.ci - 1)) {
      colResizer.showUnhide(cRect.ci);
    } else {
      colResizer.hideUnhide();
    }
  } else {
    colResizer.hide();
  }
}

let scrollThreshold = 10;
// let scrollThreshold = 0;
function overlayerMousescroll(evt) {
  const { deltaY, deltaX } = evt;
  const tempY = Math.abs(deltaY);
  const tempX = Math.abs(deltaX);
  // console.log(tempY, tempX)
  // if (tempY > 40) {
  //   scrollThreshold -= tempY * 2;
  // } else
  if (tempY > 20) {
    scrollThreshold -= tempY;
  } else if (tempX > 40) {
    scrollThreshold -= tempX;
  } else if (tempX > 20) {
    scrollThreshold -= tempX / 2;
  } else {
    scrollThreshold -= 1;
  }

  if (scrollThreshold > 0) return;
  scrollThreshold = 10;
  // scrollThreshold = 0;

  const { verticalScrollbar, horizontalScrollbar, data } = this;
  const { top } = verticalScrollbar.scroll();
  const { left } = horizontalScrollbar.scroll();
  // console.log('evt:::', evt.wheelDelta, evt.detail * 40);

  const { rows, cols } = data;

  // deltaY for vertical delta
  // const { deltaY, deltaX } = evt;
  const loopValue = (ii, vFunc) => {
    let i = ii;
    let v = 0;
    do {
      v = vFunc(i);
      i += 1;
    } while (v <= 0);
    return v;
  };
  // console.log('deltaX', deltaX, 'evt.detail', evt.detail);
  // if (evt.detail) deltaY = evt.detail * 40;
  const moveY = (vertical) => {
    if (vertical > 0) {
      // up
      const ri = data.scroll.ri + 1;
      if (ri < rows.len) {
        const rh = loopValue(ri, (i) => rows.getHeight(i));
        // chartScrollVertical.call(this, rh);
        verticalScrollbar.move({ top: top + rh - 1 });
      }
    } else {
      // down
      const ri = data.scroll.ri - 1;
      if (ri >= 0) {
        const rh = loopValue(ri, (i) => rows.getHeight(i));
        // chartScrollVertical.call(this, -rh);
        verticalScrollbar.move({ top: ri === 0 ? 0 : top - rh });
      }
    }
  };

  // deltaX for Mac horizontal scroll
  const moveX = (horizontal) => {
    if (horizontal > 0) {
      // left
      const ci = data.scroll.ci + 1;
      if (ci < cols.len) {
        const cw = loopValue(ci, (i) => cols.getWidth(i));
        // chartScrollHorizontal.call(this, -cw);
        horizontalScrollbar.move({ left: left + cw - 1 });
      }
    } else {
      // right
      const ci = data.scroll.ci - 1;
      if (ci >= 0) {
        const cw = loopValue(ci, (i) => cols.getWidth(i));
        // chartScrollHorizontal.call(this, cw);
        horizontalScrollbar.move({ left: ci === 0 ? 0 : left - cw });
      }
    }
  };
  // const tempY = Math.abs(deltaY);
  // const tempX = Math.abs(deltaX);
  const temp = Math.max(tempY, tempX);
  // console.log('event:', evt);
  // detail for windows/mac firefox vertical scroll
  if (/Firefox/i.test(window.navigator.userAgent)) throttle(moveY(evt.detail), 50);
  if (temp === tempX) throttle(moveX(deltaX), 50);
  if (temp === tempY) throttle(moveY(deltaY), 50);
}

function overlayerTouch(direction, distance) {
  const { verticalScrollbar, horizontalScrollbar } = this;
  const { top } = verticalScrollbar.scroll();
  const { left } = horizontalScrollbar.scroll();

  if (direction === 'left' || direction === 'right') {
    // chartScrollHorizontal.call(this, distance);
    horizontalScrollbar.move({ left: left - distance });
  } else if (direction === 'up' || direction === 'down') {
    // chartScrollVertical.call(this, -distance);
    verticalScrollbar.move({ top: top - distance });
  }
}

function verticalScrollbarSet() {
  const { data, verticalScrollbar } = this;
  const { height } = this.getTableOffset();
  const erth = data.exceptRowTotalHeight(0, -1);
  // console.log('erth:', erth);
  verticalScrollbar.set(height, data.rows.totalHeight() - erth);
}

function horizontalScrollbarSet() {
  const { data, horizontalScrollbar } = this;
  const { width } = this.getTableOffset();
  if (data) {
    horizontalScrollbar.set(width, data.cols.totalWidth());
  }
}

function sheetFreeze() {
  const {
    selector, data, editor,
  } = this;
  const [ri, ci] = data.freeze;
  if (ri > 0 || ci > 0) {
    const fwidth = data.freezeTotalWidth();
    const fheight = data.freezeTotalHeight();
    editor.setFreezeLengths(fwidth, fheight);
  }
  selector.resetAreaOffset();
}

export function sheetReset() {
  const {
    tableEl,
    chartEl,
    overlayerEl,
    overlayerCEl,
    table,
    toolbar,
    selector,
    el,
  } = this;
  const tOffset = this.getTableOffset();
  const vRect = this.getRect();
  const vRectChart = {
    width: vRect.width - defaultSettings.col.indexWidth,
    height: vRect.height - defaultSettings.row.height,
  };
  tableEl.attr(vRect);
  chartEl.attr(vRectChart);
  overlayerEl.offset(vRect);
  overlayerCEl.offset(tOffset);
  el.css('width', `${vRect.width}px`);
  verticalScrollbarSet.call(this);
  horizontalScrollbarSet.call(this);
  sheetFreeze.call(this);
  table.render();
  toolbar.reset();
  selector.reset();
}

function clearClipboard() {
  const { data, selector } = this;
  data.clearClipboard();
  selector.hideClipboard();
}

function copy() {
  const { data, selector } = this;
  data.copy();
  selector.showClipboard();
}

function cut() {
  const { data, selector } = this;
  data.cut();
  selector.showClipboard();
}

function paste(what, evt) {
  const { data, selector } = this;
  if (data.settings.mode === 'read') return;
  if (data.paste(what, (msg) => xtoast('Tip', msg))) {
    sheetReset.call(this);
  } else if (evt) {
    const cdata = evt.clipboardData.getData('text/plain');
    this.data.pasteFromText(cdata);
    sheetReset.call(this);
  }
  const [ri, ci] = selector.indexes;
  this.trigger('cell-edited', data.getCell(ri, ci).text, ri, ci);
}

function hideRowsOrCols() {
  this.data.hideRowsOrCols();
  sheetReset.call(this);
}

function unhideRowsOrCols(type, index) {
  this.data.unhideRowsOrCols(type, index);
  sheetReset.call(this);
}

function createFontText(c = {}) {
  let {
    size, name, bold, italic,
  } = options.style.font;
  if (c.style) {
    const style = this.data.styles[c.style].font;
    if (style) {
      if (style.size) size = style.size;
      if (style.name) name = style.name;
      if (style.bold) bold = style.bold;
      if (style.italic) italic = style.italic;
    }
  }
  const fonttext = `${bold ? 'bold' : ''} ${italic ? 'italic' : ''} ${size}px ${name}`;
  return fonttext;
}

function rowSetWidth(cRect, minDistance) {
  if (cRect.ci !== -1) return;

  const { data } = this;
  const texts = getTextsFromRows(data.rows, cRect.ri)
    .map((c) => getTextHeight(c.text, createFontText.call(c)));
  const length = Math.max(...texts);
  if (Number.isFinite(length)) {
    if (length > minDistance) {
      data.rows._[cRect.ri].height = length;
    } else {
      data.rows._[cRect.ri].height = minDistance;
    }
    sheetReset.call(this);
    this.trigger('save');
  }
}

function colSetWidth(cRect, minDistance) {
  if (cRect.ri !== -1) return;

  const { data } = this;
  const texts = getTextsFromColumn(data.rows, cRect.ci)
    .map((c) => getTextWidth(c.text, createFontText.call(c)));

  const length = Math.max(...texts);
  if (Number.isFinite(length)) {
    if (length > minDistance) {
      data.cols._[cRect.ci].width = length;
    } else {
      data.cols._[cRect.ci].width = minDistance;
    }
    sheetReset.call(this);
    this.trigger('save');
  }
}

function autofilter() {
  const { data } = this;
  data.autofilter();
  sheetReset.call(this);
}

function toolbarChangePaintformatPaste() {
  const { toolbar } = this;
  if (toolbar.paintformatActive()) {
    paste.call(this, 'format');
    clearClipboard.call(this);
    toolbar.paintformatToggle();
  }
}

function setCellTextReference() {
  const { editor, selector, data } = this;
  const { inputText } = editor;
  // For when cell is no longer a formula. User backspaces '='.
  if (!inputText.startsWith('=')) {
    editor.clear();
    addingCellRef = false;
    return;
  }
  const text = createCellText.call(this, inputText, getRange(selector.range, data.rows.len));
  // const nv = inputTextLessRef.split(OPERATORS_REGEX);
  // const lastnv = nv[nv.length - 1];
  // if (lastnv !== '=' && lastnv.length !== 0) {
  //   inputTextLessRef = inputTextLessRef.slice(0, -lastnv.length);
  // }
  // editor.setText(inputTextLessRef + getRange(selector.range, this.data.rows.len));
  editor.setText(text);
}

let clicks = 0;
const delay = 400;

function overlayerMousedown(evt) {
  clicks += 1;

  setTimeout(() => {
    clicks = 0;
  }, delay);

  // console.log(':::::overlayer.mousedown:', evt.detail, evt.button, evt.buttons, evt.shiftKey);
  // console.log('evt.target.className:', evt.target.className);
  const {
    selector, data, table, sortFilter, overlayerEl,
  } = this;
  const { offsetX, offsetY } = evt;
  const isAutofillEl = evt.target.className === `${cssPrefix}-selector-corner`;
  const isBorderEl = evt.target.className === `${cssPrefix}-selector-border-top`
    || evt.target.className === `${cssPrefix}-selector-border-bottom`
    || evt.target.className === `${cssPrefix}-selector-border-left`
    || evt.target.className === `${cssPrefix}-selector-border-right`;
  const cellRect = data.getCellRectByXY(offsetX, offsetY);
  const {
    left, top, width, height,
  } = cellRect;
  let { ri, ci } = cellRect;
  // sort or filter
  const { autoFilter } = data;
  if (autoFilter.includes(ri, ci)) {
    if (left + width - 20 < offsetX && top + height - 20 < offsetY) {
      const items = autoFilter.items(ci, (r, c) => data.rows.getCell(r, c));
      sortFilter.hide();
      sortFilter.set(ci, items, autoFilter.getFilter(ci), autoFilter.getSort(ci));
      sortFilter.setOffset({ left, top: top + height + 2 });
    }
  }
  // console.log('ri:', ri, ', ci:', ci);
  if (!evt.shiftKey) {
    // console.log('selectorSetStart:::');
    const { indexes, range } = selector;
    const previousCell = this.data.rows.getCell(indexes[0], indexes[1]);

    let cells;
    if (isAutofillEl) {
      if (clicks === 2) {
        if (data.autofillFormula()) {
          table.render();
          clicks = 0;
        }
      }
      selector.showAutofill(ri, ci);
    } else if (isBorderEl) {
      cells = data.getRange(range);
      this.data.deleteRange(range);
    // } else if (this.editor.el.css('display') === 'block'
    //   && (addingCellRef || canAddCellRef.call(this, previousCell, cellRef))
    // ) {
    //   formulaSelectorSet.call(this, false, ri, ci);
    } else {
      selectorSet.call(this, false, ri, ci);
    }

    // Drag and Drop move cell
    let isMovingX = false;
    let isMovingY = false;
    let movingIntervalX;
    let movingIntervalY;
    let scrollx = this.data.scroll.x;
    let scrolly = this.data.scroll.y;
    const viewRange = data.viewRange();
    const diffWidths = Object.keys(data.cols._).map((c) => data.cols._[c].width);
    const maxScrollX = (data.cols.len - diffWidths.length - (viewRange.eci - viewRange.sci))
      * data.cols.width + diffWidths.reduce((a, c) => a + c);
    const diffHeights = Object.values(data.rows._)
      .map((r) => r.height)
      .filter((c) => c !== undefined);
    const maxScrollY = (data.rows.len - diffHeights.length - (viewRange.eri - viewRange.sri))
      * data.rows.height + diffHeights.reduce((a, c) => a + c);
    const offset = overlayerEl.offset();
    // mouse move up
    mouseMoveUp(window, (e) => {
      // console.log('mouseMoveUp::::');
      ({ ri, ci } = data.getCellRectByXY(e.offsetX, e.offsetY));
      if (ri !== -1 && ci !== -1) {
        if (isAutofillEl) {
          selector.showAutofill(ri, ci);
        } else if (isBorderEl) {
          selectorSetGroup.call(this, ri, ci);
          // console.log(data.selector.ri, data.cols.len)
          // Drag and Drop move cell
          const mleft = e.offsetX < 60;
          const mright = options.showNavigator
            ? e.offsetX > offset.width - 125 - 40
            : e.offsetX > offset.width - 40;
          if (!isMovingX) {
            if (mleft) {
              isMovingX = true;
              movingIntervalX = setInterval(() => {
                scrollx -= 100;
                horizontalScrollbarMove.call(this, scrollx, e);
              }, INTERVAL_WAIT);
            }
            if (mright) {
              isMovingX = true;
              movingIntervalX = setInterval(() => {
                if (scrollx < maxScrollX) {
                  scrollx += 100;
                  horizontalScrollbarMove.call(this, scrollx, e);
                }
              }, INTERVAL_WAIT);
            }
          } else if (!mleft && !mright) {
            clearInterval(movingIntervalX);
            isMovingX = false;
          }

          const up = e.offsetY < 45;
          const down = e.offsetY > offset.height - 20;
          if (!isMovingY) {
            if (up) {
              isMovingY = true;
              movingIntervalY = setInterval(() => {
                scrolly -= 25;
                verticalScrollbarMove.call(this, scrolly, e);
              }, INTERVAL_WAIT);
            }
            if (down) {
              isMovingY = true;
              movingIntervalY = setInterval(() => {
                if (scrolly < maxScrollY) {
                  scrolly += 25;
                  verticalScrollbarMove.call(this, scrolly, e);
                }
              }, INTERVAL_WAIT);
            }
          } else if (!up && !down) {
            clearInterval(movingIntervalY);
            isMovingY = false;
          }
        } else if (e.buttons === 1 && !e.shiftKey) {
          // if (addingCellRef) {
          //   formulaSelectorSet.call(this, true, ri, ci, true, true);
          // } else {
          selectorSet.call(this, true, ri, ci, true, true);
          // }
        }
      }
    }, () => {
      if (isMovingX) {
        clearInterval(movingIntervalX);
        isMovingX = false;
      }
      if (isMovingY) {
        clearInterval(movingIntervalY);
        isMovingY = false;
      }

      if (isAutofillEl && selector.arange && data.settings.mode !== 'read') {
        if (data.autofill(selector.arange, 'all', (msg) => xtoast('Tip', msg))) {
          table.render();
        }
      }
      selector.hideAutofill();

      if (isBorderEl && ri !== -1 && ci !== -1) {
        selectorSetGroup.call(this, ri, ci);
        this.data.moveCell(ri, ci, cells);
        sheetReset.call(this);
        this.trigger('save');
      }

      // toolbarChangePaintformatPaste.call(this);
      // When editor has '=', mousedown adds cell reference ie. A1
      // addingCellRef is true on 2nd mousedown when !canAddCellRef ie. '=A1' to '=B2'
      const cellRef = getRange(this.selector.range, data.rows.len);
      if (this.editor.el.css('display') === 'block'
        && (addingCellRef || canAddCellRef.call(this, previousCell, cellRef))
      ) {
        // Should not change when not
        if (!addingCellRef) {
          this.data.setPrev(indexes[0], indexes[1]);
        }
        addingCellRef = true;
        setCellTextReference.call(this);
      } else {
        // console.log(ri, ci)
        this.data.setPrev(ri, ci);
        addingCellRef = false;
      }
      const {
        sri, sci, eri, eci,
      } = selector.range;
      this.trigger('cell-deselect', {
        sri, sci, eri, eci,
      });
    });
  }

  // if (!isAutofillEl && evt.buttons === 1) {
  //   if (evt.shiftKey) {
  //     // console.log('shiftKey::::');
  //     selectorSet.call(this, true, ri, ci);
  //   }
  // }
}

function editorSetOffset() {
  const { editor, data } = this;
  const sOffset = data.getSelectedRect();
  const tOffset = this.getTableOffset();
  let sPosition = 'top';
  // console.log('sOffset:', sOffset, ':', tOffset);
  if (sOffset.top > tOffset.height / 2) {
    sPosition = 'bottom';
  }
  editor.setOffset(sOffset, sPosition);
}

export function editorSet() {
  const { editor, data, selector } = this;
  if (data.settings.mode === 'read') return;
  editorSetOffset.call(this);
  const cellText = data.getSelectedCell();
  editor.setCell(cellText, data.getSelectedValidator());
  clearClipboard.call(this);
  if (cellText) {
    const { text } = cellText;
    if (text && text.startsWith('=')) {
      selector.addCellRefs(getRangeIndexes(text, data.rows.len));
    }
  }
}

function editorSetSelector(text, validator) {
  const { editor, data } = this;
  if (data.settings.mode === 'read') return;
  // editorSetOffset.call(this);
  editor.setCell({ text }, validator);
  clearClipboard.call(this);
}

function verticalScrollbarMove(distance) {
  const { data, table, selector } = this;
  data.scrolly(distance, () => {
    selector.resetBRLAreaOffset();
    editorSetOffset.call(this);
    table.render();
  });
}

function horizontalScrollbarMove(distance) {
  const { data, table, selector } = this;
  data.scrollx(distance, () => {
    selector.resetBRTAreaOffset();
    editorSetOffset.call(this);
    table.render();
  });
}

function rowResizerFinished(cRect, distance) {
  const { ri } = cRect;
  const { table, selector, data } = this;
  data.rows.setHeight(ri, distance);
  table.render();
  selector.resetAreaOffset();
  verticalScrollbarSet.call(this);
  editorSetOffset.call(this);
}

function colResizerFinished(cRect, distance) {
  const { ci } = cRect;
  const { table, selector, data } = this;
  data.cols.setWidth(ci, distance);
  // console.log('data:', data);
  table.render();
  selector.resetAreaOffset();
  horizontalScrollbarSet.call(this);
  editorSetOffset.call(this);
}

// No sheet name prefix, Not more than one, No A:A,
const CELL_ONLY_REFERENCE = /^\$?[A-Z]+\$?[0-9]+$/;
const RANGE_ONLY_REFERENCE = /^\$?[A-Z]+\$?[0-9]+:{1}\$?[A-Z]+\$?[0-9]+$/;

function dataSetCellText(text, state = 'finished') {
  const { data, table, selector } = this;
  const { ri, ci } = data.selector;
  const { prev } = data;
  // const [ri, ci] = selector.indexes;
  if (data.settings.mode === 'read') return;

  // Actively set visuals when typing cell reference
  selector.removeCellRefs();
  if (text.startsWith('=')) {
    selector.addCellRefs(getRangeIndexes(text, data.rows.len));

    const nv = text.split(OPERATORS_REGEX);
    const lastnv = nv[nv.length - 1];
    const isCell = CELL_ONLY_REFERENCE.test(lastnv);
    const isRange = RANGE_ONLY_REFERENCE.test(lastnv);
    const validator = data.getSelectedValidator();
    if (lastnv !== '=' && lastnv.length !== 0 && (isCell || isRange)) {
      const range = getRangeIndex(lastnv, data.rows.len);
      const {
        sri, sci, eri, eci,
      } = range;
      const lrows = data.rows.len;
      const lcols = data.cols.len;
      if (sri < lrows && sci < lcols && eri < lrows && eci < lcols) {
        // if (isCell) {
        //   selectorSet.call(this, false, sri, sci);
        // }
        // if (isRange) {
        //   setGroup.call(this, lastnv, sri, sci, eri - sri, eci - sci);
        // }
        // this.editor.setCell({ text }, validator);
        // editorSetSelector.call(this, text, validator);
      }
    } else if (addingCellRef && (prev.ri !== ri || prev.ci !== ci)) {
      // formulaSelectorSet.call(this, false, prev.ri, prev.ci);
      selectorSet.call(this, false, prev.ri, prev.ci);
      // this.editor.setCell({ text }, validator);
      editorSetSelector.call(this, text, validator);
      addingCellRef = false;
      this.addingFormula = false;
    } else {
      data.setPrev(ri, ci);
    }
  }

  data.setSelectedCellText(text, state);
  // const { ri, ci } = data.selector;
  if (state === 'finished') {
    table.render();
  } else {
    this.trigger('cell-edited', text, ri, ci);
  }
}

function insertDeleteRowColumn(type) {
  const { data } = this;
  if (data.settings.mode === 'read') return;
  if (type === 'insert-row') {
    data.insert('row');
  } else if (type === 'delete-row') {
    data.delete('row');
  } else if (type === 'insert-column') {
    data.insert('column');
  } else if (type === 'delete-column') {
    data.delete('column');
  } else if (type === 'delete-cell') {
    data.deleteCell();
  } else if (type === 'delete-cell-format') {
    data.deleteCell('format');
  } else if (type === 'delete-cell-text') {
    data.deleteCell('text');
  } else if (type === 'cell-printable') {
    data.setSelectedCellAttr('printable', true);
  } else if (type === 'cell-non-printable') {
    data.setSelectedCellAttr('printable', false);
  } else if (type === 'cell-editable') {
    data.setSelectedCellAttr('editable', true);
  } else if (type === 'cell-non-editable') {
    data.setSelectedCellAttr('editable', false);
  }
  clearClipboard.call(this);
  sheetReset.call(this);
}

function toolbarChange(type, value) {
  const { data } = this;
  if (type === 'undo') {
    this.undo();
  } else if (type === 'redo') {
    this.redo();
  } else if (type === 'print') {
    // this.print.preview();
  } else if (type === 'paintformat') {
    if (value === true) copy.call(this);
    else clearClipboard.call(this);
  } else if (type === 'clearformat') {
    insertDeleteRowColumn.call(this, 'delete-cell-format');
  } else if (type === 'link') {
    // link
  } else if (type === 'chart') {
    // chart
  } else if (type === 'autofilter') {
    // filter
    autofilter.call(this);
  } else if (type === 'freeze') {
    if (value) {
      const { ri, ci } = data.selector;
      this.freeze(ri, ci);
    } else {
      this.freeze(0, 0);
    }
  } else if (type === 'formula') {
    // formula
  } else {
    // console.log(type, value);
    data.setSelectedCellAttr(type, value);
    // if (type === 'formula' && !data.selector.multiple()) {
    // editorSet.call(this);
    // }
    sheetReset.call(this);
  }
}

function moveChartOut() {
  // const type = this.data.chartSelect.types[0];
  // const title = charts[type].title;
  // const n = `${title} ${getMaxNumberCustomSheet(dataNames, title)}`
  // const d = new DataProxy(n, this.options);
  // d.change = (...args) => {
  //   this.trigger('change', ...args);
  // };
  //
  // this.data.deleteChart();
}

function sortFilterChange(ci, order, operator, value) {
  // console.log('sort:', sortDesc, operator, value);
  this.data.setAutoFilter(ci, order, operator, value);
  sheetReset.call(this);
}

function sheetInitEvents() {
  const {
    selector,
    overlayerEl,
    rowResizer,
    colResizer,
    verticalScrollbar,
    horizontalScrollbar,
    editor,
    contextMenu,
    contextMenuChart,
    toolbar,
    modalValidation,
    sortFilter,
  } = this;
  // overlayer
  overlayerEl
    .on('mousemove', (evt) => {
      overlayerMousemove.call(this, evt);
    })
    .on('mousedown', (evt) => {
      const [ri, ci] = selector.indexes;
      const { rows, cols } = this.data;
      const previousCell = rows.getCell(ri, ci);
      const cellRef = getRange(this.selector.range, rows.len);
      if (!(addingCellRef || canAddCellRef.call(this, previousCell, cellRef))) {
        editor.clear();
      }
      contextMenu.hide();
      contextMenuChart.hide();
      // charts
      const isChart = chartMousedown.call(this, evt);
      // For switching between charts in chart editor
      this.trigger('chart-select', this.data.chartSelect);
      if (isChart) {
        selector.br.el.hide();
      } else {
        // no need if already shown
        selector.br.el.show();
      }

      // the left mouse button: mousedown → mouseup → click
      // the right mouse button: mousedown → contenxtmenu → mouseup
      if (evt.buttons === 2) {
        const x = evt.offsetX + 125;
        if (isChart) {
          chartMouseup(evt);
          contextMenuChart.setPosition(x, evt.offsetY);
        } else if (this.data.xyInSelectedRect(evt.offsetX, evt.offsetY)) {
          contextMenu.setPosition(x, evt.offsetY);
        } else {
          overlayerMousedown.call(this, evt);
          contextMenu.setPosition(x, evt.offsetY);
        }
        evt.stopPropagation();
        return;
      }

      if (!isChart) {
        // Prevent double click switch cell when cell referencing
        if (evt.detail === 2
          && evt.offsetX > cols.indexWidth
          && evt.offsetY > rows.height
          && !addingCellRef
        ) {
          editorSet.call(this);
        } else {
          overlayerMousedown.call(this, evt);
        }
      }
    })
    .on('mouseup', (evt) => {
      chartMouseup(evt);
      if (isResize) {
        // for saving chart position
        this.trigger('change', this.data.getData());
        isResize = false;
      }
    })
    .on('wheel.stop', (evt) => {
      overlayerMousescroll.call(this, evt);
    })
    .on('mouseout', (evt) => {
      const { offsetX, offsetY } = evt;
      if (offsetY <= 0) colResizer.hide();
      if (offsetX <= 0) rowResizer.hide();
    })
    .on('wheel', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
    });

  selector.inputChange = (v) => {
    dataSetCellText.call(this, v, 'input');
    editorSet.call(this);
  };

  // slide on mobile
  bindTouch(overlayerEl.el, {
    move: (direction, d) => {
      overlayerTouch.call(this, direction, d);
    },
  });

  // chart
  chartInitEvents.call(this);

  // toolbar change
  toolbar.change = (type, value) => toolbarChange.call(this, type, value);

  // sort filter ok
  sortFilter.ok = (ci, order, o, v) => sortFilterChange.call(this, ci, order, o, v);

  // resizer finished callback
  rowResizer.finishedFn = (cRect, distance) => {
    rowResizerFinished.call(this, cRect, distance);
  };
  colResizer.finishedFn = (cRect, distance) => {
    colResizerFinished.call(this, cRect, distance);
  };
  // resizer unhide callback
  rowResizer.unhideFn = (index) => {
    unhideRowsOrCols.call(this, 'row', index);
  };
  colResizer.unhideFn = (index) => {
    unhideRowsOrCols.call(this, 'col', index);
  };
  // resizer setWidth callback
  rowResizer.setWidthFn = (cRect, minDistance) => {
    rowSetWidth.call(this, cRect, minDistance);
  };
  colResizer.setWidthFn = (cRect, minDistance) => {
    colSetWidth.call(this, cRect, minDistance);
  };
  // scrollbar move callback
  verticalScrollbar.moveFn = (distance, evt) => {
    chartSetVertical.call(this, distance);
    verticalScrollbarMove.call(this, distance, evt);
  };
  horizontalScrollbar.moveFn = (distance, evt) => {
    chartSetHorizontal.call(this, distance);
    horizontalScrollbarMove.call(this, distance, evt);
  };
  // editor
  editor.change = (state, itext) => {
    dataSetCellText.call(this, itext, state);
  };
  // modal validation
  modalValidation.change = (action, ...args) => {
    if (action === 'save') {
      this.data.addValidation(...args);
    } else {
      this.data.removeValidation();
    }
  };
  // contextmenu
  contextMenu.itemClick = (type) => {
    // console.log('type:', type);
    switch (type) {
      case 'validation': {
        modalValidation.setValue(this.data.getSelectedValidation());
        break;
      }
      case 'copy': {
        copy.call(this);
        break;
      }
      case 'cut': {
        cut.call(this);
        break;
      }
      case 'paste': {
        paste.call(this, 'all');
        break;
      }
      case 'paste-value': {
        paste.call(this, 'text');
        break;
      }
      case 'paste-format': {
        paste.call(this, 'format');
        break;
      }
      case 'paste-transposed': {
        paste.call(this, 'transposed');
        break;
      }
      case 'hide': {
        hideRowsOrCols.call(this);
        break;
      }
      case 'freeze-header-row': {
        this.freeze(1, this.data.freeze[1]);
        break;
      }
      case 'freeze-header-column': {
        this.freeze(this.data.freeze[0], 1);
        break;
      }
      default: {
        insertDeleteRowColumn.call(this, type);
      }
    }
  };
  // contextMenuChart
  contextMenuChart.itemClick = (type) => {
    switch (type) {
      case 'edit': {
        this.trigger('show-editor');
        break;
      }
      case 'delete': {
        this.data.deleteChart();
        this.trigger('chart-select', null);
        this.trigger('change', this.data.getData());
        break;
      }
      case 'move': {
        moveChartOut();
        break;
      }
      default:
    }
  };

  bind(window, 'resize', () => {
    this.reload();
  });

  bind(window, 'click', (evt) => {
    this.focusing = overlayerEl.contains(evt.target);
  });

  bind(window, 'paste', (evt) => {
    paste.call(this, 'all', evt);
    evt.preventDefault();
  });

  // for selector
  bind(window, 'keydown', (evt) => {
    if (!this.focusing) return;
    const keyCode = evt.keyCode || evt.which;
    const {
      key, ctrlKey, shiftKey, metaKey,
    } = evt;
    // console.log('keydown.evt: ', keyCode);
    if (ctrlKey || metaKey) {
      // const { sIndexes, eIndexes } = selector;
      // let what = 'all';
      // if (shiftKey) what = 'text';
      // if (altKey) what = 'format';
      switch (keyCode) {
        case 90:
          // undo: ctrl + z
          this.undo();
          evt.preventDefault();
          break;
        case 89:
          // redo: ctrl + y
          this.redo();
          evt.preventDefault();
          break;
        case 67:
          // ctrl + c
          copy.call(this);
          evt.preventDefault();
          break;
        case 88:
          // ctrl + x
          cut.call(this);
          evt.preventDefault();
          break;
        case 85:
          // ctrl + u
          toolbar.trigger('underline');
          evt.preventDefault();
          break;
        case 86:
          // ctrl + v
          // => paste
          // evt.preventDefault();
          break;
        case 37:
          // ctrl + left
          selectorMove.call(this, shiftKey, 'row-first');
          evt.preventDefault();
          break;
        case 38:
          // ctrl + up
          selectorMove.call(this, shiftKey, 'col-first');
          evt.preventDefault();
          break;
        case 39:
          // ctrl + right
          selectorMove.call(this, shiftKey, 'row-last');
          evt.preventDefault();
          break;
        case 40:
          // ctrl + down
          selectorMove.call(this, shiftKey, 'col-last');
          evt.preventDefault();
          break;
        case 32:
          // ctrl + space, all cells in col
          selectorSet.call(this, false, -1, this.data.selector.ci, false);
          evt.preventDefault();
          break;
        case 66:
          // ctrl + B
          toolbar.trigger('bold');
          break;
        case 73:
          // ctrl + I
          toolbar.trigger('italic');
          break;
        default:
          break;
      }
    } else {
      // console.log('evt.keyCode:', evt.keyCode);
      // const v = this.editor.inputText;
      switch (keyCode) {
        case 32:
          if (shiftKey) {
            // shift + space, all cells in row
            selectorSet.call(this, false, this.data.selector.ri, -1, false);
          }
          break;
        case 27: // esc
          contextMenu.hide();
          contextMenuChart.hide();
          clearClipboard.call(this);
          break;
        case 37: // left
          selectorMove.call(this, shiftKey, 'left');
          evt.preventDefault();
          break;
        case 38: // up
          selectorMove.call(this, shiftKey, 'up');
          evt.preventDefault();
          break;
        case 39: // right
          selectorMove.call(this, shiftKey, 'right');
          evt.preventDefault();
          break;
        case 40: // down
          selectorMove.call(this, shiftKey, 'down');
          evt.preventDefault();
          break;
        case 9: // tab
          editor.clear();
          // shift + tab => move left
          // tab => move right
          selectorMove.call(this, false, shiftKey ? 'left' : 'right');
          evt.preventDefault();
          break;
        case 13: // enter
          // Add selectorSet to above/below editor instead when cell referencing
          editor.clear();
          // shift + enter => move up
          // enter => move down
          selectorMove.call(this, false, shiftKey ? 'up' : 'down');
          // if (v.startsWith('=') && v.includes('%*%')) {
          //   sheetReset.call(this);
          // }
          evt.preventDefault();
          break;
        case 8: // backspace
          if (this.data.chartSelect !== null) {
            this.data.deleteChart();
            this.trigger('chart-select', null);
            this.trigger('change', this.data.getData());
          } else {
            insertDeleteRowColumn.call(this, 'delete-cell-text');
            invalidate();
          }
          evt.preventDefault();
          break;
        default:
          break;
      }

      if (key === 'Delete') {
        insertDeleteRowColumn.call(this, 'delete-cell-text');
        evt.preventDefault();
      } else if ((keyCode >= 65 && keyCode <= 90)
        || (keyCode >= 48 && keyCode <= 57)
        || (keyCode >= 96 && keyCode <= 105)
        || (keyCode >= 186 && keyCode <= 222)
        || evt.key === '='
      ) {
        dataSetCellText.call(this, evt.key, 'input');
        editorSet.call(this);
      } else if (keyCode === 113) {
        // F2
        editorSet.call(this);
      }
    }
  });
}

export default class Sheet {
  constructor(targetEl, data, datas) {
    this.eventMap = new Map();
    const { view, showToolbar, showContextmenu } = data.settings;
    this.el = h('div', `${cssPrefix}-sheet`);
    this.toolbar = new Toolbar(data, view.width, !showToolbar);
    // this.print = new Print(data);
    targetEl.children(this.toolbar.el, this.el);
    // targetEl.children(this.toolbar.el, this.el, this.print.el);
    this.data = data;
    // table
    this.tableEl = h('canvas', `${cssPrefix}-table`);
    // resizer
    this.rowResizer = new Resizer(false, data.rows.height, data);
    this.colResizer = new Resizer(true, data.cols.minWidth, data);
    // scrollbar
    this.verticalScrollbar = new Scrollbar(true);
    this.horizontalScrollbar = new Scrollbar(false);
    // editor
    this.editor = new Editor(
      formulas,
      () => this.getTableOffset(),
      data.rows.height,
    );
    // data validation
    this.modalValidation = new ModalValidation();
    // contextMenu
    this.contextMenu = new ContextMenu('sheet', () => this.getRect(), !showContextmenu);
    // contextMenuChart
    this.contextMenuChart = new ContextMenu('chart', () => this.getRect(), !showContextmenu);
    // selector
    this.selector = new Selector(data);
    // formula selector
    // this.formulaSelector = new Selector(data);
    // chart
    this.chartEl = h('canvas', `${cssPrefix}-chart`, `${cssPrefix}-chart`);
    // overlayer
    this.overlayerCEl = h('div', `${cssPrefix}-overlayer-content`)
      .children(
        this.editor.el,
        this.selector.el,
        // this.formulaSelector.el,
        this.chartEl,
      );
    this.overlayerEl = h('div', `${cssPrefix}-overlayer`)
      .child(this.overlayerCEl);
    // sortFilter
    this.sortFilter = new SortFilter();
    // root element
    this.el.children(
      this.tableEl,
      this.overlayerEl.el,
      this.rowResizer.el,
      this.colResizer.el,
      this.verticalScrollbar.el,
      this.horizontalScrollbar.el,
      this.contextMenu.el,
      this.contextMenuChart.el,
      this.modalValidation.el,
      this.sortFilter.el,
    );
    // table
    this.table = new Table(this.tableEl.el, data, datas);
    // cell reference
    this.addingFormula = addingCellRef;
    sheetInitEvents.call(this);
    sheetReset.call(this);
    // init selector [0, 0]
    selectorSet.call(this, false, 0, 0);
  }

  on(eventName, func) {
    this.eventMap.set(eventName, func);
    return this;
  }

  trigger(eventName, ...args) {
    const { eventMap } = this;
    if (eventMap.has(eventName)) {
      eventMap.get(eventName).call(this, ...args);
    }
  }

  resetData(data, datas, isLoaded = true) {
    // before
    this.editor.clear();
    // after
    this.data = data;
    verticalScrollbarSet.call(this);
    horizontalScrollbarSet.call(this);
    this.toolbar.resetData(data);
    // this.print.resetData(data);
    this.selector.resetData(data);
    this.table.resetData(data, datas);
    if (isLoaded) {
      this.data.resetCharts();
    }
  }

  loadData(data) {
    this.data.setData(data);
    sheetReset.call(this);
    return this;
  }

  // freeze rows or cols
  freeze(ri, ci) {
    const { data } = this;
    data.setFreeze(ri, ci);
    sheetReset.call(this);
    return this;
  }

  undo() {
    this.data.undo(this);
    sheetReset.call(this);
  }

  redo() {
    this.data.redo(this);
    sheetReset.call(this);
  }

  reload() {
    sheetReset.call(this);
    return this;
  }

  getRect() {
    const { data } = this;
    return { width: data.viewWidth(), height: data.viewHeight() };
  }

  getTableOffset() {
    const { rows, cols } = this.data;
    const { width, height } = this.getRect();
    return {
      width: width - cols.indexWidth,
      height: height - rows.height,
      left: cols.indexWidth,
      top: rows.height,
    };
  }
}
