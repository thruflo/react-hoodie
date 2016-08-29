const HoodieClient = require('@hoodie/client')
const util = require ('./util')

const setState = function (component, key, value) {
  var s = {}
  s[key] = value
  return component.setState(s)
}
const clearState = function (component, key, is_obj) {
  var v = is_obj ? {} : []
  return setState(component, key, v)
}

// Query hoodie for data and update component state with the result.
const findAndSetState = function (store, component, key, type, is_obj) {
  var handle = setState.bind(null, component, key)
  var find = is_obj ? store.find : store.findAll
  return find(type).then(handle, util.warn)
}

// Listen for changes to a hoodie type (can be a string or a query
// function -- see the `hoodie.store.findAll` docs). When anything
// relevant happens, call the handler function.
const watchChanges = function (store, type, handle, clear) {
  var key, listener, dbl
  if (typeof(type) === 'string') {
    key = 'change' // type + ':change'
    listener = function (eventName, changedObject) {
      if (changedObject.type === type) {
        return handle(changedObject)
      }
    }
  }
  else if (typeof(type) === 'function') {
    key = 'change'
    listener = function (eventName, changedObject) {
      if (type(changedObject)) {
        handle(changedObject)
      }
    }
  }
  else {
    throw new Error({
      'msg': '`type` must be a string hoodie type or a map / query function',
      'type': type
    })
  }
  dbl = util.debounce(listener)
  store.on(key, dbl)
  store.on('clear', clear)
  return function () {
    store.off('clear', clear)
    store.off(key, dbl)
  }
}
const fetchAndWatch = function (store, component, type, key, is_obj) {
  var fetch, clear, watch
  fetch = findAndSetState.bind(null, store, component, key, type, is_obj)
  clear = clearState.bind(null, component, key, is_obj)
  watch = watchChanges.bind(null, store, type, fetch, clear)
  return fetch().then(watch)
}

// Bind a react state property to a hoodie object or collection. Returns an
// object which provides the hoodie store api (where appropriate, scoped to
// the type) *and* an `unbind` method to unbind the event listeners.
const bindToState = function (is_obj, component, type, key, store) {
  var api, off, scoped_store, type_is_string
  type_is_string = typeof(type) === 'string'
  scoped_store = store || type_is_string ? this.store(type) : this.store
  store = store || this.store
  fetchAndWatch(store, component, type, key, is_obj).then(function (unbind) {
    off = unbind
  })
  function unbind () {
    if (typeof(off) === 'undefined') {
      throw new Error('XXX race condition: `fetch().then()` hasn\'t resolved yet o_O.')
    }
    off()
  }
  api = util.mimic(scoped_store)
  api.unbind = unbind
  return api
}

exports.bindToState = bindToState
exports.Hoodie = function (options) {
  var hoodie = new HoodieClient(options)
  hoodie.plugin({
    bind: bindToState.bind(hoodie, true),
    bindAll: bindToState.bind(hoodie, false)
  })
  return hoodie
}
