import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  type: { type: String, default: '' },
  path: { type: String, required: true },
  storagePath: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedByName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  shared: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('File', fileSchema);
