const Profile = require('../models/Profile');
const Asset = require('../models/Asset');
const generationService = require('../services/generationService');

const resolveUserId = (req) => req.user?.id || req.body.userId || req.query.userId;

const persistAssets = async ({ userId, response }) => {
  const docs = response.assets.map((asset) => ({
    userId,
    type: response.meta.type,
    title: asset.title,
    body: asset.body,
    cta: asset.cta,
    tags: asset.tags || [],
    meta: { ...response.meta, refineHistory: response.meta?.refineHistory || [] }
  }));

  if (docs.length === 0) {
    return [];
  }

  const created = await Asset.insertMany(docs, { ordered: false });
  return created;
};

const ensureProfile = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    const error = new Error('Profile is required before generating content');
    error.status = 412;
    throw error;
  }
  return profile;
};

const generateAsset = async (req, res, next) => {
  const userId = resolveUserId(req);

  if (!userId) {
    return res.status(400).json({ message: 'User context is required' });
  }

  try {
    const profile = await ensureProfile(userId);
    const response = await generationService.generateContent({
      userId,
      profile,
      request: req.body
    });

    const assets = await persistAssets({ userId, response });

    return res.status(201).json({ response, assets });
  } catch (error) {
    return next(error);
  }
};

const generateBatch = async (req, res, next) => {
  const userId = resolveUserId(req);
  const { requests } = req.body || {};

  if (!userId) {
    return res.status(400).json({ message: 'User context is required' });
  }

  if (!Array.isArray(requests) || requests.length === 0) {
    return res.status(400).json({ message: 'requests array is required' });
  }

  if (requests.length > 10) {
    return res.status(400).json({ message: 'requests cannot exceed 10 items per call' });
  }

  try {
    const profile = await ensureProfile(userId);
    const responses = await generationService.generateBatch({ userId, profile, requests });

    const createdAssets = [];
    for (const response of responses) {
      // eslint-disable-next-line no-await-in-loop
      const assets = await persistAssets({ userId, response });
      createdAssets.push(...assets);
    }

    return res.status(201).json({ responses, assets: createdAssets });
  } catch (error) {
    return next(error);
  }
};

const refineAsset = async (req, res, next) => {
  const userId = resolveUserId(req);
  const { id } = req.params;
  const { operation } = req.body || {};

  if (!userId) {
    return res.status(400).json({ message: 'User context is required' });
  }

  if (!operation) {
    return res.status(400).json({ message: 'operation payload is required' });
  }

  try {
    const asset = await Asset.findOne({ _id: id, userId });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const profile = await ensureProfile(userId);
    const response = await generationService.refineContent({
      userId,
      profile,
      asset,
      operation
    });

    const updatedAsset = asset;
    const refinedAsset = response.assets[0];
    if (refinedAsset) {
      updatedAsset.title = refinedAsset.title;
      updatedAsset.body = refinedAsset.body;
      updatedAsset.cta = refinedAsset.cta;
      updatedAsset.tags = refinedAsset.tags || [];
      const history = Array.isArray(updatedAsset.meta?.refineHistory)
        ? updatedAsset.meta.refineHistory
        : [];
      updatedAsset.meta = {
        ...response.meta,
        refineHistory: [
          ...history,
          {
            operation: operation.type || 'refine',
            timestamp: new Date()
          }
        ]
      };
    }

    await updatedAsset.save();

    return res.json({ response, asset: updatedAsset });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateAsset,
  generateBatch,
  refineAsset
};
