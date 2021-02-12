//
//  Matrix
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import withLists from '../../RightSidebar/withLists';
import withListsDropdown from '../../RightSidebar/withListsDropdown';

const Matrix = ({
  variables, selected, setSelected, text,
}) => {
  const handleUpdateVariable = (newSelectedVariables) => setSelected(newSelectedVariables);

  const handleAddVariable = (activeOption) => {
    const newSelectedVariables = [...selected, activeOption];
    setSelected(newSelectedVariables);
  };

  return (
    <>
      <div className="rightsidebar-label">{text}</div>
      {selected.map((select, index) => (
        <OptionsWithListsDropdown
          onChange={handleUpdateVariable}
          options={variables}
          name={variables[select]}
          selection={selected}
          setSelection={setSelected}
          currentSelection={index}
          key={text + index}
        />
      ))}
      <OptionsWithLists
        onChange={handleAddVariable}
        options={variables}
        name={selected.length < 1 ? '' : 'Add additonal variable'}
        styles={{ color: '#aaa' }}
      />
    </>
  );
};

const Options = ({ option }) => option;
const OptionsWithLists = withLists(Options);
const OptionsWithListsDropdown = withListsDropdown(Options);

export default Matrix;
