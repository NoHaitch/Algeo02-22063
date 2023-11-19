process.setMaxListeners(Infinity);
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const PORT = 8080;
const DATA_FILE_PATH1 = path.join(__dirname, "uploads", "image.json");
const DATA_FILE_PATH2 = path.join(__dirname, "uploads", "tempdataset.json");
const DATASET_PATH = path.join(__dirname, "uploads", "dataset");

const { exec } = require("child_process");
const compiledProgramTexture = "textureSearch.exe";
const compiledProgramColor = "colorSearch.exe";

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

      // Check if the last uploaded image is the same as the current one
      if (
        existingImages.length > 0 &&
        existingImages[0] === lastUploadedFileName
      ) {
        return res.json({
          message: "File is the same as the last uploaded image",
        });
      }

      // Delete the image before the newly uploaded image
      if (existingImages.length > 0) {
        const imageToDelete = existingImages[0];
        await fs.rm(path.join(__dirname, "uploads", imageToDelete));
      }

      // Insert the current image at the beginning of the list
      existingImages.unshift(lastUploadedFileName);

      // Store the updated list in the JSON file
      await fs.writeFile(uploadedImagesPath, JSON.stringify(existingImages));

      // Create a duplicate of the uploaded image with the name 'query.jpg'
      const queryImageDestination = path.join(
        __dirname,
        "uploads",
        "query.jpg"
      );
      await fs.copyFile(
        path.join(__dirname, "uploads", lastUploadedFileName),
        queryImageDestination
      );
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
  
  try{
    await fs.rm(path.join(__dirname, "cache1.json"));
  } catch(error){
  }
  try{
    await fs.rm(path.join(__dirname, "cache2.json"));
  } catch(error){
  }
  try{
    await fs.rm(path.join(__dirname, "cache3.json"));
  } catch(error){
  }
  try{
    await fs.rm(path.join(__dirname, "cache4.json"));
  } catch(error){
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

app.post("/api/reset-temp", async (req, res) => {
  // this has not been fixed
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
    await fs.rm(
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
    await fs.access(DATA_FILE_PATH1);
  } catch (error) {
    await fs.writeFile(DATA_FILE_PATH1, "[]");
  }
  try {
    const base64Data = req.body.screenshot;
    if (!base64Data || typeof base64Data !== "string") {
      throw new Error("Invalid screenshot data provided.");
    }

    // Check if the base64Data starts with the data URI prefix
    const dataUriPrefix = "data:image/png;base64,";
    if (!base64Data.startsWith(dataUriPrefix)) {
      throw new Error("Invalid data URI format.");
    }

    // Remove the data URI prefix
    const base64Image = base64Data.slice(dataUriPrefix.length);

    const timestamp = Date.now();
    const fileName = `screenshot_${timestamp}.png`;

    const filePath = path.join(__dirname, "uploads", fileName);

    // Write the base64 data to the file system
    await fs.writeFile(filePath, base64Image, { encoding: "base64" });

    const uploadedImagesPath = path.join(__dirname, "uploads", "image.json");

    const existingImagesData = await fs.readFile(uploadedImagesPath, "utf-8");
    const existingImages = existingImagesData
      ? JSON.parse(existingImagesData)
      : [];

    // Check if the last uploaded image is the same as the current one
    if (existingImages.length > 0 && existingImages[0] === fileName) {
      return res.json({
        message: "File is the same as the last uploaded image",
      });
    }

    // Delete the last uploaded image if it exists
    if (existingImages.length > 0) {
      const imageToDelete = existingImages[0];
      await fs.rm(path.join(__dirname, "uploads", imageToDelete));
    }

    // Insert the current image at the beginning of the list
    existingImages.unshift(fileName);

    // Create a duplicate of the uploaded image with the name 'query.jpg'
    const queryImageDestination = path.join(__dirname, "uploads", "query.jpg");
    await fs.copyFile(filePath, queryImageDestination);

    // Store the updated list in the JSON file
    await fs.writeFile(uploadedImagesPath, JSON.stringify(existingImages));

    res.json({
      message: "Screenshot uploaded successfully",
      fileName,
      filePath,
    });
  } catch (error) {
    console.error("screenshot failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

let isTextureSearchInProgress = false;
let isColorSearchInProgress = false;

app.post("/api/search-texture", async (req, res) => {
  // If the texture search is already in progress, return a response
  if (isTextureSearchInProgress) {
    return res
      .status(400)
      .json({ error: "Texture search is already in progress" });
  }

  try {
    const childProcess = exec(
      compiledProgramTexture,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          // Handle error if needed
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          // Handle stderr if needed
        }

        // Reset the flag after the texture search is complete
        isTextureSearchInProgress = false;

        // Notify the client about the completion
        res.json({});
      }
    );

    // Handle the child process events (e.g., close, exit)
    childProcess.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
    });

    childProcess.on("exit", (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  } catch (error) {
    console.error(error);
    // Reset the flag in case of an error
    isTextureSearchInProgress = false;
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/search-color", async (req, res) => {
  // If the color search is already in progress, return a response
  if (isColorSearchInProgress) {
    return res
      .status(400)
      .json({ error: "Texture search is already in progress" });
  }

  try {
    const childProcess = exec(compiledProgramColor, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        // Handle error if needed
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        // Handle stderr if needed
      }

      // Reset the flag after the texture search is complete
      isColorSearchInProgress = false;

      // Notify the client about the completion
      res.json({});
    });

    // Handle the child process events (e.g., close, exit)
    childProcess.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
    });

    childProcess.on("exit", (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  } catch (error) {
    console.error(error);
    // Reset the flag in case of an error
    isColorSearchInProgress = false;
    res.status(500).json({ error: "Internal Server Error" });
  }
});
