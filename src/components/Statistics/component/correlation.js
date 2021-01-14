//
//  Correlation
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Form from '../core/form'
import statistics from '../core/statisticsR'
import { doRegress } from '../../Spreadsheet/cloudr'
import { CORRELATION_METHOD, createStatistic } from '../core/form'
import Matrix from '../core/matrix'
import Alternative from '../core/alternativecorrelation'
import { getRownames, getCols, getVars } from '../../RightSidebar/datarange'

const Correlation = ({ slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic }) => {
  const [variables, setVariables] = useState([])
  const [varsx, setVarsx] = useState([])
  const [varsy, setVarsy] = useState([])
  const [method, setMethod] = useState(0)
  const [error, setError] = useState(null)
  const firstUpdate = useRef(true);

  useEffect(() => {
    const { data } = slides
	  if ((data.type === "sheet" || data.type === "input") && "0" in data.rows._) {
	    let rownames = getRownames(data)
	    if (rownames.every(isNaN)) {
        rownames = rownames.map((v, i) => i)
	      setVarsx(rownames)
        setVarsy(rownames)
	    } else {
        const cols = getVars(data, getCols(rownames)).map((v, i) => i)
	      setVarsx(cols)
        setVarsy(cols)
	    }
	  }
  }, [])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setVarsx(varsx.filter(v => variables.includes(variables[v])))
    setVarsy(varsy.filter(v => variables.includes(variables[v])))
  }, [variables])

  const handleSubmit = e => {
    const formuladata = {
      ...e,
      variablesx: JSON.stringify(varsx.map(v => variables[v])),
      variablesy: JSON.stringify(varsy.map(v => variables[v])),
    }
    if (method !== 0) formuladata.method = CORRELATION_METHOD[method].charAt(0).toLowerCase()
    doRegress(formuladata, statistics.find(e => e.key === statistic).function).then(res => {
      createStatistic(res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar)
    }).catch(err => setError(err.toString()))
  }

  const isInvalid = varsx.length < 1
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
      <Matrix variables={variables} selected={varsx} setSelected={setVarsx} text='X variables' />
      <Matrix variables={variables} selected={varsy} setSelected={setVarsy} text='Y variables' />
      <Alternative setAlt={setMethod} options={CORRELATION_METHOD} alt={method} />
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
)(Correlation)
