"use client"
import imgData from "../../../server/uploads/dataset.json";

export default function ImgItems({
  start,
  end,
}: {
  start: number;
  end: number;
}) {
  const amount = end - start;
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 w-full">
        {imgData.slice(start, end).map((imageName: string, index: number) => (
          <div className="text-center text-slate-700 flex flex-col items-center justify-center">
            <h1>{imageName}</h1>
            <div className="grid items-center justify-center h-[284px] w-[284px] rounded-[5px] border-2 border-[--trinary] bg-gray-300">
              <img
                key={index}
                src={`http://localhost:8080/uploads/dataset/${imageName}`} // Adjust the path based on your actual folder structure
                alt={`Image ${index}`}
                className="max-h-[280px] max-w-[280px]"
              />
            </div>
            <h1>0.00</h1>
          </div>
        ))}
      </div>
    </>
  );
}
