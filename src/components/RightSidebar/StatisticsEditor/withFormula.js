import React, { useState, useRef, useEffect } from 'react'

const OPERATORS_REGEX = /\+|\~/g

const withFormula = Component => (props) => {
  const [formula, setFormula] = useState('')
  const [filteredOption, setFilteredOption] = useState([''])
  const [showOptions, setShowOptions] = useState(false)
  const [activeOption, setActiveOption] = useState(null)
  const formulaRef = useRef(null)

  const toggleHover = (index) => setActiveOption(index)

  const handleChange = (e) => {
    let input = e.currentTarget.value
    let inputAsArray = input.toLowerCase().split(OPERATORS_REGEX)
    let lastInput = inputAsArray[inputAsArray.length-1]
    let filter = props.options.filter(option =>
      option.toLowerCase().indexOf(lastInput) === 0
    )
    setFilteredOption(filter)
    if (lastInput.length > 0) {
      setShowOptions(true)
    } else {
      setShowOptions(false)
    }
    setFormula(input)
    setActiveOption(0)
  }

  const handleClick = (event) => {
    setFilteredOption([])
    formulaBuilder()
    formulaRef.current.focus()
  }

  const handleKeyDown = (e) => {
    // enter
    if (e.keyCode === 13) {
      formulaBuilder()
      e.stopPropagation()
    // tab
    } else if (e.keyCode === 9) {
      formulaBuilder()
      e.stopPropagation()
      e.preventDefault()
    // up arrow
    } else if (e.keyCode === 38) {
      if (activeOption === 0) return
      setActiveOption(activeOption - 1)
    // down arrow
    } else if (e.keyCode === 40) {
      if (activeOption - 1 === filteredOption.length) return
      setActiveOption(activeOption + 1)
    // tab
    }
  }

  const formulaBuilder = () => {
    setShowOptions(false)
    let selectedColumn = filteredOption[activeOption]
    if (filteredOption.length > 0 && selectedColumn !== undefined) {
      let formulaAsArray = formula.split(OPERATORS_REGEX)
      let [formulaLast] = formulaAsArray.slice(formulaAsArray.length-1)
      let formulaExceptLast = formula.slice(0, formula.length - formulaLast.length)
      if (/\s/g.test(selectedColumn)) {
        selectedColumn = "`" + selectedColumn + "`"
      }
      if (formulaAsArray.length < 2) {
        setFormula(selectedColumn + '~')
      } else {
        setFormula(formulaExceptLast + selectedColumn)
        props.onSetFormula(formulaExceptLast + selectedColumn)
      }
    } else {
      setFormula(formula)
      props.onSetFormula(formula)
    }
    setActiveOption(0)
  }

  return (
    <>
      <input
        name='formula'
        value={formula}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
        ref={formulaRef}
        placeholder="y ~ x"
        className='rightsidebar-input'
      />
      <OptionsList
        showOptions={showOptions}
        userInput={formula}
        filteredOption={filteredOption}
        activeOption={activeOption}
        onClick={handleClick}
        onToggleHover={toggleHover}
        Component={Component}
      />
    </>
  )
}

const OptionsList = ({showOptions, userInput, filteredOption, activeOption, onClick, onToggleHover, Component}) => {
  if (showOptions && userInput) {
    if (filteredOption.length) {
      return <ul className='options'>
          {filteredOption.map((option, index) => {
            if (index === activeOption) {
              var classNameOptionActive = 'option-active'
            }
            return (
              <li className={classNameOptionActive} key={index} onClick={onClick} onMouseEnter={() => onToggleHover(index)}>
                <Component option={option} />
              </li>
            )
          })}
        </ul>
    } else {
      return null
    }
  } else {
    return null
  }
}

export default withFormula
