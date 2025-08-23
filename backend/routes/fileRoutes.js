const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const File = require("../models/File")
const nodemailer = require('nodemailer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Upload a file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { sender_email, receiver_email } = req.body;
    const expiry_time = moment().add(24, 'hours').toDate();

    const file = await File.create({
      uuid: uuidv4(),
      filename: req.file.originalname,
      file_path: req.file.path,
      upload_time: new Date(),
      expiry_time,
      sender_email,
      receiver_email
    });

    // Send email if receiver_email exists
    if (receiver_email) {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const link = `${process.env.BASE_URL}/api/files/download/${file.uuid}`;
      await transporter.sendMail({
        from: sender_email || process.env.EMAIL_USER,
        to: receiver_email,
        subject: 'File Share Link',
        text: `You have been sent a file: ${link} \nLink will expire in 24 hours.`
      });
    }

    res.json({ downloadLink: `/api/files/download/${file.uuid}`, uuid: file.uuid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download the file
router.get('/download/:uuid', async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) return res.status(404).send('File expired or not found!');
    if (new Date() > file.expiry_time) {
      // Optional: delete file from DB and disk
      await File.deleteOne({ uuid: file.uuid });
      return res.status(410).send('File has expired.');
    }

    // Track downloads
    file.download_count++;
    await file.save();

    res.download(path.resolve(file.file_path), file.filename);
  } catch (err) {
    res.status(500).send('Error downloading file');
  }
});

// Get file info for frontend (countdown)
router.get('/info/:uuid', async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) return res.status(404).send('File expired or not found!');
  res.json({
    filename: file.filename,
    upload_time: file.upload_time,
    expiry_time: file.expiry_time,
    download_count: file.download_count
  });
});

module.exports = router;
