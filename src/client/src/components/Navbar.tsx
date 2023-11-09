"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <>
      <header className="flex w-full items-center justify-between font-bold select-none">
        <motion.div
          className="title flex flex-row"
          initial={{ opacity: 0, y:-100}}
          animate={{ opacity: 1, y:0 }}
        >
          <Image
            src="/phoenix.png"
            width={64}
            height={64}
            alt="phoenix logo"
            className=""
          />
          <div className="">
            <h1 className="text-3xl">PhoenixImage.</h1>
            <h2 className="text-base">Bjir Anak Nopal. Kelompok 23.</h2>
          </div>
        </motion.div>
        <motion.div
          className="space-x-3 text-base p-2"
          initial={{ opacity: 0, y:-100 }}
          animate={{ opacity: 1, y:0 }}
        >
          <Link
            href="/"
            className="px-3 py-1.5 relative rounded group overflow-hidden font-medium bg-purple-50 text-[--secondary] inline-block"
          >
            <span className="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-[--secondary] group-hover:h-full opacity-90"></span>
            <span className="relative group-hover:text-white">Home</span>
          </Link>
          <Link
            href="/introduction"
            className="px-3 py-1.5 relative rounded group overflow-hidden font-medium bg-purple-50 text-[--secondary] inline-block"
          >
            <span className="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-[--secondary] group-hover:h-full opacity-90"></span>
            <span className="relative group-hover:text-white">
              Introduction
            </span>
          </Link>
          <Link
            href="/how_to_use"
            className="px-3 py-1.5 relative rounded group overflow-hidden font-medium bg-purple-50 text-[--secondary] inline-block"
          >
            <span className="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-[--secondary] group-hover:h-full opacity-90"></span>
            <span className="relative group-hover:text-white">How to Use</span>
          </Link>
          <Link
            href="/about_us"
            className="px-3 py-1.5 relative rounded group overflow-hidden font-medium bg-purple-50 text-[--secondary] inline-block"
          >
            <span className="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-[--secondary] group-hover:h-full opacity-90"></span>
            <span className="relative group-hover:text-white">About Us</span>
          </Link>
          <Link
            href="/app"
            className="navbar_button px-4 py-2 relative rounded group overflow-hidden font-medium bg-purple-50 text-white inline-block"
          >
            <span className="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-[--secondary] group-hover:h-full opacity-90"></span>
            <span className="relative group-hover:text-white">Live Demo</span>
          </Link>
        </motion.div>
      </header>
    </>
  );
}
