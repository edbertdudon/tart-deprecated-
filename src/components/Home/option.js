import React from 'react';
import withDropdown from '../Dropdown';

const Option = ({
  text, hover, onHover, isOpen, onOpen, color,
}) => (
  <div
    className="datasource-options-only"
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ backgroundColor: hover && color }}
  >
    {text}
  </div>
);

const OptionWithDropdown = withDropdown(Option);

export default OptionWithDropdown;
