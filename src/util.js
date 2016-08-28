import debounce from '../node_modules/lodash.debounce'
import { DEBOUCE_DELAY, DEBOUNCE_CUTOFF, STORE_METHODS } from './constants'

export function debounce (f) {
  return debounce(f, DEBOUCE_DELAY, {maxWait: DEBOUNCE_CUTOFF})
}

export function mimic (store) {
  var d = {};
  STORE_METHODS.forEach(function (k) {
    if (k in store) {
      d[k] = store[k].bind(store);
    }
  });
  return d;
}

export function warn () {
  console.warn(arguments);
}
