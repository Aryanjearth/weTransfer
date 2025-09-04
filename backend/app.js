const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRouter');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'https://we-transfer-iota.vercel.app',
  'https://we-transfer-5orhf9v4u-aryanjearths-projects.vercel.app',
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));

// Ensure uploads directory exists:
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Created uploads directory');
}

mongoose.connect(process.env.MONGO_URI).then(() =>
  console.log('MongoDB connected')
);

app.use('/api/files', fileRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
