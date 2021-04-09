import { useEffect } from 'react';
import XLSX from 'xlsx';
import { CELL_REF_COLORS } from '../constants/off-color';

export const LETTERS_REFERENCE = /\$?[A-Z]+/g;
export const NUMBERS_REFERENCE = /\$?[0-9]+/g;
export const CELL_REFERENCE = /\$?[A-Z]+\$?[0-9]+/g;
export const RANGE_REFERENCE = /\$?[A-Z]+\$?[0-9]*:{1}\$?[A-Z]+\$?[0-9]*/g;
export const OPERATORS_REGEX = /=|(%\*%)|\+|-|\*|\/|~|,|\(/g;

// *** General Functions ***

function range(end) {
  const start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  const array = [];

  if (Math.sign(end - start) === -1) {
    for (let element = start; element > end; element -= step) {
      array.push(element);
    }

    return array;
  }

  for (let _element = start; _element < end; _element += step) {
    array.push(_element);
  }

  return array;
}

export function createEmptyMatrix(rows, columns) {
  return range(rows).map(() => Array(columns));
}

export function useOutsideAlerter(ref, customFunction) {
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      customFunction();
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      customFunction();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keypress', handleKeyPress);
    };
  });
}

export function useOutsideClick(ref, setIsOpen) {
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  });
}

export function getTextsFromColumn(rows, ci) {
  return Object.keys(rows._)
    .map((r) => rows._[r].cells.[ci])
    .filter((c) => c !== undefined);
}

export function getTextsFromRows(rows, ri) {
  return Object.values(rows._[ri].cells);
}

function getTextMetrics(text, font) {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  return context.measureText(text);
}

export function getTextWidth(text, font) {
  return getTextMetrics(text, font).width;
}

export function getTextHeight(text, font) {
  const metrics = getTextMetrics(text, font);
  const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  // const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  return fontHeight;
}

// *** File Organization ***

export function createFile(slides, worksheetname) {
  return new File(
    [JSON.stringify(slides.getData())],
    worksheetname,
    { type: 'application/json' },
  );
}

export function getMaxNumberCustomSheet(dataNames, prefix) {
  const v = dataNames.filter((name) => name.startsWith(prefix));
  return (v.length + 1);
}

export function xtos(sdata, filename) {
  const out = XLSX.utils.book_new();
  sdata.forEach((xws) => {
    const aoa = [[]];
    const rowobj = xws.rows;
    for (let ri = 0; ri < rowobj.len; ri += 1) {
      if (xws.type !== 'chart') {
        const row = rowobj[ri];
        if (!row) continue;
        aoa[ri] = [];
        Object.keys(row.cells).forEach((k) => {
          const idx = +k;
          if (Number.isNaN(idx)) return;
          aoa[ri][idx] = row.cells[k].text;
        });
      }
    }
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(out, ws, xws.name);
  });
  XLSX.writeFile(out, `${filename}.xlsx`);
}

export function stox(wb) {
  const out = [];
  wb.SheetNames.forEach((name) => {
    // var o = {name:name, rows:{}, type:"input"};
    const o = { name, rows: {} };
    const ws = wb.Sheets[name];
    const aoa = XLSX.utils.sheet_to_json(ws, { raw: false, header: 1 });
    aoa.forEach((r, i) => {
      const cells = {};
      r.forEach((c, j) => { cells[j] = ({ text: c }); });
      o.rows[i] = { cells };
    });
    out.push(o);
  });
  return out;
}

export function addCopyToName(files, prefix) {
  const names = files.map((file) => file.name);
  let newname = prefix;
  if (newname.endsWith(' copy')) {
    newname = `${newname} ${2}`;
  }
  if (newname.match(/ copy [0-9]+/) == null) {
    newname += ' copy';
    if (names.includes(newname)) {
      newname = `${newname} ${2}`;
    }
  }
  const match = newname.match(/ copy [0-9]+/);
  if (match != null && match.length > 0 && newname.endsWith(match)) {
    let n = 2;
    let next = newname.replace(match, ` copy ${n}`);
    while (names.includes(next)) {
      n++;
      next = newname.replace(match, ` copy ${n}`);
    }
    newname = next;
  }
  return (newname);
}

// *** Cell Referencing ***

