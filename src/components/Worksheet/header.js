import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import EditableInput from '../EditableInput';
import { getTextWidth } from '../../functions';

import OFF_COLOR from '../../constants/off-color';
import * as ROUTES from '../../constants/routes';
import withDropdown from '../Dropdown';
import { withFirebase } from '../Firebase';

const USER_DROPDOWN = [
  { key: 'Sign out', type: 'item' },
  { key: 'Settings', type: 'link', path: ROUTES.SETTINGS },
];

const User = ({
  text, hover, onHover, isOpen, onOpen, color,
}) => (
  <div
    className="worksheet-header-dropdown-header"
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ color: (hover || isOpen) && color }}
    role="banner"
  >{text}</div>
);

const UserWithDropdown = withDropdown(User);

const Header = ({
  firebase, authUser, color, worksheetname, worksheets, saving,
  readOnly, setReadOnly, onSetWorksheets, onSetWorksheetname,
}) => {
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

  const handleDropdown = () => firebase.doSignOut();

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

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  worksheets: (state.worksheetsState.worksheets || []),
  color: (state.colorState.colors || {}),
  saving: (state.savingState.saving || false),
});

const mapDispatchToProps = (dispatch) => ({
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
  onSetWorksheets: (worksheets) => dispatch({ type: 'WORKSHEETS_SET', worksheets }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Header);
