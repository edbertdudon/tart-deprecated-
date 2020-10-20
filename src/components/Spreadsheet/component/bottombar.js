import { h } from './element';
import { bindClickoutside, unbindClickoutside } from './event';
import { cssPrefix } from '../config';
import Icon from './icon';
import FormInput from './form_input';
import Dropdown from './dropdown';
import { xtoast } from './message';
import { tf } from '../locale/locale';

class DropdownMore extends Dropdown {
  constructor(click) {
    const icon = new Icon('ellipsis');
    super(icon, 'auto', false, 'top-left');
    this.contentClick = click;
  }

  reset(items) {
    const eles = items.map((it, i) => h('div', `${cssPrefix}-item`)
      .css('width', '150px')
      .css('font-weight', 'normal')
      .on('click', () => {
        this.contentClick(i);
        this.hide();
      })
      .child(it));
    this.setContentChildren(...eles);
  }

  setTitle() {}
}

const menuItems = [
  { key: 'new-sheet', title: tf('contextmenu.newSheet') },
  { key: 'rename', title: tf('contextmenu.rename') },
  { key: 'cut', title: tf('contextmenu.cut') },
  { key: 'copy', title: tf('contextmenu.copy') },
  { key: 'paste', title: tf('contextmenu.paste') },
  { key: 'delete', title: tf('contextmenu.deleteSheet') },
  { key: 'duplicate', title: tf('contextmenu.duplicate') },
];

function buildMenuItem(item) {
  return h('div', `${cssPrefix}-item`)
    .child(item.title())
    .on('click', () => {
      this.itemClick(item.key);
      this.hide();
    });
}

function buildMenu() {
  return menuItems.map(it => buildMenuItem.call(this, it));
}

class ContextMenu {
  constructor(viewFn, isHide = false) {
    this.el = h('div', `${cssPrefix}-contextmenu`)
      .css('width', '160px')
      .children(...buildMenu.call(this))
      .hide();
    this.viewFn = viewFn;
    this.itemClick = () => {};
    this.isHide = isHide;
  }

  hide() {
    const { el } = this;
    el.hide();
    unbindClickoutside(el);
  }

  setOffset(offset) {
    const { el } = this;
    el.offset(offset);
    el.show();
    bindClickoutside(el);
  }

  setPosition(x, y) {
    if (this.isHide) return;
    const { el } = this;
    const { width } = el.show().offset();
    const view = this.viewFn();
    const vhf = view.height / 2;
    let left = x;
    if (view.width - x <= width) {
      left -= width;
    }
    console.log(left, y)
    el.css('left', `${left}px`);
    if (y > vhf) {
      el.css('bottom', `${view.height - y}px`)
        .css('max-height', `${y}px`)
        .css('top', 'auto');
    } else {
      el.css('top', `${y}px`)
        .css('max-height', `${view.height - y}px`)
        .css('bottom', 'auto');
    }
    bindClickoutside(el);
  }
}

export default class Bottombar {
  constructor(addFunc = () => {},
    swapFunc = () => {},
    deleteFunc = () => {},
    updateFunc = () => {}) {
    this.swapFunc = swapFunc;
    this.updateFunc = updateFunc;
    this.dataNames = [];
    this.activeEl = null;
    this.deleteEl = null;
    this.items = [];
    this.moreEl = new DropdownMore((i) => {
      this.clickSwap2(this.items[i]);
    });
    this.contextMenu = new ContextMenu({width: 121, height: 39});
    this.contextMenu.itemClick = (type) => {
      if (type === 'new-sheet') {
        addFunc.call()
      } else if (type === 'rename') {

      } else if (type === 'copy') {
        // copy.call(this);
      } else if (type === 'cut') {
        // cut.call(this);
      } else if (type === 'paste') {
        // paste.call(this, 'all');
      } else if (type === 'delete') {
        deleteFunc.call()
      } else if (type === 'duplicate') {
        // paste.call(this, 'format');
      }
    };
    // this.contextMenu.itemClick = deleteFunc
    this.el = h('div', `${cssPrefix}-bottombar`, `${cssPrefix}-bottombar`)
      .children(
        this.contextMenu.el,
        this.menuEl = h('ul', `${cssPrefix}-menu`)
          .on('dragover', (e) => {
            e.preventDefault()
          })
          .on('drop', (e) => {
            const id = e.dataTransfer.getData("text/plain")
            e.target.appendChild(document.getElementById(id))
            e.dataTransfer.clearData()
            const value = e.target.firstChild.lastChild.data;
            const nindex = this.dataNames.findIndex(it => it === value);
            const v = this.dataNames[nindex]
            this.renameItem(nindex, value);
            console.log(this.items)
            // this.items.push(item);
            // this.menuEl.child(item);
            // this.moreEl.reset(this.dataNames);
          })
        // .child(
        //   h('li', '').children(
            // new Icon('add').on('click', () => {
            //   if (this.dataNames.length < 10) {
            //     addFunc();
            //   } else {
            //     xtoast('tip', 'it less than or equal to 10');
            //   }
            // }),
            // h('span', '').child(this.moreEl),
        //   ),
        // ),
      );
    // this.el.setAttribute('ondragover', "onDragOver(event)")
  }

