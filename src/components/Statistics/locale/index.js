/* global window */
import en from './en';

const $lang = 'en';
const $messages = {
  en,
};

export function tf(key) {
  return $messages[$lang][key];
}
