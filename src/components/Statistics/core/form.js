//
//  Form
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiLoading, mdiClose } from '@mdi/js'
import statistics from './statisticsR'
import { translateR, spreadsheetToR } from '../../Spreadsheet/cloudr'
import DataRange from '../../RightSidebar/datarange'
import Button from '../../RightSidebar/button'
import { getRownames, getCols, getVars, setVariablesRange } from '../../RightSidebar/datarange'
import { getMaxNumberCustomSheet, insertData } from '../../../functions'

export const ALTERNATIVES = ["Two-sided", "Greater", "Less"]
export const ALTERNATIVES_AUTOCORRELATION = ["Two-sided", "Positive", "Negative"]
export const CORRELATION_METHOD = ["Pearson", "Spearman", "Kendall"]
export const BOOTSTRAP_METHOD = ["Resample", "Normal"]
export const WILKS_METHOD = ["c (standard)", "MCD", "Rank"]
export const WILKS_APPROXIMATION = ["Bartlett", "Rao", "Empirical"]

export function createStatistic(res, slides, formuladata, statistic, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar) {
	const { datas, data } = slides
	delete formuladata.slides
	delete formuladata.names
	const statName = statistic + ' ' + getMaxNumberCustomSheet(datas.map(d => d.name), statistic)
	// res.name = statName
	res.type = "regression"
	res.regression = formuladata
	insertData(slides, dataNames, current, res, statName, onSetDataNames, onSetCurrent)
	onSetRightSidebar('none')
	return d
}

const Form = ({ slides, color, authUser, statistic, invalidStat, setVariables,
	onSubmit, error, setError, onSetRightSidebar, children }) => {
	const [datarange, setDatarange] = useState('')
	const [firstRow, setFirstRow] = useState(true)
	const [loading, setLoading] = useState(false)
	const [datarangeError, setDatarangeError] = useState(null)

	useEffect(() => {
		const { data } = slides
	  if ((data.type === "sheet" || data.type === "input") && "0" in data.rows._) {
	    const rownames = getRownames(data)
			const cols = getCols(rownames)
	    setDatarange(cols[0] + ":" + cols[cols.length-1])
	    if (rownames.every(isNaN)) {
	      setVariables(rownames)
	    } else {
	      setVariables(getVars(data, cols))
	      setFirstRow(false)
	    }
	  } else {
	    setDatarange("A1")
	  }
	}, [])

	const handleClose = () => {
		onSetRightSidebar('none')
		setFirstRow(true)
		setDatarangeError(null)
		setError(null)
		setLoading(false)
	}

	const handleFirstrow = () => {
		setFirstRow(!firstRow)
		setVariablesRange(slides.data, !firstRow, datarange, setVariables)
	}

	const handleSubmit = () => {
		const { datas, data } = slides
		onSubmit({
			range: translateR(datarange, data.name),
			firstrow: firstRow,
			slides: JSON.stringify(spreadsheetToR(datas)),
			names: JSON.stringify(datas.map(d => d.name))
		})
	}

	const isInvalid = invalidStat
		|| datarangeError != null
		|| error != null

	return (
		<>
			<button className='rightsidebar-close' onClick={handleClose}>
				<Icon path={mdiClose} size={1}/>
			</button>
			<div className='rightsidebar-heading'>
				{statistics.find(e => e.key === statistic).title}
			</div>
			<DataRange
				firstRow={firstRow}
				datarange={datarange}
				setVariables={setVariables}
				setDatarange={setDatarange}
				error={datarangeError}
				setError={setDatarangeError}
			/>
			{children}
			<Button onClick={handleFirstrow} condition={firstRow} text='First row as header' />
			<div className='rightsidebar-text'>
				<p>{statistics.find(e => e.key === statistic).description}</p>
				{error && <div className='rightsidebar-error'>{error}</div>}
			</div>
			{loading
				?	<div className='rightsidebar-loading'><Icon path={mdiLoading} size={1.5} spin /></div>
				: <input
						disabled={isInvalid}
						type="submit"
						style={{ color : isInvalid ? "rgb(0, 0, 0, 0.5)" : color[authUser.uid]}}
						onClick={handleSubmit}
						className='rightsidebar-submit'
					/>
			}
		</>
	)
}

const mapStateToProps = state => ({
	slides: (state.slidesState.slides || {}),
	authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
	rightSidebar: (state.rightSidebarState.rightSidebar || "none"),
});

const mapDispatchToProps = dispatch => ({
  onSetRightSidebar: rightSidebar => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
})

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
)(Form)
