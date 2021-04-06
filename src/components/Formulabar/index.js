//
//  Formulabar
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Text, createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { selectorMove } from '../Spreadsheet/component/sheet';
import { CELL_REF_COLORS } from '../../constants/off-color';
import { getRangeRefs } from '../../functions';
import './index.less';

const Formulabar = ({ slides, formula }) => {
  const [value, setValue] = useState([{
    type: 'paragraph',
    children: [{ text: formula.text || '' }],
  }]);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withReact(createEditor()), []);

  const decorate = useCallback(
    ([node, path]) => {
      const ranges = [];
      if (Text.isText(node)) {
        const { text } = node;

        if (text.startsWith('=')) {
          const cellRefs = getRangeRefs(text);

          if (cellRefs.length > 0) {
            const colors = text
              .split(new RegExp(cellRefs.map((r) => `(${r})`).join('|')))
              .filter((r) => r !== undefined);

            colors.forEach((r, i) => {
              if (cellRefs.includes(r)) {
                const prefix = colors.slice(0, i).join('').length;
                ranges.push({
                  anchor: { path, offset: prefix },
                  focus: { path, offset: prefix + r.length },
                  color: CELL_REF_COLORS[i % CELL_REF_COLORS.length],
                });
              }
            });
          }
        }
      }
      return ranges;
    }, [value]);

  useEffect(() => {
    setValue([{
      type: 'paragraph',
      children: [{ text: formula.text || '' }],
    }]);
  }, [formula]);

  const handleChange = (e) => {
    setValue(e);
    slides.cellText(formula.ri, formula.ci, e[0].children[0].text).reRender();
  };

  const handleKeyDown = (e) => {
    const { keyCode, shiftKey } = e;
    // tab
    if (keyCode === 9) {
      slides.sheet.editor.clear();
      // shift + tab => move left
      // tab => move right
      selectorMove.call(slides.sheet, false, shiftKey ? 'left' : 'right');
      e.preventDefault();
    }
    // enter
    if (keyCode === 13) {
      slides.sheet.editor.clear();
      // shift + enter => move up
      // enter => move down
      selectorMove.call(slides.sheet, false, e.shiftKey ? 'up' : 'down');
      e.preventDefault();
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <Editable
        decorate={decorate}
        className="formulabar"
        style={{ position: 'absolute' }}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
      />
    </Slate>
  );
};

const Leaf = ({ attributes, children, leaf }) => (
  <span {...attributes} style={{ color: leaf.color && leaf.color }}>
    {children}
  </span>
);

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
  formula: (state.formulaState.formula || { text: '', ri: 0, ci: 0 }),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Formulabar);
