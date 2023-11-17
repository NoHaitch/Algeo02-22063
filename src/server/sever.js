process.setMaxListeners(100);
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const addon = require("./build/Release/addon");
const { fileURLToPath } = require("url");
const { dirname } = require("path");

const app = express();
const PORT = 8080;
const DATA_FILE_PATH1 = path.join(__dirname, "uploads", "image.json");
const DATA_FILE_PATH2 = path.join(__dirname, "uploads", "tempdataset.json");
const DATASET_PATH = path.join(__dirname, "uploads", "dataset");

function runTextureSearchTest() {
  const imagePath = 'path/to/your/image.jpg'; // Replace with the actual image path
  const result = addon.textureSearch(imagePath);

  console.log(`Texture search for ${imagePath}`);
  console.log(`Time taken: ${result} milliseconds`);
}
runTextureSearchTest();


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Allows incoming requests from any IP using cors
app.use(cors());

/* HOST STATIC IMG */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/dataset",
  express.static(path.join(__dirname, "uploads/dataset"))
);

/* FILTER IMG FILES */
const imageFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false); // Reject the file
  }
};

/* MULTER */
const imgStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const dataStorage = multer.diskStorage({
  destination: async function (req, file, callback) {
    const datasetFolder = path.join(__dirname, "uploads", "tempdataset");

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
  },
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
  // Check for the directory, if not found then create it
  try {
    await fs.access(DATA_FILE_PATH1);
  } catch (error) {
    await fs.writeFile(DATA_FILE_PATH1, "[]");
  }

  try {
    const uploadedImagesPath = path.join(__dirname, "uploads", "image.json");
    const lastUploadedFileName = req.files?.[0]?.originalname;

    if (lastUploadedFileName) {
      // Read the existing uploaded images from the JSON file
      const existingImagesData = await fs.readFile(uploadedImagesPath, "utf-8");
      const existingImages = existingImagesData
        ? JSON.parse(existingImagesData)
        : [];

      // Delete the image before the newly uploaded image
      if (existingImages.length > 1) {
        const imageToDelete = existingImages[existingImages.length - 2];
        await fs.unlink(path.join(__dirname, "uploads", imageToDelete));
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
    await fs.access(DATA_FILE_PATH2);
  } catch (error) {
    // The file doesn't exist, create it with an empty array
    await fs.writeFile(DATA_FILE_PATH2, "[]");
  }
  try {
    const uploadedDatasetPath = path.join(
      __dirname,
      "uploads",
      "tempdataset.json"
    );
    const lastUploadedFileNames = req.files.map((file) => file.originalname);

    // Read the existing dataset information from the JSON file
    const existingDatasetData = await fs.readFile(uploadedDatasetPath, "utf-8");
    const existingDataset = existingDatasetData
      ? JSON.parse(existingDatasetData)
      : [];

    // Append the current dataset files to the list of uploaded files
    existingDataset.push(...lastUploadedFileNames);

    // Store the updated list in the dataset JSON file
    await fs.writeFile(uploadedDatasetPath, JSON.stringify(existingDataset));

    res.json({ mesnsage: "Files uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* Delete the third image from the newest uploaded img */
app.delete("/api/delete-last-image", async (req, res) => {
  try {
    // Read the existing uploaded images from the JSON file
    const uploadedImagesPath = path.join(__dirname, "uploads", "/image.json");
    const existingImagesData = await fs.readFile(uploadedImagesPath, "utf-8");
    const existingImages = existingImagesData
      ? JSON.parse(existingImagesData)
      : [];

    if (existingImages.length > 0) {
      // Get the last uploaded image name
      const lastUploadedFileName = existingImages.pop();

      // Delete the last uploaded image
      await fs.unlink(path.join(__dirname, "uploads", lastUploadedFileName));

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

/* Refresh dataset */
app.post("/api/refresh-dataset", async (req, res) => {
  try {
    // Check if the dataset folder exists, and create it if it doesn't
    await fs.access(DATASET_PATH);
  } catch (error) {
    await fs.mkdir(DATASET_PATH);
  }

  try {
    // Check if the dataset folder exists, and create it if it doesn't
    await fs.access(DATASET_PATH);
    await fs.rm(DATASET_PATH, { recursive: true }, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "Folder deleted successfully" });
      }
    });
  } catch (error) {
    await fs.mkdir(DATASET_PATH);
  }

  try {
    // Rename the "tempdataset" folder to "dataset"
    await fs.rename(
      path.join(__dirname, "uploads", "tempdataset"),
      path.join(__dirname, "uploads", "dataset")
    );
    // Rename the json
    await fs.rename(
      path.join(__dirname, "uploads", "tempdataset.json"),
      path.join(__dirname, "uploads", "dataset.json")
    );
    res.json({ message: "Folder renamed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/reset-temp", async (req, res) => {
  const tempdatasetPath = path.join(__dirname, "uploads", "tempdataset");
  try {
    await fs.access(tempdatasetPath);
    await fs.rm(tempdatasetPath, { recursive: true }, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "Folder deleted successfully" });
      }
    });
  } catch (error) {}

  try {
    await fs.access(path.join(__dirname, "uploads", "tempdataset.json"));
    await fs.unlink(
      path.join(__dirname, "uploads", "tempdataset.json"),
      (error) => {
        if (error) {
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json({ message: "Folder deleted successfully" });
        }
      }
    );
  } catch (error) {}
});

app.post("/api/upload-screenshot", async (req, res) => {
  try {
    const base64Data = req.body.screenshot;
    if (!base64Data) {
      throw new Error("No screenshot data provided.");
    }

    const timestamp = Date.now();
    const fileName = `screenshot_${timestamp}.jpg`;
    const filePath = path.join(__dirname, "uploads", fileName);

    // Write the base64 data to the file system
    await fs.writeFile(filePath, base64Data, { encoding: "base64" });

    // Call the /api/upload-img endpoint internally to handle the image upload
    await fetch("http://localhost:8080/api/upload-img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file: fileName }),
    });

    res.json({ message: "Screenshot uploaded successfully", fileName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/search-texture", async (req, res) => {
  try {
    const time = myLibrary.textureSearch();
    res.json({ time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/search-color", async (req, res) => {
  try {
    const time = myLibrary.colorSearch();
    res.json({ time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
