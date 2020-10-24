import React from 'react'
import Icon from '@mdi/react';
import { mdiMathIntegral, mdiMagnify, mdiChartLineVariant } from '@mdi/js'
import './index.less'

const Button = ({ isSelected, onToggle, icon }) => {
  return (
		<button
      className='worksheet-toggle-button'
      onClick={onToggle}
      style={{backgroundColor: isSelected ? "#ebebeb": "#fff" }}
    >
			<Icon path={icon} size={0.8}/>
		</button>
  )
}

const Toggle = ({ rightSidebar, setRightSidebar }) => {
  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      setRightSidebar(select)
    } else {
      setRightSidebar('none')
    }
  }

	return (
		<div className='worksheet-toggle'>
      <Button isSelected={rightSidebar === 'formulas'} onToggle={() => handleToggle('formulas')} icon={mdiMathIntegral} />
      <Button isSelected={rightSidebar === 'charts'} onToggle={() => handleToggle('charts')} icon={mdiChartLineVariant} />
      <Button isSelected={rightSidebar === 'statistics'} onToggle={() => handleToggle('statistics')} icon={mdiMagnify} />
		</div>
	)
}

export default Toggle
