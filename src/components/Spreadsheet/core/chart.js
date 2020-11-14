import { doChart, spreadsheetToR } from '../cloudr'

export default class Chart {
  constructor(name) {
    this.name = name || 'chart';
    this.type = "chart";
    this.source = '';
  }

  setData(d, datas) {
    d.slides = JSON.stringify(spreadsheetToR(datas))
    d.name = JSON.stringify(datas.map(data => data.name))
    doChart(d).then(src => this.source = src)
  }
}
