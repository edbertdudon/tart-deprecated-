import { h } from './element';
import { bindClickoutside, unbindClickoutside } from './event';
import { cssPrefix } from '../config';
import Icon from './icon';
import FormInput from './form_input';
import Dropdown from './dropdown';
import Clipboard from '../core/clipboard';
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
  // { key: 'divider' },
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
  constructor() {
    this.el = h('div', `${cssPrefix}-contextmenu`)
      .css('width', '160px')
      .children(...buildMenu.call(this))
      .hide();
    this.itemClick = () => {};
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
}

export default class Bottombar {
  constructor(addFunc = () => {},
    swapFunc = () => {},
    deleteFunc = () => {},
    updateFunc = () => {},
    copyFunc = () => {},
    pasteFunc = () => {}) {
    this.swapFunc = swapFunc;
    this.updateFunc = updateFunc;
    this.pasteFunc = pasteFunc;
    this.dataNames = [];
    this.activeEl = null;
    this.deleteEl = null;
    this.items = [];
    this.moreEl = new DropdownMore((i) => {
      this.clickSwap2(this.items[i]);
    });
    this.clipboard = new Clipboard()
    this.contextMenu = new ContextMenu();
    this.contextMenu.itemClick = type => {
      if (type === 'new-sheet') {
        addFunc.call()
      } else if (type === 'rename') {
        const event = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        })
        this.activeEl.el.dispatchEvent(event)
      } else if (type === 'copy') {
        copyFunc.call()
      } else if (type === 'cut') {
        deleteFunc.call()
      } else if (type === 'paste') {
        const index = this.items.findIndex(it => it === this.deleteEl);
        this.pasteFunc(this.clipboard.range, index)
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
          // .on('dragover', (e) => {
          //   e.preventDefault()
          // })
          // .on('drop', (e) => {
          //   const id = e.dataTransfer.getData("text/plain")
          //   e.target.appendChild(document.getElementById(id))
          //   e.dataTransfer.clearData()
          //   const nindex = this.items.findIndex(item => item.el.id === id)
          //   console.log(this.dataNames)
          //   // this.dataNames = this.dataNames.splice(nindex, 1)
          //   // const value = e.target.firstChild.lastChild.data;
          //   // const nindex = this.dataNames.findIndex(it => it === value);
          //   // console.log(value)
          //   // console.log(nindex)
          //   // console.log(this.dataNames)
          //   // const v = this.dataNames[nindex]
          //   // this.dataNames =
          //   // this.renameItem(nindex, value);
          //   // this.dataNames = []
          //   // console.log(this.items)
          //   // console.log(this.moreEl)
          //   // this.items.push(item);
          //   // this.menuEl.child(item);
          //   // this.moreEl.reset(this.dataNames);
          // })
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

  addItem(name, active, offcolor) {
    this.dataNames.push(name);
    const item = h('li', active ? 'active' : '')
      .children(
        this.numberEl = h('div', `${cssPrefix}-slidenumber`).child(this.dataNames.length.toString()),
        name
      );
    item.el.setAttribute('draggable', "true")
    var dragSrcEl = null;
    item.on('click', () => {
      this.clickSwap2(item, offcolor);
    }).on('contextmenu', (evt) => {
      const { offsetLeft, offsetHeight } = evt.target;
      // this.contextMenu.setOffset({ left: offsetLeft, bottom: offsetHeight + 1 });
      this.contextMenu.setOffset({ left: evt.offsetX, top: evt.offsetY });
      this.deleteEl = item;
    }).on('dblclick', () => {
      const v = name;
      const input = new FormInput('97px', '');
      input.val(v);
      input.input.on('blur', ({ target }) => {
        const { value } = target;
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
      dragSrcEl = item.el;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", item.el)
      item.el.classList.add("dragElem");
    }).on('dragenter', (e) => {
    }).on('dragover', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
      item.el.classList.add("over");
      e.dataTransfer.dropEffect = "move";
      return false;
    }).on('dragleave', (e) => {
      item.el.classList.remove("over");
    }).on('drop', (e) => {
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      if (dragSrcEl != this) {
        item.el.parentNode.removeChild(dragSrcEl);
        var dropHTML = e.dataTransfer.getData("text/html");
        // e.target.appendChild(document.getElementById(id))
        // e.dataTransfer.clearData()
        item.el.insertAdjacentHTML("beforebegin", dropHTML);
        console.log(item.el)
        // var dropElem = item.el.previousSibling;
        // addDnDHandlers(dropElem);
      }
      item.el.classList.remove("over");
      return false;
    }).on('dragend', (e) => {
      item.el.classList.remove("over");
    });
    if (active) {
      this.clickSwap(item);
      this.changeColor(item, offcolor)
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

  copyItem() {
    const { deleteEl } = this;
    const index = this.items.findIndex(it => it === deleteEl);
    this.clipboard.copy(index)
  }

  pasteItem(name, active, offcolor) {
    const { clipboard, deleteEl } = this;
    if (clipboard.isClear()) return false;
    const index = this.items.findIndex(it => it === deleteEl);
    this.dataNames.splice(index+1, 0, name)
    const item = h('li', active ? 'active' : '')
      .children(
        this.numberEl = h('div', `${cssPrefix}-slidenumber`).child((index+2).toString()),
        name
      );
    item.el.setAttribute('draggable', "true")
    item.on('click', () => {
      this.clickSwap2(item, offcolor);
    }).on('contextmenu', (evt) => {
      const { offsetLeft, offsetHeight } = evt.target;
      this.contextMenu.setOffset({ left: evt.offsetX, top: evt.offsetY });
      this.deleteEl = item;
    }).on('dblclick', () => {
      const v = name;
      const input = new FormInput('97px', '');
      input.val(v);
      input.input.on('blur', ({ target }) => {
        const { value } = target;
        const nindex = this.dataNames.findIndex(it => it === v);
        this.renameItem(nindex, value);
      });
      item.html('').child(input.el);
      input.focus();
    })
    if (active) {
      this.clickSwap(item);
      this.changeColor(item, offcolor)
    }
    this.items.splice(index+1, 0, item)
    this.menuEl.childAtIndex(item, index+1)
    // this.moreEl.reset(this.dataNames);

  }

  clickSwap2(item, offcolor) {
    const index = this.items.findIndex(it => it === item);
    this.clickSwap(item);
    this.activeEl.toggle();
    this.swapFunc(index);
    this.changeColor(item, offcolor)
  }

  clickSwap(item) {
    if (this.activeEl !== null) {
      this.activeEl.toggle();
    }
    this.activeEl = item;
  }

  changeColor(item, offcolor) {
    for (var i=0; i<this.items.length; i++) {
      if (this.items[i] !== item) {
        this.items[i].el.style.backgroundColor = "#fff"
      }
    }
    this.activeEl.el.style.backgroundColor = offcolor
  }
}
