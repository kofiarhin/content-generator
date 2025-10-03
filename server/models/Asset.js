const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema(
  {
    type: { type: String },
    tone: { type: String },
    lang: { type: String },
    brand: { type: String },
    wordsTarget: { type: Number },
    refineHistory: {
      type: [
        new mongoose.Schema(
          {
            operation: { type: String },
            timestamp: { type: Date, default: Date.now }
          },
          { _id: false }
        )
      ],
      default: () => []
    }
  },
  { _id: false }
);

const assetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    cta: { type: String },
    tags: { type: [String], default: () => [] },
    meta: { type: metaSchema, default: () => ({}) },
    favorite: { type: Boolean, default: false }
  },
  { timestamps: true }
);

assetSchema.index({ userId: 1, createdAt: -1 });
assetSchema.index({ userId: 1, type: 1 });
assetSchema.index({ userId: 1, favorite: 1 });

module.exports = mongoose.model('Asset', assetSchema);
