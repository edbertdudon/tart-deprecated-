import { letterToColumn } from '../Spreadsheet/cloudr';
import {
  LETTERS_REFERENCE, NUMBERS_REFERENCE, FORMULA_CELL_REFERENCES,
  VALID_RANGE_REFERENCES, VALID_FORMULA_CELL_REFERENCES, RANGE_REFERENCES,
} from '../../functions';

export function validateCell(v) {
  if (!VALID_FORMULA_CELL_REFERENCES.test(v)) {
    return ('Invalid cell reference.');
  }
  const mr = v.match(RANGE_REFERENCES);
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref));
    if (ml[1] < ml[0] || ml.length !== 1) {
      return ('Invalid range.');
    }
    const mn = v.match(NUMBERS_REFERENCE);
    if (mn !== null) {
      mn.map((ref) => parseInt(ref));
      if (mn[1] < mn[0] || mn.length !== 1) {
        return ('Invalid range.');
      }
    }
  }
  return (null);
}

export function validateCellorNumeric(v) {
  if (!NUMBERS_REFERENCE.test(v)) {
    validateCell(v);
  }
  return null;
}

export function validateCellorSingleRange(v) {
  if (!(VALID_FORMULA_CELL_REFERENCES.test(v) || VALID_RANGE_REFERENCES.test(v))) {
    return ('Invalid cell, row or column.');
  }
  const mc = v.match(FORMULA_CELL_REFERENCES);
  if (mc === null) {
    return ('Invalid cell.');
  }
  const mr = v.match(RANGE_REFERENCES);
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE);
    const mn = v.match(NUMBERS_REFERENCE);
    if (!(ml[1] === ml[0] || mn[1] === mn[0]) || ml.length > 2 || mn.length > 2) {
      return ('Invalid row or column. Must be limited to a single row or column');
    }
  }
  return (null);
}

// function validateRange(v) {
//   if (!VALID_RANGE_REFERENCES.test(v)) {
//     return ('Invalid range reference.');
//   }
//   const mc = v.match(FORMULA_CELL_REFERENCES);
//   if (mc === null) {
//     return ('Invalid cell.');
//   }
//   const mr = v.match(RANGE_REFERENCES);
//   if (mr !== null) {
//     const ml = v.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref) - 1);
//     if (ml[1] < ml[0] || ml.length !== 2) {
//       return ('Invalid range.');
//     }
//     const mn = v.match(NUMBERS_REFERENCE);
//     if (mn !== null) {
//       mn.map((ref) => parseInt(ref));
//       if (mn[1] < mn[0] || mn.length !== 2) {
//         return ('Invalid range.');
//       }
//     }
//   }
//   return (null);
// }

export function validateRangeNotOne(v) {
  if (!VALID_RANGE_REFERENCES.test(v)) {
    return ('Invalid range reference.');
  }
  const mc = v.match(FORMULA_CELL_REFERENCES);
  if (mc === null) {
    return ('Invalid cell.');
  }
  const mr = v.match(RANGE_REFERENCES);
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref) - 1);
    if (ml[1] <= ml[0] || ml.length !== 2) {
      return ('Invalid range. Must be greater than a single row or column');
    }
    const mn = v.match(NUMBERS_REFERENCE);
    if (mn !== null) {
      mn.map((ref) => parseInt(ref));
      if (mn[1] <= mn[0] || mn.length !== 2) {
        return ('Invalid range. Must be greater than a single row or column');
      }
    }
  }
  return (null);
}
