//  DataConnection
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
// Known Issues:
// Download button produces json link instead of a file pdf, excel, txt, csv, etc.
//

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Icon from '@mdi/react';
import { mdilFile, mdilTable } from '@mdi/light-js';
import { mdiDatabase, mdiDotsHorizontal } from '@mdi/js';

import Delete from './delete';
import OptionWithDropdown from '../Home/option';
import OFF_COLOR from '../../constants/off-color';
import { withFirebase } from '../Firebase';

const DATASOURCE_DROPDOWN = [
  { key: 'Delete', type: 'item' },
  { key: 'Move back', type: 'item' },
];

function removeDataTrash(trash, name, onSetTrash) {
  const ws = trash.findIndex((t) => t.name === name);
  onSetTrash([
    ...trash.slice(0, ws),
    ...trash.slice(ws + 1),
  ]);
}

const DataTrash = ({
  firebase, authUser, color, name, trash,
  connections, onSetTrash, onSetConnections,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdown = (key) => {
    switch (key) {
      case 'Delete': {
        setIsOpen(!isOpen);
        break;
      }
      case 'Move back': {
        handleMoveBack();
        break;
      }
      default:
    }
  };

  const handleMoveBack = () => {
    firebase.doMoveToWorksheets(authUser.uid, name);
    removeDataTrash(trash, name, onSetTrash);
  };

  const handleDelete = () => {
    firebase.doDeleteTrash(authUser.uid, name);
    removeDataTrash(trash, name, onSetTrash);
  };

  const handleOpen = () => setIsOpen(true);

  const ContextMenuDropdown = () => (
    <ContextMenu id={`right-click${name}`}>
      <MenuItem onClick={handleOpen}>Delete</MenuItem>
      <MenuItem onClick={handleMoveBack}>Move Back</MenuItem>
    </ContextMenu>
  );

  return (
    <div className="datasource-thumbnail">
      <ContextMenuTrigger className="datasource-dropdown" id={`right-click${name}`}>
        <div className="datasource-icon">
          {connections.includes(name)
						  ? <Icon path={mdiDatabase} size={5} />
						  : (/[.]/.exec(name) == null)
						    ? <Icon path={mdilTable} size={5} />
						    : <Icon path={mdilFile} size={5} />}
        </div>
        <div className="datasource-buttons-wrapper">
          <OptionWithDropdown
            classname="dropdown-content-datasource"
            text={<Icon path={mdiDotsHorizontal} size={0.9} />}
            items={DATASOURCE_DROPDOWN}
            onSelect={handleDropdown}
            color={OFF_COLOR[color[authUser.uid]]}
          />
        </div>
        <div className="datasource-editabletext">{name.replace(/\.[^/.]+$/, '')}</div>
      </ContextMenuTrigger>
      <ContextMenuDropdown />
      <Delete
        classname="modal"
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
)(DataTrash);
