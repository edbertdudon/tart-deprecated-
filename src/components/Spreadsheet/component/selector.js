import { h } from './element';
import { cssPrefix } from '../config';
import { CellRange } from '../core/cell_range';
import { CELL_REF_COLORS } from '../../../constants/off-color';

const selectorHeightBorderWidth = 2 * 2 - 1;
let startZIndex = 10;

class SelectorElement {
  constructor(useHideInput = false) {
    this.useHideInput = useHideInput;
    this.inputChange = () => {};
    this.cornerEl = h('div', `${cssPrefix}-selector-corner`);
    this.borderTopEl = h('div', `${cssPrefix}-selector-border-top`);
    this.borderBottomEl = h('div', `${cssPrefix}-selector-border-bottom`);
    this.borderLeftEl = h('div', `${cssPrefix}-selector-border-left`);
    this.borderRightEl = h('div', `${cssPrefix}-selector-border-right`);
    this.areaEl = h('div', `${cssPrefix}-selector-area`)
      .children(this.cornerEl, this.borderTopEl, this.borderBottomEl, this.borderLeftEl, this.borderRightEl)
      .hide();
    this.clipboardEl = h('div', `${cssPrefix}-selector-clipboard`).hide();
    this.autofillEl = h('div', `${cssPrefix}-selector-autofill`).hide();
    this.cellRefEl = h('div', `${cssPrefix}-selector-cellRef`);
    this.el = h('div', `${cssPrefix}-selector`)
      .css('z-index', `${startZIndex}`)
      .children(this.areaEl, this.clipboardEl, this.autofillEl, this.cellRefEl)
      .hide();
    if (useHideInput) {
      this.hideInput = h('input', '')
        .on('compositionend', (evt) => {
          this.inputChange(evt.target.value);
        });
      this.el.child(this.hideInputDiv = h('div', 'hide-input').child(this.hideInput));
      this.el.child(this.hideInputDiv = h('div', 'hide-input').child(this.hideInput));
    }
    startZIndex += 1;
  }

  setOffset(v) {
    this.el.offset(v).show();
    return this;
  }

  hide() {
    this.el.hide();
    return this;
  }

  setAreaOffset(v) {
    const {
      left, top, width, height,
    } = v;
    const ofwidth = width - selectorHeightBorderWidth + 0.8;
    const ofheight = height - selectorHeightBorderWidth + 0.8;
    const of = {
      width: ofwidth,
      height: ofheight,
      left: left - 0.8,
      top: top - 0.8,
    };

    this.areaEl.offset(of).show();

    this.borderTopEl.offset({
      width: ofwidth,
      height: selectorHeightBorderWidth + 2,
      top: -selectorHeightBorderWidth,
    }).show();

    this.borderBottomEl.offset({
      width: ofwidth - 3,
      height: selectorHeightBorderWidth + 2,
      top: ofheight - selectorHeightBorderWidth + 0.8,
    }).show();

    this.borderLeftEl.offset({
      width: selectorHeightBorderWidth + 2,
      height: ofheight,
      left: -selectorHeightBorderWidth - 0.8,
    }).show();

    this.borderRightEl.offset({
      width: selectorHeightBorderWidth + 2,
      height: ofheight - 3,
      left: ofwidth - selectorHeightBorderWidth + 1,
    }).show();

    if (this.useHideInput) {
      this.hideInputDiv.offset(of);
      this.hideInput.val('').focus();
    }
  }

  setClipboardOffset(v) {
    const {
      left, top, width, height,
    } = v;
    this.clipboardEl.offset({
      left,
      top,
      width: width - 5,
      height: height - 5,
    });
  }

  showAutofill(v) {
    const {
      left, top, width, height,
    } = v;
    this.autofillEl.offset({
      width: width - selectorHeightBorderWidth,
      height: height - selectorHeightBorderWidth,
      left,
      top,
    }).show();
  }

  hideAutofill() {
    this.autofillEl.hide();
  }

  showClipboard() {
    this.clipboardEl.show();
  }

  hideClipboard() {
    this.clipboardEl.hide();
  }

  addCellRefs(refs) {
    this.cellRefEl.children(...refs.map((v, i) => {
      const {
        left, top, width, height,
      } = v;
      const color = CELL_REF_COLORS[i % CELL_REF_COLORS.length];
      return this.cellRef = h('div', 'cellref')
        .offset({
          left,
          top,
          width: width - 5,
          height: height - 5,
        })
        .css('border', `2px dashed ${color}`);
    }));
  }

  removeCellRefs() {
    while (this.cellRefEl.first()) {
      this.cellRefEl.removeChild(this.cellRefEl.first());
    }
  }
}

function calBRAreaOffset(offset) {
  const { data } = this;
  const {
    left, top, width, height, scroll, l, t,
  } = offset;
  const ftwidth = data.freezeTotalWidth();
  const ftheight = data.freezeTotalHeight();
  let left0 = left - ftwidth;
  if (ftwidth > l) left0 -= scroll.x;
  let top0 = top - ftheight;
  if (ftheight > t) top0 -= scroll.y;
  return {
    left: left0,
    top: top0,
    width,
    height,
  };
}

