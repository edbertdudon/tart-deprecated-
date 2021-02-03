//
//  Worksheet
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
import { compose } from 'recompose';
import './index.less';

import Header from './header';
import Toolbar from '../Toolbar';
import Toggle from '../Toggle';
import Formulabar from '../Formulabar';
import Navigator from '../Navigator';
import RightSidebar from '../RightSidebar';
import SpreadsheetWrapper from '../Spreadsheet/spreadsheetWrapper.js';
import { withAuthorization, withEmailVerification } from '../Session';

const Worksheet = () => {
  const [readOnly, setReadOnly] = useState(true);
  const [text, setText] = useState({ text: '', ri: 0, ci: 0 });
  const [navigator, setNavigator] = useState(true);
  const [statistic, setStatistic] = useState('statdesc');

  return (
    <div className="worksheet" onContextMenu={(e) => { e.preventDefault(); return false; }}>
      <Header readOnly={readOnly} setReadOnly={setReadOnly} />
      <Toolbar
        navigator={navigator}
        setNavigator={setNavigator}
        readOnly={readOnly}
        setReadOnly={setReadOnly}
      />
      <Toggle setStatistic={setStatistic} />
      <Formulabar text={text} />
      {navigator && <Navigator />}
      <RightSidebar statistic={statistic} />
      <SpreadsheetWrapper setText={setText} />
    </div>
  );
};

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Worksheet);
