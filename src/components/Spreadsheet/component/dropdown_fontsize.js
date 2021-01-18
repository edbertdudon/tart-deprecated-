import Dropdown from './dropdown';
import { h } from './element';
import { fontSizes } from '../core/font';
import { cssPrefix } from '../config';
import { options } from '../options';

export default class DropdownFontSize extends Dropdown {
  constructor() {
    const nfontSizes = fontSizes.map((it) => h('div', `${cssPrefix}-item`)
      .on('click', () => {
        this.setTitle(`${it.pt}`);
        this.change(it);
      })
      .on('mouseenter', (e) => {
        e.target.style.background = options.style.offcolor;
      })
      .on('mouseleave', (e) => {
        e.target.style.background = '';
      })
      .child(`${it.pt}`));
    super('10', '60px', true, 'bottom-left', ...nfontSizes);
  }
}
