const cache = require('memory-cache');
const memCache = new cache.Cache();

module.exports = {
    get: key => { return memCache.get(key) },

    set: (key, value) => {
        return memCache.put(key, value, 60 * 160 * 1000, (key) => {
            memCache.del(key);
        })
    },

    del: key => {return memCache.del(key)},

    keys: () => {return memCache.keys()}
}