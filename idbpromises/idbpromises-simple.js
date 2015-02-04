/**
 * idbpromises-simple.js
 *
 * Copyright (c) 2013 Jens Arps
 * http://jensarps.de
 *
 * Licensed under the MIT (X11) license
 *
 * Creates an IDBPromises() constructor that wraps
 * all async methods in promises.
 *
 * IDBPromises exposes all methods that IDBWrapper does and
 * adds an open() method.
 *
 * Whenever you'd have to pass a callback like onSuccess,
 * onError, onEnd and onItem to an IDBWrapper method,
 * just don't do it with IDBPromises. Those methods return
 * a promise now, this is how callbacks correspond to
 * the promise events:
 *
 * onError   => method().catch()
 * onSuccess => method().then()
 */
(function(name, definition, global) {
    if (typeof define === 'function') {
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    } else {
        global[name] = definition();
    }
})('IDBPromises', function() {

    var IDBPromises = function(options) {
        this._options = options;
    };

    IDBPromises.prototype = {

        open: function() {
            var global = this;
            return new Promise(function(resolve, reject) {
                var options = global._options;
                options.onStoreReady = function() {
                    resolve();
                };
                options.onError = function(err) {
                    reject(err);
                };
                global.idbstore = new IDBStore(options);
            });


        },

        deleteDatabase: function() {
            return global.idbstore.deleteDatabase();
        },

        put: function(key, value) {
            var global = this;
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                if (global._options.keyPath !== null) {
                    // in-line keys: one arg only (key == value)
                    global.idbstore.put(key, onSuccess, onError);
                } else {
                    // out-of-line keys: two args
                    global.idbstore.put(key, value, onSuccess, onError);
                }

            });

        },

        get: function(key) {
            var global = this;
            return new Promise(function(resolve, reject) {

                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                global.idbstore.get(key, onSuccess, onError);
            });

        },

        remove: function(key) {
            var global = this;
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                global.idbstore.remove(key, onSuccess, onError);

            });



        },

        batch: function(dataArray) {
            var global = this;
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                global.idbstore.batch(dataArray, onSuccess, onError);
            });



        },

        getAll: function() {
            var global = this;
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                global.idbstore.getAll(onSuccess, onError);
            });



        },

        clear: function() {
            var global = this;
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                global.idbstore.clear(onSuccess, onError);
            });



        },

        getIndexList: function() {
            return this.idbstore.getIndexList();
        },

        hasIndex: function(indexName) {
            return this.idbstore.hasIndex(indexName);
        },

        normalizeIndexData: function(indexData) {
            return this.idbstore.normalizeIndexData(indexData);
        },

        indexComplies: function(actual, expected) {
            return this.idbstore.indexComplies(actual, expected);
        },

        iterate: function(options, onItemCallback) {
            var global = this;
            options = options || {};
            return new Promise(function(resolve, reject) {
                options.onEnd = function(result) {
                    var data = {};
                    data.result = result;
                    data.item = null;
                    data.cursor = null;

                    resolve(data);
                };
                options.onError = function(err) {
                    reject(err);
                };
                var onItem = function(item, cursor) {
                    var data = {};
                    data.result = null;
                    data.item = item;
                    data.cursor = cursor;
                    onItemCallback(data);
                };

                global.idbstore.iterate(onItem, options);
            });



        },

        query: function(options) {
            var global = this;
            options = options || {};
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    debugger
                    resolve(result);
                };
                options.onError = function(err) {
                    reject(err);
                };

                global.idbstore.query(onSuccess, options);
            });



        },

        count: function(options) {
            debugger;
            var global = this;
            options = options || {};
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result, cursorTransaction);
                };
                options.onError = function(err) {
                    reject(err);
                };

               var cursorTransaction = global.idbstore.count(onSuccess, options);

            });



        },

        makeKeyRange: function(options) {
            return this.idbstore.makeKeyRange(options);
        },

        putBatch: function (arr) {
            var batchOps = [];

            for (var i = 0; i < arr.length; i++) {
              batchOps.push({ type: 'put', value: arr[i] });
            }


            return this.batch(batchOps);
          }

    };

    return IDBPromises;

}, this);