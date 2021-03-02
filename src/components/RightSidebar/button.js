import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const Button = ({
  authUser, color, onClick, condition, text,
}) => (
  <div className="rightsidebar-buttonwrapper" onClick={onClick}>
    <button
      className="rightsidebar-button"
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
)(Button);
