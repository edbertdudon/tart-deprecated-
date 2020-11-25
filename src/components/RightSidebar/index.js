import React from 'react';
import { connect } from 'react-redux'
import { compose } from 'recompose'
import './index.less'

import Connections from './connections'
import Charts from './charts'
import ChartEditor from './charteditor'
import Statistics from './statistics'
import StatisticsEdtior from './StatisticsEditor'
import Optimize from './Optimize'
import Formulas from './formulas'

const RightSidebar = ({ rightSidebar, statistic, setStatistic }) => {
  const RIGHTSIDEBAR_STATES = {
    charteditor: <ChartEditor />,
    statistics: <StatisticsEdtior statistic={statistic} setStatistic={setStatistic} />,
    optimize: <Optimize />,
    formulas: <Formulas />
  }

  return (
    <div id='rightsidebar' className={(rightSidebar === 'none') ? 'slideout' : 'slidein'}>
      {RIGHTSIDEBAR_STATES[rightSidebar]}
    </div>
  )
}

const mapStateToProps = state => ({
  rightSidebar: (state.rightSidebarState.rightSidebar || "none"),
})


export default compose(
	connect(
		mapStateToProps,
	),
)(RightSidebar)
