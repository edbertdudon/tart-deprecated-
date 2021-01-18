import Dropdown from './dropdown';
import { h } from './element';
import { baseFonts } from '../core/font';
import { cssPrefix } from '../config';
import { options } from '../options';

export default class DropdownFont extends Dropdown {
  constructor() {
    const nfonts = baseFonts.map((it) => h('div', `${cssPrefix}-item`)
      .on('click', () => {
        this.setTitle(it.title);
        this.change(it);
      })
      .on('mouseenter', (e) => {
        e.target.style.background = options.style.offcolor;
      })
      .on('mouseleave', (e) => {
        e.target.style.background = '';
      })
      .child(it.title));
    super(baseFonts[0].title, '160px', true, 'bottom-left', ...nfonts);
  }
}
