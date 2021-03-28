//
//  header.js
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import withDropdown from '../Dropdown';

const Header = ({
  text, index, hover, onHover, isOpen, onOpen,
}) => {
  const handleKeyDown = () => {
    // if (e.keyCode === 13) onOpen()
  };

  return (
    <div
      className="worksheet-toolbar-dropdown"
      onClick={onOpen}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
      onKeyDown={handleKeyDown}
      style={{ backgroundColor: (hover || isOpen) && 'rgba(0, 0, 0, 0.05)' }}
      // role="button"
      // tabIndex={index}
    >
      {text}
    </div>
  );
};

export default withDropdown(Header);
