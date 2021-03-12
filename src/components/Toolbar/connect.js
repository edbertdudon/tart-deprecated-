//
//  connect.js
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState } from 'react';
import Header from './header';
import ImportDatabase from '../Connectors/importdatabase';

const CONNECT_DROPDOWN = [
  { key: 'Connect to MySQL...', type: 'item' },
  { key: 'Connect to SQL server...', type: 'item' },
  { key: 'Connect to Oracle SQL...', type: 'item' },
];

const Connect = () => {
  const [isOpenDatabaseMysql, setIsOpenDatabaseMysql] = useState(false);
  const [isOpenDatabaseSqlserver, setIsOpenDatabaseSqlserver] = useState(false);
  const [isOpenDatabaseOracle, setIsOpenDatabaseOracle] = useState(false);

  const handleConnect = (key) => {
    switch (key) {
      case CONNECT_DROPDOWN[0].key: {
        setIsOpenDatabaseMysql(true);
        break;
      }
      case CONNECT_DROPDOWN[1].key: {
        setIsOpenDatabaseSqlserver(true);
        break;
      }
      case CONNECT_DROPDOWN[2].key: {
        setIsOpenDatabaseOracle(true);
        break;
      }
      default:
    }
  };

  return (
    <>
      <Header
        classname="dropdown-content"
        text="Connect"
        items={CONNECT_DROPDOWN}
        onSelect={handleConnect}
        // color={OFF_COLOR[color[authUser.uid]]}
      />
      <ImportDatabase
        classname="modal-importdatabase"
        databaseType="MySQL"
        isOpen={isOpenDatabaseMysql}
        setIsOpen={setIsOpenDatabaseMysql}
      />
      <ImportDatabase
        classname="modal-importdatabase"
        databaseType="Microsoft SQL Server"
        isOpen={isOpenDatabaseSqlserver}
        setIsOpen={setIsOpenDatabaseSqlserver}
      />
      <ImportDatabase
        classname="modal-importdatabase"
        databaseType="OracleDB"
        isOpen={isOpenDatabaseOracle}
        setIsOpen={setIsOpenDatabaseOracle}
      />
    </>
  );
};

export default Connect;
