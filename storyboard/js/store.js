/* VAO Shotbook · Local persistence (IndexedDB, with in-memory fallback).
 * Projects never leave the device. Preferences use localStorage.
 */
(function () {
  'use strict';
  var VAO = (window.VAO = window.VAO || {});
  var DB = 'vao-shotbook', STORE = 'kv', dbp = null, mem = {}, ok = true;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise(function (resolve, reject) {
      try {
        if (!window.indexedDB) throw new Error('IndexedDB unavailable');
        var req = window.indexedDB.open(DB, 1);
        req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
        req.onblocked = function () { reject(new Error('blocked')); };
      } catch (err) { reject(err); }
    });
    dbp.catch(function () { ok = false; });
    return dbp;
  }
  function tx(mode, fn) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(STORE, mode), st = t.objectStore(STORE), out;
        var r = fn(st);
        if (r) r.onsuccess = function () { out = r.result; };
        t.oncomplete = function () { resolve(out); };
        t.onerror = function () { reject(t.error); };
        t.onabort = function () { reject(t.error); };
      });
    });
  }
  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

  VAO.Store = {
    get persistent() { return ok; },
    get: function (k) {
      return tx('readonly', function (s) { return s.get(k); })
        .then(function (v) { return v === undefined ? clone(mem[k]) : v; })
        .catch(function () { ok = false; return clone(mem[k]); });
    },
    set: function (k, v) {
      mem[k] = clone(v);
      return tx('readwrite', function (s) { return s.put(v, k); })
        .then(function () { return true; })
        .catch(function () { ok = false; return false; });
    },
    del: function (k) {
      delete mem[k];
      return tx('readwrite', function (s) { return s.delete(k); }).catch(function () {});
    },
    pref: function (k, v) {
      try {
        if (v === undefined) return JSON.parse(window.localStorage.getItem('vao-shotbook:' + k));
        window.localStorage.setItem('vao-shotbook:' + k, JSON.stringify(v));
      } catch (err) { /* storage blocked: preferences are optional */ }
      return null;
    },
  };
})();
