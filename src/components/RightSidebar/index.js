import React, { useState, useEffect, useRef } from 'react';
import Connections from './connections'
import Charts from './charts'
import ChartEditor from './charteditor'
import Statistics from './statistics'
import StatisticsEdtior from './StatisticsEditor'
import Formulas from './formulas'
import './index.less'

const RightSidebar = ({ rightSidebar, setRightSidebar }) => {
  const [selectedCharts, setSelectedCharts] = useState([])
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const rightSidebarRef = useRef(null)

  // const handleListen = e => {
  //   if (e.target === rightSidebarRef) {
  //     rightSidebarRef.current.setAttribute('hidden', true)
  //   }
  // }
  // useEffect(() => {
  //   if (rightSidebarRef.current !== null) {
  //     rightSidebarRef.current.addEventListener('transitionend', handleListen)
  //   }
  //   return () => {
  //     if (rightSidebarRef.current !== null) {
  //       rightSidebarRef.current.removeEventListener('transitionend', handleListen)
  //     }
  //   }
  // }, [])

  const RIGHTSIDEBAR_STATES = {
    connections: <Connections />,
    charts: <Charts setRightSidebar={setRightSidebar} setSelectedCharts={setSelectedCharts} />,
    charteditor: <ChartEditor setRightSidebar={setRightSidebar} selectedCharts={selectedCharts} setSelectedCharts={setSelectedCharts} />,
    statistics: selectedAnalysis === null
      ? <Statistics setRightSidebar={setRightSidebar} setSelectedAnalysis={setSelectedAnalysis} />
      : <StatisticsEdtior setRightSidebar={setRightSidebar} selectedAnalysis={selectedAnalysis} setSelectedAnalysis={setSelectedAnalysis} />,
    // optimize: <Optimize />,
    formulas: <Formulas />
  }

  return (
    <>
    {rightSidebar !== 'none' &&
      <div id='rightsidebar' className={(rightSidebar === 'none') ? 'slideout' : 'slidein'} ref={rightSidebarRef}>
        {RIGHTSIDEBAR_STATES[rightSidebar]}
      </div>
    }
    </>
  )
}
export default RightSidebar;
