"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { motion } from "motion/react";

export default function FAQs() {
  const faqs = [
    {
      question:"Does this app store my files ?",
      answer:"No, we don't store any of your files. Everything that is viewed or converted is handled in the browser and is not stored on our servers. Meaning you completely own your data."
    },
    {
      question: "Is this app free, or what are the in-app purchase options?",
      answer:
        "The app is free to use with features like viewing your csv files, saving your files, unlimited csv to pdf conversions.",
    },
    {
      question: "Can the app handle large CSV files without crashing?",
      answer:
        "Yes, our app is optimized to handle large CSV files efficiently for viewing but for conversion we support files under 4MB. ",
    },
    {
      question: "Can I edit cells, rows, or columns directly in the viewer?",
      answer:
        "Currently, the app is designed primarily for viewing and converting CSV files. Basic editing capabilities like sorting and filtering are available. Full editing features including cell modification, row/column operations are planned for future releases based on user feedback.",
    },
    {
      question: "How do I convert a CSV file to PDF using the app?",
      answer:
        "Converting your CSV to PDF is simple: First, upload your CSV file using the file picker or drag-and-drop area. Once the file is loaded and displayed in the viewer, click the 'Download PDF' button in the toolbar.",
    },
  ];

  return (
    <section className="p-5" id="faq">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-muted-foreground">
            Have another question? Contact us on <Link href="https://x.com/anirudhprmar" target="_blank" className="underline">X</Link>
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
