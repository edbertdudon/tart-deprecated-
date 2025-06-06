//* global window */
import { h } from './element';
import Suggest from './suggest';
import Datepicker from './datepicker';
import { cssPrefix } from '../config';
import { getTextWidth, getFormulaColors, setCaretPosition } from '../../../functions';
// import { selectorMove } from './sheet';
// import { mouseMoveUp } from '../event';

function resetTextareaSize() {
  const { inputText } = this;
  // this.textEl.el.innerHTML = inputText;
  if (!/^\s*$/.test(inputText)) {
    const {
      textlineEl, textEl, areaOffset,
    } = this;
    const txts = inputText.split('\n');
    const maxTxtSize = Math.max(...txts.map((it) => it.length));
    const tlOffset = textlineEl.offset();
    const fontWidth = tlOffset.width / inputText.length;
    const tlineWidth = (maxTxtSize + 1) * fontWidth + 5;
    const maxWidth = this.viewFn().width - areaOffset.left - fontWidth;
    let h1 = txts.length;
    if (tlineWidth > areaOffset.width) {
      let twidth = tlineWidth;
      if (tlineWidth > maxWidth) {
        twidth = maxWidth;
        h1 += parseInt(tlineWidth / maxWidth, 10);
        h1 += (tlineWidth % maxWidth) > 0 ? 1 : 0;
      }
      textEl.css('width', `${twidth}px`);
    }
    h1 *= this.rowHeight;
    if (h1 > areaOffset.height) {
      textEl.css('height', `${h1}px`);
    }
  }
}

function insertText({ target }, itxt) {
  const { value, selectionEnd } = target;
  const ntxt = `${value.slice(0, selectionEnd)}${itxt}${value.slice(selectionEnd)}`;
  target.value = ntxt;
  target.setSelectionRange(selectionEnd + 1, selectionEnd + 1);

  this.inputText = ntxt;
  this.textlineEl.html(ntxt);
  resetTextareaSize.call(this);
}

const OPERATORS_ONLY_REGEX = /\+|-|(%\*%)|\*|\/|~/g;

function keydownEventHandler(evt, val, i, formulaColors) {
  const { keyCode, altKey } = evt;
  if (keyCode !== 13 && keyCode !== 9) evt.stopPropagation();
  if (keyCode === 13 && altKey) {
    insertText.call(this, evt, '\n');
    evt.stopPropagation();
  }
  if ((keyCode === 13 || keyCode === 9) && !altKey) {
    const v = evt.target.value;
    const start = v.lastIndexOf('=');
    if (start !== -1 && v.length > 1) {
      const nv = v.substring(start + 1).split(OPERATORS_ONLY_REGEX);
      const begin = nv[nv.length - 1].lastIndexOf('(');
      const end = nv[nv.length - 1].lastIndexOf(')');
      if (end === -1 && begin !== -1) {
        insertText.call(this, evt, ')');
      }
    }
    evt.preventDefault();
  }
  // const caret = evt.target.selectionStart;
  // // left
  // if (keyCode === 37 && caret === 0 && i > 0) {
  //   const prevText = formulaColors[i - 1].text;
  //   const elem = this.areaEl.children()[i - 1];
  //   elem.focus();
  //   elem.setSelectionRange(prevText.length, prevText.length);
  // }
  // // right
  // if (keyCode === 39
  //   && caret === val.text.length
  //   && formulaColors.length > 1
  //   && i < formulaColors.length - 1
  // ) {
  //   const elem = this.areaEl.children()[i + 1];
  //   elem.focus();
  // }
}

