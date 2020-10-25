import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdilChartHistogram } from '@mdi/light-js'
import { mdiMagnify, mdiBrush } from '@mdi/js'

import { OFF_COLOR } from '../../constants/off-color'
import withDropdownModal from '../DropdownModal'
import charts from '../RightSidebar/chartsR'
import './index.less'

const categories = [
  'One Variable',
  'Two continous variables',
  'One discrete, one continous',
  'Two discrete variables',
  'Continous bivariate distribution',
  'Continous function',
]

const Button = ({ isSelected, onToggle, icon }) => {
  return (
		<button
      className='worksheet-toggle-button'
      onClick={onToggle}
      style={{ backgroundColor: isSelected ? "#ebebeb": "#fff" }}
    >
			<Icon path={icon} size={0.8}/>
		</button>
  )
}

const Toggle = ({ color, authUser, rightSidebar, setRightSidebar }) => {
  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      setRightSidebar(select)
    } else {
      setRightSidebar('none')
    }
  }
  const handleSelect = () => {
    // let chartNumber
    // for (var i=0; i<charts.length; i++) {
    //   if (chart === charts[i].name) {
    //     chartNumber = i
    //     break;
    //   }
    // }
    // setSelectedCharts([chartNumber])
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

  // <Button isSelected={rightSidebar === 'formulas'} onToggle={() => handleToggle('formulas')} icon={mdiMathIntegral} />
	return (
    <>
      <div className='worksheet-buttons'>
        <ButtonWithDropdownModal
          onSelect={handleSelect}
          icon={mdilChartHistogram}
          items={charts}
          categories={categories}
          color={OFF_COLOR[color[authUser.uid]]}
        />
      </div>
  		<div className='worksheet-toggle'>
        <Button isSelected={rightSidebar === 'charteditor'} onToggle={() => handleToggle('charts')} icon={mdiBrush} />
        <Button isSelected={rightSidebar === 'statistics'} onToggle={() => handleToggle('statistics')} icon={mdiMagnify} />
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
