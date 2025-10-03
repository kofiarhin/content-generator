const mongoose = require('mongoose');

const contentPreferencesSchema = new mongoose.Schema(
  {
    length: { type: String },
    readingLevel: { type: String, default: 'Year 8–9' },
    ctaStyle: { type: String, default: 'soft nudge → subscribe & save' },
    keywords: [{ type: String }]
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    niche: { type: String, required: true },
    audience: { type: String, required: true },
    primaryChannels: [{ type: String, required: true }],
    brandVoice: { type: String, required: true },
    contentPreferences: { type: contentPreferencesSchema, default: () => ({}) },
    goals: [{ type: String, required: true }],
    constraints: { type: [String], default: ['no clickbait', 'authentic tone'] }
  },
  { timestamps: true }
);

profileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Profile', profileSchema);
