import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import XLSX from 'xlsx';
import { useHistory } from 'react-router-dom';
import Header from './header';
import {
  stox, addCopyToName, getMaxNumberCustomSheet, xtos, insertData,
} from '../../functions';
import ImportConnection from './importconnection';
import ImportDatabase from '../Connectors/importdatabase';

import { DEFAULT_INITIAL_SLIDES } from '../../constants/default';
import withDropdown from '../Dropdown';
import withModal from '../Modal';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { OFF_COLOR } from '../../constants/off-color';
import { options } from '../Spreadsheet/options';

const Papa = require('papaparse/papaparse.min.js');

const re = /(?:\.([^.]+))?$/;

function papaToSpreadsheet(csv) {
  const o = { rows: {} };
  csv.forEach((r, i) => {
    const cells = {};
    r.forEach((c, j) => { cells[j] = ({ text: c }); });
    o.rows[i] = { cells };
  });
  return o;
}

export const FILE_DROPDOWN = [
  { key: 'New Worksheet', type: 'item' },
  { key: 'Save', type: 'item' },
  { key: 'Duplicate', type: 'item' },
  { key: 'Rename...', type: 'item' },
  { key: 'Download as Xlsx', type: 'item' },
  { key: 'Move to Trash', type: 'item', path: ROUTES.HOME },
  { type: 'divider' },
  { key: 'Import csv or xlsx', type: 'item' },
  { key: 'Import connection', type: 'item' },
  { type: 'divider' },
  { key: 'Connect to MySQL...', type: 'item' },
  { key: 'Connect to SQL server...', type: 'item' },
  { key: 'Connect to Oracle SQL...', type: 'item' },
];