function calTAreaOffset(offset) {
  const { data } = this;
  const {
    left, width, height, l, t, scroll,
  } = offset;
  const ftwidth = data.freezeTotalWidth();
  let left0 = left - ftwidth;
  if (ftwidth > l) left0 -= scroll.x;
  return {
    left: left0, top: t, width, height,
  };
}

function calLAreaOffset(offset) {
  const { data } = this;
  const {
    top, width, height, l, t, scroll,
  } = offset;
  const ftheight = data.freezeTotalHeight();
  let top0 = top - ftheight;
  // console.log('ftheight:', ftheight, ', t:', t);
  if (ftheight > t) top0 -= scroll.y;
  return {
    left: l, top: top0, width, height,
  };
}

function setBRAreaOffset(offset) {
  const { br } = this;
  br.setAreaOffset(calBRAreaOffset.call(this, offset));
}

function setTLAreaOffset(offset) {
  const { tl } = this;
  tl.setAreaOffset(offset);
}

function setTAreaOffset(offset) {
  const { t } = this;
  t.setAreaOffset(calTAreaOffset.call(this, offset));
}

function setLAreaOffset(offset) {
  const { l } = this;
  l.setAreaOffset(calLAreaOffset.call(this, offset));
}

function setLClipboardOffset(offset) {
  const { l } = this;
  l.setClipboardOffset(calLAreaOffset.call(this, offset));
}

function setBRClipboardOffset(offset) {
  const { br } = this;
  br.setClipboardOffset(calBRAreaOffset.call(this, offset));
}

function setTLClipboardOffset(offset) {
  const { tl } = this;
  tl.setClipboardOffset(offset);
}

function setTClipboardOffset(offset) {
  const { t } = this;
  t.setClipboardOffset(calTAreaOffset.call(this, offset));
}

function setAllAreaOffset(offset) {
  setBRAreaOffset.call(this, offset);
  setTLAreaOffset.call(this, offset);
  setTAreaOffset.call(this, offset);
  setLAreaOffset.call(this, offset);
}

function setAllClipboardOffset(offset) {
  setBRClipboardOffset.call(this, offset);
  setTLClipboardOffset.call(this, offset);
  setTClipboardOffset.call(this, offset);
  setLClipboardOffset.call(this, offset);
}

export default class Selector {
  constructor(data) {
    this.inputChange = () => {};
    this.data = data;
    this.br = new SelectorElement(true);
    this.t = new SelectorElement();
    this.l = new SelectorElement();
    this.tl = new SelectorElement();
    this.br.inputChange = (v) => {
      this.inputChange(v);
    };
    this.br.el.show();
    this.offset = null;
    this.areaOffset = null;
    this.indexes = null;
    this.range = null;
    this.arange = null;
    this.el = h('div', `${cssPrefix}-selectors`)
      .children(
        this.tl.el,
        this.t.el,
        this.l.el,
        this.br.el,
      ).hide();

    // for performance
    this.lastri = -1;
    this.lastci = -1;

    startZIndex += 1;
  }

  resetData(data) {
    this.data = data;
    this.range = data.selector.range;
    this.resetAreaOffset();
  }

  hide() {
    this.el.hide();
  }

  resetOffset() {
    const {
      data, tl, t, l, br,
    } = this;
    const freezeHeight = data.freezeTotalHeight();
    const freezeWidth = data.freezeTotalWidth();
    if (freezeHeight > 0 || freezeWidth > 0) {
      tl.setOffset({ width: freezeWidth, height: freezeHeight });
      t.setOffset({ left: freezeWidth, height: freezeHeight });
      l.setOffset({ top: freezeHeight, width: freezeWidth });
      br.setOffset({ left: freezeWidth, top: freezeHeight });
    } else {
      tl.hide();
      t.hide();
      l.hide();
      br.setOffset({ left: 0, top: 0 });
    }
  }

  resetAreaOffset() {
    // console.log('offset:', offset);
    const offset = this.data.getSelectedRect();
    const coffset = this.data.getClipboardRect();
    setAllAreaOffset.call(this, offset);
    setAllClipboardOffset.call(this, coffset);
    this.resetOffset();
  }

  resetBRTAreaOffset() {
    const offset = this.data.getSelectedRect();
    const coffset = this.data.getClipboardRect();
    setBRAreaOffset.call(this, offset);
    setTAreaOffset.call(this, offset);
    setBRClipboardOffset.call(this, coffset);
    setTClipboardOffset.call(this, coffset);
    this.resetOffset();
  }

  resetBRLAreaOffset() {
    const offset = this.data.getSelectedRect();
    const coffset = this.data.getClipboardRect();
    setBRAreaOffset.call(this, offset);
    setLAreaOffset.call(this, offset);
    setBRClipboardOffset.call(this, coffset);
    setLClipboardOffset.call(this, coffset);
    this.resetOffset();
  }

