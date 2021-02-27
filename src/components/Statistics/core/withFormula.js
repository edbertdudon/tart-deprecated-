import React, { useState, useRef } from 'react';

const OPERATORS_REGEX = /\+|\~/g;

const withFormula = (Component) => (props) => {
  const [formula, setFormula] = useState('');
  const [filteredOption, setFilteredOption] = useState(['']);
  const [showOptions, setShowOptions] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  const formulaRef = useRef(null);

  const toggleHover = (index) => setActiveOption(index);

  const handleChange = (e) => {
    const input = e.currentTarget.value;
    const inputAsArray = input.toLowerCase().split(OPERATORS_REGEX);
    const lastInput = inputAsArray[inputAsArray.length - 1];
    const filter = props.options.filter((option) => option.toLowerCase().indexOf(lastInput) === 0);
    setFilteredOption(filter);
    if (lastInput.length > 0) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    setFormula(input);
    setActiveOption(0);
  };

  const formulaBuilder = () => {
    setShowOptions(false);
    let selectedColumn = filteredOption[activeOption];
    if (filteredOption.length > 0 && selectedColumn !== undefined) {
      const formulaAsArray = formula.split(OPERATORS_REGEX);
      const [formulaLast] = formulaAsArray.slice(formulaAsArray.length - 1);
      const formulaExceptLast = formula.slice(0, formula.length - formulaLast.length);
      // if (/\s/g.test(selectedColumn)) {
      selectedColumn = `\`${selectedColumn}\``;
      // }
      if (formulaAsArray.length < 2) {
        setFormula(`${selectedColumn}~`);
      } else {
        setFormula(formulaExceptLast + selectedColumn);
        props.onSetFormula(formulaExceptLast + selectedColumn);
      }
    } else {
      setFormula(formula);
      props.onSetFormula(formula);
    }
    setActiveOption(0);
  };

  const handleClick = () => {
    setFilteredOption([]);
    formulaBuilder();
    formulaRef.current.focus();
  };

  const handleKeyDown = (e) => {
    // enter
    if (e.keyCode === 13) {
      formulaBuilder();
      e.stopPropagation();
    // tab
    } else if (e.keyCode === 9) {
      formulaBuilder();
      e.stopPropagation();
      e.preventDefault();
    // up arrow
    } else if (e.keyCode === 38) {
      if (activeOption === 0) return;
      setActiveOption(activeOption - 1);
    // down arrow
    } else if (e.keyCode === 40) {
      if (activeOption - 1 === filteredOption.length) return;
      setActiveOption(activeOption + 1);
    // tab
    }
  };

  return (
    <>
      <input
        name="formula"
        value={formula}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
        ref={formulaRef}
        placeholder="y ~ x"
        className="rightsidebar-input"
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
  );
};
// className={classNameOptionActive}
const OptionsList = ({
  showOptions, userInput, filteredOption, activeOption, onClick, onToggleHover, Component,
}) => {
  if (showOptions && userInput) {
    if (filteredOption.length) {
      return (
        <div className="rightsidebar-dropdown-content">
          {filteredOption.map((option, index) => {
            if (index === activeOption) {
              const classNameOptionActive = 'option-active';
            }
            return (
              <div className="rightsidebar-dropdown-item" key={index} onClick={onClick} onMouseEnter={() => onToggleHover(index)}>
                <Component option={option} />
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  }
  return null;
};

export default withFormula;
