import React, { useState, useEffect, useRef } from 'react';
import Connections from './connections'
import Charts from './charts'
import ChartEditor from './charteditor'
import Statistics from './statistics'
import StatisticsEdtior from './StatisticsEditor'
import Optimize from './optimize'
import Formulas from './formulas'
import './index.less'

const RightSidebar = ({ rightSidebar, setRightSidebar, statistic, setStatistic, schart, setSchart }) => {
  // const drawer = useRef(null)

  const RIGHTSIDEBAR_STATES = {
    charteditor: <ChartEditor setRightSidebar={setRightSidebar} schart={schart} setSchart={setSchart}/>,
    statistics: <StatisticsEdtior setRightSidebar={setRightSidebar} statistic={statistic} setStatistic={setStatistic}/>,
    optimize: <Optimize setRightSidebar={setRightSidebar}/>,
    formulas: <Formulas setRightSidebar={setRightSidebar}/>
  }

  // useEffect(() => {
  //   if (rightSidebar === 'none') {
  //     hide()
  //   } else {
  //     show()
  //   }
  //   return () => {
  //     drawer.current.removeEventListener('transitionend', listener)
  //   }
  // }, [rightSidebar])
  //
  // const show = () => {
  //   drawer.current.removeAttribute('hidden')
  //   drawer.current.removeEventListener('transitionend', listener)
  // }
  //
  // const hide = () => {
  //   drawer.current.addEventListener('transitionend', listener)
  // }
  //
  // const listener = e => {
  //   if (e.target === drawer.current) {
  //     drawer.current.setAttribute('hidden', true)
  //   }
  // }

  return (
    <div id='rightsidebar' className={(rightSidebar === 'none') ? 'slideout' : 'slidein'}>
      {RIGHTSIDEBAR_STATES[rightSidebar]}
    </div>
  )
}
export default RightSidebar;
