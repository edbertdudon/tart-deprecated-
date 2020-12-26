//
//  CorrelationSignificance
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Form from '../core/form'
import statistics from '../core/statisticsR'
import { doRegress } from '../../Spreadsheet/cloudr'
import { CORRELATION_METHOD, ALTERNATIVES, createStatistic } from '../core/form'
import Variable from '../core/variable'
import Alternative from '../core/alternative'
import Number from '../core/number'
import AlternativeMethod from '../core/alternativecorrelation'

const CorrelationSignificance = ({ slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic }) => {
  const [variables, setVariables] = useState([])
  const [variableX, setVariableX] = useState(null)
  const [variableY, setVariableY] = useState(null)
  const [alt, setAlt] = useState(0)
  const [method, setMethod] = useState(0)
  const [confLevel, setConfLevel] = useState(0.95)
  const [error, setError] = useState(null)
  const [confLevelError, setConfLevelError] = useState(null)

  const handleVariableX = i => setVariableX(i)

  const handleVariableY = i => setVariableY(i)

  const handleAlt = i => setAlt(i)

  const handleMethod = i => setMethod(i)

  const handleConfLevel = e => {
    let input = e.target.value
    setConfLevel(input)
    if (isNaN(parseFloat(input))) {
      setConfLevelError("Confidence level must be a number.")
    } else if (parseFloat(input) > 1 || parseFloat(input) < 0) {
      setConfLevelError("Confidence Level must be between 0 and 1.")
    } else {
      setConfLevelError(null)
    }
  }

  const handleSubmit = e => {
    const formuladata = {
      ...e,
      variablex: variables[variableX],
      variabley: variables[variableY],
    }
    if (alt !== 0) formuladata.alternative = ALTERNATIVES[alt].charAt(0).toLowerCase()
    if (method !== 0) formuladata.method = CORRELATION_METHOD[method].charAt(0).toLowerCase()
    if (confLevel !== 0.95) formuladata.confidencelevel = confLevel
    doRegress(formuladata, statistics.find(e => e.key === statistic).function).then(res => {
      slides.data = createStatistic(res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar)
    }).catch(err => setError(err.toString()))
  }

  const isInvalid = variableX == null
    || variableY == null
    || confLevelError !== null

  return (
    <Form
      statistic={statistic}
      invalidStat={isInvalid}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Variable label="X variable" onChange={handleVariableX} options={variables} name={variables[variableX]} />
      <Variable label="Y variable" onChange={handleVariableY} options={variables} name={variables[variableY]} />
      <Alternative onSetAlt={handleAlt} alt={alt} />
      <AlternativeMethod onSetAlt={handleMethod} options={CORRELATION_METHOD} alt={method} />
      <Number label='Confidence level' value={confLevel} onChange={handleConfLevel} error={confLevelError} />
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
)(CorrelationSignificance)
