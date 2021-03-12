//
//  DataConnection
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
import { mdiDatabase, mdiDotsHorizontal } from '@mdi/js';
import Delete from './delete';
import OptionWithDropdown from '../Home/option';
import OFF_COLOR from '../../constants/off-color';
import { withFirebase } from '../Firebase';

const DATASOURCE_DROPDOWN = [
  { key: 'Delete Connection', type: 'item' },
];

const DataConnection = ({
  firebase, authUser, color, name, connections, onSetConnections,
}) => {
  // const [hover, setHover] = useState(false);
  // const [hoverDropdown, setHoverDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    firebase.doDeleteConnectionsField(authUser.uid, name);
    const ws = connections.findIndex((c) => c.name === name);
    onSetConnections([
      ...connections.slice(0, ws),
      ...connections.slice(ws + 1),
    ]);
  };

  const handleOpen = () => setIsOpen(true);

  const ContextMenuDropdown = () => (
    <ContextMenu id={`right-click${name}`}>
      <MenuItem onClick={handleOpen}>Delete Connection</MenuItem>
    </ContextMenu>
  );

  return (
    <div className="datasource-thumbnail">
      <ContextMenuTrigger className="datasource-dropdown" id={`right-click${name}`}>
        <div className="datasource-icon">
          <Icon path={mdiDatabase} size={5} />
        </div>
        <div className="datasource-buttons-wrapper">
          <OptionWithDropdown
            classname="dropdown-content-datasource"
            text={<Icon path={mdiDotsHorizontal} size={0.9} />}
            items={DATASOURCE_DROPDOWN}
            onSelect={handleOpen}
            color={OFF_COLOR[color[authUser.uid]]}
          />
        </div>
        <div className="datasource-editabletext">{name}</div>
      </ContextMenuTrigger>
      <ContextMenuDropdown />
      <Delete
        name={name}
        color={color[authUser.uid]}
        onSelect={handleDelete}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
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
)(DataConnection);
