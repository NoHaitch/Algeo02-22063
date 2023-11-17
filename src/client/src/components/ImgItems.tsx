"use client";
import imgData from "../../../server/uploads/dataset.json";
import queryData from "../../../server/uploads/query.json";

export default function ImgItems({
  start,
  end,
  query,
}: {
  start: number;
  end: number;
  query: boolean;
}) {
  const amount = end - start;
  type ImageData = {
    cosine: number;
    path: string;
  };
  const formatPercentage = (value: number): string => {
    // Convert the cosine value to a percentage with two decimal points
    const percentage = (value).toFixed(2);
    return `${percentage}%`;
  };
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 w-full my-4">
        {query
          ? queryData
              .slice(start, end)
              .map(({ cosine, path }: ImageData, index: number) => (
                <div
                  className="text-center text-slate-700 flex flex-col items-center justify-center"
                  key={index}
                >
                  <h1>{path}</h1>
                  <div className="grid items-center justify-center h-[284px] w-[284px] rounded-[5px] border-2 border-[--trinary] bg-gray-300">
                    <img
                      src={`http://localhost:8080/uploads/dataset/${path}`}
                      alt={`Image ${index}`}
                      className="max-h-[280px] max-w-[280px]"
                    />
                  </div>
                  <h1 className="mb-4">{formatPercentage(cosine)}</h1>
                </div>
              ))
          : imgData
              .slice(start, end)
              .map((imageName: string, index: number) => (
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
                  <h1>0.00%</h1>
                </div>
              ))}
      </div>
    </>
  );
}
