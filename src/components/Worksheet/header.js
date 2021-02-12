import React, {
  useState, useEffect, useRef,
} from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import EditableInput from '../EditableInput';
import { getTextWidth } from '../../functions';

import { OFF_COLOR } from '../../constants/off-color';
import * as ROUTES from '../../constants/routes';
import withDropdown from '../Dropdown';
import { withFirebase } from '../Firebase';

const USER_DROPDOWN = [
  { key: 'Sign out', type: 'item' },
  { key: 'Settings', type: 'link', path: ROUTES.SETTINGS },
];

const Header = ({
  firebase, authUser, color, worksheetname, worksheets, slides, saving,
  readOnly, onSetSaving, setReadOnly, onSetWorksheets, onSetWorksheetname,
}) => {
  const worksheetnameRef = useRef(null);

  useEffect(() => {
    if (worksheets === undefined) {
      firebase.doListWorksheets(authUser.uid).then((res) => {
        onSetWorksheets(res.items);
      });
    }
  }, []);

  const handleCommit = (name) => {
    onSetWorksheetname(name);
    firebase.doRenameWorksheet(authUser.uid, worksheetname, name);
  };

  const handleDropdown = (i) => firebase.doSignOut();

  const length = getTextWidth(worksheetname, '13px Helvetica Neue');

  return (
    <div className="worksheet-header">
      <div className="worksheet-header-right">
        <UserWithDropdown
          classname="dropdown-content-worksheet-header"
          text={authUser.firstname}
          items={USER_DROPDOWN}
          onSelect={handleDropdown}
          color={OFF_COLOR[color[authUser.uid]]}
        />
      </div>
      <div className="worksheet-header-wrapper">
        <div className="worksheet-header-center">
          <EditableInput
            value={worksheetname}
            readOnly={readOnly}
            onCommit={handleCommit}
            worksheets={worksheets}
            classname="worksheet-header-filename"
            setReadOnly={setReadOnly}
            style={{ width: `${length + 1}px` }}
          />
        </div>
        {saving && (
          <div
            className="worksheet-header-save"
            style={{ marginLeft: `${length + 145}px` }}
          >
            - Saving...
          </div>
        )}
      </div>
    </div>
  );
};

const User = ({
  classname, text, hover, onHover, isOpen, onOpen, color,
}) => (
  <div
    className="worksheet-header-dropdown-header"
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ color: (hover || isOpen) && color }}
  >
    {text}
  </div>
);

const UserWithDropdown = withDropdown(User);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  worksheets: (state.worksheetsState.worksheets || []),
  color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
  saving: (state.savingState.saving || false),
});

const mapDispatchToProps = (dispatch) => ({
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
  onSetWorksheets: (worksheets) => dispatch({ type: 'WORKSHEETS_SET', worksheets }),
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Header);
