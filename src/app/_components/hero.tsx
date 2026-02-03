"use client";

import CsvUpload from "./csv-upload";
import { motion } from "motion/react";

export default function Hero() {

  return (
      <section className="w-full space-y-5">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="flex flex-col items-center justify-center gap-5"
          >
            <div className="flex flex-col items-center max-w-xl text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-semibold md:text-5xl lg:text-6xl tracking-tighter"
              >
                See your CSV&apos;s instantly
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-muted-foreground text-lg mt-4"
              >
                Upload, preview, save, or convert CSV to PDF in seconds.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="w-full"
            >
               <CsvUpload/>
            </motion.div>
          </motion.div>
        </div>
      </section>
  );
}
