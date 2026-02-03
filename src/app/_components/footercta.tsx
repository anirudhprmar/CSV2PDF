"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { motion } from "motion/react";

export default function FooterCTA() {
  return (
    <section className="p-5">
      <div className="mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed bg-muted/20 px-6 py-16 text-center"
        >
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to convert your CSV files?
            </h2>
            <p className="text-muted-foreground text-lg">
              Start viewing, editing, and converting your CSV files to PDF with
              just a few clicks.
            </p>
          </div>
          {/* <Button size="lg" className="text-base shadow-xl">
            Get CSV2PDF
          </Button> */}
          <Link href={"/login"}>
            <Button variant={"default"} size={"lg"} className="text-lg shadow-md tracking-tight">Get CSV2PDF</Button>
        </Link>
        </motion.div>
      </div>
    </section>
  );
}
