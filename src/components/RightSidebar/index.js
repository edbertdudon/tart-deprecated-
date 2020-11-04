import React from 'react';
import Connections from './connections'
import Charts from './charts'
import ChartEditor from './charteditor'
import Statistics from './statistics'
import StatisticsEdtior from './StatisticsEditor'
import Optimize from './Optimize'
import Formulas from './formulas'
import './index.less'

const RightSidebar = ({ rightSidebar, setRightSidebar, statistic, setStatistic, schart, setSchart }) => {
  const RIGHTSIDEBAR_STATES = {
    charteditor: <ChartEditor setRightSidebar={setRightSidebar} schart={schart} setSchart={setSchart}/>,
    statistics: <StatisticsEdtior setRightSidebar={setRightSidebar} statistic={statistic} setStatistic={setStatistic}/>,
    optimize: <Optimize setRightSidebar={setRightSidebar}/>,
    formulas: <Formulas setRightSidebar={setRightSidebar}/>
  }

  return (
    <div id='rightsidebar' className={(rightSidebar === 'none') ? 'slideout' : 'slidein'}>
      {RIGHTSIDEBAR_STATES[rightSidebar]}
    </div>
  )
}
export default RightSidebar;
