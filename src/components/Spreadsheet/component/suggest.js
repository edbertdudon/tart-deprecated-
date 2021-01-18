import { h } from './element';
import { bindClickoutside, unbindClickoutside } from './event';
import { cssPrefix } from '../config';

function inputMovePrev(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  const { filterItems } = this;
  if (filterItems.length <= 0) return;
  if (this.itemIndex >= 0) filterItems[this.itemIndex].toggle();
  this.itemIndex -= 1;
  if (this.itemIndex < 0) {
    this.itemIndex = filterItems.length - 1;
  }
  filterItems[this.itemIndex].toggle();
}

function inputMoveNext(evt) {
  evt.stopPropagation();
  const { filterItems } = this;
  if (filterItems.length <= 0) return;
  if (this.itemIndex >= 0) filterItems[this.itemIndex].toggle();
  this.itemIndex += 1;
  if (this.itemIndex > filterItems.length - 1) {
    this.itemIndex = 0;
  }
  filterItems[this.itemIndex].toggle();
}

function inputMouseEnter(index, description) {
  const { filterItems } = this;
  if (filterItems.length <= 0) return;
  if (this.itemIndex >= 0) {
    filterItems[this.itemIndex].toggle();
    filterItems[this.itemIndex].css('height', '26px');
  }
  this.itemIndex = index;
  filterItems[this.itemIndex].toggle();
  if (description.length > 53) {
    filterItems[this.itemIndex].css('height', '54px');
  } else {
    filterItems[this.itemIndex].css('height', '40px');
  }
}

function inputEnter(evt) {
  evt.preventDefault();
  const { filterItems } = this;
  if (filterItems.length <= 0) return;
  evt.stopPropagation();
  if (this.itemIndex < 0) this.itemIndex = 0;
  filterItems[this.itemIndex].el.click();
  this.hide();
}

function inputKeydownHandler(evt) {
  const { keyCode } = evt;
  if (evt.ctrlKey) {
    evt.stopPropagation();
  }
  switch (keyCode) {
    case 37: // left
      evt.stopPropagation();
      break;
    case 38: // up
      inputMovePrev.call(this, evt);
      break;
    case 39: // right
      evt.stopPropagation();
      break;
    case 40: // down
      inputMoveNext.call(this, evt);
      break;
    case 13: // enter
      inputEnter.call(this, evt);
      break;
    case 9:
      inputEnter.call(this, evt);
      break;
    default:
      evt.stopPropagation();
      break;
  }
}

export default class Suggest {
  constructor(items, itemClick, width = '300px') {
    this.filterItems = [];
    this.items = items;
    this.el = h('div', `${cssPrefix}-suggest`).css('width', width).hide();
    this.itemClick = itemClick;
    this.itemIndex = 0;
  }

  setOffset(v) {
    this.el.cssRemoveKeys('top', 'bottom')
      .offset(v);
  }

  hide() {
    const { el } = this;
    this.filterItems = [];
    this.itemIndex = 0;
    el.hide();
    unbindClickoutside(this.el.parent());
  }

  setItems(items) {
    this.items = items;
    // this.search('');
  }

  search(word) {
    let { items } = this;
    if (!/^\s*$/.test(word)) {
      items = items.filter((it) => (it.key || it).startsWith(word.toLowerCase()));
    }
    items = items.map((it, index) => {
      let { title, description } = it;
      if (title) {
        if (typeof title === 'function') {
          title = title();
        }
      } else {
        title = it;
      }
      const desc = h('div', `${cssPrefix}-description`)
        .child(description);
      const item = h('div', `${cssPrefix}-item`)
        // .child(title)
        .children(title, desc)
        .on('click.stop', () => {
          this.itemClick(it);
          this.hide();
        })
        .on('mouseenter', (evt) => {
          inputMouseEnter.call(this, index, description);
        });
      if (it.label) {
        item.child(h('div', 'label').html(it.label));
      }
      if (items.length === 1 && description.length > 53) {
        item.css('height', '54px');
      }
      return item;
    });
    this.filterItems = items;
    if (items.length <= 0) {
      this.hide();
      return;
    }
    const { el } = this;
    items[0].toggle();
    el.html('').children(...items).show();
    bindClickoutside(el.parent(), () => { this.hide(); });
  }

  bindInputEvents(input) {
    input.on('keydown', (evt) => inputKeydownHandler.call(this, evt));
  }
}
