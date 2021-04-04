import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import OFF_COLOR from '../../constants/off-color';
import { withFirebase } from '../Firebase';

const COLORS_APP = Object.keys(OFF_COLOR);

const Colors = ({
  firebase, color, authUser, onSetColor,
}) => {
  const handleColor = (c) => {
    firebase.user(authUser.uid).update({ color: c });
    onSetColor(color, authUser.uid);
  };

  return (
    <div className="home-content-settings-text">
      {COLORS_APP.map((color) => (
        <button
          style={{
            backgroundColor: color,
            'box-shadow': (color === color[authUser.uid]) ? 'inset 0px 0px 0px 3px #fff' : 'none',
            border: (color === color[authUser.uid]) ? `1px solid ${color[authUser.uid]}` : 'none',
          }}
          onClick={() => handleColor(color)}
          type="button"
        />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  color: (state.colorState.colors || {}),
});

const mapDispatchToProps = (dispatch) => ({
  onSetColor: (color, uid) => dispatch({ type: 'COLOR_SET', color, uid }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Colors);
