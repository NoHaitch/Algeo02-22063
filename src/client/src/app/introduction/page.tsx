import Navbar from "@/components/Navbar";

export default function Introduction() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col h-screen w-full -mt-14 items-center justify-center">
        <div className="flex flex-col text-[--primary] font-bold text-center m-5">
          <h1 className="text-5xl  max-w-[600px]">
            Content-Based Image Retrieval System
          </h1>
          <h2 className="text-l text-[--secondary]">
            by Bjir Anak Nopal. Kelompok 23.
          </h2>
        </div>
        <div className="text-base font-serif">
          <h1 className="m-2 font-bold text-center">
            CONTENT-BASED INFORMATION RETRIEVAL (CBIR)
          </h1>
          <p>
            Merupakan sistem pencarian gambar berdasarkan isi dari suatu gambar.
            Proses pencarian ini dapat menggunakan beberapa aspek penting dari
            gambar seperti warna, texture, dan bentuk yang dapat diwakili dalam
            bentuk vektor. Vektor dapat tersebut digunakan untuk melakukan
            pencocokan dan perbandingan dengan gambar lain. PhoenixImage sendiri
            dapat menggunakan 2 mode yaitu, warna(mode color) atau tekstur(mode
            texture).
          </p>
          <h2 className="m-2 font-bold">1. Mode Color</h2>
          <p>
            Suatu gambar terdiri dari pixel-pixel yang suatu pixel merupakan
            gabungan dari 3 warna dasar pada{" "}
            <span className="text-red-500 font-bold">R</span>
            <span className="text-green-500 font-bold">G</span>
            <span className="text-blue-500 font-bold">B</span>, yaitu merah(
            <span className="text-red-500 italic font-bold">Red</span>), hijau(
            <span className="text-green-500 italic font-bold">Green</span>), dan
            biru(<span className="text-blue-500 italic font-bold">Blue</span>).
            Warna-warna tersebut dikonversi menjadi bentuk HSV (Hue Saturation
            Value) yang lebih umum digunakan. Dengan HSV ini kita dapat membuat
            histogram dan merepresentasikan histogram ini sebagai vektor. Dengan
            menggunakan
            <span className="italic font-bold"> cosine similarity</span> kita
            dapat mendapatkan nilai yang menjadi skala kecocokan 2 buah gambar.
            Semakin besar nilainya maka semakin cocok 2 buah gambar dan
            sebaliknya semakin kecil maka semakin tidak cocok 2 buah gambar.
            Namun hal ini juga dipengaruhi pada blok perbandingan 2 buah gambar.
            <span className="font-bold"> Blok</span> ini adalah besar pixel yang
            dibandingkan contoh: 4 × 4 px.
          </p>
          <h2 className="m-2 font-bold">2. Mode Texture</h2>
          <p>
            Untuk membandingkan tekstur pada gambar, pertama kita harus mengubah
            gambar menjadi
            <span className="italic font-bold"> grayscale</span> karena dalam
            perbandingan teksture, warna sudah tidak diperlukan bahkan
            memperlambat proses. Dari gambar ini, dengan menggunakan{" "}
            <span className="italic font-bold">co-occurrence matrix</span>, kita
            dapat mendapatkan 3 komponen dari gambar, yaitu Contrast,
            Homogeneity, dan Entropy. Komponen-komponen ini dapat digunakan
            dalam <span className="italic font-bold"> cosine similarity</span>{" "}
            sama seperti pada mode color. Dengan semakin besar nilainya maka
            semakin cocok 2 buah gambar dan sebaliknya semakin kecil maka
            semakin tidak cocok 2 buah gambar.
          </p>
        </div>
      </main>
    </>
  );
}
