import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function page() {
  return (
    <>
      <Navbar />
      <main className="grid grid-cols-2 gap-4 h-full w-full -mt-14 items-center justify-between">
        <div className="flex flex-col text-[--primary] font-bold">
          <h1 className="text-5xl  max-w-[600px]">
            Content-Based Image Retrieval System
          </h1>
          <h2 className="text-l text-[--secondary]">
            by Bjir Anak Nopal. Kelompok 23.
          </h2>
          <Link
            href="/introduction"
            className="mt-12 w-[180px] relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-[--primary] transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
          >
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[--primary] group-hover:h-full"></span>
            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
              <svg
                className="w-5 h-5 text-[--primary]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
              Get Started
            </span>
          </Link>
          <Link
            href="/introduction"
            className="mt-2 w-[180px] relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-[--primary] transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
          >
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[--primary] group-hover:h-full"></span>
            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
              <svg
                className="w-5 h-5 text-[--primary]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
              Live Demo
            </span>
          </Link>
        </div>
        <div className=" z-10">
          <Image
            src="/placeholder.jpg"
            width={640}
            height={400}
            alt="Picture of the author"
            className="rounded-[25px] drop-shadow-[10px_10px_5px_#000]"
          />
        </div>
        <div className="absolute z-[-10] right-0 bottom-0">
          <svg
            width="1345"
            height="1024"
            viewBox="0 0 1345 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              y="1076.14"
              width="1800.66"
              height="949.983"
              transform="rotate(-32.8606 0.734131 1050)"
              className="fill-[--trinary]"
            />
          </svg>
        </div>
      </main>
    </>
  );
}
