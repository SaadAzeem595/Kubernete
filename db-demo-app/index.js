const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const dbURL = process.env.MONGODB_URL;

console.log("Connecting to:", dbURL);

// 🔥 Better connection (with retry)
const connectDB = async () => {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB Connected Successfully! ✅');
  } catch (err) {
    console.error('MongoDB connection error ❌:', err);
    process.exit(1); // 🔥 stop app if DB fails
  }
};

connectDB();

// Schema
const emailSchema = new mongoose.Schema({
  email: String,
});

const Email = mongoose.model('Email', emailSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/add-email', async (req, res) => {
  try {
    const newEmail = new Email({ email: req.body.email });
    await newEmail.save();
    console.log("Saved:", req.body.email);
    res.send("Email saved successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving email");
  }
});

app.get('/emails', async (req, res) => {
  const data = await Email.find();
  res.json(data);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});