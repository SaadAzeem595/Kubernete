const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the URL from the ConfigMap or use a default
const dbURL = process.env.MONGODB_URL || "mongodb://service-mongodb:27017/mydb";

console.log("Connecting to MongoDB at:", dbURL);

// Connect to MongoDB (ONLY ONCE)
mongoose.connect(dbURL)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.log("MongoDB Connection Error:", err));

// Create a Mongoose model
const Email = mongoose.model('Email', {
    email: String,
});
// ... rest of your code (Middlewares and Routes)

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/add-email', async (req, res) => {
    const { email } = req.body;
    try {
        const newEmail = new Email({ email });
        await newEmail.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding email');
    }
});

app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find({});
        res.json(emails);
    } catch (error) {
        res.status(500).send('Error fetching emails');
    }
});

app.get('/exit', (req, res) => {
    // Perform actions to stop the server or any other desired actions
    res.send('Server stopped');
    process.exit(0); // This stops the server (not recommended in production)
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
