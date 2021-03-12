//
//  Formulabar
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import './index.less';

const Formulabar = ({ slides, formula }) => {
  const [value, setValue] = useState(formula.text);

  useEffect(() => {
    setValue(formula.text);
  }, [formula]);

  const handleChange = (e) => {
    setValue(e.target.value);
    slides.cellText(formula.ri, formula.ci, e.target.value).reRender();
  };

  return (
    <input
      type="text"
      onChange={handleChange}
      className="formulabar"
      value={value}
    />
  );
};

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
  formula: (state.formulaState.formula || { text: '', ri: 0, ci: 0 }),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Formulabar);
