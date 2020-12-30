//
//  AkaikeInformationCriterion
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
import Formula from '../core/formula'
import Number from '../../RightSidebar/number'

const AkaikeInformationCriterion = ({ slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic }) => {
  const [variables, setVariables] = useState([])
  const [formula, setFormula] = useState('')
  const [penalty, setPenalty] = useState(2)
  const [error, setError] = useState(null)
  const [formulaError, setFormulaError] = useState(null)
  const [penaltyError, setPenaltyError] = useState(null)

  const handleFormula = e => setFormula(e)

  const handlePenalty = e => {
		let input = e.target.value
		setPenalty(input)
		if (isNaN(parseFloat(input))) {
			setPenaltyError("Penalty must be a number.")
		} else {
			setPenaltyError(null)
		}
	}

  const handleSubmit = e => {
    const formuladata = {
      ...e,
      formula: formula
    }
    if (penalty !== 0.95) formuladata.penalty = penalty
    doRegress(formuladata, statistics.find(e => e.key === statistic).function).then(res => {
      slides.data = createStatistic(res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar)
    }).catch(err => setError(err.toString()))
  }

  const isInvalid = formulaError !== null
    || penaltyError !== null

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
      <Number label='Penalty' value={penalty} onChange={handlePenalty} error={penaltyError} />
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
)(AkaikeInformationCriterion)
