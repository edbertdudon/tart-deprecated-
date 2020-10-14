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

// *** File Organization API ***

export function getMaxNumberFromFiles(files) {
  let untitledWorksheetNames = []
  for (var i=0; i<files.length; i++) {
    if (files[i].name.startsWith("Untitled Worksheet ")
      && /\d/.test(files[i].name)) {
        untitledWorksheetNames.push(files[i].name.match(/\d+/)[0])
    }
  }

  let max = Math.max(...untitledWorksheetNames)
  if (max === -Infinity) {
    return 1
  } else {
    return max + 1
  }
}

export function xtos(sdata, filename) {
  var out = XLSX.utils.book_new();
  sdata.forEach(function(xws) {
    var aoa = [[]];
    var rowobj = xws.rows;
    for(var ri = 0; ri < rowobj.len; ++ri) {
      // if (slides[i].type !== "chart") {
      var row = rowobj[ri];
      if(!row) continue;
      aoa[ri] = [];
      Object.keys(row.cells).forEach(function(k) {
        var idx = +k;
        if(isNaN(idx)) return;
        aoa[ri][idx] = row.cells[k].text;
      });
    }
    var ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(out, ws, xws.name);
  });
  XLSX.writeFile(out, filename + '.xlsx');
}
