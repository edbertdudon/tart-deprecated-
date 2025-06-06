import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ALTERNATIVES } from './form';
import Button from '../../RightSidebar/button';

const Alternative = ({
  authUser, color, setAlt, alt,
}) => {
  const handleAlt0 = () => setAlt(0);

  const handleAlt1 = () => setAlt(1);

  const handleAlt2 = () => setAlt(2);

  return (
    <>
      <div className="rightsidebar-label">Alternative Hypothesis</div>
      <Button
        onClick={handleAlt0}
        condition={alt === 0}
        text={ALTERNATIVES[0]}
        color={color[authUser.uid]}
      />
      <Button
        onClick={handleAlt1}
        condition={alt === 1}
        text={ALTERNATIVES[1]}
        color={color[authUser.uid]}
      />
      <Button
        onClick={handleAlt2}
        condition={alt === 2}
        text={ALTERNATIVES[2]}
        color={color[authUser.uid]}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Alternative);
