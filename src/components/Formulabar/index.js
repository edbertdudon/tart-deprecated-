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
import { PRIMARY_COLORS, CELL_REF_COLORS } from '../../constants/off-color';
import { createFile, getRangeRefs } from '../../functions';
import useDebounce from '../../functions/useDebounce.ts';
import { withFirebase } from '../Firebase';
import './index.less';

const Formulabar = ({
  firebase, authUser, slides, worksheetname, formula, onSetSaving,
}) => {
  const [value, setValue] = useState([{
    type: 'paragraph',
    children: [{ text: formula.text || '' }],
  }]);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [pendingSave, setPendingSave] = useState('');
  const debouncePendingSave = useDebounce(pendingSave, 750);

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
              .filter((r) => r !== undefined && r.length > 0);

            colors.forEach((r, i) => {
              if (cellRefs.includes(r)) {
                const prefix = colors.slice(0, i).join('').length;
                const range = {
                  anchor: { path, offset: prefix },
                  focus: { path, offset: prefix + r.length },
                  color: CELL_REF_COLORS[i % CELL_REF_COLORS.length],
                };

                if (i === colors.length - 1 && slides.sheet.addingFormula) {
                  range.border = PRIMARY_COLORS[i % PRIMARY_COLORS.length];
                }
                ranges.push(range);
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

  function save() {
    onSetSaving(true);
    firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
      .then(() => onSetSaving(false));
  }

  useEffect(() => {
    if (debouncePendingSave) {
      save();
    }
  }, [debouncePendingSave]);

  const handleChange = (e) => {
    setValue(e);
    slides.cellText(formula.ri, formula.ci, e[0].children[0].text).reRender();
    setPendingSave(e);
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
    slides.sheet.addingFormula = false;
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
  <span {...attributes}
    className="formulabar-leaf"
    style={{
      color: leaf.color && leaf.color,
      border: leaf.border && `1px solid ${leaf.border}`,
    }}
  >
    {children}
  </span>
);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  saving: (state.savingState.saving || false),
  formula: (state.formulaState.formula || { text: '', ri: 0, ci: 0 }),
});

const mapDispatchToProps = (dispatch) => ({
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Formulabar);