function inputEventHandler(evt) {
  const v = evt.target.value;
  // console.log(evt, 'v:', v);
  const { suggest, textlineEl, validator } = this;
  const { cell } = this;
  if (cell !== null) {
    if (('editable' in cell && cell.editable === true) || (cell.editable === undefined)) {
      this.inputText = v;
      if (validator) {
        if (validator.type === 'list') {
          suggest.search(v);
        } else {
          suggest.hide();
        }
      } else {
        const start = v.lastIndexOf('=');
        if (start !== -1 && v.length > 1) {
          const nv = v.substring(start + 1).split(OPERATORS_ONLY_REGEX);
          const lastnv = nv[nv.length - 1];
          if (lastnv.length > 0) {
            suggest.search(lastnv);
            // suggest.search(v.substring(start + 1));
          } else {
            suggest.hide();
          }
        } else {
          suggest.hide();
        }
      }
      textlineEl.html(v);
      resetTextareaSize.call(this);
      this.change('input', v);
    } else {
      evt.target.value = '';
    }
  } else {
    this.inputText = v;
    if (validator) {
      if (validator.type === 'list') {
        suggest.search(v);
      } else {
        suggest.hide();
      }
    } else {
      const start = v.lastIndexOf('=');
      if (start !== -1 && v.length > 1) {
        const nv = v.substring(start + 1).split(OPERATORS_ONLY_REGEX);
        suggest.search(nv[nv.length - 1]);
        // suggest.search(v.substring(start + 1));
      } else {
        suggest.hide();
      }
    }
    textlineEl.html(v);
    resetTextareaSize.call(this);
    this.change('input', v);
  }
}

function setTextareaRange(position) {
  const { el } = this.textEl;
  setTimeout(() => {
    el.focus();
    el.setSelectionRange(position, position);
  }, 0);
}

function setText(text, position) {
  const { textEl, textlineEl } = this;
  // firefox bug
  textEl.el.blur();

  textEl.val(text);
  textlineEl.html(text);
  setTextareaRange.call(this, position);
}

function suggestItemClick(it) {
  const { inputText, validator } = this;
  let position = 0;
  if (validator && validator.type === 'list') {
    this.inputText = it;
    position = this.inputText.length;
  } else {
    const start = inputText.lastIndexOf('=');
    const sit = inputText.substring(0, start + 1);
    let eit = inputText.substring(start + 1);
    const nv = eit.split(OPERATORS_ONLY_REGEX);
    const [l] = nv.slice(nv.length - 1);
    eit = l;
    if (eit.length < 1) {
      // When does this occur? Before changes to suggest requiring 1 character after '='?
      if (it.key === '%*%') {
        this.inputText = `${sit + it.key}`;
      } else {
        this.inputText = `${sit + it.key}(`;
      }
      position = this.inputText.length;
      this.inputText += `)${eit}`;
    } else {
      let formula = `${it.key}`;
      if (formula !== '%*%') {
        formula += '(';
      }
      this.inputText = this.inputText.slice(0, this.inputText.length - l.length) + formula;
      position = this.inputText.length;
      // this.inputText += ')';
    }
  }
  setText.call(this, this.inputText, position);
}

function resetSuggestItems() {
  this.suggest.setItems(this.formulas);
}

function dateFormat(d) {
  let month = d.getMonth() + 1;
  let date = d.getDate();
  if (month < 10) month = `0${month}`;
  if (date < 10) date = `0${date}`;
  return `${d.getFullYear()}-${month}-${date}`;
}

export default class Editor {
  constructor(formulas, viewFn, rowHeight) {
    this.viewFn = viewFn;
    this.rowHeight = rowHeight;
    this.formulas = formulas;
    this.suggest = new Suggest(formulas, (it) => {
      suggestItemClick.call(this, it);
    });
    this.datepicker = new Datepicker();
    this.datepicker.change((d) => {
      // console.log('d:', d);
      this.setText(dateFormat(d));
      this.clear();
    });
    this.areaEl = h('div', `${cssPrefix}-editor-area`)
      .children(
        this.textEl = h('textarea', '')
          // .attr({ contentEditable: 'true' })
          .on('input', (evt) => inputEventHandler.call(this, evt))
          .on('paste.stop', () => {})
          .on('keydown', (evt) => keydownEventHandler.call(this, evt)),
        this.textlineEl = h('div', 'textline'),
        this.suggest.el,
        this.datepicker.el,
      )
      .on('mousemove.stop', () => {})
      .on('mousedown.stop', () => {});
    this.el = h('div', `${cssPrefix}-editor`)
      .child(this.areaEl).hide();
    this.suggest.bindInputEvents(this.textEl);

    this.areaOffset = null;
    this.freeze = { w: 0, h: 0 };
    this.cell = null;
    this.inputText = '';
    this.change = () => {};
  }

  setFreezeLengths(width, height) {
    this.freeze.w = width;
    this.freeze.h = height;
  }

