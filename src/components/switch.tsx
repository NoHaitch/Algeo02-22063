"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Switch() {
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <div
      onClick={() => setToggle(!toggle)}
      className={`flex h-7 w-14 cursor-pointer rounded-full border-2  border-[--primary] ${
        toggle ? "justify-start bg-white" : "justify-end bg-[--primary]"
      } p-[2px] `}
    >
      <motion.div
        className={`h-5 w-5 rounded-full ${
          toggle ? "bg-[--primary]" : "bg-white"
        }`}
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      />
    </div>
  );
}
