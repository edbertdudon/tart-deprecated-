//
//  cloudr
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
//  Notes:
//  Build: docker build . -t 'cloudrun-r-rscript'
//  Run: docker run -p 8080:8080 -e PORT=8080 cloudrun-r-rscript
//  Spreadsheet Architecture: https://ethercalc.net/#ch1
//  234\ ==> 234\\
//  translateR only works for "A2" not "AA22" for javascript and R
//  '=B2' works in cloudfunctions but not in localhost
//
//  Test Cases:
//  reference within a reference:
//    "Sheet1!C3"
//    * "Sheet1!C3 + Sheet1!C6"
//    "mean(Sheet1$Rating_X)"
//    * "1+2", "=1+2" !== 3
//    "31-Dec-2019"
//    "Sheet1!C3:C4"
//    "Sheet1!C3:D3"
//    "Sheet1!C:C"
//  "31-Dec-2019"
//  "Sheet1!C3 + Sheet1!C6"
//  "mean(Sheet1$Rating_X)"
//  * "1+2", "=1+2" !== 3
//  "Sheet1!C3"
//  "Sheet1!C3:C4"
//  "Sheet1!C3:D3"
//  "Sheet1!C:C"
//
//	Matrices Test Cases:
// 	H4 should work
// 	H4:H6 should not work
// 	H4:H6 %*% H4:H6 should work (replaces MMULT)
//	H:H %*% 2 should not work (can do H1+2, H2+2, etc.)
//	t(H:H)%*% H:H should work
//
import rFormulas from './formula'
import { createEmptyMatrix } from '../../../functions'
import { CellRange } from '../core/cell_range';

var FORMULA_CELL_REFERENCES = /\$?[A-Z]+\$?[0-9]*/g;
var LETTERS_REFERENCE = /\$?[A-Z]+/g;
var NUMBERS_REFERENCE = /\$?[0-9]+/g;

export function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

export function letterToColumn(letter) {
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}

const optionsFilterAdd = rFormulas.filter(formula => "addStart" in formula || "addEnd" in formula)

function addPrefixToFunction(cell) {
  let optionsInCell = []
  for (var i=0; i<optionsFilterAdd.length; i++) {
    if (cell.includes(optionsFilterAdd[i].key + '(')) {
      optionsInCell.push(optionsFilterAdd[i])
    }
  }
  for (var j=0; j<optionsInCell.length; j++) {
    if ("addStart" in optionsInCell[j]) {
      let match = cell.match(new RegExp(optionsInCell[j].key.slice(1, -1) + "\\("))
      cell = cell.replace(match, optionsInCell[j].key.slice(1) + optionsInCell[j].addStart)
    }
  }
  return cell
}

