import { useEffect } from 'react'
import XLSX from 'xlsx'

function range(end) {
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

export function useOutsideAlerter(ref, customFunction) {
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      customFunction()
    }
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      customFunction()
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keypress", handleKeyPress)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keypress", handleKeyPress)
    }
  })
}

// *** File Organization API ***

export function getMaxNumberCustomSheet(dataNames, prefix) {
  const v = dataNames.filter(name => name.startsWith(prefix))
  return(v.length+1)
}

export function xtos(sdata, filename) {
  var out = XLSX.utils.book_new();
  sdata.forEach(function(xws) {
    var aoa = [[]];
    var rowobj = xws.rows;
    for(var ri = 0; ri < rowobj.len; ++ri) {
      if (xws.type !== "chart") {
        var row = rowobj[ri];
        if(!row) continue;
        aoa[ri] = [];
        Object.keys(row.cells).forEach(function(k) {
          var idx = +k;
          if(isNaN(idx)) return;
          aoa[ri][idx] = row.cells[k].text;
        });
      }
    }
    var ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(out, ws, xws.name);
  });
  XLSX.writeFile(out, filename + '.xlsx');
}

export function stox(wb) {
  var out = [];
  wb.SheetNames.forEach(function(name) {
    // var o = {name:name, rows:{}, type:"input"};
    var o = {name:name, rows:{}};
    var ws = wb.Sheets[name];
    var aoa = XLSX.utils.sheet_to_json(ws, {raw: false, header:1});
    aoa.forEach(function(r, i) {
      var cells = {};
      r.forEach(function(c, j) { cells[j] = ({ text: c }); });
      o.rows[i] = { cells: cells };
    })
    out.push(o);
  });
  return out;
}

export function addCopyToName(files, prefix) {
  const names = files.map(file => file.name)
  let newname = prefix
  if (newname.endsWith(" copy")) {
  	newname = newname + " " + 2
  }
  if (newname.match(/ copy [0-9]+/) == null) {
  	newname = newname + " copy"
  	if (names.includes(newname)) {
        newname = newname + " " + 2
    }
  }
  let match = newname.match(/ copy [0-9]+/)
  if (match != null && match.length > 0 && newname.endsWith(match)) {
  	let n = 2
  	let next = newname.replace(match, " copy " + n)
      while (names.includes(next)) {
        	n++
      	next = newname.replace(match, " copy " + n)
      }
    	newname = next
  }
  return(newname)
}

export function insertData(slides, dataNames, current, o, name, onSetDataNames, onSetCurrent) {
  const currentData = slides.data.rows._
  const isEmptyData = Object.keys(currentData).length === 0 && currentData.constructor === Object
  const d = slides.insertData(dataNames, current, o, name, isEmptyData)
  if (isEmptyData) {
    onSetDataNames([
      ...dataNames.slice(0, current),
      d.name,
      ...dataNames.slice(current+1),
    ])
  } else {
    onSetDataNames([
      ...dataNames.slice(0, current+1),
      d.name,
      ...dataNames.slice(current+1)
    ])
    onSetCurrent(current+1)
  }
  slides.data = d
}
