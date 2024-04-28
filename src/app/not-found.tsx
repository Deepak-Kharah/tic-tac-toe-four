"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <main className="flex flex-col justify-center items-center w-full p-7  flex-1">
      <section className="flex-1 gap-10 flex flex-col justify-center items-center">
        <h1 className="text-8xl sm:text-9xl text-white font-bold [text-shadow:_0_0px_2rem_rgb(255_255_255_/_50%)]">
          <motion.div className="inline-block">4</motion.div>
          <motion.div
            className="inline-block"
            animate={{
              // random smooth different opacity animation
              opacity: [
                1.0, 0.5, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.2, 0.15, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 0.3, 1,
              ],
            }}
            transition={{
              duration: 5,
              times: [0, 5, 1],
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            0
          </motion.div>
          <motion.div className="inline-block">4</motion.div>
        </h1>
        <h1 className="text-l text-center sm:text-2xl font-light text-slate-300">
          There&apos;s nothing to see here, gamer. Return back or you may wake
          the Glokenzof.
        </h1>
        <p className="text-slate-400">
          Let&apos;s get back to the{" "}
          <Link className="italic text-slate-300" href="/">
            Homepage
          </Link>
        </p>
      </section>
    </main>
  );
}

export default NotFound;
