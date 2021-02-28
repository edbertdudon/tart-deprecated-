//
//  header.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import withDropdown from '../Dropdown';

const Header = ({
  text, hover, onHover, isOpen, onOpen,
}) => (
  <div
    className="worksheet-toolbar-dropdown"
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ backgroundColor: (hover || isOpen) && 'rgba(0, 0, 0, 0.05)' }}
  >{text}</div>
);

export default withDropdown(Header);
