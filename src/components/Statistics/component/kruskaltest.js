//
//  KruskalTest
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
import { createStatistic } from '../core/form'
import Variable from '../core/variable'

const KruskalTest = ({  slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic }) => {
  const [variables, setVariables] = useState([])
  const [variableX, setVariableX] = useState(null)
  const [groups, setGroups] = useState(null)
  const [error, setError] = useState(null)

  const handleVariableX = i => setVariableX(i)

  const handleGroups = i => setGroups(i)

  const handleSubmit = e => {
    const formuladata = {
      ...e,
      variablex: variables[variableX],
      groups: variables[groups],
    }
    doRegress(formuladata, statistics.find(e => e.key === statistic).function).then(res => {
      slides.data = createStatistic(res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar)
    }).catch(err => setError(err.toString()))
  }

  const isInvalid = variableX == null
    || group == null

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
      <Variable label="Grouping variable" onChange={handleGroups} options={variables} name={variables[groups]} />
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
)(KruskalTest)
