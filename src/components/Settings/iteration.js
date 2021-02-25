import React from 'react';

const Iteration = () => {
  return (
    <div>
      <div>Maximum iterations to resolve circular references (minimum 50):</div>
      <input type="number" min="50" name="iteration" className="settings-iteration" value={100}/>
      <div>Save</div>
    </div>
  )
}

export default Iteration;
