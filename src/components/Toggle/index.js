import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdilChartHistogram } from '@mdi/light-js'
import { mdiMagnify, mdiBrush, mdiMathIntegral } from '@mdi/js'

import { OFF_COLOR } from '../../constants/off-color'
import withDropdownModal from '../DropdownModal'
import charts from '../RightSidebar/chartsR'
import statistics from '../RightSidebar/statisticsR'
import formulas from '../Spreadsheet/cloudr/formula'
import './index.less'

const CHART_CATEGORIES = [
  'One Variable',
  'Two continous variables',
  'One discrete, one continous',
  'Two discrete variables',
  'Continous bivariate distribution',
  'Continous function',
]

const STATISTICS_CATEGORIES = [
  'Frequency table',
  'Tests of Independence',
  't-tests',
  'Correlations',
  'Nonparametric Tests of Group Differences',
  'Multiple (Linear) Regression',
  'ANOVA',
  'MANOVA',
]

const FORMULA_CATEGORIES = [
  'Math',
  'Matrix',
  'Distribution'
]

const Button = ({ isSelected, onToggle, icon, name }) => {
  return (
		<button
      className='worksheet-toggle-button'
      onClick={onToggle}
      style={{ backgroundColor: isSelected ? "#ebebeb": "#fff" }}
      id={ name + "toggle"}
    >
			<Icon path={icon} size={0.8}/>
		</button>
  )
}

const Toggle = ({ color, authUser, rightSidebar, setRightSidebar, setStatistic, setSchart }) => {
  const handleToggle = select => {
    if (rightSidebar !== select) {
      setRightSidebar(select)
    } else {
      setRightSidebar('none')
    }
  }

  const handleChart = chart => {
    setRightSidebar('charteditor')
    let chartNumber
    for (var i=0; i<charts.length; i++) {
      if (chart === charts[i].name) {
        chartNumber = i
        break;
      }
    }
    setSchart([chartNumber])
    // if (slides.data.type !== "chart") {
    //   let variables
    //   if (Object.keys(slides.data.rows._).length === 0 && slides.data.rows._.constructor === Object) {
    //     variables = []
    //   } else {
    //     variables = Object.values(slides.data.rows._[0].cells)
    //       .map(variable => Object.values(variable)[0])
    //   }
    //   let chartData = setChart(slides, variables, [chartNumber], 0, 1, 2)
    //   // dispatchSlides({function:'CHART', data: chartData, name:("Chart" + getMaxNumberFile(slides, "Chart")), currentSlide: currentSlide, type:"chart"})
    // }
  }

  const handleStatistics = statistic => {
    setRightSidebar('statistics')
    let statisticNumber
		for (var i=0; i<statistics.length; i++) {
			if (statistic === statistics[i].name) {
				statisticNumber = i
				break;
			}
		}
		setStatistic(statisticNumber)
  }

  const handleFormulas = formula => {
    slides.data.setSelectedCellAttr('formula', formula)
		if (!slides.data.selector.multiple()) {
			editorSet.call(slides.sheet);
		}
		sheetReset.call(slides.sheet);
  }

  // <Button isSelected={rightSidebar === 'formulas'} onToggle={() => handleToggle('formulas')} icon={mdiMathIntegral} />
	return (
    <>
      <div className='worksheet-buttons'>
        <ButtonWithDropdownModal
          onSelect={handleFormulas}
          icon={mdiMathIntegral}
          items={formulas}
          categories={FORMULA_CATEGORIES}
          color={OFF_COLOR[color[authUser.uid]]}
          height={296}
          name="formulas"
        />
        <ButtonWithDropdownModal
          onSelect={handleChart}
          icon={mdilChartHistogram}
          items={charts}
          categories={CHART_CATEGORIES}
          color={OFF_COLOR[color[authUser.uid]]}
          style={{marginLeft: "30px"}}
          height={232}
          name="charts"
        />
        <ButtonWithDropdownModal
          onSelect={handleStatistics}
          icon={mdiMagnify}
          items={statistics}
          categories={STATISTICS_CATEGORIES}
          color={OFF_COLOR[color[authUser.uid]]}
          style={{marginLeft: "60px"}}
          height={296}
          name="statistics"
        />
      </div>
  		<div className='worksheet-toggle'>
        <Button
          isSelected={rightSidebar === 'charteditor'}
          onToggle={() => handleToggle('charteditor')}
          icon={mdiBrush}
          name={'charteditor'}
        />
  		</div>
    </>
	)
}

const ButtonWithDropdownModal = withDropdownModal(Button)

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
})

export default compose(
  connect(
    mapStateToProps,
  ),
)(Toggle)
