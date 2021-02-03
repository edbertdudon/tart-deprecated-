import React, { useState, useRef, useEffect } from 'react';
import { useOutsideAlerter } from '../../functions';

const withLists = (Component) => (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  const listsRef = useRef(null);

  const handleHideOptions = () => setShowOptions(false);

  useOutsideAlerter(listsRef, handleHideOptions);

  const toggleComponent = () => setShowOptions(!showOptions);

  const handleSelectComponent = () => {
    setShowOptions(false);
    props.onChange(activeOption);
    setActiveOption(null);
  };

  const toggleHover = (index) => setActiveOption(index);

  return (
    <div ref={listsRef}>
      <div className="rightsidebar-dropdown" onClick={toggleComponent} style={props.styles}>
        {props.name}
      </div>
      {(showOptions && props.options.length > 0)
        && (
        <div className="rightsidebar-dropdown-content">
          {props.options.map((option, index) => (
            <div
              className="rightsidebar-dropdown-item"
              key={index}
              onClick={handleSelectComponent}
              onMouseEnter={() => toggleHover(index)}
            >
              <Component option={option} />
            </div>
          ))}
        </div>
        )}
    </div>
  );
};

export default withLists;
