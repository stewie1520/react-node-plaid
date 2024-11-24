import mongoose from "mongoose";

const syncMetaSchema = new mongoose.Schema({
  link_id: {
    type: 'ObjectId',
    required: true,
    ref: 'Link',
  },
  initial_cursor: {
    type: String,
    required: true,
  },
  next_cursor: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

/**
 * @description Store the current cursor for next sync
 */
export const SyncMetaModel = mongoose.model("SyncMeta", syncMetaSchema);
