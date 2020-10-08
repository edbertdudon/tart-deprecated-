import rFormulas from './formula'

export var FORMULA_CELL_REFERENCES = /\$?[A-Z]+\$?[0-9]*/g;
export var LETTERS_REFERENCE = /\$?[A-Z]+/g;
export var NUMBERS_REFERENCE = /\$?[0-9]+/g;

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

export function addPrefixToFunction(cell) {
	let optionsInCell = []
	for (var i=0; i<optionsFilterAdd.length; i++) {
		if (cell.includes(optionsFilterAdd[i].key.slice(1))) {
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

export function range(end) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var array = [];

  if (Math.sign(end - start) === -1) {
    for (var element = start; element > end; element -= step) {
      array.push(element);
    }

    return array;
  }

  for (var _element = start; _element < end; _element += step) {
    array.push(_element);
  }

  return array;
}

export function createEmptyMatrix(rows, columns) {
  return range(rows).map(function () {
    return Array(columns);
  });
}

export function mapSpreadsheet(data, cb) {
	for (let ri=0; ri<data.length; ri++) {
		for (let ci=0; ci<data[ri].length; ci++) {
			data[ri][ci] = cb(ri,ci)
		}
	}
	return data
}

// [[1,2],["a","b"]]
export function spreadsheetToR(datas) {
	return datas.map(data => {
		const {rows, cols } = data
		let newData = createEmptyMatrix(rows.len, cols.len)
		newData = mapSpreadsheet(newData, (ri, ci) => {
			if (rows._.[ri] != undefined && rows._.[ri].cells[ci] != undefined) {
				return rows._.[ri].cells[ci].text
			} else {
				return ''
			}
		})
		return newData
	});
}

export const rRender = (src, name, datas) => {
	if (src[0] === '=') {
    const cell = translateR(src.slice(1), name)
		const spreadsheet = spreadsheetToR(datas)
		const names = datas.map(data => data.name)

		// firebase.doParse()
    return src;
  }
  return src;
};
