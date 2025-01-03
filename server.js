require('dotenv').config();
const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());
app.use(bodyParser.json()); // To parse JSON bodies in POST requests

// Load credentials from .env
const validUsername = process.env.USERNAME;
const secretKey = process.env.SECRET_KEY;


// Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log(`Received username: ${username}, password: ${password}`);
    console.log(`Expected username: ${validUsername}, secret key: ${secretKey}`);

    if (username !== validUsername) {
        console.error("Username mismatch");
    }

    if (password !== secretKey) {
        console.error("Password mismatch");
    }

    if (username === validUsername && password === secretKey) {
        return res.status(200).json({ success: true });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
});


// Serve news.html at "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "news.html"));
});


// Serve editor.html at "/editor"
app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});


// Upload image endpoint
app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();
    // Image name
    let imagename = date.getDate() + date.getTime() + file.name;
    // Image upload path
    let uploadPath = 'public/uploads/' + imagename;

    // Create upload
    file.mv(uploadPath, (err, result) => {
        if (err) {
            throw err;
        } else {
            // Return the uploaded image path
            res.json(`uploads/${imagename}`);
        }
    });
});

// Handle blog route
app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
