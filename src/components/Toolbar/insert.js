import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import XLSX from 'xlsx'

import Header from './header'
import ImportConnection from './importconnection'
import { stox } from '../../functions'
import * as ROUTES from '../../constants/routes'
import withDropdown from '../Dropdown'
import withModal from '../Modal'
import { withFirebase } from '../Firebase'

const Papa = require('papaparse/papaparse.min.js');

var re = /(?:\.([^.]+))?$/;

function papaToSpreadsheet(csv) {
  let o = {rows:{}};
  csv.forEach(function(r, i) {
    var cells = {};
    r.forEach(function(c, j) { cells[j] = ({ text: c }); });
    o.rows[i] = { cells: cells };
  })
  return o
}

const Insert = ({ color, authUser, slides, rightSidebar, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar }) => {
	const [isOpen, setIsOpen] = useState(false)
	const uploadRef = useRef(null)

	const INSERT_DROPDOWN = [
		{key: 'Sheet', type: 'item'},
		{key: 'Chart', type: 'item'},
		{key: 'Statistics', type: 'item'},
		{key: 'Formulas', type: 'item'},
		{type: 'divider'},
		{key: 'Import csv or xlsx', type: 'item'},
		{key: 'Import connection', type: 'item'},
	]

	const handleInsert = key => {
		switch(key) {
			case INSERT_DROPDOWN[0].key:
        var d = slides.addSheet(undefined, undefined, current);
        slides.sheet.resetData(d);
        onSetDataNames([
          ...dataNames.slice(0, current+1),
          d.name,
          ...dataNames.slice(current+1)
        ])
        onSetCurrent(current+1)
        slides.data = d
				break;
			case INSERT_DROPDOWN[1].key:
			  document.getElementById("chartstoggle").click()
				break;
			case INSERT_DROPDOWN[2].key:
				document.getElementById("statisticstoggle").click()
				break;
			case INSERT_DROPDOWN[3].key:
				handleToggle('formulas')
				break;
			case INSERT_DROPDOWN[5].key:
				uploadRef.current.click()
				break;
			case INSERT_DROPDOWN[6].key:
				setIsOpen(!isOpen)
				break;
		}
	}

	const handleToggle = (select) => {
		if (rightSidebar !== select) {
			onSetRightSidebar(select)
		} else {
			onSetRightSidebar('none')
		}
	}

	const handleOpen = () => setIsOpen(true)

	const handleUpload = e => {
	  var files = e.target.files, f = files[0];
		switch(re.exec(f.name)[1]) {
			case 'csv':
				Papa.parse(f, {
          worker: true,
					complete: function(results, file) {
						let o = papaToSpreadsheet(results.data)
            insert(o, f.name, results.meta.delimiter, f.name)
            firebase.doUploadFile(authUser.uid, f.name, file)
					}
				});
				break;
			case 'xls':
			case 'xlsx':
				var reader = new FileReader();
				reader.onload = function(e) {
				  var data = new Uint8Array(e.target.result);
				  var wb = XLSX.read(data, {type: 'array'});
          stox(wb).forEach(o => insert(o, o.name, ",", f.name + "_" + o.name));
          wb.SheetNames.forEach(function(name) {
            var ws = wb.Sheets[name];
            var aoa = XLSX.utils.sheet_to_csv(ws);
            firebase.doUploadFile(authUser.uid, f.name + "_" + name, aoa)
          });
				};
				reader.readAsArrayBuffer(f);
				break;
		}
    uploadRef.current.value = '';
	}

  const insert = (o, name, delimiter, filename) => {
    o.delimiter = delimiter
    o.filename = filename
    const d = slides.insertData(dataNames, current, o, name)
    onSetDataNames([
      ...dataNames.slice(0, current+1),
      d.name,
      ...dataNames.slice(current+1)
    ])
    onSetCurrent(current+1)
    slides.data = d
  }

	return (
		<>
	    <InsertWithDropdown text='Insert' items={INSERT_DROPDOWN} onSelect={handleInsert} color={color[authUser.uid]} />
			<input type="file" className='toolbar-upload' onChange={handleUpload} accept=".xlsx, .xls, .csv" ref={uploadRef} />
			<ImportConnectionWithModal isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	)
}

const InsertWithDropdown = withDropdown(Header)
const ImportConnectionWithModal = withModal(ImportConnection)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
	slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ["sheet1"]),
  current: (state.currentState.current || 0),
  rightSidebar: (state.rightSidebarState.rightSidebar || "none"),
})

const mapDispatchToProps = dispatch => ({
  onSetDataNames: dataNames => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: current => dispatch({ type: 'CURRENT_SET', current }),
  onSetRightSidebar: rightSidebar => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
})

export default compose(
	connect(
		mapStateToProps,
    mapDispatchToProps,
	),
	withFirebase,
)(Insert)
