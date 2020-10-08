import React, { useEffect, useRef } from 'react'
import Dropdown from '../../Spreadsheet/component/dropdown'
import { h } from '../../Spreadsheet/component/element';

const items = ['asdf']

// class DropdownFile extends Dropdown {
// 	constructor() {
// 		const icon = h('div', 'worksheet-toolbar-file-button');
// 		const nformulas = items.map(it => h('div', 'worksheet-toolbar-file-item')
// 			.on('click', () => {
// 				this.hide();
// 				this.change(it);
// 			})
// 			.child(it));
// 		super(icon, '180px', true, 'bottom-left', ...nformulas);
// 	}
// }

const Toolbar = () => {
	// const inputRef = useRef(null)
	// console.log(inputRef.current)
	useEffect(() => {
		// var d = new DropdownFile()
		// const rootEl = h('div', 'worksheet-toolbar-file')
	}, [])
	return (
		<div className='worksheet-toolbar'>
		</div>
	)
}

export default Toolbar;
