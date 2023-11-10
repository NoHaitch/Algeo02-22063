import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE_PATH1 = path.join(__dirname, 'uploads', 'image.json');
const DATA_FILE_PATH2 = path.join(__dirname, 'uploads', 'dataset.json');

// Check if the JSON file exists, and create it if it doesn't
async function ensureJsonFile() {
  try {
    await fs.access(DATA_FILE_PATH1);
  } catch (error) {
    // The file doesn't exist, create it with an empty array
    await fs.writeFile(DATA_FILE_PATH1, '[]');
  }
  try {
    await fs.access(DATA_FILE_PATH2);
  } catch (error) {
    // The file doesn't exist, create it with an empty array
    await fs.writeFile(DATA_FILE_PATH2, '[]');
  }
}
ensureJsonFile();

app.get("/api/home", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Allows incoming requests from any IP using cors
app.use(cors()); 

/* HOST STATIC IMG */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* FILTER IMG FILES */
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpg','image/jpeg', 'image/png', 'image/gif'];
 
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false); // Reject the file
  }
};

/* MULTER */
const imgStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

const dataStorage = multer.diskStorage({
  destination: async function (req, file, callback) {
    const datasetFolder = path.join(__dirname, 'uploads', 'dataset');

    try {
      // Check if the dataset folder exists, and create it if it doesn't
      await fs.access(datasetFolder);
    } catch (error) {
      await fs.mkdir(datasetFolder);
    }

    callback(null, datasetFolder);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

/* DATA INPUT TYPE */
const ImgUpload = multer({
  storage: imgStorage,
  fileFilter: imageFilter,
});

const dataUpload = multer({
  storage: dataStorage,
  fileFilter: imageFilter,
});

/* API ACTIONS */
app.post("/api/upload-img", ImgUpload.array("file"), async (req, res) => {
  try {
    const uploadedImagesPath = path.join(__dirname, 'uploads', 'image.json');
    const lastUploadedFileName = req.files?.[0]?.originalname;

    if (lastUploadedFileName) {
      // Read the existing uploaded images from the JSON file
      const existingImagesData = await fs.readFile(uploadedImagesPath, 'utf-8');
      const existingImages = existingImagesData ? JSON.parse(existingImagesData) : [];

      // Delete the image before the newly uploaded image
      if (existingImages.length > 1) {
        const imageToDelete = existingImages[existingImages.length - 2];
        await fs.unlink(path.join(__dirname, 'uploads', imageToDelete));
        // DELETE THE IMAGE
      }

      // Append the current image to the list of uploaded images
      existingImages.push(lastUploadedFileName);

      // Store the updated list in the JSON file
      await fs.writeFile(uploadedImagesPath, JSON.stringify(existingImages));
    }

    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/api/upload-data", dataUpload.array("file"), async (req, res) => {
  try {
    const uploadedDatasetPath = path.join(__dirname, 'uploads', 'dataset.json');
    const lastUploadedFileNames = req.files.map(file => file.originalname);

    // Read the existing dataset information from the JSON file
    const existingDatasetData = await fs.readFile(uploadedDatasetPath, 'utf-8');
    const existingDataset = existingDatasetData ? JSON.parse(existingDatasetData) : [];

    // Append the current dataset files to the list of uploaded files
    existingDataset.push(...lastUploadedFileNames);

    // Store the updated list in the dataset JSON file
    await fs.writeFile(uploadedDatasetPath, JSON.stringify(existingDataset));

    res.json({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/delete-last-image", async (req, res) => {
try {
  // Read the existing uploaded images from the JSON file
  const uploadedImagesPath = path.join(__dirname, 'uploads', '/uploads/image.json');
  const existingImagesData = await fs.readFile(uploadedImagesPath, 'utf-8');
  const existingImages = existingImagesData ? JSON.parse(existingImagesData) : [];

  if (existingImages.length > 0) {
    // Get the last uploaded image name
    const lastUploadedFileName = existingImages.pop();

    // Delete the last uploaded image
    await fs.unlink(path.join(__dirname, 'uploads', lastUploadedFileName));

    // Store the updated list in the JSON file
    await fs.writeFile(uploadedImagesPath, JSON.stringify(existingImages));

    res.json({ message: "Last uploaded image deleted successfully" });
  } else {
    res.status(404).json({ error: "No uploaded images found" });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
}
});
