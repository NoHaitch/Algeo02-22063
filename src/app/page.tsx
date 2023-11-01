import Navbar from "@/components/navbar";
import Switch from "@/components/switch";
import Image from "next/image";

export default async function Page() {
  return (
    <>
      <Navbar />
      <main className="grid grid-cols-2 gap-4 h-full w-full -mt-14 items-center justify-between">
        <div className="flex flex-col align-middle items-center">
            <div className="flex flex-col align-middle items-center m-5">
                <h1 className="text-5xl font-bold text-[--secondary] ">Image Retrieval System</h1>
                <h2 className="text-2xl font-bold text-black">content-based search</h2>
            </div>
            <button className="text-xl font-bold text-white p-2 pl-5 pr-5 bg-[--button-bg]  rounded-[20px] m-3">Insert Image</button>
            <div className="-mr-5 text-l font-bold flex flex-row space-x-3 mt-5">
                <h3>Color</h3>
                <Switch/>
                <h3>Texture</h3>
            </div>
            <button className="text-xl font-bold text-white p-2 pl-5 pr-5 bg-[--button-bg]  rounded-[20px] m-3">Search</button>
        </div>
        <div className="flex">
          <Image
            src="/placeholder.jpg"
            width={640}
            height={480}
            alt="Picture of the author"
            className="rounded-[25px] drop-shadow-[10px_10px_5px_#000]"
          />
        </div>
      </main>
    </>
  );
}
