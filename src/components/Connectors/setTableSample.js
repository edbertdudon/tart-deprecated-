function aoaToSpreadsheet(aoa) {
  const o = { rows: {}, type: 'input' };
  aoa.forEach((r, i) => {
    const cells = {};
    r.forEach((c, j) => { cells[j] = ({ text: c }); });
    o.rows[i] = { cells };
  });
  return o;
}

// from [{x: 1, y: 'a'},{x: 2, y: 'b'}]
function mysqlToSpreadsheet(data) {
  let aoa = data.map((row) => Object.values(row).map((value) => value.toString()));
  aoa = [Object.keys(data[0]), ...aoa];
  return aoaToSpreadsheet(aoa);
}

// from {headers: [{name: 'DATE_'}, {name: 'RATING_X'}],
// rows: [['31-Dec-98', 0.0806], ['31-Dec-99', 0.2635]]}
function oracledbToSpreadsheet(data) {
  const aoa = [data.headers.map((header) => header.name), ...data.rows];
  return aoaToSpreadsheet(aoa);
}

export default function setTableSample(connector, res) {
  switch (connector) {
    case 'MySQL': {
      return mysqlToSpreadsheet(res);
    }
    case 'Microsoft SQL Server': {
      return mysqlToSpreadsheet(res);
    }
    case 'Oracle SQL': {
      return oracledbToSpreadsheet(res);
    }
    default:
  }
  return null;
}
