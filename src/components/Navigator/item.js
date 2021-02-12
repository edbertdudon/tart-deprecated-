//
//  Item
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';

const Item = ({ text, onSelect, color }) => {
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover(!hover);

  return (
    <div
      className="dropdown-item"
      onClick={() => onSelect(text)}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      // style={{ backgroundColor: hover && color, color: hover ? '#fff' : '#000000' }}
    >
      {text}
    </div>
  );
};

export default Item;
