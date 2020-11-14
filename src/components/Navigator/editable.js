//
//  Editable
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
// Known Issues:
// Alert users when they make an illegal change ie. same name headers, spaces within name
//
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

import { OFF_COLOR } from '../../constants/off-color'

const NAVIGATOR_DROPDOWN = [
	{key: 'New sheet', type: 'item'},
	{type: 'divider'},
	{key: 'Rename...', type: 'item'},
	{key: 'Duplicate', type: 'item'},
	{type: 'divider'},
	{key: 'Cut', type: 'item'},
	{key: 'Copy', type: 'item'},
	{key: 'Paste', type: 'item'},
	{type: 'divider'},
	{key: 'Delete', type: 'item'},
]

const ContextMenuDropdown = ({ slide, onDropdown }) => (
	<ContextMenu id={'right-click' + slide}>
		<MenuItem onClick={() => onDropdown(NAVIGATOR_DROPDOWN[0].key)}>{NAVIGATOR_DROPDOWN[0].key}</MenuItem>
		<hr/>
		<MenuItem onClick={() => onDropdown(NAVIGATOR_DROPDOWN[2].key)}>{NAVIGATOR_DROPDOWN[2].key}</MenuItem>
		<MenuItem onClick={() => onDropdown(NAVIGATOR_DROPDOWN[3].key)}>{NAVIGATOR_DROPDOWN[3].key}</MenuItem>
		<hr/>
		<MenuItem onClick={() => onDropdown(NAVIGATOR_DROPDOWN[5].key)}>{NAVIGATOR_DROPDOWN[5].key}</MenuItem>
		<MenuItem onClick={() => onDropdown(NAVIGATOR_DROPDOWN[6].key)}>{NAVIGATOR_DROPDOWN[6].key}</MenuItem>
		<MenuItem onClick={() => onDropdown(NAVIGATOR_DROPDOWN[7].key)}>{NAVIGATOR_DROPDOWN[7].key}</MenuItem>
		<hr />
		<MenuItem onClick={() => onDropdown(NAVIGATOR_DROPDOWN[9].key)}>{NAVIGATOR_DROPDOWN[9].key}</MenuItem>
	</ContextMenu>
)

const Editable = ({ slides, color, authUser, dataNames, current, onSetDataNames, onSetCurrent, value, index }) => {
  const [text, setText] = useState(value)
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)
	// const inputCallback = useCallback(inputRef => {
	// 	if (inputRef) {
	// 		inputRef.focus();
	// 	}
	// }, [])

  const useOutsideAlerter = (ref) => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        checkIllegalChange()
      }
    }
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' || event.key === 'Tab') {
        checkIllegalChange()
      }
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClick)
      document.addEventListener("keypress", handleKeyPress)
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
        document.removeEventListener("keypress", handleKeyPress)
      }
    })
  }
  useOutsideAlerter(wrapperRef, show)
  const checkIllegalChange = () => {
    if (show === true) {
      setShow(false)
      for (var i=0; i<dataNames.length; i++) {
        if (dataNames[i].name === text) {
          var doesExist = true
          break
        } else {
          var doesExist = false
        }
      }
      if (!doesExist) {
        slides.datas[index].name = text;
        onSetDataNames(dataNames.map((item, i) => {
          if (i === index) {
            return text
          } else {
            return item
          }
        }))
      } else {
        setText(value)
      }
    }
  }

	const deleteSheet = () => {
		if (dataNames.length > 1) {
			onSetDataNames(dataNames.filter((n,i) => index !== i))
			if (current === index) {
				if (index === 0) {
					onSetCurrent(0)
					const d = slides.datas[index+1];
					slides.data = d
					slides.deleteSheet(index, index)
				} else {
					onSetCurrent(current-1)
					const d = slides.datas[index-1];
					slides.data = d
					slides.deleteSheet(index, index-1)
				}
			} else {
				slides.deleteSheet(index, -1)
			}
		}
	}

	const paste = d => {
		onSetDataNames([
			...dataNames.slice(0,index+1),
			d.name,
			...dataNames.slice(index+1)
		])
		onSetCurrent(index+1)
		slides.data = d
	}

	const handleDropdown = key => {
		switch(key) {
			case NAVIGATOR_DROPDOWN[0].key:
				var d = slides.addSheet(undefined, undefined, current);
				slides.sheet.resetData(d);
				onSetDataNames([
		      ...dataNames.slice(0, current+1),
		      d.name,
		      ...dataNames.slice(current+1)
		    ])
				onSetCurrent(current+1)
				slides.data = d
				break;
			case NAVIGATOR_DROPDOWN[2].key:
				// Not working as expected
				handleShow();
				// handleSelect();
				break;
			case NAVIGATOR_DROPDOWN[3].key:
				var d = slides.pasteSheet(dataNames, index, true)
				paste(d)
				break;
			case NAVIGATOR_DROPDOWN[5].key:
				deleteSheet()
				break;
			case NAVIGATOR_DROPDOWN[6].key:
				slides.copySheet(index)
				break;
			case NAVIGATOR_DROPDOWN[7].key:
				var d = slides.pasteSheet(dataNames, index, false)
				paste(d)
				break;
			case NAVIGATOR_DROPDOWN[9].key:
				deleteSheet()
				break;
		}
	}

  const handleChange = e => setText(e.target.value)

  const handleShow = () => {
		setShow(true)
	}

	const handleSelect = () => {
		if (current !== index) {
			const d = slides.datas[index];
			slides.sheet.resetData(d);
			slides.data = d
			onSetCurrent(index)
		}
	}

	const backgroundColor = () => {
		return({backgroundColor: current === index && OFF_COLOR[color[authUser.uid]]})
	}

  const whiteText = () => {
    return({color: current === index && "#fff"})
  }

  return (
    <>
      <ContextMenuTrigger id={'right-click' + text}>
        <div className='navigator-slide' onClick={handleSelect} style={backgroundColor()} ref={wrapperRef}>
          <div className='navigator-number' style={whiteText()}>{index+1}</div>
          {show && <input
            type="text"
            onChange={handleChange}
            className='navigator-input'
            value={text}
						autoFocus
          />}
          <div className='navigator-text' style={{...backgroundColor(index), ...whiteText(index)}} onDoubleClick={handleShow}>
            {text}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuDropdown slide={text} onDropdown={handleDropdown} />
    </>
  )
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
  slides: (state.slidesState.slides || {}),
	color: (state.colorState.colors || {}),
	dataNames: (state.dataNamesState.dataNames || ["sheet1"]),
	current: (state.currentState.current || 0),
})

const mapDispatchToProps = dispatch => ({
  onSetDataNames: dataNames => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: current => dispatch({ type: 'CURRENT_SET', current }),
})

export default compose(
  connect(
    mapStateToProps,
		mapDispatchToProps,
  ),
)(Editable)
