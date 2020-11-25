import { doChart, spreadsheetToR } from '../cloudr'

export default class ChartProxy {
  constructor(name, d) {
    this.name = name || 'chart';
    // this.charts = d.charts || [0];
    // this.datarange = d.datarange;
    this.source = '';
    this.type = "chart";
  }

  setData(d, datas) {
    d.slides = JSON.stringify(spreadsheetToR(datas))
    d.names = JSON.stringify(datas.map(data => data.name))
    doChart(d).then(src => this.source = src)
  }
}
