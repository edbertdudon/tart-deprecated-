import { doChart, spreadsheetToR } from '../cloudr'

export default class ChartProxy {
  constructor(name, d) {
    this.name = name || 'chart';
    this.types = d.types || [0];
    this.range = d.range;
    this.variablex = d.variablex || '';
    this.variabley = d.variabley || '';
    this.firstrow = d.firstrow || true;
    this.source = '';
    this.type = "chart";
  }

  setData(d, datas) {
    d.slides = JSON.stringify(spreadsheetToR(datas))
    d.names = JSON.stringify(datas.map(data => data.name))
    doChart(d).then(src => {
      console.log(src)
      this.source = src
    })
  }
}
