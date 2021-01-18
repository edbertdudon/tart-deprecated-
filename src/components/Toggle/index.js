//
//  Toggle
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Icon from '@mdi/react';
import { mdilChartHistogram } from '@mdi/light-js';
import { mdiMagnify, mdiBrush, mdiMathIntegral } from '@mdi/js';
import formulas from '../Spreadsheet/cloudr/formula';
import charts from '../Chart/chartsR';
import statistics from '../Statistics/core/statisticsR';
import { editorSet, sheetReset } from '../Spreadsheet/component/sheet';
import { OFF_COLOR } from '../../constants/off-color';
import withDropdownModal from '../DropdownModal';
import './index.less';

const CHART_CATEGORIES = [
  'One Variable',
  'Two continous variables',
  'One discrete, one continous',
  'Two discrete variables',
  'Continous bivariate distribution',
  'Continous function',
];

const STATISTICS_CATEGORIES = [
  'Descriptive Statistics',
  'Frequency/Contingency',
  'Tests of Independence',
  'Correlations/Covariances',
  't-tests',
  'Nonparametric statistic',
  'Fitting Tools',
  'Regression',
  'Regression Diagnostics',
  'ANOVA',
  'MANOVA',
  'Equality of Variances',
];

const FORMULA_CATEGORIES = [
  'Math',
  'Matrix',
  'Distribution',
  'Data',
];

const Button = ({
  isSelected, onToggle, icon, name,
}) => (
  <button
    className="worksheet-toggle-button"
    onClick={onToggle}
    style={{ backgroundColor: isSelected ? '#ebebeb' : '#fff' }}
    id={`${name}toggle`}
		>
    <Icon path={icon} size={0.8} />
  </button>
);

const Toggle = ({
  color, authUser, slides, rightSidebar, dataNames, current,
  onSetDataNames, onSetCurrent, onSetRightSidebar, setStatistic,
}) => {
  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      onSetRightSidebar(select);
    } else {
      onSetRightSidebar('none');
    }
  };

  const handleChart = (chart) => {
    const i = charts.findIndex((item) => item.key === chart);
    const { data, sheet } = slides;
    const { type, name, rows } = data;
    // setSchart([i])
    if (type === 'sheet' || type === 'input') {
      const d = slides.insertChart(charts[i].type, charts[i].variables);
      // slides.data = d;
    }
  };

  const handleStatistics = (stat) => {
    onSetRightSidebar('statistics');
    setStatistic(stat);
  };

  const handleFormulas = (formula) => {
    slides.data.setSelectedCellAttr('formula', formula);
    if (!slides.data.selector.multiple()) {
      editorSet.call(slides.sheet);
    }
    sheetReset.call(slides.sheet);
  };

  return (
    <>
      <div className="worksheet-buttons">
        <ButtonWithDropdownModal
          onSelect={handleFormulas}
          icon={mdiMathIntegral}
          items={formulas}
          categories={FORMULA_CATEGORIES}
          color={OFF_COLOR[color[authUser.uid]]}
          classname="dropdownmodal-content-formulas"
          name="formulas"
        />
        <ButtonWithDropdownModal
          onSelect={handleChart}
          icon={mdilChartHistogram}
          items={charts}
          categories={CHART_CATEGORIES}
          color={OFF_COLOR[color[authUser.uid]]}
          classname="dropdownmodal-content-chart"
          name="charts"
        />
        <ButtonWithDropdownModal
          onSelect={handleStatistics}
          icon={mdiMagnify}
          items={statistics}
          categories={STATISTICS_CATEGORIES}
          color={OFF_COLOR[color[authUser.uid]]}
          classname="dropdownmodal-content-statistics"
          name="statistics"
        />
      </div>
      <div className="worksheet-toggle">
        <Button
          isSelected={rightSidebar === 'chart'}
          onToggle={() => handleToggle('chart')}
          icon={mdiBrush}
          name="chart"
        />
      </div>
    </>
  );
};

const ButtonWithDropdownModal = withDropdownModal(Button);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetRightSidebar: (rightSidebar) => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Toggle);
