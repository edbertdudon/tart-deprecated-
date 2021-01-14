//
//  RobustOneWayManova
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
import { WILKS_METHOD, WILKS_APPROXIMATION, createStatistic } from '../core/form'
import Variable from '../core/variable'
import Matrix from '../core/matrix'
import WilksMethod from '../core/wilksmethod'
import WilksApproximation from '../core/wilksapprox'

const RobustOneWayManova = ({ slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic }) => {
  const [variables, setVariables] = useState([])
  const [variableX, setVariableX] = useState(null)
  const [varsy, setVarsy] = useState([])
  const [method, setMethod] = useState(0)
  const [approximation, setApproximation] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    setVarsy(varsy.filter(v => variables.includes(variables[v])))
  }, [variables])

  const handleSubmit = e => {
    const formuladata = {
      ...e,
      variablex: variables[variableX],
      variablesy: JSON.stringify(varsy.map(v => variables[v])),
    }
    if (method !== 0) formuladata.method = WILKS_METHOD[method].charAt(0).toLowerCase()
    if (approximation !== 0) {
      if (approximation === 1) {
        formuladata.approximation = WilksApproximation[approximation].charAt(0)
      } else {
        formuladata.approximation = WilksApproximation[approximation].charAt(0).toLowerCase()
      }
    }
    doRegress(formuladata, statistics.find(e => e.key === statistic).function).then(res => {
      createStatistic(res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar)
    }).catch(err => setError(err.toString()))
  }

  const isInvalid = variableX == null
    || varsy.length < 1

  return (
    <Form
      statistic={statistic}
      invalidStat={false}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Variable label="X (independent) variable" setSelected={setVariableX} options={variables} name={variables[variableX]} />
      <Matrix variables={variables} selected={varsy} setSelected={setVarsy} text='Y (dependent) variables' />
      <WilksMethod setMethod={setMethod} method={method} />
      <WilksApproximation setMethod={setApproximation} method={approximation} />
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
)(RobustOneWayManova)
