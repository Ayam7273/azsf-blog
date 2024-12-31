const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "news.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

// Upload link
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
            // Our image upload path
            res.json(`uploads/${imagename}`);
        }
    })
})

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.use((req, res) => {
    res.json("404");
})

const PORT = 3000; // Define the port

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`); // Log the local server address
});
