/* global window, document */
import { h } from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
// import Bottombar from './component/bottombar';
import Clipboard from './core/clipboard';
import { cssPrefix } from './config';
import { locale } from './locale/locale';
import { getMaxNumberCustomSheet } from '../../functions';
import './index.less';

class Spreadsheet {
  constructor(selectors, options = {}) {
    let targetEl = selectors;
    this.options = options;
    this.sheetIndex = 1;
    this.datas = [];
    if (typeof selectors === 'string') {
      targetEl = document.querySelector(selectors);
    }
    // this.bottombar = new Bottombar(() => {
    //   const d = this.addSheet();
    //   this.sheet.resetData(d);
    // }, (index) => {
    //   const d = this.datas[index];
    //   this.sheet.resetData(d);
    // }, () => {
    //   this.deleteSheet();
    // }, (index, value) => {
    //   this.datas[index].name = value;
    // }, () => {
    //   this.copySheet();
    // }, (copyIndex, pasteIndex) => {
    //   const d = this.datas[copyIndex]
    //   this.pasteSheet(d, pasteIndex);
    // });
    this.data = this.addSheet();
    const rootEl = h('div', `${cssPrefix}`)
      .on('contextmenu', (evt) => evt.preventDefault());
    // create canvas element
    targetEl.appendChild(rootEl.el);
    this.sheet = new Sheet(rootEl, this.data, this.datas);
    this.clipboard = new Clipboard();
    // rootEl.child(this.bottombar.el);
  }

  addSheet(name, active = true, current) {
    const n = name || `Sheet${this.sheetIndex}`;
    const d = new DataProxy(n, this.options);
    d.change = (...args) => {
      this.sheet.trigger('change', ...args);
    };
    if (current == undefined) {
      this.datas.push(d);
    } else {
      this.datas.splice(current + 1, 0, d);
    }
    // console.log('d:', n, d, this.datas);
    // this.bottombar.addItem(n, active, this.options.style.offcolor);
    this.sheetIndex += 1;
    return d;
  }

  deleteSheet(oldIndex, nindex) {
    // const [oldIndex, nindex] = this.bottombar.deleteItem();
    if (oldIndex >= 0) {
      this.datas.splice(oldIndex, 1);
      if (nindex >= 0) this.sheet.resetData(this.datas[nindex]);
    }
  }

  copySheet(index) {
    this.clipboard.copy(index);
  }

  pasteSheet(dataNames, index, isDuplicate, active = true) {
    let data;
    if (isDuplicate) {
      data = this.datas[index];
    } else {
      data = this.datas[this.clipboard.range];
    }
    const d = new DataProxy('temp', this.options);
    d.setData(data.getData());
    d.name = `${data.name} ${getMaxNumberCustomSheet(dataNames, data.name)}`;
    this.datas.splice(index + 1, 0, d);
    // this.bottombar.pasteItem(d.name, active, this.options.style.offcolor);
    // this.sheetIndex = index + 1;
    this.sheet.resetData(d);
    return d;
  }

  insertChart(type) {
    this.data.addChart(type, this.datas, this.sheet.selector.range)
      .then((d) => {
        this.sheet.resetData(d);
        this.sheet.trigger('chart-select', d.chartSelect);
      });
  }

  editChart(c) {
    this.data.changeChart(c, this.datas, this.sheet.selector.range)
      .then((d) => this.sheet.resetData(d));
  }

  insertData(current, o, name) {
    const { row, col } = this.options;
    const { rows } = o;
    const nrows = Object.keys(rows).length;
    const ncols = Object.keys(rows[0].cells).length;
    if (nrows > row.len) {
      row.len = nrows;
    }
    if (ncols > col.len) {
      col.len = ncols;
    }

    const { datas } = this;
    const d = new DataProxy('temp', this.options);
    d.setData(o);
    const names = datas.map((it) => it.name);
    const n = getMaxNumberCustomSheet(names, name);

    if (n !== 1) {
      name = `${name} ${n}`;
    }
    d.name = name;

    const { _ } = this.data.rows;
    const isEmpty = Object.keys(_).length === 0 && _.constructor === Object;
    if (isEmpty) {
      datas.splice(current, 1, d);
    } else {
      datas.splice(current + 1, 0, d);
      this.sheetIndex = current + 1;
    }
    this.sheet.resetData(d);
    this.data = d;

    return isEmpty;
  }

  loadData(data) {
    const ds = Array.isArray(data) ? data : [data];
    // this.bottombar.clear();
    this.datas = [];
    if (ds.length > 0) {
      for (let i = 0; i < ds.length; i += 1) {
        const it = ds[i];
        const nd = this.addSheet(it.name, i === 0);
        nd.setData(it);
        if (i === 0) {
          this.sheet.resetData(nd);
        }
      }

      ds.forEach((nd) => {
        this.data.loadChart(nd.charts, this.datas);
      });
    }

    return this;
  }

  getData() {
    return this.datas.map((it) => it.getData());
  }

  cellText(ri, ci, text, sheetIndex = 0) {
    this.datas[sheetIndex].setCellText(ri, ci, text, 'finished');
    return this;
  }

  cell(ri, ci, sheetIndex = 0) {
    return this.datas[sheetIndex].getCell(ri, ci);
  }

  cellStyle(ri, ci, sheetIndex = 0) {
    return this.datas[sheetIndex].getCellStyle(ri, ci);
  }

  reRender() {
    return this;
  }

  on(eventName, func) {
    this.sheet.on(eventName, func);
    return this;
  }

  validate() {
    const { validations } = this.data;
    return validations.errors.size <= 0;
  }

  change(cb) {
    this.sheet.on('change', cb);
    return this;
  }

  static locale(lang, message) {
    locale(lang, message);
  }
}

const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);

if (window) {
  window.x_spreadsheet = spreadsheet;
  window.x_spreadsheet.locale = (lang, message) => locale(lang, message);
}

export default Spreadsheet;
export {
  spreadsheet,
};
