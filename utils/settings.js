// Wraps store so client.settings.xyz works naturally
// Writing saves to JSONBin automatically

const defaults = require('../settings');
const store    = require('./store');

module.exports = new Proxy({}, {
  get(_, key) {
    if (key === 'isOverridden') return (k) => k in store.getOverrides();
    if (key === 'getOverrides') return () => store.getOverrides();
    if (key === 'getDefault')   return (k) => defaults[k];
    if (key === 'reset')        return (k) => store.delSetting(k);
    return store.getSetting(key, defaults);
  },
  set(_, key, value) {
    store.setSetting(key, value);
    return true;
  },
});
