import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const Checkbox = ({
  authUser, color, onClick, condition, text,
}) => (
  <div className="importdatabase-checkbox" onClick={onClick}>
    <button
      className="importdatabase-checkbox-box"
      style={{
        backgroundColor: condition === true && color[authUser.uid],
        boxShadow: condition === true ? 'inset 0px 0px 0px 3px #fff' : 'none',
        border: condition === true ? `1px solid ${color[authUser.uid]}` : '1px solid #fff',
      }}
      type="button"
    />
    <div className="rightsidebar-buttontext">{text}</div>
  </div>
);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Checkbox);
