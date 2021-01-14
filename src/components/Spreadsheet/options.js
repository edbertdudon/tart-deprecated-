export const options = {
  mode: 'edit', // edit | read
  showToolbar: true,
  showGrid: true,
  showContextmenu: true,
  showNavigator: true,
  view: {
    height: () => document.documentElement.clientHeight-31,
    width: () => document.documentElement.clientWidth,
  },
  row: {
    len: 1000,
    height: 25,
  },
  col: {
    len: 40,
    width: 100,
    indexWidth: 30,
    minWidth: 30,
  },
  style: {
    bgcolor: '#ffffff',
    align: 'left',
    valign: 'middle',
    textwrap: false,
    strike: false,
    underline: false,
    color: '#0a0a0a',
    font: {
      name: 'Helvetica',
      size: 10,
      bold: false,
      italic: false,
    },
  },
}
