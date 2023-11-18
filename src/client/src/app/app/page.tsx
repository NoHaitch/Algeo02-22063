"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import GetAllImgItems from "@/components/getAllImgItems";
import { saveAs } from "file-saver";
import DatasetNoquery from "../../../../server/uploads/dataset.json";
import ImgQuery from "../../../../server/uploads/image.json";

export default function App() {
  const imgCount = DatasetNoquery.length;

  const imgInputRef = useRef<HTMLInputElement>(null);
  const datasetInputRef = useRef<HTMLInputElement>(null);
  const currentImgShownRef = useRef<HTMLImageElement>(null);
  const currentImgLabelRef = useRef<HTMLLabelElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const [toggleColorTexture, setToggleColorTexture] = useState<boolean>(false);
  const [toggleCamera, setToggleCamera] = useState<boolean>(true);
  const [toggleCapture, setToggleCapture] = useState<boolean>(false);
  const [toggleAutoSearch, setToggleAutoSearch] = useState<boolean>(true);
  const [havequery, setHavequery] = useState<boolean>(false);
  const [isSearching, setIsSeaching] = useState<boolean>(false);
  const [captureInterval, setCaptureInterval] = useState<number>(5);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [webcamError, setWebcamError] = useState<boolean>(false);
  const [currentData, setData] = useState({
    selectedDataset: "",
    image: "",
    dataset: "",
    timeSearch: -1,
  });

  const [isUploading, setIsUploading] = useState(false);

  /* UPLOADING FILES */
  const handleImgUpload = async () => {
    const imgInput = imgInputRef.current;
    const currentImgShown = currentImgShownRef.current;
    const currentImgLabel = currentImgLabelRef.current;
    const file = imgInput?.files?.[0];

    if (!file) {
      createDangerAlert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8080/api/upload-img", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();

      if (response.ok) {
        console.log(result);
        if (currentImgShown) {
          currentImgShown.src = `http://localhost:8080/uploads/${file.name}`;
        }
        if (currentImgLabel) {
          currentImgLabel.textContent = file.name;
        }

        setData((prevData) => ({
          ...prevData,
          image: file.name,
        }));
        createSuccessAlert("Image upload completed successfully");
      } else {
        // If the response is not OK, show an alert with the full response
        createDangerAlert(`File is not an Image`);
      }
    } catch (error) {
      createDangerAlert(
        "An error occurred during file upload. Please check the console for more details."
      );
    }
  };

  const handleDatasetUpload = async () => {
    const datasetInput = datasetInputRef.current;
    const files = datasetInput?.files;
    const startTime = new Date();
    setIsUploading(true);
    
    if (!files || files.length === 0) {
      createDangerAlert("Please select a folder");
      setIsUploading(false);
      return;
    }

    const firstFilePath = files[0]?.webkitRelativePath || "";
    const folderName = firstFilePath.split("/")[0];

    let errorOccurred = false; // Track whether an error occurred

    for (let i = 0; i < files.length; i++) {
      const singleFile = files[i];

      const singleFileFormData = new FormData();
      singleFileFormData.append("file", singleFile);

      try {
        const response = await fetch("http://127.0.0.1:8080/api/upload-data", {
          method: "POST",
          body: singleFileFormData,
        });

        const result = await response.text();

        if (!response.ok) {
          errorOccurred = true;
          break; // Break out of the loop on the first error
        }

        console.log(result);
      } catch (error) {
        createDangerAlert(
          "An error occurred during file upload. Please check the console for more details."
        );
        errorOccurred = true;
        break; // Break out of the loop on the first error
      }
    }
    setIsUploading(false);

    if (!errorOccurred) {
      const endTime = new Date();
      createSuccessAlert(
        `Folder upload completed successfully\nTime : ${
          (endTime.getTime() - startTime.getTime()) / 1000
        } second`
      );

      // delete the last dataset
      try {
        fetch("http://127.0.0.1:8080/api/refresh-dataset", {
          method: "POST",
        });
      } catch (error) {
        console.log("dataset folder not found thus nothing is deleted");
        console.error(error);
      }

      setData((prevData) => ({
        ...prevData,
        dataset: folderName || "",
      }));
    } else {
      createDangerAlert(
        "Folder upload failed, content of folder must all be an image"
      );
    }
  };

  const handleSearchImage = async () => {
    if (imgCount == 0) {
      createDangerAlert("Dataset is empty. Please upload a dataset");
    } else if (currentData.image == "") {
      createDangerAlert("No image to query. Please insert an image.");
    } else {
      setIsSeaching(true);
      setHavequery(true);
      if (toggleColorTexture) {
        // Color search
        console.log("color search");
        handleColorSearch();
      } else {
        // Texture search
        console.log("texture search");
        handleTextureSearch();
      }
      setIsSeaching(false);
    }
  };

  const handleTextureSearch = async () => {
    const startTime = performance.now();
    try {
      const fileImgName = ImgQuery[0];
      const time = await fetch("http://127.0.0.1:8080/api/search-texture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }).then((response) => response.json());
      console.log(
        `Texture search for file ${fileImgName} took ${time} milliseconds`
      );
    } catch (error) {
      console.error("Error during texture search:", error);
    } finally {
      const endTime = performance.now();
  
      const elapsedTime = endTime - startTime;
      const elapsedTimeInSeconds = Math.round(elapsedTime / 10) / 100;
      setData((prevData) => ({
        ...prevData,
        timeSearch: elapsedTimeInSeconds,
      }));
    }
  };

  const handleColorSearch = async () => {
    const startTime = performance.now();
    try {
      const fileImgName = ImgQuery[0];
      const time = await fetch("http://127.0.0.1:8080/api/search-color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }).then((response) => response.json());
      console.log(
        `Texture search for file ${fileImgName} took ${time} milliseconds`
      );
    } catch (error) {
      console.error("Error during texture search:", error);
    } finally {
      const endTime = performance.now();
  
      const elapsedTime = endTime - startTime;
      const elapsedTimeInSeconds = Math.round(elapsedTime / 10) / 100;
      setData((prevData) => ({
        ...prevData,
        timeSearch: elapsedTimeInSeconds,
      }));
    }
  };

  /* SELECTING FILES */
  const openImgSelect = async () => {
    const imgInput = imgInputRef.current;
    if (imgInput) {
      imgInput.click();
    }
  };

  const openDatasetSelect = async () => {
    const datasetInput = datasetInputRef.current;
    if (datasetInput) {
      datasetInput.click();
    }
  };

  /* ON CHANGE FILES */
  const handleImgInputChange = async () => {
    // Automatically run handleImgUpload after setting the state
    await handleImgUpload();
  };

  const handleDatasetInputChange = async () => {
    const datasetInput = datasetInputRef.current;
    if (datasetInput?.files?.length) {
      const folderName = datasetInput.files[0].webkitRelativePath.split("/")[0];
      setData((prevData) => ({
        ...prevData,
        selectedDataset: "Selected folder: " + folderName || "",
      }));
    }
  };

  /* ALERTS SECTION */
  const hideAlert = (id: string) => {
    const alertElement = document.getElementById(id);

    if (alertElement) {
      alertElement.style.display = "none";
    }
  };

  const createSuccessAlert = (message: string) => {
    const alertElement = document.getElementById("success-alert");
    const alertElementText = document.getElementById("success-alert-content");

    if (alertElement) {
      alertElement.style.display = "flex";
    }
    if (alertElementText) {
      alertElementText.textContent = message;
    }

    // Automatically remove the alert after a certain timeout
    setTimeout(() => {
      hideAlert("success-alert");
    }, 8000); // Adjust the timeout as needed
  };

  const createDangerAlert = (message: string) => {
    const alertElement = document.getElementById("danger-alert");
    const alertElementText = document.getElementById("danger-alert-content");

    if (alertElement) {
      alertElement.style.display = "flex";
    }
    if (alertElementText) {
      alertElementText.textContent = message;
    }

    // Automatically remove the alert after a certain timeout
    setTimeout(() => {
      hideAlert("danger-alert");
    }, 5000); // Adjust the timeout as needed
  };

  /* CAMERA */
  const handleCameraSearch = async () => {
    setToggleCapture(false);
    saveScreenshot();
  };

  useEffect(() => {
    const captureScreenshot = async () => {
      if (webcamRef.current && toggleCapture) {
        try {
          const base64 = webcamRef.current.getScreenshot();
          setScreenshot(base64);
          setWebcamError(false);
        } catch (error) {
          console.error("Error accessing webcam:", error);
          setWebcamError(true);
        }
      }
    };

    // Capture a screenshot initially
    captureScreenshot();

    // Set up interval to capture a screenshot every 5 seconds
    const intervalId = setInterval(captureScreenshot, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [toggleCapture]);

  const saveScreenshot = () => {
    if (screenshot) {
      const blob = base64ToBlob(screenshot);
      saveAs(blob, "delete_this.png");
      console.log(screenshot);
    }
  };

  const base64ToBlob = (base64: string): Blob => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: "image/png" });
  };

  return (
    <>
      <header>
        <motion.div
          className="space-x-3 text-base p-2"
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <Link
            href="/"
            className="navbar_button px-4 py-2 relative rounded group overflow-hidden font-medium bg-purple-50 text-white inline-block"
          >
            <span className="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-[--secondary] group-hover:h-full opacity-90"></span>
            <span className="relative group-hover:text-white">➜ Home</span>
          </Link>
        </motion.div>
      </header>
      <main
        className={`flex flex-col justify-center items-center select-none ${
          isUploading ? "overflow-hidden" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col justify-center items-center font-bold space-y-5 -mt-4 m-5 p-2"
        >
          <div className="title flex flex-row select-none">
            <Image
              src="/phoenix.png"
              width={64}
              height={64}
              alt="phoenix logo"
              className=""
            />
            <div className="">
              <h1 className="text-3xl">PhoenixImage.</h1>
              <h2 className="text-base">Bjir Anak Nopal. Kelompok 23.</h2>
            </div>
          </div>
          <div className="-mr-5 text-l font-bold flex flex-row space-x-3 mt-5">
            <h3 className={`${toggleCamera ? "text-[--primary]" : ""}`}>
              Manual
            </h3>
            <div
              onClick={() => setToggleCamera(!toggleCamera)}
              className={`flex h-7 w-14 cursor-pointer rounded-full border-2  border-[--primary] ${
                toggleCamera
                  ? "justify-start bg-white"
                  : "justify-end bg-[--primary]"
              } p-[2px] `}
            >
              <motion.div
                className={`h-5 w-5 rounded-full ${
                  toggleCamera ? "bg-[--primary]" : "bg-white"
                }`}
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
              />
            </div>
            <h3 className={`${!toggleCamera ? "text-[--primary]" : ""}`}>
              WebCamera
            </h3>
          </div>
          {toggleCamera ? (
            <div className="flex flex-col justify-center items-center font-bold space-y-2">
              <div className="grid grid-cols-2 items-center p-4">
                <div className="flex flex-col items-center space-y-4 m-5">
                  <input
                    type="file"
                    ref={imgInputRef}
                    className="hidden"
                    id="imgInput"
                    onChange={handleImgInputChange}
                  />
                  <input
                    type="file"
                    ref={datasetInputRef}
                    // @ts-ignore
                    directory=""
                    webkitdirectory=""
                    className="hidden"
                    id="datasetInput"
                    onChange={handleDatasetInputChange}
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex flex-row">
                      <div className="flex flex-col">
                        <button
                          onClick={openDatasetSelect}
                          className="h-[50px] relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                          <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                          <span className="relative text-white">
                            Select DataSet Folder
                          </span>
                        </button>
                        <h1 className="text-center font-normal text-sm">
                          {currentData.selectedDataset}
                        </h1>
                      </div>
                      <button
                        onClick={handleDatasetUpload}
                        className="ml-2 h-[50px] relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                        <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                        <span className="relative text-white">Upload</span>
                        <svg
                          className="ml-2 w-5 h-5 z-[10]"
                          fill="none"
                          stroke="white"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-col mt-2">
                      <button
                        onClick={openImgSelect}
                        className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                        <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                        <span className="relative text-white">
                          Insert Image
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="-mr-5 text-l font-bold flex flex-row space-x-3 mt-5">
                    <h3
                      className={`${
                        toggleColorTexture ? "text-[--primary]" : ""
                      }`}
                    >
                      Color
                    </h3>

                    <div
                      onClick={() => setToggleColorTexture(!toggleColorTexture)}
                      className={`flex h-7 w-14 cursor-pointer rounded-full border-2  border-[--primary] ${
                        toggleColorTexture
                          ? "justify-start bg-white"
                          : "justify-end bg-[--primary]"
                      } p-[2px] `}
                    >
                      <motion.div
                        className={`h-5 w-5 rounded-full ${
                          toggleColorTexture ? "bg-[--primary]" : "bg-white"
                        }`}
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 700,
                          damping: 30,
                        }}
                      />
                    </div>
                    <h3
                      className={`${
                        !toggleColorTexture ? "text-[--primary]" : ""
                      }`}
                    >
                      Texture
                    </h3>
                  </div>
                </div>
                <div className="text-center text-slate-600 m-5">
                  <img
                    ref={currentImgShownRef}
                    src="/placeholder.jpg"
                    height={400}
                    alt="Picture of the author"
                    className=" max-h-[400px] w-auto max-w-[400px] rounded-[25px] drop-shadow-[4px_4px_2.5px_#000] border-2 border-[--trinary] bg-gray-300"
                  />
                  <label ref={currentImgLabelRef}>file.jpg</label>
                </div>
              </div>
              <div className="button">
                <button
                  onClick={handleSearchImage}
                  className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                  <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                  <span className="relative text-white">Search</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="flex flex-col items-center">
                <div className="flex flex-row items-center space-x-8 m-5">
                  <div className="">
                    <h2 className="text-center">Webcam</h2>
                    {webcamError ? (
                      <div className="w-[400px] h-[300px] bg-gray-300"></div>
                    ) : (
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        className="w-[400px] h-auto rounded-[5px] border-2 border-[--trinary] bg-gray-300 "
                      />
                    )}
                  </div>
                  {screenshot && !webcamError && (
                    <div>
                      <h2 className="text-center">Current Screenshot</h2>
                      <img
                        src={screenshot}
                        alt="Latest Screenshot"
                        className="w-[400px] h-auto rounded-[25px] drop-shadow-[4px_4px_2.5px_#000] border-4 border-[--primary] bg-gray-300 "
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex flex-row m-2 text-center justify-center items-center">
                    <h1>Capture Interval</h1>
                    <input
                      type="number"
                      step="0.1"
                      min="2"
                      max="20"
                      disabled={toggleCapture}
                      value={captureInterval}
                      className={`m-2 border-2 border-black w-[64px] text-center ${
                        toggleCapture ? "bg-slate-400" : ""
                      }`}
                      onChange={(e) => {
                        const newInterval = parseFloat(e.target.value);
                        setCaptureInterval(
                          !isNaN(newInterval) && newInterval >= 0
                            ? newInterval
                            : 0.1
                        );
                      }}
                      // Add this onBlur event to prevent issues with decimal input
                      onBlur={(e) => {
                        const newInterval = parseFloat(e.target.value);
                        setCaptureInterval(
                          !isNaN(newInterval) && newInterval >= 0
                            ? newInterval
                            : 0.1
                        );
                      }}
                    />
                    <h1>second</h1>
                  </div>
                  <div className="space-x-3 m-2">
                    <button
                      onClick={() => setToggleCapture(true)}
                      className="ml-2 h-[50px] relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                      <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                      <span className="relative text-white">Start Capture</span>
                    </button>
                    <button
                      onClick={() => setToggleCapture(false)}
                      className="ml-2 h-[50px] relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                      <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                      <span className="relative text-white">Stop Capture</span>
                    </button>
                  </div>
                  <div className="flex flex-row space-x-3 m-2 justify-center">
                    <div className="text-l font-bold flex flex-row space-x-3 items-center">
                      <h3
                        className={`${
                          toggleAutoSearch ? "text-purple-600" : ""
                        }`}
                      >
                        Manual
                      </h3>
                      <div
                        onClick={() => setToggleAutoSearch(!toggleAutoSearch)}
                        className={`flex h-7 w-14 cursor-pointer rounded-full border-2  border-purple-600 ${
                          toggleAutoSearch
                            ? "justify-start bg-white"
                            : "justify-end bg-purple-600"
                        } p-[2px] `}
                      >
                        <motion.div
                          className={`h-5 w-5 rounded-full ${
                            toggleAutoSearch ? " bg-purple-600" : "bg-white"
                          }`}
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 700,
                            damping: 30,
                          }}
                        />
                      </div>
                      <h3
                        className={`${
                          !toggleAutoSearch ? "text-purple-600" : ""
                        }`}
                      >
                        Automatic
                      </h3>
                    </div>
                    <div className={!toggleAutoSearch ? "opacity-10" : ""}>
                      <button
                        onClick={() => handleCameraSearch()}
                        disabled={!toggleAutoSearch}
                        className="ml-2 h-[50px] relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                        <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                        <span className="relative text-white">Search</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {imgCount > 0 && (
            <div className="font-bold text-[--trinary] text-center">
              <h2>
                Dataset :{" "}
                {currentData.dataset != "" ? currentData.dataset : "default"}
              </h2>
            </div>
          )}
        </motion.div>
        <div className="w-full text-right">
          {searchTime != null ? `${searchTime} ms` : ""}
        </div>
        <span className="m-4 h-0.5 w-full bg-[--secondary] divider"></span>
        <div
          id="success-alert"
          className="absolute z-[10] top-0 mt-5 flex items-center p-4 mb-4 rounded-lg bg-gray-800 text-green-400 drop-shadow-2xl"
          role="alert"
          style={{ display: "none" }}
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div
            className="ms-3 text-sm font-medium"
            id="success-alert-content"
          ></div>
          <button
            type="button"
            onClick={() => hideAlert("success-alert")}
            className="ms-auto ml-3 -mx-1.5 -my-1.5 bg-gray-800 text-green-400 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        <div
          id="danger-alert"
          className="absolute z-[10] top-0 mt-5 flex items-center p-4 mb-4 bg-gray-800 text-red-400 rounded-lg"
          role="alert"
          style={{ display: "none" }}
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div
            className="ms-3 text-sm font-medium"
            id="danger-alert-content"
          ></div>
          <button
            type="button"
            className="ms-auto ml-3 -mx-1.5 -my-1.5 bg-gray-800 text-red-400 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 "
            onClick={() => hideAlert("danger-alert")}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      </main>
      {!isUploading && !isSearching && havequery ? (<h1 className="font-bold text-[--trinary] text-right">Search Time: {currentData.timeSearch} seconds</h1>) : ""}
      {!isUploading &&
        (!isSearching ? (
          <GetAllImgItems query={havequery} />
        ) : (
          <div role="status">
            <div className="top-0 left-0 flex flex-col justify-center items-center z-[10] ">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin  fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
              <h1 className=" m-4 text-xl">Loading . . .</h1>
            </div>
          </div>
        ))}
      <button onClick={handleImgUpload} className="hidden"></button>
      <button onClick={handleDatasetUpload} className="hidden"></button>
      <div className="absolute left-0 top-0 app-body-background h-screen w-full z-[-20]"></div>

      {isUploading && (
        <div className="fixed top-0 left-0 flex flex-col justify-center items-center h-screen w-screen z-[10] bg-black opacity-90 ">
          <div role="status">
            <div className="absolute top-0 left-0 flex flex-col justify-center items-center h-screen w-screen z-[10] bg-black opacity-90">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin  fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
              <h1 className="text-white m-4 text-xl">Loading . . .</h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
