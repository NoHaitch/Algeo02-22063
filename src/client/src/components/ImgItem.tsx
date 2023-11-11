export default function ImgItem({ fileName }: { fileName: string }) {
  return (
    <>
      <div className="text-center text-slate-700 flex flex-col items-center justify-center">
        <h1>{fileName}</h1>
        <div className="grid items-center justify-center h-[284px] w-[284px] rounded-[5px] border-2 border-[--trinary] bg-gray-300">
          <img
            src={`http://localhost:8080/uploads/dataset/${fileName}`}
            alt="Picture of the author"
            className="max-h-[280px] max-w-[280px]"
          />
        </div>
        <h1>0.00</h1>
      </div>
    </>
  );
}
