//
//  Item
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import { MenuItem } from 'react-contextmenu';

const Item = ({ text, onSelect }) => (
  <MenuItem
    onClick={() => onSelect(text)}
    attributes={{ className: 'dropdown-item' }}
  >
    {text}
  </MenuItem>
);

export default Item;
