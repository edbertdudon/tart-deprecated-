import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import EditableInput from '../EditableInput';
import withDropdown from '../Dropdown';
import { withFirebase } from '../Firebase';
import { OFF_COLOR } from '../../constants/off-color';
import * as ROUTES from '../../constants/routes';

const USER_DROPDOWN = [
  { key: 'Sign out', type: 'item' },
  { key: 'Settings', type: 'link', path: ROUTES.SETTINGS },
];

const Header = ({
  firebase, authUser, color, worksheetname, worksheets, slides, onSetWorksheets, onSetWorksheetname,
  saving, setSaving, readOnly, setReadOnly,
}) => {
  useEffect(() => {
    if (worksheets === undefined) {
      firebase.doListWorksheets(authUser.uid).then((res) => {
        onSetWorksheets(res.items);
      });
    }
  }, []);

  const handleCommit = (name) => {
    setSaving(true);
    // const file = new File([JSON.stringify(slides.getData())], name, { type: 'application/json' });
    // firebase.doUploadWorksheet(authUser.uid, name, file);
    // firebase.doDeleteWorksheet(authUser.uid, worksheetname)
    //   .then(() => {
    //     setSaving(false);
    //     onSetWorksheetname(name);
    //   });
  };

  const handleDropdown = (i) => firebase.doSignOut();

  return (
    <div className="worksheet-header">
      <div className="worksheet-header-right">
        <UserWithDropdown
          text={authUser.firstname}
          items={USER_DROPDOWN}
          onSelect={handleDropdown}
          style={{ right: '10px' }}
          color={OFF_COLOR[color[authUser.uid]]}
        />
      </div>
      <div className="worksheet-header-wrapper">
        <div className="worksheet-header-center">
          <EditableInput
            value={worksheetname.replace(/\.[^/.]+$/, '')}
            readOnly={readOnly}
            onCommit={handleCommit}
            worksheets={worksheets}
            classname="worksheet-header-filename"
            setReadOnly={setReadOnly}
          />
        </div>
        {saving && <div className="worksheet-header-save">- Saving...</div>}
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
