import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js'

import { formulas } from '../Spreadsheet/cloudr/formula'
import { editorSet, sheetReset } from '../Spreadsheet/component/sheet'

const Formulas = ({ slides, onSetRightSidebar }) => {
	const [filteredOption, setFilteredOption] = useState(formulas)

	const handleSelectFunction = formula => {
		slides.data.setSelectedCellAttr('formula', formula)
		if (!slides.data.selector.multiple()) {
			editorSet.call(slides.sheet);
		}
		sheetReset.call(slides.sheet);
	}

	const handleSearch = e => {
		let filter = formulas.filter(formula =>
			formula.key.toLowerCase().includes(e.target.value.toLowerCase()))
		setFilteredOption(filter)
	}

	const handleClose = () => onSetRightSidebar('none')

	return (
		<>
			<button className='rightsidebar-close' onClick={handleClose}>
				<Icon path={mdiClose} size={1}/>
			</button>
			<div className='rightsidebar-heading'>Formulas</div>
			<input
				type="text"
				name="search"
				className='rightsidebar-search'
				placeholder="Search"
				onChange={handleSearch}
			/>
			{filteredOption.map((formula, index) => (
				<div className='rightsidebar-item' onClick={() => handleSelectFunction(formula.key)} key={index}>
						{formula.key}
				</div>
			))}
		</>
	)
}

const mapStateToProps = state => ({
	slides: (state.slidesState.slides || {}),
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
)(Formulas)
