import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 8080;

app.get("/api/home", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.use(cors()); // Allows incoming requests from any IP

// Start by creating some disk storage options:
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imgStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

// Set saved storage options:
const ImgUpload = multer({ storage: imgStorage })

app.post("/api/upload-img", ImgUpload.array("file"), (req, res) => {
    // Sets multer to intercept files named "files" on uploaded form data

    console.log(req.body); // Logs form body values
    console.log(req.files); // Logs any files
    res.json({ message: "File uploaded successfully" });

});

const dataStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, 'uploads/dataset'));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

// Set saved storage options:
const dataUpload = multer({ storage: dataStorage })

app.post("/api/upload-data", dataUpload.array("file"), (req, res) => {
    // Sets multer to intercept files named "files" on uploaded form data

    console.log(req.body); // Logs form body values
    console.log(req.files); // Logs any files
    res.json({ message: "File uploaded successfully" });

});


