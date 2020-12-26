/* global window */
import en from './en';

let $lang = 'en';
const $messages = {
  en,
};

export function tf(key) {
  return $messages[$lang][key]
}
