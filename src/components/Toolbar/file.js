import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import XLSX from 'xlsx'

import Header from './header'
import { stox, addCopyToName } from '../../functions'
import ImportConnection from './importconnection'
import ImportDatabase from '../Connectors/importdatabase'
import { getMaxNumberCustomSheet, xtos } from '../../functions'
import withDropdown from '../Dropdown'
import withModal from '../Modal'
import * as ROUTES from '../../constants/routes'
import { withFirebase } from '../Firebase'
import { OFF_COLOR } from '../../constants/off-color'
import { options } from '../Spreadsheet/options'

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

export const FILE_DROPDOWN = [
  {key: 'New...', type: 'item'},
  {key: 'Save', type: 'item'},
  {key: 'Duplicate', type: 'item'},
  {key: 'Rename...', type: 'item'},
  {key: 'Download as Xlsx', type: 'item'},
  {key: 'Move to Trash', type: 'link', path: ROUTES.HOME},
  {type: 'divider'},
  {key: 'Import csv or xlsx', type: 'item'},
  {key: 'Import connection', type: 'item'},
  {type: 'divider'},
  {key: 'Connect to MySQL...', type: 'item'},
  {key: 'Connect to SQL server...', type: 'item'},
  {key: 'Connect to Oracle SQL...', type: 'item'},
]

const Files = ({ firebase, authUser, worksheetname, files, slides, color, dataNames, current,
  onSetDataNames, onSetCurrent, onSetWorksheetname, setReadOnly }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDatabaseMysql, setIsOpenDatabaseMysql] = useState(false)
  const [isOpenDatabaseSqlserver, setIsOpenDatabaseSqlserver] = useState(false)
  const [isOpenDatabaseOracle, setIsOpenDatabaseOracle] = useState(false)
  const uploadRef = useRef(null)

  const handleFile = key => {
    switch (key) {
      case FILE_DROPDOWN[0].key:
        let filename = "Untitled Worksheet "
          + getMaxNumberCustomSheet(
            files[authUser.uid].map(file => file.name),
            "Untitled Worksheet "
          )
        firebase.doUploadFile(
          authUser.uid,
          filename,
          new File ([JSON.stringify(DEFAULT_INITIAL_SLIDES)], filename, {type: "application/json"})
        ).on('state_changed', function(){}, function(){}, snapshot => {
          onSetWorksheetname(filename)
          window.location.reload()
        })
        break;
      case FILE_DROPDOWN[1].key:
        const file = new File ([JSON.stringify(slides.getData())], worksheetname, {type: "application/json"})
        firebase.doUploadFile(authUser.uid, worksheetname, file)
        break;
      case FILE_DROPDOWN[2].key:
        // doListFiles needed because files[authUser.uid] does not contain trash
        firebase.doListFiles(authUser.uid).then(res => {
          const newname = addCopyToName(res.items, worksheetname)
          const file = new File ([JSON.stringify(slides.getData())], newname, {type: "application/json"})
          var uploadTask = firebase.doUploadFile(authUser.uid, newname, file)
          uploadTask.on('state_changed', function(){}, function(){}, snapshot => {
            onSetWorksheetname(newname)
        		window.location.reload()
          })
        })
        break;
      case FILE_DROPDOWN[3].key:
        setReadOnly(false)
        break;
      case FILE_DROPDOWN[4].key:
        xtos(slides.getData(), worksheetname)
        break;
      case FILE_DROPDOWN[5].key:
        let today = new Date().toLocaleDateString()
        firebase.trash(authUser.uid).get().then(doc => {
          if (doc.exists) {
            firebase.trash(authUser.uid).update({ [worksheetname]: today })
          } else {
            firebase.trash(authUser.uid).set({ [worksheetname]: today })
          }
        })
        break;
      case FILE_DROPDOWN[7].key:
        uploadRef.current.click()
        break;
      case FILE_DROPDOWN[8].key:
        setIsOpen(!isOpen)
        break;
      case FILE_DROPDOWN[10].key:
        setIsOpenDatabaseMysql(true)
        break;
      case FILE_DROPDOWN[11].key:
        setIsOpenDatabaseSqlserver(true)
        break;
      case FILE_DROPDOWN[12].key:
        setIsOpenDatabaseOracle(true)
        break;
    }
  }

  const handleUpload = e => {
    var files = e.target.files, f = files[0];
    switch(re.exec(f.name)[1]) {
      case 'csv':
        Papa.parse(f, {
          worker: true,
          complete: function(results, file) {
            const { data, meta } = results;
            let o = papaToSpreadsheet(data)
            insert(o, f.name, meta.delimiter, f.name)
            firebase.doUploadFile(authUser.uid, f.name, file)
          }
        });
        break;
      case 'xls':
      case 'xlsx':
        var reader = new FileReader();
        reader.onload = function(e) {
          var results = new Uint8Array(e.target.result);
          var wb = XLSX.read(results, {type: 'array'});
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
      <FileWithDropdown text='File' items={FILE_DROPDOWN} onSelect={handleFile} color={OFF_COLOR[color[authUser.uid]]}/>
      <input type="file" className='toolbar-upload' onChange={handleUpload} accept=".xlsx, .xls, .csv" ref={uploadRef} />
      <ImportConnectionWithModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        style={{width: "550px", left: "Calc((100% - 550px)/2)", top: "10%"}}
      />
      <ImportDatabaseWithModal
        databaseType='MySQL'
        isOpen={isOpenDatabaseMysql}
        setIsOpen={setIsOpenDatabaseMysql}
        style={{width: "466px", left: "Calc((100% - 466px)/2)", top: "10%"}}
      />
      <ImportDatabaseWithModal
        databaseType='Microsoft SQL Server'
        isOpen={isOpenDatabaseSqlserver}
        setIsOpen={setIsOpenDatabaseSqlserver}
        style={{width: "466px", left: "Calc((100% - 466px)/2)", top: "10%"}}
      />
      <ImportDatabaseWithModal
        databaseType='OracleDB'
        isOpen={isOpenDatabaseOracle}
        setIsOpen={setIsOpenDatabaseOracle}
        style={{width: "466px", left: "Calc((100% - 466px)/2)", top: "10%"}}
      />
    </>
  )
}

const FileWithDropdown = withDropdown(Header)
const ImportConnectionWithModal = withModal(ImportConnection)
const ImportDatabaseWithModal = withModal(ImportDatabase)

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  files: (state.filesState.files || {}),
  color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ["sheet1"]),
  current: (state.currentState.current || 0),
})

const mapDispatchToProps = dispatch => ({
  onSetDataNames: dataNames => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: current => dispatch({ type: 'CURRENT_SET', current }),
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname })
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withFirebase,
)(Files)
