const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS || 180);

const store = new Map();

const buildKey = ({ userId, type, hash }) => `${userId}|${type}|${hash}`;

const setCache = ({ key, value }) => {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  store.set(key, { value, expiresAt });
};

const getCache = (key) => {
  const record = store.get(key);
  if (!record) {
    return null;
  }

  if (record.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }

  return record.value;
};

const clearCache = () => {
  store.clear();
};

module.exports = {
  buildKey,
  setCache,
  getCache,
  clearCache
};
