import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const Checkbox = ({
  authUser, color, onClick, condition, text,
}) => (
  <div className="rightsidebar-checkbox" onClick={onClick}>
    <button
      className="rightsidebar-checkbox-box"
      style={{
			  backgroundColor: condition === true && color[authUser.uid],
			  boxShadow: condition === true && 'inset 0px 0px 0px 3px #fff',
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