  clear() {
    // const { cell } = this;
    // const cellText = (cell && cell.text) || '';
    if (this.inputText !== '') {
      this.change('finished', this.inputText);
    }
    this.cell = null;
    this.areaOffset = null;
    this.inputText = '';
    this.el.hide();
    this.textEl.val('');
    this.textlineEl.html('');
    resetSuggestItems.call(this);
    this.datepicker.hide();
  }

  setOffset(offset, suggestPosition = 'top') {
    const {
      textEl, areaEl, suggest, freeze, el,
    } = this;
    if (offset) {
      this.areaOffset = offset;
      const {
        left, top, width, height, l, t,
      } = offset;
      // console.log('left:', left, ',top:', top, ', freeze:', freeze);
      const elOffset = { left: 0, top: 0 };
      // top left
      if (freeze.w > l && freeze.h > t) {
        //
      } else if (freeze.w < l && freeze.h < t) {
        elOffset.left = freeze.w;
        elOffset.top = freeze.h;
      } else if (freeze.w > l) {
        elOffset.top = freeze.h;
      } else if (freeze.h > t) {
        elOffset.left = freeze.w;
      }
      el.offset(elOffset);
      areaEl.offset({ left: left - elOffset.left - 0.8, top: top - elOffset.top - 0.8 });
      textEl.offset({ width: width - 9 + 0.8, height: height - 3 + 0.8 });
      const sOffset = { left: 0 };
      sOffset[suggestPosition] = height;
      suggest.setOffset(sOffset);
      suggest.hide();
    }
  }

  setCell(cell, validator) {
    // console.log('::', validator);
    const {
      el, datepicker, suggest, rowHeight, textlineEl, areaOffset,
    } = this;
    el.show();
    this.cell = cell;
    const text = (cell && cell.text) || '';
    this.setText(text);

    this.validator = validator;
    if (validator) {
      const { type } = validator;
      if (type === 'date') {
        datepicker.show();
        if (!/^\s*$/.test(text)) {
          datepicker.setValue(text);
        }
      }
      if (type === 'list') {
        suggest.setItems(validator.values());
        suggest.search('');
      }
    }
    // const childs = this.areaEl.children();
    // console.log(childs);
    // for (let i = 0; i < childs.length; i += 1) {
    //   console.log(childs[i]);
    //   if (childs[i].className === 'editor-cellreference') {
    //     this.areaEl.removeChild(childs[i]);
    //   }
    // }
    // this.areaEl.removeChildren();
    //
    // const inputText = cell && cell.text ? cell.text : '';
    // let tlineWidth = 0;
    // if (inputText.length > 0) {
    //   const txts = inputText.split('\n');
    //   const maxTxtSize = Math.max(...txts.map((it) => it.length));
    //   const tlOffset = textlineEl.offset();
    //   const fontWidth = tlOffset.width / inputText.length;
    //   tlineWidth = (maxTxtSize + 1) * fontWidth + 5;
    // }
    // const formulaColors = cell && cell.text ? getFormulaColors(cell.text) : [{ text: '', id: '0' }];
    // this.areaEl.children(...formulaColors.map((v, i) => h('input', 'editor-cellreference')
    //   .attr({
    //     type: 'text', value: v.text, key: v.id, id: v.id,
    //   })
    //   .css('width', (i === formulaColors.length - 1 && tlineWidth < areaOffset.width)
    //     ? `${areaOffset.width - 8.2
    //       - getTextWidth(inputText.slice(0, inputText.lastIndexOf(v.text)), '13px Helvetica')}px`
    //     : `${getTextWidth(v.text, '13px Helvetica')}px`)
    //   .css('height', `${rowHeight - 2.2}px`)
    //   .css('color', ('color' in v) && v.color)
    //   .on('input', (evt) => inputEventHandler.call(this, evt))
    //   .on('paste.stop', () => {})
    //   .on('keydown', (evt) => keydownEventHandler.call(this, evt, v, i, formulaColors))));
    //
    // const lastInput = this.areaEl.last();
    // this.areaEl.children(
    //   this.textlineEl.el,
    //   this.suggest.el,
    //   this.datepicker.el,
    // );
    // setTimeout(() => lastInput.focus());
  }

  setText(text) {
    this.inputText = text;
    // console.log('text>>:', text);
    setText.call(this, text, text.length);
    resetTextareaSize.call(this);
  }
}
