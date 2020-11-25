//
//  Bounds
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiClose, mdiLessThanOrEqual } from '@mdi/js'
import { updateCell, updateCellorRange } from './index'

const Bounds = ({ slides, objectiveClass, lhs, setLhs, dir, setDir, rhs, setRhs,
  li, setLi, lb, setLb, ui, setUi, ub, setUb, ld, setLd, ud, setUd, onClose, error, setError }) => {
  const handleUpdateLhs = e => updateCellorRange(e, setLhs, setError)

  const handleUpdateDir = e => updateCellorRange(e, setDir, setError)

  const handleUpdateRhs = e => updateCellorRange(e, setRhs, setError)

  const handleUpdateLi = e => updateCellorRange(e, setLi, setError)

  const handleUpdateLb = e => updateCellorRange(e, setLb, setError)

  const handleUpdateUi = e => updateCellorRange(e, setUi, setError)

  const handleUpdateUb = e => updateCellorRange(e, setUb, setError)

  const handleUpdateLd = e => updateCell(e, setLd, setError)

  const handleUpdateUd = e => updateCell(e, setUd, setError)

  const handleClose = () => onClose(1)

  return (
    <>
      <div className='rightsidebar-label'>Bounds</div>
      <button className='rightsidebar-label-close' onClick={handleClose}>
        <Icon path={mdiClose} size={0.8}/>
      </button>
      {objectiveClass === 0
        ? <General lhs={lhs} dir={dir} rhs={rhs} onLhs={handleUpdateLhs} onDir={handleUpdateDir} onRhs={handleUpdateRhs} />
        : <QuadraticLinear
            li={li} onLi={handleUpdateLi}
            lb={lb} onLb={handleUpdateLb}
            ui={ui} onUi={handleUpdateUi}
            ub={ub} onUb={handleUpdateUb}
            ld={ld} onLd={handleUpdateLd}
            ud={ud} onUd={handleUpdateUd}
          />
      }
      <div className='rightsidebar-subtext'>
        Use -Inf or Inf for infinity.
      </div>
      <div className='rightsidebar-text'>
        {error && <div className='rightsidebar-error'>{error}</div>}
      </div>
    </>
  )
}

const General = ({ lhs, dir, rhs, onLhs, onDir, onRhs }) => (
  <>
    <div className='rightsidebar-input-text-3part1'>Cell range</div>
    <div className='rightsidebar-input-text-3part2'>Direction range</div>
    <div className='rightsidebar-input-text-3part3'>Numeric range</div>
    <input
      type="text"
      className='rightsidebar-input-3part1'
      onChange={onLhs}
      value={lhs}
      placeholder="A1:A2"
    />
    <input
      type="text"
      className='rightsidebar-input-3part2'
      onChange={onDir}
      value={dir}
      placeholder="B1:B2"
    />
    <input
      type="text"
      className='rightsidebar-input-3part3'
      onChange={onRhs}
      value={rhs}
      placeholder="C1:C2"
    />
  </>
)

const QuadraticLinear = ({ li, onLi, lb, onLb, ui, onUi, ub, onUb, ld, onLd, ud, setUd }) => (
  <>
    <div className='rightsidebar-input-text-2part1'>Lower index</div>
    <div className='rightsidebar-input-text-2part2'>Lower bound</div>
    <input
      type="text"
      className='rightsidebar-input-2part1'
      onChange={onLi}
      value={li}
      placeholder="A1:A2"
    />
    <input
      type="text"
      className='rightsidebar-input-2part2'
      onChange={onLb}
      value={lb}
      placeholder="B1:B2"
    />
    <div className='rightsidebar-input-text-2part1'>Upper index</div>
    <div className='rightsidebar-input-text-2part2'>Upper bound</div>
    <input
      type="text"
      className='rightsidebar-input-2part1'
      onChange={onUi}
      value={ui}
      placeholder="C1:C2"
    />
    <input
      type="text"
      className='rightsidebar-input-2part2'
      onChange={onUb}
      value={ub}
      placeholder="D1:D2"
    />
    <div className='rightsidebar-input-text-2part1'>Lower limit (all variables)</div>
    <div className='rightsidebar-input-text-2part2'>Upper limit (all variables)</div>
    <input
      type="text"
      className='rightsidebar-input-2part1'
      onChange={onLd}
      value={ld}
      placeholder="D1"
    />
    <input
      type="text"
      className='rightsidebar-input-2part2'
      onChange={onUd}
      value={ud}
      placeholder="E1"
    />
  </>
)

const mapStateToProps = state => ({
	slides: (state.slidesState.slides || {}),
});

export default compose(
	connect(
		mapStateToProps,
	),
)(Bounds)
