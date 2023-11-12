"use client";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Introduction() {
  return (
    <>
      <Navbar />
      <motion.main 
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col w-full items-center mt-8">
        <div className="flex flex-col text-[--primary] font-bold text-center mt-5">
          <h1 className="text-3xl  max-w-[400px]">
            Content-Based Image Retrieval System
          </h1>
          <h2 className="text-l text-[--secondary]">
            by Bjir Anak Nopal. Kelompok 23.
          </h2>
        </div>
        <h1 className="text-base font-medium w-[400px] text-center m-5">
          Search Similar Images using Image Data Content through the amazing
          cosine similarity.
        </h1>
        <Link href="/app" className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600 text-white">
        <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
        <span className="relative text-indigo-600 transition duration-300 group-hover:text-white ease">Try the APP</span>
        </Link>
        <div className="cards flex flex-row space-x-[80px] mt-10 mb-5">
          <div className="flex flex-col w-[360px] h-[400px] bg-[--trinary] rounded-[24px] items-center p-5 text-white">
            <img src="/rgb.png" alt="" className="h-[160px] w-[160px]" />
            <h1 className="font-bold text-lg m-4">Using Color Data</h1>
            <p className="text-sm text-justify">
              An Image color is made out of the base RGB (Red Green Blue)
              values. When combine these become the color you see. Using a
              special technique we can extract a Vector, which then is used to
              compare the similarity of 2 images.
            </p>
          </div>
          <div className="flex flex-col w-[360px] h-[400px] bg-[--trinary] rounded-[24px] items-center p-5 text-white">
            <img src="/texture.png" alt="" className="h-[160px] w-[160px]" />
            <h1 className="font-bold text-lg m-4">Using Texture Data</h1>
            <p className="text-sm text-justify">
              An Image Texture are are used to add detail, realism, and
              complexity to an image. Texture hard to see yet become of the key
              aspect of an img. Using a certain technique one of which is using
              grayscaled img, we can also extract a Vector, used for comparing
              the similarity of 2 images.
            </p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 5  }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1,
            }}
            className="flex flex-col items-center text-center font-bold text-[--secondary] m-2 mb-24"
          >
            <h1>More Detail Explanations Below</h1>
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </motion.div>
          <div className="text-base w-[80%] bg-[--trinary] text-white p-5 m-5">
            <h1 className="m-2 font-bold text-center">
              CONTENT-BASED INFORMATION RETRIEVAL (CBIR)
            </h1>
            <p className="text-justify">
              Merupakan sistem pencarian gambar berdasarkan isi dari suatu
              gambar. Proses pencarian ini dapat menggunakan beberapa aspek
              penting dari gambar seperti warna, texture, dan bentuk yang dapat
              diwakili dalam bentuk vektor. Vektor dapat tersebut digunakan
              untuk melakukan pencocokan dan perbandingan dengan gambar lain.
              PhoenixImage sendiri dapat menggunakan 2 mode yaitu, warna(mode
              color) atau tekstur(mode texture).
            </p>
            <h2 className="m-2 font-bold ">1. Mode Color</h2>
            <p className="text-justify">
              Suatu gambar terdiri dari pixel-pixel yang suatu pixel merupakan
              gabungan dari 3 warna dasar pada{" "}
              <span className="text-red-500 font-bold">R</span>
              <span className="text-green-500 font-bold">G</span>
              <span className="text-blue-500 font-bold">B</span>, yaitu merah(
              <span className="text-red-500 italic font-bold">Red</span>),
              hijau(
              <span className="text-green-500 italic font-bold">Green</span>),
              dan biru(
              <span className="text-blue-500 italic font-bold">Blue</span>).
              Warna-warna tersebut dikonversi menjadi bentuk HSV (Hue Saturation
              Value) yang lebih umum digunakan. Dengan HSV ini kita dapat
              membuat histogram dan merepresentasikan histogram ini sebagai
              vektor. Dengan menggunakan
              <span className="italic font-bold"> cosine similarity</span> kita
              dapat mendapatkan nilai yang menjadi skala kecocokan 2 buah
              gambar. Semakin besar nilainya maka semakin cocok 2 buah gambar
              dan sebaliknya semakin kecil maka semakin tidak cocok 2 buah
              gambar. Namun hal ini juga dipengaruhi pada blok perbandingan 2
              buah gambar.
              <span className="font-bold"> Blok</span> ini adalah besar pixel
              yang dibandingkan contoh: 4 × 4 px.
            </p>
            <h2 className="m-2 font-bold">2. Mode Texture</h2>
            <p className="text-justify">
              Untuk membandingkan tekstur pada gambar, pertama kita harus
              mengubah gambar menjadi
              <span className="italic font-bold"> grayscale</span> karena dalam
              perbandingan teksture, warna sudah tidak diperlukan bahkan
              memperlambat proses. Dari gambar ini, dengan menggunakan{" "}
              <span className="italic font-bold">co-occurrence matrix</span>,
              kita dapat mendapatkan 3 komponen dari gambar, yaitu Contrast,
              Homogeneity, dan Entropy. Komponen-komponen ini dapat digunakan
              dalam <span className="italic font-bold"> cosine similarity</span>{" "}
              sama seperti pada mode color. Dengan semakin besar nilainya maka
              semakin cocok 2 buah gambar dan sebaliknya semakin kecil maka
              semakin tidak cocok 2 buah gambar.
            </p>
          </div>
        </motion.div>
      </motion.main>
    </>
  );
}
