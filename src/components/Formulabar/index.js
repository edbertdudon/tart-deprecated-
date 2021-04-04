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
import { selectorMove } from '../Spreadsheet/component/sheet';
import { getTextWidth, getFormulaColors, setCaretPosition } from '../../functions';
import './index.less';

const Formulabar = ({ slides, formula }) => {
  const [cell, setCell] = useState(formula.text || '');
  const [caretN, setCaretN] = useState(null);
  const [caretId, setCaretId] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setCell(formula.text || '');
  }, [formula]);

  // useEffect(() => {
  //   setCaretPosition(caretId, caretN);
  // }, [caretId])
  //
  // const formulaColors = getFormulaColors(cell);
  //
  const handleChange = (e) => {
    setCell(e.target.value);
    slides.cellText(formula.ri, formula.ci, e.target.value).reRender();
    // const text = formulaColors;
    // text[i].text = e.target.value;
    // const fulltext = text.map((t) => t.text).join('');
    // setCell(fulltext);
    // slides.cellText(formula.ri, formula.ci, fulltext).reRender();
    // setCaretId(`${i}${text[i].text}`);
    // setCaretN(text[i].text.length);
  };
  //
  // const handleKeyDown = (e, v, i) => {
  //   const { keyCode, shiftKey } = e;
  //   // tab
  //   if (keyCode === 9) {
  //     slides.sheet.editor.clear();
  //     // shift + tab => move left
  //     // tab => move right
  //     selectorMove.call(slides.sheet, false, shiftKey ? 'left' : 'right');
  //     e.preventDefault();
  //   }
  //   // enter
  //   if (keyCode === 13) {
  //     inputRef.current.blur();
  //     slides.sheet.editor.clear();
  //     // shift + enter => move up
  //     // enter => move down
  //     selectorMove.call(slides.sheet, false, e.shiftKey ? 'up' : 'down');
  //     e.preventDefault();
  //     return;
  //   }
  //   const caret = e.target.selectionStart;
  //   // backspace
  //   // At selection start backspace to previous text
  //   if (keyCode === 8 && caret === 0 && i > 0) {
  //     const prevText = formulaColors[i - 1].text;
  //     const newText = formulaColors[i - 1].text.slice(0, prevText.length - 1);
  //     const text = formulaColors;
  //     text[i - 1].text = newText;
  //     const fulltext = text.map((t) => t.text).join('');
  //     setCell(fulltext);
  //     slides.cellText(formula.ri, formula.ci, fulltext).reRender();
  //   }
  //   // left
  //   if (keyCode === 37 && caret === 0 && i > 0) {
  //     const prevText = formulaColors[i - 1].text;
  //     setCaretPosition(`${i - 1}${prevText}`, prevText.length);
  //   }
  //   // right
  //   if (keyCode === 39
  //     && caret === v.text.length
  //     && formulaColors.length > 1
  //     && i < formulaColors.length - 1
  //   ) {
  //     const nextText = formulaColors[i + 1].text;
  //     setCaretPosition(`${i + 1}${nextText}`, 0);
  //   }
  //   // console.log(caret, formulaColors, formulaColors[i].text.length);
  // };
  // console.log(formulaColors);
  // const formulaText = '';

  return (
    <input
      type="text"
      onChange={handleChange}
      className="formulabar"
      value={cell}
    />
  );
};

// {formulaColors.map((v, i) => (
//   <input
//     type="text"
//     onChange={(e) => handleChange(e, i)}
//     onKeyDown={(e) => handleKeyDown(e, v, i)}
//     style={{
//       width: (i === formulaColors.length - 1)
//         ? `Calc(100% - 10px - ${getTextWidth(cell, '13px Helvetica')}px)`
//         : `${getTextWidth(v.text, '13px Helvetica')}px`,
//       color: ('color' in v) && v.color,
//     }}
//     className="formulabar-cellreference"
//     value={v.text}
//     key={v.id}
//     id={v.id}
//     ref={inputRef}
//   />
// ))}

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
  formula: (state.formulaState.formula || { text: '', ri: 0, ci: 0 }),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Formulabar);
