import Navbar from "@/components/Navbar";

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col text-l mt-5">
        <h1 className="text-3xl mb-5 font-bold">About Us</h1>
        <div className="ml-4">
          <h2 className="text-2xl font-bold">Hi There!</h2>
          <p className="text-l ml-2 font-semibold text-justify w-[75%]">
            Welcome to Image Retrieval System, a web we made as the second
            project for ITB course IF2123 Aljabar Linier dan Geometri. This
            Project is made by a group of 3 people called Bjir Anak Nopal.
            (Kelompok 23)
          </p>
        </div>
      </main>
    </>
  );
}