const Files = ({
  firebase, authUser, worksheetname, worksheets, slides, color, dataNames, current,
  onSetDataNames, onSetCurrent, onSetWorksheetname, setReadOnly,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDatabaseMysql, setIsOpenDatabaseMysql] = useState(false);
  const [isOpenDatabaseSqlserver, setIsOpenDatabaseSqlserver] = useState(false);
  const [isOpenDatabaseOracle, setIsOpenDatabaseOracle] = useState(false);
  const uploadRef = useRef(null);
  const history = useHistory();

  const handleFile = (key) => {
    switch (key) {
      case FILE_DROPDOWN[0].key: {
        const ws = worksheets[authUser.uid].map((file) => file.name)
        const max = getMaxNumberCustomSheet(ws, 'Untitled Worksheet ')
        const filename = 'Untitled Worksheet ' + max;
        const initial = [JSON.stringify(DEFAULT_INITIAL_SLIDES)]
        const newFile = new File(initial, filename, { type: 'application/json' })

        firebase.doUploadWorksheet(authUser.uid, filename, newFile)
          .on('state_changed', () => {}, () => {}, (snapshot) => {
            onSetWorksheetname(filename);
            window.location.reload();
          });
        break;
      }
      case FILE_DROPDOWN[1].key: {
        const data = [JSON.stringify(slides.getData())]
        const file = new File(data, worksheetname, { type: 'application/json' });

        firebase.doUploadWorksheet(authUser.uid, worksheetname, file);
        break;
      }
      case FILE_DROPDOWN[2].key: {
      const data = [JSON.stringify(slides.getData())]

        // doListWorksheets needed because worksheets[authUser.uid] does not contain trash
        firebase.doListWorksheets(authUser.uid).then((res) => {
          const newname = addCopyToName(res.items, worksheetname);
          const file = new File(data, newname, { type: 'application/json' });

          firebase.doUploadWorksheet(authUser.uid, newname, file)
            .on('state_changed', () => {}, () => {}, (snapshot) => {
              onSetWorksheetname(newname);
          		window.location.reload();
            });
        });
        break;
      }
      case FILE_DROPDOWN[3].key: {
        setReadOnly(false);
        break;
      }
      case FILE_DROPDOWN[4].key: {
        xtos(slides.getData(), worksheetname);
        break;
      }
      case FILE_DROPDOWN[5].key: {
        // const today = new Date().toLocaleDateString();
        //
        // firebase.trash(authUser.uid).get().then((doc) => {
        //   if (doc.exists) {
        //     firebase.trash(authUser.uid).update({ [worksheetname]: today });
        //   } else {
        //     firebase.trash(authUser.uid).set({ [worksheetname]: today });
        //   }
        // });
        //
        // history.push(ROUTES.HOME);
        break;
      }
      case FILE_DROPDOWN[7].key: {
        uploadRef.current.click();
        break;
      }
      case FILE_DROPDOWN[8].key: {
        setIsOpen(!isOpen);
        break;
      }
      case FILE_DROPDOWN[10].key: {
        setIsOpenDatabaseMysql(true);
        break;
      }
      case FILE_DROPDOWN[11].key: {
        setIsOpenDatabaseSqlserver(true);
        break;
      }
      case FILE_DROPDOWN[12].key: {
        setIsOpenDatabaseOracle(true);
        break;
      }
    }
  };

  const handleUpload = (e) => {
    const { files } = e.target;
    const f = files[0];
    switch (re.exec(f.name)[1]) {
      case 'csv': {
        Papa.parse(f, {
          worker: true,
          complete(results) {
            const { data, meta } = results;
            const o = papaToSpreadsheet(data);

            insert(o, f.name, meta.delimiter, f.name);

            firebase.doUploadWorksheet(authUser.uid, f.name, f);
          },
        });
        break;
      }
      case 'xls':
      case 'xlsx':
        var reader = new FileReader();

        reader.onload = function (e) {
          const results = new Uint8Array(e.target.result);
          const wb = XLSX.read(results, { type: 'array' });

          stox(wb).forEach((o) => insert(o, o.name, ',', `${f.name}_${o.name}`));

          wb.SheetNames.forEach((name) => {
            const ws = wb.Sheets[name];
            const aoa = new File([JSON.stringify(XLSX.utils.sheet_to_csv(ws))], name, { type: 'text/csv' });

            firebase.doUploadWorksheet(authUser.uid, `${f.name}_${name}`, aoa);
          });
        };

        reader.readAsArrayBuffer(f);
        break;
    }
    uploadRef.current.value = '';
  };

  const insert = (o, name, delimiter, filename) => {
    o.delimiter = delimiter;
    o.filename = filename;

    insertData(slides, dataNames, current, o, name, onSetDataNames, onSetCurrent);
  };

  return (
    <>
      <FileWithDropdown text="File" items={FILE_DROPDOWN} onSelect={handleFile} color={OFF_COLOR[color[authUser.uid]]} />
      <input type="file" className="toolbar-upload" onChange={handleUpload} accept=".xlsx, .xls, .csv" ref={uploadRef} />
      <ImportConnectionWithModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        style={{ width: '550px', left: 'Calc((100% - 550px)/2)', top: '10%' }}
      />
      <ImportDatabaseWithModal
        databaseType="MySQL"
        isOpen={isOpenDatabaseMysql}
        setIsOpen={setIsOpenDatabaseMysql}
        style={{ width: '466px', left: 'Calc((100% - 466px)/2)', top: '10%' }}
      />
      <ImportDatabaseWithModal
        databaseType="Microsoft SQL Server"
        isOpen={isOpenDatabaseSqlserver}
        setIsOpen={setIsOpenDatabaseSqlserver}
        style={{ width: '466px', left: 'Calc((100% - 466px)/2)', top: '10%' }}
      />
      <ImportDatabaseWithModal
        databaseType="OracleDB"
        isOpen={isOpenDatabaseOracle}
        setIsOpen={setIsOpenDatabaseOracle}
        style={{ width: '466px', left: 'Calc((100% - 466px)/2)', top: '10%' }}
      />
    </>
  );
};

const FileWithDropdown = withDropdown(Header);
const ImportConnectionWithModal = withModal(ImportConnection);
const ImportDatabaseWithModal = withModal(ImportDatabase);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  worksheets: (state.worksheetsState.worksheets || []),
  color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withFirebase,
)(Files);
