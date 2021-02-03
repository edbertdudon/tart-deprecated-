//
//  Import Connection
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
//	Commands
//  list containers: docker ps
//  SQL Server:
//    docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=yourStrong(!)Password' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2017-latest
//    docker restart 67a02d931c58
//    sqlcmd -S 0.0.0.0:1433 -U sa -P MyNewPass! -Q "CREATE DATABASE SampleDB;"
//  OracleDB:
//    https://medium.com/@mfofana/how-to-install-oracle-database-on-mac-os-sierra-10-12-or-above-c0b350fd2f2c
//    docker run -d -p 8080:8080 -p 1521:1521 -v ~/oracle_data/:/u01/app/oracle truevoly/oracle-12c
//    Downloads > sqlcl > bin > sqlcl
//    Username: system
//    Password: oracle
//
import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Icon from '@mdi/react';
import { mdilChevronLeft, mdilChevronRight, mdilMagnify } from '@mdi/light-js';
import { mdiLoading } from '@mdi/js';

import { databaseList } from './databaseList';
import { tablesList } from './tablesList';
import { getTableSample } from './getTableSample';
import { createFile, getMaxNumberCustomSheet } from '../../functions';
import { withFirebase } from '../Firebase';

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

// from {headers: [{name: 'DATE_'}, {name: 'RATING_X'}], rows: [['31-Dec-98', 0.0806], ['31-Dec-99', 0.2635]]}
export function oracledbToSpreadsheet(data) {
  const aoa = [data.headers.map((header) => header.name), ...data.rows];
  return aoaToSpreadsheet(aoa);
}

const LEVELS_STATES = [
  'connections', 'databases', 'tables',
];

const Levels = ({
  option, level, onSelectConnection, onSelectDatabase, onSelectTable,
}) => (
  <div>
    {
        {
          connections:
  <div className="filexplorer-content-text" onClick={() => onSelectConnection(option)}>
    <p>{option}</p>
  </div>,
          databases:
  <div className="filexplorer-content-text" onClick={() => onSelectDatabase(option)}>
    <p>{option}</p>
  </div>,
          tables:
  <div className="filexplorer-content-text" onClick={() => onSelectTable(option)}>
    <p>{option}</p>
  </div>,
    		}[LEVELS_STATES[level]]
      }
  </div>
);

