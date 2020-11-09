import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import XLSX from 'xlsx'

import { getMaxNumberCustomSheet } from '../../functions'
import ImportConnection from './importconnection'
import { stox } from '../../functions'
import { OFF_COLOR } from '../../constants/off-color'
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

const Insert = ({ color, authUser, slides, rightSidebar, setRightSidebar, dataNames, setDataNames, current, setCurrent }) => {
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
        setDataNames([...dataNames, "sheet" + slides.sheetIndex])
        setCurrent(dataNames.length)
				const d = slides.addSheet();
        slides.sheet.resetData(d);
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
			setRightSidebar(select)
		} else {
			setRightSidebar('none')
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
    let n = getMaxNumberCustomSheet(dataNames, name)
    o.delimiter = delimiter
    o.filename = filename
    const d = slides.insertData(dataNames, current, o, name)
    setDataNames([...dataNames, d.name])
    setCurrent(current+1)
    slides.data = d
  }

	return (
		<>
	    <InsertWithDropdown
	    	items={INSERT_DROPDOWN}
	    	onSelect={handleInsert}
	    	classname='worksheet-header-dropdown-header'
				color={OFF_COLOR[color[authUser.uid]]}
	    />
			<input type="file" className='toolbar-upload' onChange={handleUpload} accept=".xlsx, .xls, .csv" ref={uploadRef}/>
			<ImportConnectionWithModal isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	)
}

const Header = ({ classname, hover, onHover, isOpen, onOpen, color }) => (
	<div
		className={classname}
		onClick={onOpen}
		onMouseEnter={onHover}
		onMouseLeave={onHover}
		style={{ color: (hover || isOpen) && color }}
	>
		Insert
	</div>
)

const InsertWithDropdown = withDropdown(Header)
const ImportConnectionWithModal = withModal(ImportConnection)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
	slides: (state.slidesState.slides || {}),
})

export default compose(
	connect(
		mapStateToProps,
	),
	withFirebase,
)(Insert)
