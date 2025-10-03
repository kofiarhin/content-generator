const Asset = require('../models/Asset');

const resolveUserId = (req) => req.user?.id || req.query.userId;

const listAssets = async (req, res, next) => {
  const userId = resolveUserId(req);
  const { page = 1, limit = 20 } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User context is required' });
  }

  try {
    const query = { userId };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Asset.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Asset.countDocuments(query)
    ]);

    return res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (error) {
    return next(error);
  }
};

const getAsset = async (req, res, next) => {
  const userId = resolveUserId(req);
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User context is required' });
  }

  try {
    const asset = await Asset.findOne({ _id: id, userId });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    return res.json(asset);
  } catch (error) {
    return next(error);
  }
};

const toggleFavorite = async (req, res, next) => {
  const userId = resolveUserId(req);
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User context is required' });
  }

  try {
    const asset = await Asset.findOne({ _id: id, userId });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    asset.favorite = !asset.favorite;
    await asset.save();

    return res.json(asset);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listAssets,
  getAsset,
  toggleFavorite
};
