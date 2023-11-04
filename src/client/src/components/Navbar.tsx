import Link from "next/link";


export default function Navbar() {
  return (
    <header className="flex flex-row justify-between font-bold mt-4">
        <div className="title">
          <h1 className="text-3xl w-[300px]">Bjir Anak Nopal.</h1>
          <h2 className="text-l w-[200px]">Kelompok 23.</h2>
        </div>
        <div className="title space-x-3 text-l p-2">
          <Link href="/">Home</Link>
          <Link href="/introduction">Introduction</Link>
          <Link href="/how_to_use">How to Use</Link>
          <Link href="/about_us">About Us</Link>
        </div>
    </header>
  );
}