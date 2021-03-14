//
//  SpreadsheetWrapper
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
//  Deploy:
//  1. cd bac
//  2. firebase init
//  3. npm run build
//  4. firebase deploy
//
//  Limitations:
//  Headers within headers? Drilldown
//  hover shade selected formula after "=..."
//
import React, {
  useState, useRef, useEffect, useLayoutEffect,
} from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import useDebounce from '../../functions/useDebounce.ts';
import Spreadsheet from './index';
import { createFile } from '../../functions';
import { options } from './options';
// import OFF_COLOR from '../../constants/off-color';
import { withFirebase } from '../Firebase';

const SpreadsheetWrapper = ({
  firebase, authUser, slides, worksheetname, onSetSaving, onSetSlides, onSetDataNames,
  onSetCurrent, onSetRightSidebar, onSetChartSelect, onSetFormula, onSetRange,
}) => {
  const [pendingSave, setPendingSave] = useState({});
  const debouncePendingSave = useDebounce(pendingSave, 750);
  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    const unsubscribe = firebase.doDownloadWorksheet(authUser.uid, worksheetname).then((res) => {
      // options.style.offcolor = OFF_COLOR[color[authUser.uid]];
      const s = new Spreadsheet('#spreadsheet', options)
        .loadData(res)
        .on('cell-edited', (text, ri, ci) => onSetFormula({ text, ri, ci }))
        .on('cell-selected', (text, ri, ci) => {
          if (text === null || (text
            && Object.keys(text).length === 0
            && text.constructor === Object)
          ) {
            onSetFormula({ text: '', ri, ci });
          } else {
            onSetFormula({ text: text.text, ri, ci });
          }
        })
        .on('cell-deselect', (range) => onSetRange(range))
        .on('show-editor', () => onSetRightSidebar('chart'))
        .on('chart-select', (chart) => onSetChartSelect(chart))
        .change((data) => setPendingSave(data));

      s.validate();
      s.data = s.datas[0];
      onSetDataNames([...s.datas.map((data) => data.name)]);
      onSetCurrent(0);
      onSetSlides(s);
      console.log(s);
      if (firstUpdate.current) {
        firstUpdate.current = false;
      }
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    if (debouncePendingSave && firstUpdate.current === false) {
      onSetSaving(true);
      firebase.doUploadWorksheet(
        authUser.uid,
        worksheetname,
        createFile(slides, worksheetname),
      ).then(() => onSetSaving(false));
    }
  }, [debouncePendingSave]);

  return (
    <div id="spreadsheet" />
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['Sheet1']),
  current: (state.currentState.current || 0),
  saving: (state.savingState.saving || false),
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
  chartSelect: (state.chartSelectState.chartSelect || null),
  formula: (state.formulaState.formula || { text: '', ri: 0, ci: 0 }),
  range: (state.rangeState.range || {}),
});

const mapDispatchToProps = (dispatch) => ({
  onSetSlides: (slides) => dispatch({ type: 'SLIDES_SET', slides }),
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
  onSetRightSidebar: (rightSidebar) => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
  onSetChartSelect: (chartSelect) => dispatch({ type: 'CHARTSELECT_SET', chartSelect }),
  onSetFormula: (formula) => dispatch({ type: 'FORMULA_SET', formula }),
  onSetRange: (range) => dispatch({ type: 'RANGE_SET', range }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SpreadsheetWrapper);
