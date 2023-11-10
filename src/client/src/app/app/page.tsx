"use client";
import Switch from "@/components/Switch";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const datasetInputRef = useRef<HTMLInputElement>(null);
  const currentImgShownRef = useRef<HTMLImageElement>(null);
  const currentImgLabelRef = useRef<HTMLLabelElement>(null);

  const [currentData, setData] = useState({
    selectedDataset: "",
    image: "empty",
    dataset: "empty",
  });

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

    if (!files || files.length === 0) {
      createDangerAlert("Please select a folder");
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

        const result = await response.text(); // Get the full response as text

        if (!response.ok) {
          errorOccurred = true;
          break; // Break out of the loop on the first error
        }

        console.log(result); // Log the full response
      } catch (error) {
        createDangerAlert(
          "An error occurred during file upload. Please check the console for more details."
        );
        errorOccurred = true;
        break; // Break out of the loop on the first error
      }
    }

    if (!errorOccurred) {
      const endTime = new Date();
      createSuccessAlert(
        `Folder upload completed successfully\nTime : ${
          (endTime.getTime() - startTime.getTime()) / 1000
        } second`
      );
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
      <main className=" flex flex-col justify-center items-center select-none">
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col justify-center items-center font-bold space-y-5 m-5"
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
                      className="ml-2 w-5 h-5 z-10"
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
                    <span className="relative text-white">Insert Image</span>
                  </button>
                </div>
              </div>
              <div className="-mr-5 text-l font-bold flex flex-row space-x-3 mt-5">
                <h3>Color</h3>
                <Switch />
                <h3>Texture</h3>
              </div>
              <div className="font-bold text-[--trinary] p-5">
                <h1>Current Server Data</h1>
                <h2>Image : {currentData.image}</h2>
                <h2>Dataset : {currentData.dataset}</h2>
              </div>
            </div>
            <div className="text-center text-slate-600 m-5">
              <img
                ref={currentImgShownRef}
                src="/placeholder.jpg"
                height={330}
                width={330}
                alt="Picture of the author"
                className="rounded-[25px] drop-shadow-[4px_4px_2.5px_#000] border-2 border-[--trinary]"
              />
              <label ref={currentImgLabelRef}>file.jpg</label>
            </div>
          </div>
          <div className="button">
            <Link
              href="#"
              className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative text-white">Search</span>
            </Link>
          </div>
        </motion.div>
        <span className="m-4 h-0.5 w-full bg-[--secondary]"></span>
        <div className="imgItems m-5"></div>
        <div
          id="success-alert"
          className="absolute z-10 top-0 mt-5 flex items-center p-4 mb-4 rounded-lg bg-gray-800 text-green-400 drop-shadow-2xl"
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
            className="ms-auto ml-3 -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
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
          className="absolute z-10 top-0 mt-5 flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
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
            className="ms-auto ml-3 -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
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
      <button onClick={handleImgUpload} className="hidden"></button>
      <button onClick={handleDatasetUpload} className="hidden"></button>
      <div className="absolute left-0 top-0 app-body-background h-screen w-screen z-[-20]"></div>
    </>
  );
}
