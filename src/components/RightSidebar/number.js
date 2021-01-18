import React from 'react';

const Number = ({
  label, value, onChange, error,
}) => (
  <>
    <div className="rightsidebar-label">{label}</div>
    <div className="rightsidebar-variable">
      <input
        className="rightsidebar-input"
        type="number"
        value={value}
        onChange={onChange}
      />
      {error && <div className="rightsidebar-error">{error}</div>}
    </div>
  </>
);

export default Number;
