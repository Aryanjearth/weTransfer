const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  filename: String,
  file_path: String,
  upload_time: { type: Date, default: Date.now },
  expiry_time: Date,
  sender_email: String,
  receiver_email: String,
  download_count: { type: Number, default: 0 },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports = mongoose.model('File', FileSchema);