"use client";

import classNames from "classnames";
import { Variants, motion } from "framer-motion";
import { Satisfy } from "next/font/google";
import Link from "next/link";
import React, { useEffect } from "react";
import { annotate, annotationGroup } from "rough-notation";
import { RoughAnnotationConfig } from "rough-notation/lib/model";
import style from "./Homepage.module.css";

const satisfy = Satisfy({ subsets: ["latin"], weight: ["400"] });

const mainDescriptionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function Homepage() {
  const twistRef = React.useRef<HTMLSpanElement>(null);
  const fourPiecesRef = React.useRef<HTMLSpanElement>(null);
  const neverDrawsRef = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (twistRef.current && neverDrawsRef.current && fourPiecesRef.current) {
      const annotationConfig: RoughAnnotationConfig = {
        type: "underline",
        color: "#3b82f6",
        iterations: 1,
        animationDuration: 500,
        padding: [2, 10],
        strokeWidth: 1,
      };
      const notationGroup = annotationGroup([
        annotate(twistRef.current, annotationConfig),
        annotate(fourPiecesRef.current, annotationConfig),
        annotate(neverDrawsRef.current, annotationConfig),
      ]);

      notationGroup.show();
    }
  }, []);
  return (
    <div>
      <section className="flex flex-col items-center w-full px-3 py-10 gap-8">
        <h1 className="text-5xl font-light">
          Tic Tac Toe{" "}
          <em className={classNames(satisfy.className, "text-blue-500")}>
            Four
          </em>
        </h1>
        <motion.div
          className="leading-7 text-center text-l font-light"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.5 }}
        >
          <motion.p variants={mainDescriptionVariants}>
            It&apos;s your regular Tic Tac Toe but with a{" "}
            <span ref={twistRef} className="text-blue-300">
              twist
            </span>
            .
          </motion.p>
          <motion.p variants={mainDescriptionVariants}>
            You can place at most{" "}
            <span ref={fourPiecesRef} className="text-blue-300">
              four of your pieces
            </span>
            .
          </motion.p>
          <motion.p variants={mainDescriptionVariants}>
            It means, this game{" "}
            <span ref={neverDrawsRef} className="text-blue-300">
              never draws
            </span>
            .
          </motion.p>
        </motion.div>
        <Link
          className={classNames(
            // "rounded-xl text-sm px-8 py-3 shadow-lg border border-stone-800",
            // style.button
            "px-4 py-2 text-sm font-light rounded-lg focus:z-10 focus:ring-2  border-gray-900 bg-gray-800 text-slate-300 hover:text-white hover:bg-gray-900 hover:border-blue-800 focus:ring-blue-500 focus:text-white disabled:text-gray-700 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:text shadow-lg transition-all"
          )}
          href={"/game"}
        >
          Play game
        </Link>
      </section>
    </div>
  );
}

export default Homepage;
