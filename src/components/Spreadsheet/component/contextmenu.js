import { h } from './element';
import { bindClickoutside, unbindClickoutside } from './event';
import { cssPrefix } from '../config';
import { tf } from '../locale/locale';
import { options } from '../options';

const menuItems = [
  { key: 'copy', title: tf('contextmenu.copy')/* , label: 'Ctrl+C' */ },
  { key: 'cut', title: tf('contextmenu.cut')/* , label: 'Ctrl+X' */ },
  { key: 'paste', title: tf('contextmenu.paste')/* , label: 'Ctrl+V' */ },
  { key: 'paste-value', title: tf('contextmenu.pasteValue')/* , label: 'Ctrl+Shift+V' */ },
  { key: 'paste-format', title: tf('contextmenu.pasteFormat')/* , label: 'Ctrl+Alt+V' */ },
  { key: 'paste-transposed', title: tf('contextmenu.pasteTransposed') },
  { key: 'divider' },
  { key: 'insert-row', title: tf('contextmenu.insertRow') },
  { key: 'insert-column', title: tf('contextmenu.insertColumn') },
  { key: 'divider' },
  { key: 'delete-row', title: tf('contextmenu.deleteRow') },
  { key: 'delete-column', title: tf('contextmenu.deleteColumn') },
  { key: 'delete-cell-text', title: tf('contextmenu.deleteCellText') },
  { key: 'hide', title: tf('contextmenu.hide') },
  { key: 'divider' },
  { key: 'freeze-header-row', title: tf('contextmenu.freezeHeaderRow') },
  { key: 'freeze-header-column', title: tf('contextmenu.freezeHeaderColumn') },
  { key: 'delete-row', title: tf('contextmenu.deleteRow') },
  { key: 'divider' },
  { key: 'validation', title: tf('contextmenu.validation') },
  { key: 'divider' },
  { key: 'cell-printable', title: tf('contextmenu.cellprintable') },
  { key: 'cell-non-printable', title: tf('contextmenu.cellnonprintable') },
  { key: 'divider' },
  { key: 'cell-editable', title: tf('contextmenu.celleditable') },
  { key: 'cell-non-editable', title: tf('contextmenu.cellnoneditable') },
];

const menuChart = [
  { key: 'edit', title: tf('contextmenuchart.edit') },
  { key: 'delete', title: tf('contextmenuchart.delete') },
  // { key: 'move', title: tf('contextmenuchart.move') },
];

function buildMenuItem(item) {
  if (item.key === 'divider') {
    return h('div', `${cssPrefix}-item divider`);
  }
  return h('div', `${cssPrefix}-item`)
    .on('click', () => {
      this.itemClick(item.key);
      this.hide();
    })
    // .on('mouseenter', (e) => {
    //   e.target.style.background = options.style.offcolor;
    // })
    // .on('mouseleave', (e) => {
    //   e.target.style.background = '';
    // })
    .children(
      item.title(),
      h('div', 'label').child(item.label || ''),
    );
}

function buildMenu(type) {
  if (type === 'sheet') {
    return menuItems.map((it) => buildMenuItem.call(this, it));
  }

  if (type === 'chart') {
    return menuChart.map((it) => buildMenuItem.call(this, it));
  }
}

export default class ContextMenu {
  constructor(type, viewFn, isHide = false) {
    this.type = type;
    this.menuItems = buildMenu.call(this, type);
    this.el = h('div', `${cssPrefix}-contextmenu`)
      .children(...this.menuItems)
      .hide();
    this.viewFn = viewFn;
    this.itemClick = () => {};
    this.isHide = isHide;
    this.setMode('range');
  }

  // row-col: the whole rows or the whole cols
  // range: select range
  setMode(mode) {
    if (this.type === 'sheet') {
      const hideEl = this.menuItems[12];
      if (mode === 'row-col') {
        hideEl.show();
      } else {
        hideEl.hide();
      }
    }
  }

  hide() {
    const { el } = this;
    el.hide();
    unbindClickoutside(el);
  }

  setPosition(x, y) {
    if (this.isHide) return;
    const { el } = this;
    const { height, width } = el.show().offset();
    const view = this.viewFn();
    const vhf = view.height / 2;
    let left = x;
    if (view.width - x <= width) {
      left -= width;
    }
    let top = y;
    let bottom = view.height - y;
    if (bottom <= height) {
      if (bottom < y) {
        bottom -= height - top;
      } else {
        top -= height - bottom;
      }
    }
    el.css('left', `${left}px`);
    if (y > vhf) {
      el.css('bottom', `${bottom}px`)
        // .css('max-height', `${y}px`)
        .css('top', 'auto');
    } else {
      el.css('top', `${top}px`)
        // .css('max-height', `${view.height - y}px`)
        .css('bottom', 'auto');
    }
    bindClickoutside(el);
  }
}
