import { useEffect } from 'react';
import XLSX from 'xlsx';

export const LETTERS_REFERENCE = /\$?[A-Z]+/g;
export const NUMBERS_REFERENCE = /\$?[0-9]+/g;
export const FORMULA_CELL_REFERENCES = /\$?[A-Z]+\$?[0-9]*/g;
export const VALID_RANGE_REFERENCES = /^\$?[A-Z]+\$?[0-9]*\:{1}\$?[A-Z]+\$?[0-9]*$/;
export const VALID_FORMULA_CELL_REFERENCES = /^\$?[A-Z]+\$?[0-9]*$/;
export const RANGE_REFERENCES = /\$?[A-Z]+\$?[0-9]*\:{1}\$?[A-Z]+\$?[0-9]*/g;

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

export function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

// *** File Organization ***

export function createFile(slides, worksheetname) {
  return new File([JSON.stringify(slides.getData())], worksheetname, { type: 'application/json' });
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
    for (var ri = 0; ri < rowobj.len; ++ri) {
      if (xws.type !== 'chart') {
        var row = rowobj[ri];
        if (!row) continue;
        aoa[ri] = [];
        Object.keys(row.cells).forEach((k) => {
          const idx = +k;
          if (isNaN(idx)) return;
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
