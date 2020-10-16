import React, { useState } from 'react';
import Connections from './connections'
import Charts from './charts'
import ChartEditor from './charteditor'
import Statistics from './statistics'
import StatisticsEdtior from './StatisticsEditor'
import './index.less'

const RightSidebar = ({ rightSidebar, setRightSidebar }) => {
  const [selectedCharts, setSelectedCharts] = useState([])
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  const RIGHTSIDEBAR_STATES = {
    connections: <Connections />,
    charts: <Charts setRightSidebar={setRightSidebar} setSelectedCharts={setSelectedCharts} />,
    charteditor: <ChartEditor setRightSidebar={setRightSidebar} selectedCharts={selectedCharts} setSelectedCharts={setSelectedCharts} />,
    statistics: selectedAnalysis === null
      ? <Statistics setRightSidebar={setRightSidebar} setSelectedAnalysis={setSelectedAnalysis} />
      : <StatisticsEdtior setRightSidebar={setRightSidebar} selectedAnalysis={selectedAnalysis} setSelectedAnalysis={setSelectedAnalysis}/>,
    // optimize: <Optimize />,
    // formulas: <Formulas />
  }

  return (
    <div id='rightsidebar' className={(rightSidebar === 'none') ? 'slideout' : 'slidein'}>
      {RIGHTSIDEBAR_STATES[rightSidebar]}
    </div>
  )
}
export default RightSidebar;
