"use client";
import Navbar from "@/components/Navbar";
import Switch from "@/components/Switch";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const datasetInputRef = useRef<HTMLInputElement>(null);
  const currentImgShown = useRef<HTMLImageElement>(null);

  const [currentData, setData] = useState({
    selectedImage: "",
    selectedDataset: "",
    lastUploadedImage: "",
    image: "empty",
    dataset: "empty",
  });

  const handleImgUpload = async () => {
    const imgInput = imgInputRef.current;
    const file = imgInput?.files?.[0];

    if (!file) {
      alert("Please select a file");
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
        alert("Image upload completed successfully");

        setData((prevData) => ({
          ...prevData,
          image: file.name,
          lastUploadedImage: file.name, 
        }));
      } else {
        // If the response is not OK, show an alert with the full response
        alert(`File is not an Image`);
      }
    } catch (error) {
      alert(
        "An error occurred during file upload. Please check the console for more details."
      );
    }
  };

  const handleDatasetUpload = async () => {
    const datasetInput = datasetInputRef.current;
    const files = datasetInput?.files;
    const startTime = new Date();

    if (!files || files.length === 0) {
      alert("Please select a folder");
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
        alert(
          "An error occurred during file upload. Please check the console for more details."
        );
        errorOccurred = true;
        break; // Break out of the loop on the first error
      }
    }

    if (!errorOccurred) {
      const endTime = new Date();
      alert(
        `Folder upload completed successfully\nTime : ${
          (endTime.getTime() - startTime.getTime()) / 1000
        } second`
      );
      setData((prevData) => ({
        ...prevData,
        dataset: folderName || "",
      }));
    } else {
      alert("Folder upload failed, content of folder must all be an image");
    }
  };

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

  const handleImgInputChange = async () => {
    const imgInput = imgInputRef.current;
    if (imgInput?.files?.length) {
      const file = imgInput.files[0];
      const fileName = file.name;
      setData((prevData) => ({
        ...prevData,
        selectedImage: fileName,
      }));

      // Automatically run handleImgUpload after setting the state
      await handleImgUpload();
    }
  };

  const handleDatasetInputChange = async () => {
    const datasetInput = datasetInputRef.current;
    if (datasetInput?.files?.length) {
      const folderName = datasetInput.files[0].webkitRelativePath.split("/")[0];
      setData((prevData) => ({
        ...prevData,
        selectedDataset: folderName || "",
      }));
    }
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
      <main className="flex flex-col justify-center items-center">
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
          <div className="grid grid-cols-2 items-center p-5">
            <div className="flex flex-col items-center space-y-4">
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
                <div className="flex flex-col">
                  <button
                    onClick={openDatasetSelect}
                    className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                    <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                    <span className="relative text-white">
                      Insert DataSet Folder
                    </span>
                  </button>
                  <h1>{currentData.selectedDataset}</h1>
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={openImgSelect}
                    className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                    <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                    <span className="relative text-white">Insert Image</span>
                  </button>
                  <h1>{currentData.selectedDataset}</h1>
                </div>
              </div>
              <div className="font-bold text-[--trinary] p-5">
                <h1>Current Data</h1>
                <h2>Image : {currentData.image}</h2>
                <h2>Dataset : {currentData.dataset}</h2>
              </div>
            </div>
            <div className="text-center text-slate-600 m-3">
              <img
                ref={currentImgShown}
                src="/placeholder.jpg"
                width={440}
                height={330}
                alt="Picture of the author"
                className="rounded-[25px] drop-shadow-[4px_4px_2.5px_#000] border-2 border-[--trinary]"
              />
              <label>file.jpg</label>
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
      </main>
      <button onClick={handleImgUpload} className="hidden"></button>
      <button onClick={handleDatasetUpload} className="hidden"></button>
      <div className="absolute left-0 top-0 app-body-background h-screen w-screen z-[-20]"></div>
    </>
  );
}
