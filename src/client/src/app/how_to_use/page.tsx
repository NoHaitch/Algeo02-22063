import Navbar from "@/components/Navbar";

export default function HowToUse() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center mt-12 w-full">
        <h1 className="text-4xl font-bold text-[--primary] title mb-8">
          How To
        </h1>
        <h2 className="text-xl font-bold m-3">Very Simple</h2>
        <div className="flex flex-row text-base m-4 text-white justify-between w-[80%]">
          <div className="w-[15rem] p-4 bg-[--trinary] rounded-md">
            <h1 className="text-xl font-bold">
              Select and Upload your dataset
            </h1>
            <p></p>
          </div>
          <div className="flex justify-center items-center">
            <svg
              className="w-12 h-12 text-black"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </div>
          <div className="w-[15rem] p-4 bg-[--trinary] rounded-md">
            <h1 className="text-xl font-bold">
              Upload your Image that you want to search
            </h1>
          </div>
          <div className="flex justify-center items-center">
            <svg
              className="w-12 h-12 text-black"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </div>
          <div className="w-[15rem] p-4 bg-[--trinary] rounded-md">
            <h1 className="text-xl font-bold">Choose How you serach</h1>
          </div>
          <div className="flex justify-center items-center">
            <svg
              className="w-12 h-12 text-black"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </div>
          <div className="w-[15rem] p-4 bg-[--trinary] rounded-md">
            <h1 className="text-xl font-bold">Search Your Image</h1>
          </div>
        </div>
      </main>
    </>
  );
}
