const Profile = require('../models/Profile');

const resolveUserId = (req) => req.user?.id || req.body.userId || req.query.userId;

const createOrUpdateProfile = async (req, res, next) => {
  const userId = resolveUserId(req);

  if (!userId) {
    return res.status(400).json({ message: 'User context is required' });
  }

  try {
    const update = { ...req.body, userId };
    const profile = await Profile.findOneAndUpdate(
      { userId },
      update,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );

    return res.status(200).json(profile);
  } catch (error) {
    return next(error);
  }
};

const getProfile = async (req, res, next) => {
  const userId = resolveUserId(req);

  if (!userId) {
    return res.status(400).json({ message: 'User context is required' });
  }

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrUpdateProfile,
  getProfile
};
