"use client";
import Navbar from "@/components/Navbar";
import Switch from "@/components/Switch";
import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async () => {
    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

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

      const result = await response.text(); // Get the full response as text

      if (response.ok) {
        console.log(result); // Log the full response
        alert("Image upload completed successfully");
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

  const handleFolderUpload = async () => {
    const folderInput = folderInputRef.current;
    const files = folderInput?.files;
    const startTime = new Date();

    if (!files || files.length === 0) {
      alert("Please select a folder");
      return;
    }
  
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
      alert(`Folder upload completed successfully\nTime : ${(endTime.getTime() - startTime.getTime())/1000} second`);
    }
    else{
      alert("Folder upload failed, content of folder must all be an image")
    }
  };

  return (
    <>
      <Navbar />
      <main className="grid grid-cols-2 gap-4 h-full w-full -mt-14 items-center justify-between">
        <div className="flex flex-col align-middle items-center">
          <div className="flex flex-col align-middle items-center m-5">
            <h1 className="text-5xl font-bold text-[--secondary] ">
              Image Retrieval System
            </h1>
            <h2 className="text-2xl font-bold text-black">
              content-based search
            </h2>
          </div>
          <div className="-mr-5 text-l font-bold flex flex-row space-x-3 mt-5">
            <h3>Color</h3>
            <Switch />
            <h3>Texture</h3>
          </div>

          <button className="text-xl font-bold text-white p-2 pl-5 pr-5 bg-[--button-bg]  rounded-[20px] m-3">
            Search
          </button>
          <button className="text-xl font-bold text-white p-2 pl-5 pr-5 bg-[--button-bg]  rounded-[20px] m-3">
            Insert Image
          </button>
          <div>
            <input type="file" ref={fileInputRef} />
            <button onClick={handleFileUpload}>Upload Query Image</button>
            <input
              type="file"
              ref={folderInputRef}
              // @ts-ignore
              directory=""
              // @ts-ignore
              webkitdirectory=""
            />
            <button onClick={handleFolderUpload}>Upload Dataset</button>
          </div>
        </div>
        <div className="">
          <Image
            src="/placeholder.jpg"
            width={640}
            height={400}
            alt="Picture of the author"
            className="rounded-[25px] drop-shadow-[10px_10px_5px_#000]"
          />
        </div>
      </main>
    </>
  );
}
