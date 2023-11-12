import ImgItems from "./ImgItems";
import imgData from "../../../server/uploads/dataset.json";
import { useState, useRef } from "react";
import Link from "next/link";

export default function GetAllImgItems() {
  const prevButtonRef = useRef<HTMLButtonElement>(null);

  const itemsPerPage = 8;
  const imgCount = imgData.length;
  const pageCount = Math.ceil(imgCount / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(3);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(currentPage);
  };

  return (
    <>
      <div className="flex flex-row space-x-4 justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 text-sm">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight order border-e-0 rounded-s-lg  border-gray-700 text-gray-400 ${
                  currentPage === 1
                    ? "bg-black"
                    : "bg-gray-800 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center justify-center px-3 h-8 leading-tight ${
                  currentPage === 1
                    ? "text-blue-600 border hover:text-blue-700 border-gray-700 bg-gray-700"
                    : "border-gray-300 bg-gray-800 :border-gray-700 text-gray-400 :hover:bg-gray-700 hover:text-white"
                }`}
              >
                {currentPage <= 3 ? "1" : currentPage - 2}
              </button>
            </li>
            {pageCount > 1 && (
              <li>
                <button
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    currentPage === 2
                      ? "text-blue-600 border hover:text-blue-700 border-gray-700 bg-gray-700"
                      : "border-gray-300 bg-gray-800 :border-gray-700 text-gray-400 :hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {currentPage <= 3 ? "2" : currentPage - 1}
                </button>
              </li>
            )}
            {pageCount > 2 && (
              <li>
                <button
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    (currentPage !== 1 && currentPage !== 2)
                      ? "text-blue-600 border hover:text-blue-700 border-gray-700 bg-gray-700"
                      : "border-gray-300 bg-gray-800 :border-gray-700 text-gray-400 :hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {currentPage <= 3 ? "3" : currentPage}
                </button>
              </li>
            )}
            {pageCount > 3 && currentPage !== pageCount && (
              <li>
                <button className="flex items-center justify-center px-3 h-8 leading-tight border-gray-300 bg-gray-800 :border-gray-700 text-gray-400 :hover:bg-gray-700 hover:text-white">
                  {currentPage <= 3 ? "4" : currentPage + 1}
                </button>
              </li>
            )}
            {pageCount > 4 && currentPage < pageCount - 1 && (
              <li>
                <button className="flex items-center justify-center px-3 h-8 leading-tight border-gray-300 bg-gray-800 :border-gray-700 text-gray-400 :hover:bg-gray-700 hover:text-white">
                  {currentPage <= 3 ? "5" : currentPage + 2}
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
                className={`flex items-center justify-center px-3 h-8 leading-tight order border-e-0 rounded-e-lg  border-gray-700 text-gray-400 ${
                  currentPage === pageCount
                    ? "bg-black"
                    : "bg-gray-800 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <ImgItems start={startIndex} end={endIndex} />
    </>
  );
}
