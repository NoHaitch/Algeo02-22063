import ImgItem from "./ImgItem";

export default function ImgItems({start,end}:{start: number, end: number}) {
  const amount = end - start; 
  return (
    <>
        {amount >= 0 && (<ImgItem fileName="0.jpg" />)}
        {amount >= 1 && (<ImgItem fileName="1.jpg" />)}
        {amount >= 2 && (<ImgItem fileName="2.jpg" />)}
        {amount >= 3 && (<ImgItem fileName="3.jpg" />)}
        {amount >= 4 && (<ImgItem fileName="0.jpg" />)}
        {amount >= 5 && (<ImgItem fileName="1.jpg" />)}
        {amount >= 6 && (<ImgItem fileName="2.jpg" />)}
        {amount >= 7 && (<ImgItem fileName="3.jpg" />)}
    </>
  )
}
