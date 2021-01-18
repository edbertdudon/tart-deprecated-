import React, { useState, useRef, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { useOutsideAlerter } from '../../functions';

const withListsDropdown = (Component) => (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  const listdropdownRef = useRef(null);

  const handleHideOptions = () => setShowOptions(false);

  useOutsideAlerter(listdropdownRef, handleHideOptions);

  const handleSelectComponent = () => {
    setShowOptions(false);
    const newSelection = props.selection.map((selected, j) => {
      if (props.currentSelection === j) {
        return activeOption;
      }
      return selected;
    });
    props.setSelection(newSelection);
    props.onChange(newSelection);
    setActiveOption(null);
  };

  const handleDelete = () => {
    setShowOptions(false);
    if (props.selection.length > 1) {
      const newSelection = props.selection.filter((selected, j) => props.currentSelection !== j);
      props.setSelection(newSelection);
      props.onChange(newSelection);
    }
  };

  const toggleHover = (index) => setActiveOption(index);

  const toggleComponent = () => setShowOptions(false);

  return (
    <div ref={listdropdownRef}>
      <ContextMenuTrigger id="withlistsdropdown-rightclick">
        <div className="rightsidebar-dropdown" onClick={toggleComponent}>
          {props.name}
          <button className="rightsidebar-dropdown-close" onClick={handleDelete}>
            <Icon path={mdiClose} size={0.8} />
          </button>
        </div>
      </ContextMenuTrigger>
      <ContextMenu id="withlistsdropdown-rightclick" className="rightsidebar-dropdown-contextmenu">
        <MenuItem>Delete</MenuItem>
      </ContextMenu>
      {(showOptions && props.options.length)
        && (
        <div className="rightsidebar-dropdown-content">
          {props.options.map((option, index) => (
            <div
              className="rightsidebar-dropdown-item"
              key={index}
              onClick={() => handleSelectComponent(index)}
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

export default withListsDropdown;
