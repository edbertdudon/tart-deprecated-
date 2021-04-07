const OFF_COLOR = {
  'rgb(0, 0, 0)': 'rgb(53, 53, 53)',
  'rgb(0, 181, 170)': 'rgb(29, 210, 199)',
  'rgb(255, 162, 0)': 'rgb(284, 191, 29)',
  'rgb(221, 95, 105)': 'rgb(250, 124, 134)',
};

export const PRIMARY_COLORS = Object.keys(OFF_COLOR).slice(1);
export const CELL_REF_COLORS = Object.values(OFF_COLOR).slice(1);

export default OFF_COLOR;
