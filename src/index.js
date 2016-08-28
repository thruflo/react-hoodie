import Hoodie from 'hoodie'

import Provider from './provider'
import bindToState from './plugin'

Hoodie.extend(
  function (hoodie) {
    hoodie.bind = bindToState.bind(hoodie, true);
    hoodie.bindAll = bindToState.bind(hoodie, false);
  }
);

export default Hoodie;
export const Provider = Provider;
