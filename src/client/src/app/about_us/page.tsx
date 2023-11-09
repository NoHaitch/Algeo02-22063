import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col w-full items-center space-y-6p-5 my-5 rounded-3xl pb-12">
        <div className="title flex flex-col items-center justify-center m-5">
          <Image
            src="/phoenix.png"
            width={160}
            height={160}
            alt="phoenix logo"
            className="about-us-logo"
          />
          <div className="font-bold text-center">
            <h1 className="text-3xl">PhoenixImage.</h1>
            <h2 className="text-base">Bjir Anak Nopal. Kelompok 23.</h2>
          </div>
        </div>
        <div className="text-lg space-y-5 w-[80%]">
          <p>
            <strong>PhoenixImage</strong> merupakan Content-Based Image Retrieval System atau CBIR System yang
            dibuat sebagai tugas besar 2 mata kuliah IF2123 Aljabar Linier dan
            Geometri. Website ini dibuat oleh kelompok 23 bernama “Bjir Anak
            Nopal” yang terdiri dari 3 orang, yaitu :
          </p>
          <ul className="list-disc m-8 font-bold">
            <li>Shazya Audrea Taufik(13522063)</li>
            <li>Bagas Sambega Rosyada(13522071)</li>
            <li>Raden Francisco Trianto
            Bratadiningrat (13522091)</li>
          </ul>
          <p>Tujuan dari tugas ini adalah sebagai media pembelajaran mahasiswa dalam aplikasi ilmu dari mata kuliah Aljabar Linier dan Geometri dalam bidang Informatika.</p>
          <p><strong>Soure Code (Kode Program)</strong> terdapat pada repositori yang terbuka untuk umum, dan berada pada <Link href="https://github.com/NoHaitch/tubes2_algeo" className="font-bold text-[--primary]">tautan ini</Link>.</p>
          <p><strong>Spesifikasi program</strong> dan tugas berada pada <Link href="https://docs.google.com/document/d/1HVDyywnUdNz9hStgx5ZLqHypK89hWH8qfERJOiDw6KA/edit" className="font-bold text-[--primary]">tautan ini</Link>.</p>
          <p>Jika terdapat masalah atau pertanyaan terhadap masalah ini dapat melalui issue di repository github (pada tautan di atas) atau melewati salah satu email berikut :</p>
          <ul className="list-disc m-8">
            <li>13522063@std.stei.itb.ac.id</li>
            <li>13522071@std.stei.itb.ac.id</li>
            <li>13522091@std.stei.itb.ac.id</li>
          </ul>
          <p><strong>NOTE : </strong> We don't own all the image nor the logo used in this project</p>
          <h1> Thats All! Enjoy our Result!</h1>
        </div>
      </main>
    </>
  );
}
