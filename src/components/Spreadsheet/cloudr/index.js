//
// cloudr
// Sciepp
//
// Created by Edbert Dudon on 7/8/19.
// Copyright © 2019 Project Sciepp. All rights reserved.
//
// Notes:
// Build: docker build . -t 'cloudrun-r-rscript'
// Run: docker run -p 8080:8080 -e PORT=8080 cloudrun-r-rscript
// 234\ ==> 234\\
//
// Test Cases:
// reference within a reference:
//   "Sheet1!C3"
//   * "Sheet1!C3 + Sheet1!C6"
//   "mean(Sheet1$Rating_X)"
//   * "1+2", "=1+2" !== 3
//   "31-Dec-2019"
//   "Sheet1!C3:C4"
//   "Sheet1!C3:D3"
//   "Sheet1!C:C"
// "31-Dec-2019"
// "Sheet1!C3 + Sheet1!C6"
// "mean(Sheet1$Rating_X)"
// * "1+2", "=1+2" !== 3
// "Sheet1!C3"
// "Sheet1!C3:C4"
// "Sheet1!C3:D3"
// "Sheet1!C:C"
//
// Matrices Test Cases:
// H4 should work
// H4:H6 should not work
// H4:H6 %*% H4:H6 should work (replaces MMULT)
// H:H %*% 2 should not work (can do H1+2, H2+2, etc.)
// t(H:H)%*% H:H should work
// matrix with cell referencing
//
import _cell from '../core/cell';
import { formulam, rFormulas } from './formula';
import {
  LETTERS_REFERENCE, NUMBERS_REFERENCE, CELL_REFERENCE, createEmptyMatrix, letterToColumn,
} from '../../../functions';
import { CellRange } from '../core/cell_range';

const optionsFiltered = rFormulas
  .filter((formula) => 'addStart' in formula || 'addEnd' in formula);

function addPrefixToFunction(cell) {
  let newCell = cell;
  const options = optionsFiltered.filter((o) => cell.includes(`${o.key}(`));

  options.forEach((o) => {
    if ('addStart' in o) {
      const prefix = new RegExp(`${o.key}\\(`);
      const match = cell.match(prefix);
      const replacement = `${o.key}(${o.addStart},`;
      const prefixPlusStart = new RegExp(`${o.key}\\(${o.addStart}`);
      // rnorm() -> rnorm(1,) but rnorm(1) remains
      if (!prefixPlusStart.test(cell)) {
        newCell = cell.replace(match, replacement);
      }
    }
    // addEnd
  });
  return newCell;
}

