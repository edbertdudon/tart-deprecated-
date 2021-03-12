//
//  Import Connection
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
//  Commands
//  list containers: docker ps
//  SQL Server:
//    docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=yourStrong(!)Password' -p 1433:1433 -
//      d mcr.microsoft.com/mssql/server:2017-latest
//    docker restart 122c21c652cb
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

import databaseList from './databaseList';
import tablesList from './tablesList';
import getTableSample from './getTableSample';
import setTableSample from './setTableSample';
import { createFile } from '../../functions';
import withModal from '../Modal';
import { withFirebase } from '../Firebase';

const LEVELS_STATES = [
  'connections', 'databases', 'tables',
];

const Levels = ({
  option, level, onSelectConnection, onSelectDatabase, onSelectTable,
}) => (
  <div>
    {
        {
          connections: (
            <div className="filexplorer-content-text" onClick={() => onSelectConnection(option)}>
              <p>{option}</p>
            </div>
          ),
          databases: (
            <div className="filexplorer-content-text" onClick={() => onSelectDatabase(option)}>
              <p>{option}</p>
            </div>
          ),
          tables: (
            <div className="filexplorer-content-text" onClick={() => onSelectTable(option)}>
              <p>{option}</p>
            </div>
          ),
        }[LEVELS_STATES[level]]
      }
  </div>
);

const ImportConnection = ({
  firebase, authUser, worksheetname, slides, current,
  onClose, onSelect, onSetDataNames, onSetCurrent, onSetSaving,
}) => {
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(0);
  const [connections, setConnections] = useState({});
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [filteredOption, setFilteredOption] = useState([]);
  const [connector, setConnector] = useState('');
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

  const handleSelectLibrary = (select) => {
    let library;
    switch (LEVELS_STATES[select]) {
      case 'connections': {
        library = Object.keys(connections);
        break;
      }
      case 'databases': {
        library = databases;
        break;
      }
      case 'tables': {
        library = tables;
        break;
      }
      default:
    }
    return library;
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
      handleSelectLibrary(level)
        .filter((file) => file.toLowerCase().includes(e.target.value.toLowerCase())),
    );
  };

  const handleSelectConnection = (connection) => {
    setLoading(true);
    const { connector } = connections[connection];
    setConnector(connector);
    setConfig({ connection });
    const data = { connection, uid: authUser.uid };
    if (connector === 'Oracle SQL') {
      tablesList(firebase, connector, data)
        .then((res) => {
          setLevel(level + 2);
          setTables(res);
          setFilteredOption(res);
          setError('');
          setLoading(false);
        })
        .catch(() => {
          setError('Unable to connect');
          setLoading(false);
        });
    } else {
      databaseList(firebase, connector, data)
        .then((res) => {
          setLevel(level + 1);
          setDatabases(res);
          setFilteredOption(res);
          setError('');
          setLoading(false);
        })
        .catch(() => {
          setError('Unable to connect');
          setLoading(false);
        });
    }
  };

  const handleSelectDatabase = (database) => {
    setLoading(true);
    const data = { ...config, database };
    setConfig(data);
    tablesList(firebase, connector, { ...data, uid: authUser.uid })
      .then((res) => {
        setLevel(level + 1);
        setTables(res);
        setFilteredOption(res);
        setError('');
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to connect');
        setLoading(false);
      });
  };

  const insert = (o) => {
    const name = o.table;
    const isEmpty = slides.insertData(current, o, name, 'read');
    onSetDataNames(slides.datas.map((it) => it.name));
    if (!isEmpty) {
      onSetCurrent(current + 1);
    }

    onSetSaving(true);
    firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
      .then(() => onSetSaving(false));
  };

  const handleSelectTable = (table) => {
    if (level !== 2) return;

    setLoading(true);
    getTableSample(firebase, connector, { ...config, table, uid: authUser.uid })
      .then((res) => {
        const out = setTableSample(connector, res);
        out.input = {
          connector,
          connection: config.connection,
          database: config.database,
          table: config.table,
        };
        insert(out);

        onSelect();
        handleClose();
        setError('');
        setLoading(false);
        setLevel(0);
      }).catch(() => {
        setError('Unable to connect');
        setLoading(false);
      });
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
      {error && <p className="filexplorer-error">{error}</p>}
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
  withModal,
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ImportConnection);
