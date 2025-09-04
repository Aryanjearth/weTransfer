const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRouter');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
const corsOptions = {
  origin: 'https://we-transfer-iota.vercel.app/', // replace with your actual Vercel frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // if you are sending cookies or authorization headers
};

app.use(cors(corsOptions));
mongoose.connect(process.env.MONGO_URI).then(() =>
  console.log('MongoDB connected')
);

app.use('/api/files', fileRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