function translateR(cell, name) {
  // replaces 'Sheet 1' with `Sheet 1`
  let coordinates = addPrefixToFunction(cell.replace(/'/g, '`'));
  let match = coordinates.match(CELL_REFERENCE);

  if (match === null) return coordinates;

  const matchNo$ = match.map((c) => c.replace(/\$/g, ''));
  match = match.map((c) => c.replace(/\$/g, '\\$'));

  for (let i = 0; i < match.length; i += 1) {
    // R reads 1:1 as first number in row and column
    const column = letterToColumn(matchNo$[i].match(LETTERS_REFERENCE)[0]);
    let row = matchNo$[i].match(NUMBERS_REFERENCE);

    // if (row != null) {row = row[0] - 1} else {row = NaN}
    if (row != null) { row = row[0]; } else { row = NaN; }
    if (i !== match.length - 1) {
      const column2 = letterToColumn(matchNo$[i + 1].match(LETTERS_REFERENCE)[0]);
      let row2 = matchNo$[i + 1].match(NUMBERS_REFERENCE);

      // if (row2 != null) {row2 = row2[0] - 1} else {row2 = NaN}
      if (row2 != null) { row2 = row2[0]; } else { row2 = NaN; }
      if (!/\d/.test(match[i])) {
        // Check for Sheet1!B:B and replace with Sheet1[,2:2]
        const ref5 = `[,${column}:${column2}]`;
        const prefix5 = new RegExp(`!${match[i]}:${match[i + 1]}`, 'g');
        coordinates = coordinates.replace(prefix5, ref5);

        // Check for B:B and replace with Sheet1[,2:2]
        const ref6 = `\`${name}\`[,${column}:${column2}]`;
        const prefix6 = new RegExp(`${match[i]}:${match[i + 1]}`, 'g');
        coordinates = coordinates.replace(prefix6, ref6);
      }

      // replaces Sheet1!B2:C2 with Sheet1[1:1, 2:3] (Letters as Y, Numbers as X)
      const ref4 = `[${row}:${row2},${column}:${column2}]`;
      const prefix4 = new RegExp(`!${match[i]}:${match[i + 1]}`, 'g');
      coordinates = coordinates.replace(prefix4, ref4);

      // replaces B2:C2 with Sheet1[1:1, 2:3] (Letters as Y, Numbers as X)
      const ref3 = `\`${name}\`[${row}:${row2},${column}:${column2}]`;
      const prefix3 = new RegExp(`${match[i]}:${match[i + 1]}`, 'g');
      coordinates = coordinates.replace(prefix3, ref3);
    }
    if (/\d/.test(match[i])) {
      // replaces Sheet1!B2 with Sheet1[1,2]
      const ref = `[${row},${column}]`;
      const prefix = new RegExp(`!${match[i]}`, 'g');
      coordinates = coordinates.replace(prefix, ref);

      // replaces B2 with Sheet1[1,2]
      const ref2 = `\`${name}\`[${row},${column}]`;
      const prefix2 = new RegExp(match[i], 'g');
      coordinates = coordinates.replace(prefix2, ref2);
    }
  }
  return addPrefixToFunction(coordinates);
}

function mapSpreadsheet(data, cb) {
  const newData = data;
  for (let ri = 0; ri < data.length; ri += 1) {
    for (let ci = 0; ci < data[ri].length; ci += 1) {
      newData[ri][ci] = cb(ri, ci);
    }
  }
  return data;
}

// [[1,2],["a","b"]]
function spreadsheetToR(datas) {
  const newDatas = datas.map((data) => {
    const { rows } = data;
    const arows = Object.keys(rows._);
    if (arows.length < 1) return [];
    const nrows = Math.max(...arows) + 1;
    let ncols = 0;
    arows.forEach((row) => {
      const l = Math.max(...Object.keys(rows._.[row].cells));
      if (l > ncols) {
        ncols = l;
      }
    });
    ncols += 1;
    let newData = createEmptyMatrix(nrows, ncols);
    newData = mapSpreadsheet(newData, (ri, ci) => {
      if (rows._.[ri] !== undefined && rows._.[ri].cells[ci] !== undefined) {
        const cell = rows._.[ri].cells[ci].text;
        if ((typeof cell === 'string' || cell instanceof String)
          && cell.startsWith('=') && cell !== '=') {
          return translateR(cell.slice(1), data.name);
        }
        return cell;
      }
      return '';
    });
    return newData;
  });
  return newDatas;
}

function fetchR(data, func) {
  return fetch(process.env.CLOUD_FUNCTIONS_URL + func, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });
}

function removeMatrix(data, ri, ci) {
  if (data.matrices._.length > 0) {
    const cr = data.matrices._.find((c) => c.sri === ri && c.sci === ci);
    if (cr !== undefined) {
      data.removeMatrix(cr);
    }
  }
}

function replaceQuotes(result) {
  return result.toString().replace(/['"]+/g, '');
}

function doParse(obj, data, ri, ci) {
  return fetchR(obj, 'cloudR')
    .then((res) => res.json())
    .then((res) => {
      let result = JSON.parse(res[0]);
      if (result.length > 1 || result[0].length > 1) {
        if (!Array.isArray(result[0])) {
          result = [result];
        }
        const cr = new CellRange(ri, ci, ri + result.length, ci + result[0].length);
        const stringResult = replaceQuotes(result[0][0]);
        if (stringResult === '#ERROR!' || stringResult === '#REF!') {
          removeMatrix(data, ri, ci);
        } else {
          data.addMatrix(cr, result);
        }
        return stringResult;
        // return {
        //   value: result[0][0].toString().replace(/['"]+/g, ''),
        //   hasMatrix: true,
        // };
      }
      removeMatrix(data, ri, ci);
      return replaceQuotes(result[0]);
    })
    .catch(() => {
      removeMatrix(data, ri, ci);
      return '#ERROR!';
    });
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => binary += String.fromCharCode(b));

  return window.btoa(binary);
}

function doChart(data) {
  return fetchR(data, 'plot')
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
      const base64Flag = 'data:image/jpeg;base64,';
      const imageStr = arrayBufferToBase64(buffer);
      return (base64Flag + imageStr);
    });
}

