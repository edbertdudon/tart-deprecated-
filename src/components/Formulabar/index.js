//
//  Formulabar
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { getRangeRefs } from '../../functions';
import { CELL_REF_COLORS } from '../../constants/off-color';
import './index.less';

const Formulabar = ({ slides, formula }) => {
  const [value, setValue] = useState(formula.text || '');
  const formulaRef = useRef(null);

  useEffect(() => {
    setValue(formula.text || '');
  }, [formula]);

  // const onInput = (e) => {
    // console.log(e.target.textContent);
    // setValue(e.target.textContent);
    // slides.cellText(formula.ri, formula.ci, e.target.textContent).reRender();
  // };

  // useEffect(() => {
  //   setValue(formula.text);
  //   formulaRef.current.addEventListener('input', onInput);
  // }, []);
  const cellRefs = getRangeRefs(value, slides.data.rows.len);
  const colors = cellRefs.map((r, i) => ({ [r]: CELL_REF_COLORS[i % CELL_REF_COLORS.length], id: `${i}${r}` }));
  const valueArray = value.split(new RegExp(cellRefs.map((r) => `(${r})`).join('|')))
    .filter((r) => r !== undefined);
  cellRefs.forEach((r, i) => {
    valueArray[valueArray.findIndex((e) => e === r)] = colors[i];
  });

  return (
    <div className="formulabar" ref={formulaRef} contentEditable>
      {valueArray.map((v) => (
        (typeof v === 'string' || v instanceof String) ? v : (
          <span style={{ color: Object.values(v)[0] }} key={v.id}>
            {Object.keys(v)[0]}
          </span>
        )
      ))}
    </div>
  );
  // return (
  //   <input
  //     type="text"
  //     onChange={handleChange}
  //     className="formulabar"
  //     value={value}
  //   />
  // );
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
