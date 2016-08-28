import { debouce, mimic, warn } from './util'

// Utility functions to update a component's state.
function setState (component, key, value) {
  var s = {};
  s[key] = value;
  return component.setState(s);
}
function clearState (component, key, is_obj) {
  var v = is_obj ? {} : [];
  return setState(component, key, v);
}

// Query hoodie for data and update component state with the result.
function findAndSetState (store, component, key, type, is_obj) {
  var handle = setState.bind(null, component, key);
  var find = is_obj ? store.find : store.findAll;
  return find(type).then(handle, warn);
};

// Listen for changes to a hoodie type (can be a string or a query
// function -- see the `hoodie.store.findAll` docs). When anything
// relevant happens, call the handler function.
function watchChanges (store, type, handle, clear) {
  var key, listener, dbl;
  if (typeof(type) === 'string') {
    key = type + ':change';
    listener = handle;
  }
  else if (typeof(type) === 'function') {
    key = 'change';
    listener = function (eventName, changedObject) {
      if (type(changedObject)) {
        handle(changedObject);
      }
    };
  }
  else {
    throw new Error({
      'msg': '`type` must be a string hoodie type or a map / query function',
      'type': type
    });
  }
  dbl = debounce(listener);
  store.on(key, dbl);
  store.on('clear', clear);
  return function () {
    store.off('clear', clear);
    store.off(key, dbl);
  }
}
function fetchAndWatch (store, component, type, key, is_obj) {
  var fetch, clear, watch;
  fetch = findAndSetState.bind(null, store, component, key, type, is_obj);
  clear = clearState.bind(null, component, key, is_obj);
  watch = watchChanges.bind(null, store, type, fetch, clear);
  return fetch().then(watch);
}

// Bind a react state property to a hoodie object or collection. Returns an
// object which provides the hoodie store api (where appropriate, scoped to
// the type) *and* an `unbind` method to unbind the event listeners.
function bindToState (is_obj, component, type, key, store) {
  var api, off, scoped_store, type_is_string;
  type_is_string = typeof(type) === 'string';
  scoped_store = store || type_is_string ? this.store(type) : this.store;
  store = store || this.store;
  fetchAndWatch(store, component, type, key, is_obj).then(function (unbind) {
    off = unbind;
  });
  function unbind () {
    if (typeof(off) === 'undefined') {
      throw new Error('XXX race condition: `fetch().then()` hasn\'t resolved yet o_O.');
    }
    off();
  }
  api = mimic(scoped_store);
  api.unbind = unbind;
  return api;
}

export default bindToState
