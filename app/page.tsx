"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export default function LandingPage() {
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const scrollToButton = () => {
    buttonRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf4ef] via-[#f7f0e8] to-[#f3ece3] text-slate-800 relative overflow-hidden flex flex-col items-center px-6 pt-20 pb-16">

      {/* SOFT MANDALA BACKDROP */}
      <motion.img
        src="/chapter_3.png"
        alt="mandala"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 3 }}
        className="absolute inset-0 w-[90%] max-w-[900px] m-auto pointer-events-none"
      />

      {/* SANSKRIT DECOR */}
      <motion.div
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute bottom-24 left-10 text-[8rem] text-[#d8c7b5] font-bold blur-sm select-none pointer-events-none"
      >
        ॐ
      </motion.div>

      <motion.div
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 11, repeat: Infinity }}
        className="absolute top-28 right-10 text-[7rem] text-[#d6c3ab] font-bold blur-[2px] select-none pointer-events-none"
      >
        म
      </motion.div>

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4 }}
        className="text-[3rem] md:text-[4rem] font-semibold text-[#4a3525] tracking-[0.06em] text-center z-20"
        style={{ fontFamily: "var(--font-kalyuugh)" }}
      >
        Kalyuugh
      </motion.h1>

      {/* SUBTITLE */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8 }}
        className="mt-3 text-lg md:text-2xl text-[#6a4c3b] font-medium text-center z-20"
        style={{ fontFamily: "var(--font-kalyuugh)" }}
      >
        Step beyond the veil of innocence.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
        className="mt-1 text-sm md:text-lg text-[#856957] text-center tracking-wide z-20"
        style={{ fontFamily: "var(--font-kalyuugh)" }}
      >
        Where karma whispers… and truth refuses to hide.
      </motion.p>

      {/* HERO IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="mt-12 w-full max-w-4xl flex justify-center z-20"
      >
        <img
          src="/chapter_4.png"
          alt="Kalyuugh Portal"
          className="rounded-3xl shadow-2xl border border-[#e0d3c3] w-full object-cover"
        />
      </motion.div>

      {/* SCROLL DOWN INDICATOR */}
      {/* <motion.div
        onClick={scrollToButton}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: [0.3, 1, 0.3], y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-6 text-[#6f5543] cursor-pointer z-30 select-none"
      >
        ↓
      </motion.div> */}

      {/* CTA BUTTON */}
      <motion.div
        ref={buttonRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.4 }}
        className="mt-12 z-20"
      >
        <Link
          href="/chat"
          className="px-10 py-4 rounded-xl text-[#4a3525] bg-[#efe5d8] border border-[#d6c4af] shadow-md text-lg md:text-xl tracking-wide hover:bg-[#ead9c6] hover:shadow-xl transition-all"
          style={{ fontFamily: "var(--font-kalyuugh)" }}
        >
          ENTER INTO THE EXISTENCE
        </Link>
      </motion.div>
    </div>
  );
}