const ImportConnection = ({
  firebase, authUser, color, worksheetname, slides, dataNames, current, saving,
  files, onClose, onSelect, onSetDataNames, onSetCurrent, onSetSaving,
}) => {
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(0);
  const [connections, setConnections] = useState({});
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [filteredOption, setFilteredOption] = useState([]);
  const [config, setConfig] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    firebase.connection(authUser.uid).get()
      .then((doc) => {
        if (doc.exists) {
          setConnections(doc.data());
          setFilteredOption(Object.keys(doc.data()));
        }
      });
  }, []);

  const handleClose = () => {
    onClose();
    setError(null);
    setLoading(false);
    setLevel(0);
  };

  const handleBack = () => {
    if (level > 0) {
      setLevel(level - 1);
      setFilteredOption(handleSelectLibrary(level - 1));
      setError(null);
      setLoading(false);
    }
  };

  const handleForward = () => {
    if ((level === 0 && databases.length > 0)
        || (level === 1 && tables.length > 0)) {
      setLevel(level + 1);
      setFilteredOption(handleSelectLibrary(level + 1));
    }
  };

  const handleSearch = (e) => {
    setFilteredOption(
      handleSelectLibrary(level).filter((file) => file.toLowerCase().includes(e.target.value.toLowerCase())),
    );
  };

  const handleSelectLibrary = (select) => {
    let library;
    switch (LEVELS_STATES[select]) {
      case 'connections':
        library = Object.keys(connections);
        break;
      case 'databases':
        library = databases;
        break;
      case 'tables':
        library = tables;
        break;
    }
    return library;
  };

  const handleSelectConnection = (connection) => {
    setLoading(true);
    setConfig(connections[connection]);
    if (connections[connection].connector === 'Oracle SQL') {
      setLevel(level + 2);
      tablesList(connections[connection].connector, connections[connection], firebase)
        .then((res) => {
          if ('status' in res) {
            if (res.status === 'ERROR') {
              setError('Unable to connect');
              setLoading(false);
              return;
            }
          }
          setTables(res);
          setFilteredOption(res);
          setLoading(false);
        });
    } else {
      setLevel(level + 1);
      databaseList(connections[connection].connector, connections[connection], firebase)
        .then((res) => {
          if ('status' in res) {
            if (res.status === 'ERROR') {
              setError('Unable to connect');
              setLoading(false);
              return;
            }
          }
          setDatabases(res);
          setFilteredOption(res);
          setLoading(false);
        });
    }
  };

  const handleSelectDatabase = (database) => {
    setLoading(true);
    setLevel(level + 1);
    const data = { ...config, database };
    setConfig(data);
    tablesList(config.connector, data, firebase)
      .then((res) => {
        if ('status' in res) {
          if (res.status === 'ERROR') {
            setError('Unable to connect');
            setLoading(false);
            return;
          }
        }
        setTables(res);
        setFilteredOption(res);
        setLoading(false);
      });
  };

  const handleSelectTable = (table) => {
    if (level !== 2) return;
    setLoading(true);

    const data = { ...config, table };
    getTableSample(config.connector, data, firebase).then((res) => {
      if ('status' in res) {
        if (res.status === 'ERROR') {
          setError('Unable to connect');
          setLoading(false);
          return;
        }
      }

      switch (config.connector) {
        case 'MySQL': {
          const out = mysqlToSpreadsheet(res);
          out.delimiter = 'mySQL';
          break;
        }
        case 'Microsoft SQL Server': {
          const out = mysqlToSpreadsheet(res);
          out.delimiter = 'SQLServer';
          break;
        }
        case 'Oracle SQL': {
          const out = oracledbToSpreadsheet(res);
          out.delimiter = 'OracleDB';
          break;
        }
      }

      out.connection = `${config.host}.${config.port}`;
      out.database = config.database;
      out.table = table;
      insert(out, table);

      onSelect();
      handleClose();
      setLevel(0);
      setLoading(false);
    });
  };

  const insert = (o, table) => {
    const name = table.split('.').slice(0, -1).join('.');

    const isEmpty = slides.insertData(current, o, name);
    onSetDataNames(slides.datas.map((it) => it.name));
    if (!isEmpty) {
      onSetCurrent(slides.sheetIndex);
    }

    onSetSaving(true);
    firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
      .then(() => onSetSaving(false));
  };

  return (
    <>
      <div className="filexplorer-header">
        <Icon path={mdilChevronLeft} size={1.5} onClick={handleBack} />
        <Icon path={mdilChevronRight} size={1.5} onClick={handleForward} />
        {loading && <Icon path={mdiLoading} size={1.5} spin />}
        <div className="filexplorer-search">
          <Icon path={mdilMagnify} size={1} />
          <input
            type="text"
            name="search"
            placeholder="Search"
            onChange={handleSearch}
            onClick={handleSearch}
          />
        </div>
      </div>
      {error && <p className="filexplorer-error">{error}</p>}
      <div className="filexplorer-content">
        {filteredOption.map((option) => (
          <Levels
            option={option}
            level={level}
            onSelectConnection={handleSelectConnection}
            onSelectDatabase={handleSelectDatabase}
            onSelectTable={handleSelectTable}
            key={option}
          />
        ))}
      </div>
      <br />
      <input
        className="modal-button"
        type="button"
        value="Cancel"
        onClick={handleClose}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
  saving: (state.savingState.saving || false),
});

const mapDispatchToProps = (dispatch) => ({
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
)(ImportConnection);
