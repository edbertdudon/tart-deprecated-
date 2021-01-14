//
//  DurbinWatsonTest
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
import { BOOTSTRAP_METHOD, ALTERNATIVES, createStatistic } from '../core/form'
import Formula from '../core/formula'
import BootstrapMethod from '../core/bootstrap'
import Alternative from '../core/alternative'
import Number from '../../RightSidebar/number'

const DurbinWatsonTest = ({ slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic }) => {
  const [variables, setVariables] = useState([])
  const [formula, setFormula] = useState('')
  const [lag, setLag] = useState(1)
  const [method, setMethod] = useState(0)
  const [alt, setAlt] = useState(0)
  const [error, setError] = useState(null)
  const [formulaError, setFormulaError] = useState(null)
  const [lagError, setLagError] = useState(null)

  const handleFormula = e => setFormula(e)

  const handleLag = e => {
    let input = e.target.value
    setLag(input)
    if (isNaN(parseFloat(input))) {
      setLagError("Lag must be a number.")
    } else if (parseFloat(input) < 0) {
      setLagError("Lag must be greater than 0.")
    } else {
      setLagError(null)
    }
  }

  const handleSubmit = e => {
    const formuladata = {
      ...e,
      formula: formula
    }
    if (lag != 1) formuladata.lag = lag
    if (method !== 0) formuladata.method = BOOTSTRAP_METHOD[method].charAt(0).toLowerCase()
    if (alt !== 0 && lag == 1) {
      if (alt == 1) {
        formuladata.alternative = 'p'
      } else if (alt == 2) {
        formuladata.alternative = 'n'
      }
    }
    doRegress(formuladata, statistics.find(e => e.key === statistic).function).then(res => {
      createStatistic(res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar)
    }).catch(err => setError(err.toString()))
  }

  const isInvalid = formulaError !== null
    || lagError !== null

  return (
    <Form
      statistic={statistic}
      invalidStat={isInvalid}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Formula formulaText={formula} variables={variables} onSetFormula={handleFormula} formulaError={formulaError} />
      <Number label='Maximum Lag' value={lag} onChange={handleLag} error={lagError} />
      <BootstrapMethod setMethod={setMethod} method={method} />
      {lag == 1 && <Alternative setAlt={setAlt} alt={alt} />}
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
)(DurbinWatsonTest)
