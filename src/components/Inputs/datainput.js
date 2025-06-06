//  DataInput
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Icon from '@mdi/react';
import { mdiDotsHorizontal } from '@mdi/js';
import { mdilFile } from '@mdi/light-js';

import OptionWithDropdown from '../Home/option';
import OFF_COLOR from '../../constants/off-color';
import { withFirebase } from '../Firebase';

const DATASOURCE_DROPDOWN = [
  { key: 'Move to trash', type: 'item' },
];

const DataInput = ({
  firebase, authUser, color, filename, inputs, onSetInputs,
}) => {
  // const [hover, setHover] = useState(false);

  const handleTrash = () => {
    firebase.doMoveToTrash(authUser.uid, filename);
    const ws = inputs.findIndex((input) => input.name === filename);
    onSetInputs([
      ...inputs.slice(0, ws),
      ...inputs.slice(ws + 1),
    ]);
  };

  const ContextMenuDropdown = () => (
    <ContextMenu id={`right-click${filename}`}>
      <MenuItem onClick={handleTrash}>Move to Trash</MenuItem>
    </ContextMenu>
  );

  return (
    <div className="datasource-thumbnail">
      <ContextMenuTrigger className="datasource-dropdown" id={`right-click${filename}`}>
        <div className="datasource-icon">
          <Icon path={mdilFile} size={5} />
        </div>
        <div className="datasource-buttons-wrapper">
          <OptionWithDropdown
            classname="dropdown-content-datasource"
            text={<Icon path={mdiDotsHorizontal} size={0.9} />}
            items={DATASOURCE_DROPDOWN}
            onSelect={handleTrash}
            color={OFF_COLOR[color[authUser.uid]]}
          />
        </div>
        <div className="datasource-editabletext">{filename}</div>
      </ContextMenuTrigger>
      <ContextMenuDropdown />
    </div>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(DataInput);
