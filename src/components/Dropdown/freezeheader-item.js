import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const FreezeHeader = ({
  slides, text, secondarytext, onSelect, isRow,
}) => {
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover(!hover);

  const isFrozen = slides.data.freeze[isRow ? 0 : 1] > 0

  return (
    <div
      className="dropdown-item"
      onClick={() => onSelect(text, isFrozen)}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      {isFrozen ? secondarytext : text}
    </div>
  );
};

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(FreezeHeader);