export function columnToLetter(column) {
  let temp; let
    letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

export function letterToColumn(letter) {
  let column = 0; const
    { length } = letter;
  for (let i = 0; i < length; i += 1) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}

export function asCell(ri, ci) {
  return `${columnToLetter(ci + 1)}${ri + 1}`;
}

function asCellRange(sri, sci, eri, eci) {
  return `${columnToLetter(sci + 1)}${sri + 1}:${columnToLetter(eci + 1)}${eri + 1}`;
}

function asFullRange(sci, eci) {
  return `${columnToLetter(sci + 1)}:${columnToLetter(eci + 1)}`;
}

export function getRange(rangei, len) {
  const {
    sri, sci, eri, eci,
  } = rangei;

  if (sri === eri && sci === eci) {
    return asCell(sri, sci);
  }
  if (len === eri + 1) {
    return asFullRange(sci, eci);
  }
  return asCellRange(sri, sci, eri, eci);
}

export function getRangeIndex(r, len) {
  const cleansed = r.replace(/\$/g, '');
  let mn = cleansed.match(NUMBERS_REFERENCE);
  let ml = cleansed.match(LETTERS_REFERENCE);
  // A:A, A1:A, A:A2
  if (ml !== null && (mn === null || mn.length < 2) && ml.length === 2) {
    if (mn) {
      mn = mn.map((ref) => parseInt(ref) - 1);
    }
    ml = ml.map((ref) => letterToColumn(ref) - 1);
    return {
      sri: mn ? mn[0] : 0,
      sci: ml[0],
      eri: len - 1,
      eci: ml[1],
    };
  }

  if (mn === null || ml === null) {
    return null;
  }

  mn = mn.map((ref) => parseInt(ref) - 1);
  ml = ml.map((ref) => letterToColumn(ref) - 1);

  return {
    sri: mn[0],
    sci: ml[0],
    eri: mn[1] || mn[0],
    eci: ml[1] || ml[0],
  };
}

// Don't merge regex. +A will be captured not just A:A.
const CELL_OPERATOR_REFERENCE = /(=|(%\*%)|\+|-|\*|\/|~|,|\()\$?[A-Z]+\$?[0-9]+(?!:)/g;
const RANGE_OPERATOR_REFERENCE = /(=|(%\*%)|\+|-|\*|\/|~|,|\()\$?[A-Z]+\$?[0-9]*:{1}\$?[A-Z]+\$?[0-9]*/g;

export function getRangeIndexes(text, len) {
  const cellRefs = text.match(CELL_OPERATOR_REFERENCE) || [];
  const rangeRefs = text.match(RANGE_OPERATOR_REFERENCE) || [];

  return cellRefs.concat(rangeRefs)
    .map((r) => getRangeIndex(r.replace(OPERATORS_REGEX, ''), len));
}

export function getRangeRefs(text) {
  const cellRefs = text.match(CELL_OPERATOR_REFERENCE) || [];
  const rangeRefs = text.match(RANGE_OPERATOR_REFERENCE) || [];

  return cellRefs.concat(rangeRefs)
    .map((r) => r.replace(OPERATORS_REGEX, ''));
}

export function setCaretPosition(elemId, caretPos) {
  const elem = document.getElementById(elemId);
  if (elem != null) {
    if (elem.createTextRange) {
      const textRange = elem.createTextRange();
      textRange.move('character', caretPos);
      textRange.select();
    } else if (elem.selectionStart) {
      elem.focus();
      elem.setSelectionRange(caretPos, caretPos);
    } else {
      elem.focus();
    }
  }
}

export function getFormulaColors(cell) {
  let arr;
  if (cell.startsWith('=')) {
    const cellRefs = getRangeRefs(cell);
    if (cellRefs.length > 0) {
      arr = cell.split(new RegExp(cellRefs.map((r) => `(${r})`).join('|')))
        .filter((r) => r !== undefined)
        .map((r, i) => (cellRefs.includes(r)
          ? ({ text: r, color: CELL_REF_COLORS[i % CELL_REF_COLORS.length], id: `${i}${r}` })
          : ({ text: r, id: `${i}${r}` })));
    } else {
      arr = [{ text: cell, id: '0' }];
    }
  } else {
    arr = [{ text: cell, id: '0' }];
  }
  return arr;
}
