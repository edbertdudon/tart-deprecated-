import React from 'react';
import './index.less';

import Files from './file';
import Edit from './edit';
import Insert from './insert';
import Table from './table';
import Format from './format';
import View from './view';
import Run from './run';

const Toolbar = ({ navigator, setNavigator, setReadOnly }) => (
  <div className="worksheet-toolbar">
    <Files setReadOnly={setReadOnly} />
    <Edit />
    <Insert />
    <Table />
    <Format />
    <View navigator={navigator} setNavigator={setNavigator} />
    <Run />
  </div>
);

export default Toolbar;
