/**
 * idbpromises-jquery.js
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
 * onError   => method().fail()
 * onSuccess => method().done()
 * onEnd     => method().done()
 * onItem    => method().progress()
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
            return new Promise(function(resolve, reject) {
                var options = this._options;
                options.onStoreReady = function() {
                    resolve();
                };
                options.onError = function(err) {
                    reject(err);
                };
                this.idbstore = new IDBStore(options);
            });


        },

        deleteDatabase: function() {
            return this.idbstore.deleteDatabase();
        },

        put: function(key, value) {
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                if (this._options.keyPath !== null) {
                    // in-line keys: one arg only (key == value)
                    this.idbstore.put(key, onSuccess, onError);
                } else {
                    // out-of-line keys: two args
                    this.idbstore.put(key, value, onSuccess, onError);
                }

            });

        },

        get: function(key) {
            return new Promise(function(resolve, reject) {

                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                this.idbstore.get(key, onSuccess, onError);
            });

        },

        remove: function(key) {
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                this.idbstore.remove(key, onSuccess, onError);

            });



        },

        batch: function(dataArray) {
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                this.idbstore.batch(dataArray, onSuccess, onError);
            });



        },

        getAll: function() {
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                this.idbstore.getAll(onSuccess, onError);
            });



        },

        clear: function() {
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                var onError = function(err) {
                    reject(err);
                };

                this.idbstore.clear(onSuccess, onError);
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

        iterate: function(options) {
            options = options || {};
            return new Promise(function(resolve, reject) {
                options.onEnd = function(result) {
                    resolve(result);
                };
                options.onError = function(err) {
                    reject(err);
                };
                var onItem = function(item) {
                    notify(item);
                };

                this.idbstore.iterate(onItem, options);
            });



        },

        query: function(options) {
            options = options || {};
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                options.onError = function(err) {
                    reject(err);
                };

                this.idbstore.query(onSuccess, options);
            });



        },

        count: function(options) {
            options = options || {};
            return new Promise(function(resolve, reject) {
                var onSuccess = function(result) {
                    resolve(result);
                };
                options.onError = function(err) {
                    reject(err);
                };

                this.idbstore.count(onSuccess, options);

            });



        },

        makeKeyRange: function(options) {
            return this.idbstore.makeKeyRange(options);
        }

    };

    return IDBPromises;

}, this);