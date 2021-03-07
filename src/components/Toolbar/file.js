//
//  file.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import XLSX from 'xlsx';
import { useHistory } from 'react-router-dom';
import Header from './header';
import {
  stox, addCopyToName, createFile, getMaxNumberCustomSheet, xtos,
} from '../../functions';
import ImportConnection from '../Connectors/importconnection';
import Share from '../Share';

import DEFAULT_INITIAL_SLIDES from '../../constants/default';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
// import OFF_COLOR from '../../constants/off-color';

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
  { key: 'Share', type: 'item' },
  { type: 'divider' },
  { key: 'Import csv or xlsx', type: 'item' },
  { key: 'Import connection', type: 'item' },
];

const Files = ({
  firebase, authUser, worksheetname, worksheets, slides, current,
  setReadOnly, onSetDataNames, onSetCurrent, onSetSaving, onSetWorksheetname,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const uploadRef = useRef(null);
  const history = useHistory();

  function insert(o, name, delimiter, filename) {
    const data = o;
    data.delimiter = delimiter;
    data.filename = filename;

    const isEmpty = slides.insertData(current, data, name);
    onSetDataNames(slides.datas.map((it) => it.name));
    if (!isEmpty) {
      onSetCurrent(current + 1);
    }
  }

  function save() {
    onSetSaving(true);
    firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
      .then(() => onSetSaving(false));
  }

  const handleFile = (key) => {
    switch (key) {
      case FILE_DROPDOWN[0].key: {
        const ws = worksheets[authUser.uid].map((file) => file.name);
        const max = getMaxNumberCustomSheet(ws, 'Untitled Worksheet ');
        const filename = `Untitled Worksheet ${max}`;
        const initial = [JSON.stringify(DEFAULT_INITIAL_SLIDES)];
        const newFile = new File(initial, filename, { type: 'application/json' });

        firebase.doUploadWorksheet(authUser.uid, filename, newFile)
          .on('state_changed', () => {}, () => {}, (snapshot) => {
            onSetWorksheetname(filename);
            window.location.reload();
          });
        break;
      }
      case FILE_DROPDOWN[1].key: {
        save();
        break;
      }
      case FILE_DROPDOWN[2].key: {
        const data = [JSON.stringify(slides.getData())];
        // doListWorksheets needed because worksheets[authUser.uid] does not contain trash
        firebase.doListWorksheets(authUser.uid).then((res) => {
          const newname = addCopyToName(res.items, worksheetname);
          const file = new File(data, newname, { type: 'application/json' });

          firebase.doUploadWorksheet(authUser.uid, newname, file)
            .on('state_changed', () => {}, () => {}, () => {
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
        firebase.doMoveToTrash(authUser.uid, worksheetname);
        history.push(ROUTES.HOME);
        break;
      }
      case FILE_DROPDOWN[7].key: {
        setIsShareOpen(!isShareOpen);
        break;
      }
      case FILE_DROPDOWN[9].key: {
        uploadRef.current.click();
        break;
      }
      case FILE_DROPDOWN[10].key: {
        setIsOpen(!isOpen);
        break;
      }
      default:
    }
  };

  const handleUpload = (e) => {
    const { files } = e.target;
    const f = files[0];
    const reader = new FileReader();

    switch (re.exec(f.name)[1]) {
      case 'csv': {
        Papa.parse(f, {
          worker: true,
          complete(results) {
            const { data, meta } = results;
            const o = papaToSpreadsheet(data);
            insert(o, f.name, meta.delimiter, f.name);
            save();
            // firebase.doUploadInput(authUser.uid, f.name, f);
          },
        });
        break;
      }
      case 'xls':
      case 'xlsx':
        // const reader = new FileReader();
        reader.onload = function (r) {
          const results = new Uint8Array(r.target.result);
          const wb = XLSX.read(results, { type: 'array' });
          stox(wb).forEach((o) => insert(o, o.name, ',', `${f.name}_${o.name}`));
          save();
          // wb.SheetNames.forEach((name) => {
          //   const ws = wb.Sheets[name];
          // const aoa = new File(
          //   [JSON.stringify(XLSX.utils.sheet_to_csv(ws))],
          //   name,
          //   { type: 'text/csv' }
          // );
          //
          //   firebase.doUploadInput(authUser.uid, `${f.name}_${name}`, aoa);
          // });
        };

        reader.readAsArrayBuffer(f);
        break;
      default:
    }
    uploadRef.current.value = '';
  };

  return (
    <>
      <Header
        classname="dropdown-content"
        text="File"
        items={FILE_DROPDOWN}
        onSelect={handleFile}
        // color={OFF_COLOR[color[authUser.uid]]}
      />
      <Share
        classname="modal-share"
        isOpen={isShareOpen}
        setIsOpen={setIsShareOpen}
      />
      <input type="file" className="toolbar-upload" onChange={handleUpload} accept=".xlsx, .xls, .csv" ref={uploadRef} />
      <ImportConnection
        classname="modal-importconnection"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  // color: (state.colorState.colors || {}),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  worksheets: (state.worksheetsState.worksheets || []),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
  saving: (state.savingState.saving || false),
});

const mapDispatchToProps = (dispatch) => ({
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Files);
