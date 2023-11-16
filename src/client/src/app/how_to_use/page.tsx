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
        <div className="flex flex-row text-base m-4 text-white justify-between w-[80%] text-center">
          <div className="flex flex-col w-[17rem] p-4 bg-[--trinary] rounded-md items-center">
            <span className="border-white border-2 text-3xl rounded-full px-4 m-2 text-center font-bold">
              1
            </span>
            <h1 className="text-xl font-bold">
              Select and Upload your dataset
            </h1>
          </div>
          <div className="flex flex-col w-[17rem] p-4 bg-[--trinary] rounded-md items-center">
            <span className="border-white border-2 text-3xl rounded-full px-4 m-2 text-center font-bold">
              2
            </span>
            <h1 className="text-xl font-bold">
              Upload your Image that you want to search
            </h1>
          </div>
          <div className="flex flex-col w-[17rem] p-4 bg-[--trinary] rounded-md items-center">
            <span className="border-white border-2 text-3xl rounded-full px-4 m-2 text-center font-bold">
              3
            </span>
            <h1 className="text-xl font-bold">Choose How you serach</h1>
          </div>
          <div className="flex flex-col w-[17rem] p-4 bg-[--trinary] rounded-md items-center">
            <span className="border-white border-2 text-3xl rounded-full px-4 m-2 text-center font-bold">
              4
            </span>
            <h1 className="text-xl font-bold">Search Your Image</h1>
          </div>
        </div>
      </main>
    </>
  );
}
