//
//  StatisticDescription
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Form from '../core/form'
import statistics from '../core/statisticsR'
import { doRegress } from '../../Spreadsheet/cloudr'
import { createStatistic } from '../core/form'
import Matrix from '../core/matrix'

const StatisticDescription = ({ slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic }) => {
  const [variables, setVariables] = useState([])
  const [varsx, setVarsx] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setVarsx(varsx.filter(v => variables.includes(variables[v])))
  }, [variables])

  const handleSubmit = e => {
    const formuladata = {
      ...e,
      variablesx: JSON.stringify(varsx.map(v => variables[v])),
    }
    doRegress(formuladata, statistics.find(e => e.key === statistic).function).then(res => {
      slides.data = createStatistic(res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar)
    }).catch(err => setError(err.toString()))
  }

  const isInvalid = varsx.length < 1

  return (
    <Form
      statistic={statistic}
      invalidStat={isInvalid}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Matrix variables={variables} selected={varsx} setSelected={setVarsx} text='X variables' />
    </Form>
  )
}

const mapStateToProps = state => ({
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ["sheet1"]),
	current: (state.currentState.current || 0),
	rightSidebar: (state.rightSidebarState.rightSidebar || "none"),
});

const mapDispatchToProps = dispatch => ({
  onSetDataNames: dataNames => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: current => dispatch({ type: 'CURRENT_SET', current }),
  onSetRightSidebar: rightSidebar => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
})

export default compose(
	connect(
		mapStateToProps,
    mapDispatchToProps
	),
)(StatisticDescription)
