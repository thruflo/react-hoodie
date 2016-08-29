const lodash_debounce = require('lodash.debounce')
const constants = require('./constants')

exports.warn = function () {
  console.warn(arguments)
}

exports.debounce = function (f) {
  return lodash_debounce(f, constants.DEBOUNCE_DELAY, {
    maxWait: constants.DEBOUNCE_CUTOFF
  })
}

exports.mimic = function (store) {
  var d = {}
  constants.STORE_METHODS.forEach(function (k) {
    if (k in store) {
      d[k] = store[k].bind(store)
    }
  })
  return d
}
