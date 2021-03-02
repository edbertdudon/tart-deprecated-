import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { CORRELATION_METHOD } from './form';
import Button from '../../RightSidebar/button';

const Alternative = ({
  authUser, color, setAlt, alt,
}) => {
  const handleAlt0 = () => setAlt(0);

  const handleAlt1 = () => setAlt(1);

  // const handleAlt2 = () => setAlt(2);

  return (
    <>
      <div className="rightsidebar-label">Correlation Method</div>
      <Button
        onClick={handleAlt0}
        condition={alt === 0}
        text={CORRELATION_METHOD[0]}
        color={color[authUser.uid]}
      />
      <Button
        onClick={handleAlt1}
        condition={alt === 1}
        text={CORRELATION_METHOD[1]}
        color={color[authUser.uid]}
      />
      {/*<Button
        onClick={handleAlt2}
        condition={alt === 2}
        text={CORRELATION_METHOD[2]}
        color={color[authUser.uid]}
      />*/}
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