export function translateR(cell, name) {
  let match = cell.match(FORMULA_CELL_REFERENCES)
  if (match === null) return cell.replace(/'/g, "`")
  // replaces 'Sheet 1' with `Sheet 1`
  let coordinates = cell.replace(/'/g, "`")
  for (var i=0; i<match.length; i++) {
    // R reads 1:1 as first number in row and column
    // let column = match[i].toLowerCase().charCodeAt(0) - 96
    // let row = match[i].charAt(1) - 1
    let column = letterToColumn(match[i].match(LETTERS_REFERENCE)[0])
    let row = match[i].match(NUMBERS_REFERENCE)
    if (row != null) {row = row[0] - 1 } else {row = NaN}
    if (i !== match.length-1) {
      // let column2 = match[i+1].toLowerCase().charCodeAt(0) - 96
      // let row2 = match[i+1].charAt(1) - 1
      let column2 = letterToColumn(match[i+1].match(LETTERS_REFERENCE)[0])
      let row2 = match[i+1].match(NUMBERS_REFERENCE)
      if (row2 != null) {row2 = row2[0] - 1 } else {row2 = NaN}
      if (!/\d/.test(match[i])) {
        // Check for Sheet1!B:B and replace with Sheet1[,2:2]
        let ref5 = '[,' + column + ':' + column2 + ']'
        let prefix5 = new RegExp('!' + match[i] + ':' + match[i+1], 'g')
        coordinates = coordinates.replace(prefix5, ref5)
        // Check for B:B and replace with Sheet1[,2:2]
        let ref6 = '`' + name + '`' + '[,' + column + ':' + column2 + ']'
        let prefix6 = new RegExp(match[i] + ':' + match[i+1], 'g')
        coordinates = coordinates.replace(prefix6, ref6)
      }
      // replaces Sheet1!B2:C2 with Sheet1[1:1, 2:3] (Letters as Y, Numbers as X)
      let ref4 = '[' + row + ':' + row2 + ',' + column + ':' + column2 + ']'
      let prefix4 = new RegExp('!' + match[i] + ':' + match[i+1], 'g')
      coordinates = coordinates.replace(prefix4, ref4)
      // replaces B2:C2 with Sheet1[1:1, 2:3] (Letters as Y, Numbers as X)
      let ref3 = '`' + name + '`' + '[' + row + ':' + row2 + ',' + column + ':' + column2 + ']'
      let prefix3 = new RegExp(match[i] + ':' + match[i+1], 'g')
      coordinates = coordinates.replace(prefix3, ref3)
    }
    if (/\d/.test(match[i])) {
      // replaces Sheet1!B2 with Sheet1[1,2]
      let ref = '[' + row + ',' + column + ']'
      let prefix = new RegExp('!' + match[i], 'g')
      coordinates = coordinates.replace(prefix, ref)
      // replaces B2 with Sheet1[1,2]
      let ref2 = '`' + name + '`' + '[' + row + ',' + column + ']'
      let prefix2 = new RegExp(match[i], 'g')
      coordinates = coordinates.replace(prefix2, ref2)
    }
  }
  return addPrefixToFunction(coordinates)
}

function mapSpreadsheet(data, cb) {
  for (let ri=0; ri<data.length; ri++) {
    for (let ci=0; ci<data[ri].length; ci++) {
      data[ri][ci] = cb(ri,ci)
    }
  }
  return data
}

// [[1,2],["a","b"]]
export function spreadsheetToR(datas) {
  let newDatas = datas.map(data => {
    const {rows, cols } = data
    let newData = createEmptyMatrix(rows.len, cols.len)
    newData = mapSpreadsheet(newData, (ri, ci) => {
      if (rows._.[ri] != undefined && rows._.[ri].cells[ci] != undefined) {
        const cell = rows._.[ri].cells[ci].text
        if ((typeof cell === 'string' || cell instanceof String) && cell.startsWith("=") && cell != "=") {
          return translateR(cell.slice(1), data.name)
        } else {
          return cell
        }
      } else {
        return ''
      }
    })
    return newData
  });
  return newDatas
}

function rToSpreadsheet(tibble) {
  let slide = JSON.parse(tibble[0])
  let aoa = slide.map(row => {return Object.values(row)})
  aoa = [Object.keys(slide[0]), ...aoa]
  let o = {rows:{}};
  aoa.forEach(function(r, i) {
    var cells = {};
    r.forEach(function(c, j) { cells[j] = ({ text: c }); });
    o.rows[i] = { cells: cells };
  })
  return o
}

const fetchR = (data, func) => {
  return fetch(process.env.CLOUD_FUNCTIONS_URL + func, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
    mode: 'cors',
  })
}

const removeMatrix = (data, ri, ci) => {
  if (data.matrices._.length > 0) {
    let cr = data.matrices._.find(cr => cr.sri === ri && cr.sci === ci)
    if (cr !== undefined) {
      data.removeMatrix(cr)
    }
  }
}

const doParse = (obj, data, ri, ci) => {
  return fetchR(obj, "cloudR")
    .then(res => res.json())
    .then(res => {
      let result = JSON.parse(res[0])
      if (result.length > 1 || result[0].length > 1) {
        if (!Array.isArray(result[0])) {
          result = [result]
        }
        let cr = new CellRange(ri, ci, ri + result.length, ci + result[0].length);
        data.addMatrix(cr, result)
        return result[0][0].toString().replace(/['"]+/g, '')
      } else {
        removeMatrix(data, ri, ci)
        return result[0].toString().replace(/['"]+/g, '')
      }
    })
    .catch(err => {
      removeMatrix(data, ri, ci)
      return '#ERROR!'
  })
}

export const doRegression = data => {
  return fetchR(data, "regression")
		.then(res => res.json())
		.then(res => {
			if (typeof JSON.parse(res[0])[0] === "string" || JSON.parse(res[0])[0] instanceof String) {
				return(res)
			} else {
				return rToSpreadsheet(res)
			}
		})
}

export const rRender = (src, data, datas, ri, ci) => {
  if (src[0] === '=') {
    return doParse({
      cell: translateR(src.slice(1), data.name),
      slides: JSON.stringify(spreadsheetToR(datas)),
      names: JSON.stringify(datas.map(data => data.name)),
    }, data, ri, ci)
  }
  removeMatrix(data, ri, ci)
  return src;
};