  addItem(name, active) {
    this.dataNames.push(name);
    const item = h('li', active ? 'active' : '', 'slide' + this.dataNames.length)
      .children(
        this.numberEl = h('div', `${cssPrefix}-slidenumber`).child(this.dataNames.length.toString()),
        name
      );
    item.el.setAttribute('draggable', "true")
    item.on('click', () => {
      this.clickSwap2(item);
    }).on('contextmenu', (evt) => {
      const { offsetLeft, offsetHeight } = evt.target;
      this.contextMenu.setOffset({ left: offsetLeft, bottom: offsetHeight + 1 });
      // this.contextMenu.setPosition(evt.offsetX, evt.offsetY);
      this.deleteEl = item;
    }).on('dblclick', () => {
      const v = name;
      const input = new FormInput('97px', '');
      input.val(v);
      input.input.on('blur', ({ target }) => {
        const { value } = target;
        console.log(value)
        const nindex = this.dataNames.findIndex(it => it === v);
        this.renameItem(nindex, value);
        /*
        this.dataNames.splice(nindex, 1, value);
        this.moreEl.reset(this.dataNames);
        item.html('').child(value);
        this.updateFunc(nindex, value);
        */
      });
      item.html('').child(input.el);
      input.focus();
    }).on('dragstart', (e) => {
      e.dataTransfer.setData("text/plain", e.target.id)
    }).on('drop', (e) => {
      e.stopPropagation()
    });
    if (active) {
      this.clickSwap(item);
    }
    this.items.push(item);
    this.menuEl.child(item);
    this.moreEl.reset(this.dataNames);
  }

  renameItem(index, value) {
    this.dataNames.splice(index, 1, value);
    this.moreEl.reset(this.dataNames);
    this.items[index].html('')
      .children(
        this.numberEl = h('div', `${cssPrefix}-slidenumber`).child((index+1).toString()),
        value
      );
    this.updateFunc(index, value);
  }

  clear() {
    this.items.forEach((it) => {
      this.menuEl.removeChild(it.el);
    });
    this.items = [];
    this.dataNames = [];
    this.moreEl.reset(this.dataNames);
  }

  deleteItem() {
    const { activeEl, deleteEl } = this;
    if (this.items.length > 1) {
      const index = this.items.findIndex(it => it === deleteEl);
      this.items.splice(index, 1);
      this.dataNames.splice(index, 1);
      this.menuEl.removeChild(deleteEl.el);
      this.moreEl.reset(this.dataNames);
      if (activeEl === deleteEl) {
        const [f] = this.items;
        this.activeEl = f;
        this.activeEl.toggle();
        return [index, 0];
      }
      return [index, -1];
    }
    return [-1];
  }

  clickSwap2(item) {
    const index = this.items.findIndex(it => it === item);
    this.clickSwap(item);
    this.activeEl.toggle();
    this.swapFunc(index);
  }

  clickSwap(item) {
    if (this.activeEl !== null) {
      this.activeEl.toggle();
    }
    this.activeEl = item;
  }
}