function rToSpreadsheet(aoa) {
  const o = { rows: {} };
  aoa.forEach((r, i) => {
    const cells = {};
    r.forEach((c, j) => { cells[j] = ({ text: c }); });
    o.rows[i] = { cells };
  });
  return o;
}

// Applicable Types of data
// const firstone = '[["formula.name","ChiSquare","Df","p","test"],["Variance","0.932418764519325","1","0.334235198366151","Non-constant Variance Score Test"]]';
// const secondone = '[{"statistic":0,"p.value":1,"parameter":1,"method":"Pearson\'s Chi-squared test with Yates\' continuity correction"}]'
// const thirdone = '[{"rowname":"Air.Flow","Air.Flow":1,"Water.Temp":0.781852332952155,"Acid.Conc.":0.500142874899459},{"rowname":"Water.Temp","Air.Flow":0.781852332952155,"Water.Temp":1,"Acid.Conc.":0.39093953782809},{"rowname":"Acid.Conc.","Air.Flow":0.500142874899459,"Water.Temp":0.39093953782809,"Acid.Conc.":1}]'
function doRegress(data, type) {
  return fetchR(data, type)
    .then((res) => res.json())
    .then((res) => {
      const slide = JSON.parse(res);
      // const slide = JSON.parse(res[0])
      if (Array.isArray(slide[0])) {
        return rToSpreadsheet(slide);
      }
      let aoa = slide.map((row) => Object.values(row));
      aoa = [Object.keys(slide[0]), ...aoa];
      return rToSpreadsheet(aoa);
    });
}

function doOptimization(data) {
  return fetchR(data, 'optimization')
    .then((res) => {
      if (!res.ok) {
        return res.text();
      }
      return res.json();
    })
    .then((res) => {
      const slide = JSON.parse(res);
      if ('error' in slide) {
        return slide;
      }
      // const optimizeData = slide[0];
      // const optimizeData = slide[1];
      let aoa = slide.map((row) => Object.values(row));
      aoa = [Object.keys(slide[0]), ...aoa];
      return rToSpreadsheet(aoa);
      // return {
      //   sparkdata: slide[0],
      //   res: rToSpreadsheet(aoa),
      // };
    });
}

async function rRender(cell, data, datas, ri, ci, prevData) {
  const src = cell.text || '';
  // check for changes in data
  if ('result' in cell
    && ri in prevData
    && 'cells' in prevData[ri]
    && ci in prevData[ri].cells
    && 'text' in prevData[ri].cells[ci]
    && prevData[ri].cells[ci].text === src) {
    return cell.result;
  }

  let result;
  if (src[0] === '=') {
    if (/[a-z]+/i.test(src)) {
      result = await doParse({
        cell: translateR(src.slice(1), data.name),
        slides: JSON.stringify(spreadsheetToR(datas)),
        names: JSON.stringify(datas.map((d) => d.name)),
      }, data, ri, ci);
      data.setCellResult(ri, ci, result);
      return result;
    }
    result = _cell.render(src, formulam, (y, x) => (data.getCellTextOrDefault(x, y)));
  }

  if ('result' in cell) {
    data.removeCellResult(ri, ci);
  }
  removeMatrix(data, ri, ci);
  result = src;
  return result;
}

export {
  translateR,
  spreadsheetToR,
  removeMatrix,
  doChart,
  doRegress,
  doOptimization,
  rRender,
};