  set(ri, ci, indexesUpdated = true) {
    const { data } = this;
    const cellRange = data.calSelectedRangeByStart(ri, ci);
    const { sri, sci } = cellRange;
    if (indexesUpdated) {
      let [cri, cci] = [ri, ci];
      if (ri < 0) cri = 0;
      if (ci < 0) cci = 0;
      data.selector.setIndexes(cri, cci);
      this.indexes = [cri, cci];
    }

    this.moveIndexes = [sri, sci];
    // this.sIndexes = sIndexes;
    // this.eIndexes = eIndexes;
    this.range = cellRange;
    this.resetAreaOffset();
    this.el.show();
  }

  setGroup(ri, ci, rilength, cilength) {
    const { data } = this;
    const cellRange = data.calSelectedRangeByStartGroup(ri, ci, ri + rilength, ci + cilength);
    const { sri, sci, eri, eci } = cellRange;
    let [cri, cci] = [ri, ci];
    if (ri < 0) cri = 0;
    if (ci < 0) cci = 0;
    data.selector.setIndexes(cri, cci);
    this.indexes = [cri, cci];
    this.lastri = eri;
    this.lastci = eci;
    this.moveIndexes = [sri, sci];
    this.range = cellRange;
    setAllAreaOffset.call(this, this.data.getSelectedRect());
  }

  setEnd(ri, ci, moving = true) {
    const { data, lastri, lastci } = this;
    if (moving) {
      if (ri === lastri && ci === lastci) return;
      this.lastri = ri;
      this.lastci = ci;
    }
    this.range = data.calSelectedRangeByEnd(ri, ci);
    setAllAreaOffset.call(this, this.data.getSelectedRect());
  }

  reset() {
    // console.log('::::', this.data);
    const { eri, eci } = this.data.selector.range;
    this.setEnd(eri, eci);
  }

  showAutofill(ri, ci) {
    if (ri === -1 && ci === -1) return;
    // console.log('ri:', ri, ', ci:', ci);
    // const [sri, sci] = this.sIndexes;
    // const [eri, eci] = this.eIndexes;
    const {
      sri, sci, eri, eci,
    } = this.range;
    const [nri, nci] = [ri, ci];
    // const rn = eri - sri;
    // const cn = eci - sci;
    const srn = sri - ri;
    const scn = sci - ci;
    const ern = eri - ri;
    const ecn = eci - ci;
    if (scn > 0) {
      // left
      // console.log('left');
      this.arange = new CellRange(sri, nci, eri, sci - 1);
      // this.saIndexes = [sri, nci];
      // this.eaIndexes = [eri, sci - 1];
      // data.calRangeIndexes2(
    } else if (srn > 0) {
      // top
      // console.log('top');
      // nri = sri;
      this.arange = new CellRange(nri, sci, sri - 1, eci);
      // this.saIndexes = [nri, sci];
      // this.eaIndexes = [sri - 1, eci];
    } else if (ecn < 0) {
      // right
      // console.log('right');
      // nci = eci;
      this.arange = new CellRange(sri, eci + 1, eri, nci);
      // this.saIndexes = [sri, eci + 1];
      // this.eaIndexes = [eri, nci];
    } else if (ern < 0) {
      // bottom
      // console.log('bottom');
      // nri = eri;
      this.arange = new CellRange(eri + 1, sci, nri, eci);
      // this.saIndexes = [eri + 1, sci];
      // this.eaIndexes = [nri, eci];
    } else {
      // console.log('else:');
      this.arange = null;
      // this.saIndexes = null;
      // this.eaIndexes = null;
      return;
    }
    if (this.arange !== null) {
      // console.log(this.saIndexes, ':', this.eaIndexes);
      const offset = this.data.getRect(this.arange);
      offset.width += 2;
      offset.height += 2;
      const {
        br, l, t, tl,
      } = this;
      br.showAutofill(calBRAreaOffset.call(this, offset));
      l.showAutofill(calLAreaOffset.call(this, offset));
      t.showAutofill(calTAreaOffset.call(this, offset));
      tl.showAutofill(offset);
    }
  }

  hideAutofill() {
    ['br', 'l', 't', 'tl'].forEach((property) => {
      this[property].hideAutofill();
    });
  }

  showClipboard() {
    const coffset = this.data.getClipboardRect();
    setAllClipboardOffset.call(this, coffset);
    ['br', 'l', 't', 'tl'].forEach((property) => {
      this[property].showClipboard();
    });
  }

  hideClipboard() {
    ['br', 'l', 't', 'tl'].forEach((property) => {
      this[property].hideClipboard();
    });
  }

  addCellRefs(refs) {
    if (refs.length > 0) {
      const croffsets = refs.map((range) => this.data.getRect(range));
      ['br', 'l', 't', 'tl'].forEach((property) => {
        this[property].addCellRefs(croffsets);
      });
    }
  }

  removeCellRefs() {
    ['br', 'l', 't', 'tl'].forEach((property) => {
      this[property].removeCellRefs();
    });
  }
}
