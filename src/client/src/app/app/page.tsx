"use client"
import Navbar from "@/components/Navbar";
import Switch from "@/components/Switch";
import Image from "next/image";
import { useRef } from 'react';


export default function Home() {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async () => {
    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8080/api', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="grid grid-cols-2 gap-4 h-full w-full -mt-14 items-center justify-between">
        <div className="flex flex-col align-middle items-center">
            <div className="flex flex-col align-middle items-center m-5">
                <h1 className="text-5xl font-bold text-[--secondary] ">Image Retrieval System</h1>
                <h2 className="text-2xl font-bold text-black">content-based search</h2>
            </div>
              <input type="file" ref={fileInputRef} />
              <button onClick={handleFileUpload} className="text-xl font-bold text-white p-2 pl-5 pr-5 bg-[--button-bg]  rounded-[20px] m-3">Insert Image</button>
            <div className="-mr-5 text-l font-bold flex flex-row space-x-3 mt-5">
                <h3>Color</h3>
                <Switch/>
                <h3>Texture</h3>
            </div>
            <button className="text-xl font-bold text-white p-2 pl-5 pr-5 bg-[--button-bg]  rounded-[20px] m-3">Search</button>
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
