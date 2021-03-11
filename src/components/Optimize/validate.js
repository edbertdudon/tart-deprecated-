import {
  LETTERS_REFERENCE, NUMBERS_REFERENCE, FORMULA_CELL_REFERENCES, VALID_RANGE_REFERENCES,
  VALID_FORMULA_CELL_REFERENCES, RANGE_REFERENCES, letterToColumn,
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

export function validateLhsRhs(lhs, rhs) {
  const mnl = lhs.match(NUMBERS_REFERENCE);
  const mnr = rhs.match(NUMBERS_REFERENCE);
  let mll = lhs.match(LETTERS_REFERENCE);
  let mlr = rhs.match(LETTERS_REFERENCE);

  if (mnl === null || mnr === null || mll === null || mlr === null) {
    return false;
  }
  mll = mll.map((ref) => letterToColumn(ref));
  mlr = mlr.map((ref) => letterToColumn(ref));

  const lrows = mnl[1] - mnl[0];
  const rrows = mnr[1] - mnr[0];
  const lcols = mll[1] - mll[0];
  const rcols = mlr[1] - mlr[0];
  console.log(lrows, rrows, lcols, rcols)

  if (lrows === 0) {
    if ((rrows === 0 && lcols === rcols)
      || (rcols === 0 && lcols === rrows)) {
      return true;
    }
  } else {
    if ((rrows === 0 && lrows === rcols)
      || (rcols === 0 && lrows === rrows)) {
      return true;
    }
  }
  return false;
}

export function checkErrors(hasContstraint, errorConstraint, lhs, dir, rhs) {
  if (!hasContstraint) {
    return false;
  }
  if (errorConstraint !== null) {
    return true;
  }
  if (lhs.length === 0 && dir.length === 0 && rhs.length === 0) {
    return false;
  }
  if (lhs.length > 0 && dir.length > 0 && rhs.length > 0) {
    // if both are valid, return no error
    if (validateLhsRhs(lhs, rhs) && validateLhsRhs(lhs, dir)) {
      return false;
    }
  }
  return true;
}

export function checkConeErrors(hasCone, errorCone, lhs, rhs) {
  if (!hasCone) {
    return false;
  }
  if (errorCone !== null) {
    return true;
  }
  if (lhs.length === 0 && rhs.length === 0) {
    return false;
  }
  if (lhs.length > 0 && rhs.length > 0) {
    // if valid, return no error
    if (validateLhsRhs(lhs, rhs)) {
      return false;
    }
  }
  return true;
}
