"use client";

import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarkdownRenderer } from "./markdown-renderer";
import { linkifySKUs } from "@/lib/linkify-skus";
import { parseMarkdownSections } from "@/lib/parse-markdown-sections";

interface SynthesisAccordionProps {
  content: string;
  jobId?: string;
  skuList?: string[];
}

export function SynthesisAccordion({
  content,
  jobId,
  skuList,
}: SynthesisAccordionProps) {
  const { preamble, sections } = useMemo(
    () => parseMarkdownSections(content),
    [content]
  );

  const processContent = (text: string) => {
    if (jobId && skuList?.length) {
      return linkifySKUs(text, skuList, jobId);
    }
    return text;
  };

  // No H2 sections found → render as flat markdown (fallback)
  if (sections.length === 0) {
    return <MarkdownRenderer content={processContent(content)} />;
  }

  return (
    <div>
      {preamble && (
        <div className="mb-4">
          <MarkdownRenderer content={processContent(preamble)} />
        </div>
      )}

      <Accordion type="single" collapsible defaultValue="section-0">
        {sections.map((section, index) => (
          <AccordionItem
            key={index}
            value={`section-${index}`}
            className="border-b border-[var(--color-border)] last:border-b-0"
          >
            <AccordionTrigger
              className="text-base font-semibold font-display text-[var(--color-text)] hover:no-underline hover:bg-[var(--color-bg-surface)] px-4 py-3 rounded-lg data-[state=open]:bg-[var(--color-bg-surface)]"
            >
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4 bg-[var(--color-bg-surface)]">
              <MarkdownRenderer
                content={processContent(section.content)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
