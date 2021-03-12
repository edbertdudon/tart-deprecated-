/* global window, document */
import { h } from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
// import Bottombar from './component/bottombar';
import Clipboard from './core/clipboard';
import { cssPrefix } from './config';
import { locale } from './locale/locale';
import { getMaxNumberCustomSheet } from '../../functions';
import reservedKeywords from '../../constants/reservedkeywords'
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

  addSheet(name, active = true, index, mode = 'edit') {
    let n = name || `Sheet${this.sheetIndex}`;
    const names = this.datas.map((it) => it.name);

    // When n is Sheet4 but Sheet4 already exists.
    if (n === `Sheet${this.sheetIndex}` && n in names) {
      n = `Sheet${this.sheetIndex + 1}`;
      this.sheetIndex += 1;
    }
    if (this.datas.length > 0) {
      const max = getMaxNumberCustomSheet(names, n);
      if (max !== 1) {
        n = `${n} ${max}`;
      }
    }

    const opt = this.options;
    opt.mode = mode;

    const d = new DataProxy(n, opt);
    d.change = (...args) => {
      this.sheet.trigger('change', ...args);
    };
    if (index === undefined) {
      this.datas.push(d);
    } else {
      this.datas.splice(index + 1, 0, d);
    }
    // console.log('d:', n, d, this.datas);
    // this.bottombar.addItem(n, active, this.options.style.offcolor);
    this.sheetIndex += 1;
    return d;
  }

  insertSheet(index) {
    const d = this.addSheet(`Sheet${this.sheetIndex}`, true, index);
    this.sheet.resetData(d, this.datas);
    this.data = d;
    return this.datas.map((data) => data.name);
  }

  selectSheet(index) {
    const d = this.datas[index];
    this.sheet.resetData(d, this.datas);
    this.data = d;
  }

  deleteSheet(oldIndex, nindex) {
    // const [oldIndex, nindex] = this.bottombar.deleteItem();
    if (oldIndex >= 0) {
      this.datas.splice(oldIndex, 1);
      if (nindex >= 0) this.sheet.resetData(this.datas[nindex], this.datas);
    }
  }

  updateSheetName(index, name) {
    this.datas[index].name = name;
  }

  copySheet(index) {
    this.clipboard.copy(index);
  }

  pasteSheet(dataNames, index, isDuplicate) {
    let data;
    if (isDuplicate) {
      data = this.datas[index];
    } else {
      data = this.datas[this.clipboard.range];
    }
    const opt = this.options;
    opt.mode = data.settings.mode;
    const d = new DataProxy('temp', opt);
    d.setData(data.getData());
    d.name = `${data.name} ${getMaxNumberCustomSheet(dataNames, data.name)}`;
    this.datas.splice(index + 1, 0, d);
    // this.bottombar.pasteItem(d.name, active, this.options.style.offcolor);
    // this.sheetIndex = index + 1;
    this.sheet.resetData(d, this.datas);
    this.data = d;
    return this.datas.map((a) => a.name);
  }

  insertChart(type) {
    this.data.addChart(type, this.datas, this.sheet);
  }

  editChart(c) {
    this.data.changeChart(c, this.datas, this.sheet.selector.range);
  }

  insertData(current, o, name, mode = 'edit') {
    const opt = this.options;
    const { row, col } = opt;
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
    opt.mode = mode;
    const d = new DataProxy('temp', opt);
    d.setData(o);
    const names = datas.map((it) => it.name);
    let newName = name;
    if (reservedKeywords.includes(newName)) {
      newName = `${newName} sheet`
    }
    const n = getMaxNumberCustomSheet(names, newName);
    if (n !== 1) {
      newName = `${newName} ${n}`;
    }
    d.name = newName;

    const { _ } = this.data.rows;
    const isEmpty = Object.keys(_).length === 0 && _.constructor === Object;
    if (isEmpty) {
      datas.splice(current, 1, d);
    } else {
      datas.splice(current + 1, 0, d);
      // this.sheetIndex = current + 1;
    }
    this.sheet.resetData(d, this.datas);
    this.data = d;

    return isEmpty;
  }

  loadData(data) {
    const ds = Array.isArray(data) ? data : [data];
    // Fixing charts can introduce nulls. Use splice to manually fix.
    // ds[1].charts.splice(1, 3);
    // this.bottombar.clear();
    this.datas = [];
    if (ds.length > 0) {
      for (let i = 0; i < ds.length; i += 1) {
        const it = ds[i];
        const mode = it.type === 'input' ? 'read' : 'edit';
        const nd = this.addSheet(it.name, i === 0, undefined, mode);
        nd.setData(it, false);
        nd.loadChart(nd.charts, this.datas, i === 0);
        if (i === 0) {
          this.sheet.resetData(nd, this.datas, false);
        }
      }
      const names = ds.filter(({ name }) => name.match(/^Sheet[0-9]+$/g))
        .map((d) => d.name.match(/[0-9]+/g)[0])
      this.sheetIndex = Math.max(...names) + 1
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
