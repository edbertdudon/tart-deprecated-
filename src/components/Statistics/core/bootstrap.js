//
//  BootstrapMethod
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { BOOTSTRAP_METHOD } from './form';

const BootstrapMethod = ({
  authUser, color, setMethod, method,
}) => {
  const handleMethodResample = () => setMethod(0);

  const handleMethodNormal = () => setMethod(1);

  return (
    <>
      <div className="rightsidebar-label">Bootstrap Method</div>
      <Button
        onClick={handleMethodResample}
        condition={method === 0}
        text={BOOTSTRAP_METHOD[0]}
        color={color[authUser.uid]}
      />
      <Button
        onClick={handleMethodNormal}
        condition={method === 1}
        text={BOOTSTRAP_METHOD[1]}
        color={color[authUser.uid]}
      />
    </>
  );
};

const Button = ({
  onClick, condition, text, color,
}) => (
  <div className="rightsidebar-buttonwrapper" onClick={onClick}>
    <button
      className="rightsidebar-button"
      style={{
			  backgroundColor: condition === true && color,
			  boxShadow: condition === true ? 'inset 0px 0px 0px 3px #fff' : 'none',
			  border: condition === true ? `1px solid ${color}` : '1px solid #fff',
      }}
    />
    <div className="rightsidebar-buttontext-2part-bootstrap">{text}</div>
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
)(BootstrapMethod);
