//
//  Variable
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import withLists from './withLists';

const Variable = ({
  label, setSelected, options, name, onSelect,
}) => {
  const handleSelect = (i) => {
    setSelected(i);
    onSelect(i);
  };

  return (
    <>
      <div className="rightsidebar-label">{label}</div>
      <OptionsWithLists onChange={handleSelect} options={options} name={name} />
    </>
  );
};

const Options = ({ option }) => option;
const OptionsWithLists = withLists(Options);

export default Variable;
