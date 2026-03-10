"use client";

import { useCallback, useState, createElement } from "react";
import type { SeriesPdfData, ForecastPoint } from "@/types/export";

/**
 * Inline all computed styles on every element inside a cloned SVG so
 * it renders identically when serialized to a standalone image.
 */
function inlineStyles(svgClone: SVGElement) {
  const elements = svgClone.querySelectorAll("*");
  const importantProps = [
    "fill",
    "fill-opacity",
    "stroke",
    "stroke-width",
    "stroke-dasharray",
    "stroke-linejoin",
    "stroke-linecap",
    "opacity",
    "font-size",
    "font-family",
    "font-weight",
    "text-anchor",
    "dominant-baseline",
    "transform",
    "d",
    "visibility",
    "display",
  ];

  elements.forEach((el) => {
    const computed = window.getComputedStyle(el);
    importantProps.forEach((prop) => {
      const val = computed.getPropertyValue(prop);
      if (val && val !== "none" && val !== "" && val !== "normal") {
        (el as SVGElement).style.setProperty(prop, val);
      }
    });
  });
}

/**
 * Capture the Recharts SVG from within a container element.
 * 1. Finds the recharts-surface SVG
 * 2. Clones it with inlined computed styles
 * 3. Renders to a high-res canvas
 */
async function captureChartSvg(
  container: HTMLElement
): Promise<string | null> {
  // Wait for Recharts animations to settle
  await new Promise((r) => setTimeout(r, 800));

  const svgEl = container.querySelector("svg.recharts-surface") as SVGSVGElement | null;
  if (!svgEl) return null;

  // Use the SVG's own width/height (set by Recharts)
  const svgWidth = svgEl.width.baseVal.value;
  const svgHeight = svgEl.height.baseVal.value;
  if (svgWidth === 0 || svgHeight === 0) return null;

  // Deep clone and inline styles
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

  // Set explicit viewBox matching the SVG dimensions
  if (!clone.getAttribute("viewBox")) {
    clone.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  }

  // Inline all computed styles so they survive serialization
  inlineStyles(clone);

  // Serialize to blob
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const scale = 3;
    const canvas = document.createElement("canvas");
    canvas.width = svgWidth * scale;
    canvas.height = svgHeight * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dark background matching the app brand
    ctx.fillStyle = "#0B1020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new window.Image();
    img.crossOrigin = "anonymous";

    const dataUrl = await new Promise<string>((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("SVG image load failed"));
      img.src = svgUrl;
    });

    return dataUrl;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

/**
 * Fallback: capture the full container via html2canvas.
 */
async function captureChartHtml(
  container: HTMLElement
): Promise<string | null> {
  // Wait for Recharts animations to finish
  await new Promise((r) => setTimeout(r, 800));

  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(container, {
    backgroundColor: "#0B1020",
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
    foreignObjectRendering: false,
    imageTimeout: 10000,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.offsetWidth,
    windowHeight: document.documentElement.offsetHeight,
  });
  return canvas.toDataURL("image/png");
}

export function useExportPdf() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureChart = useCallback(
    async (chartElement: HTMLElement | null): Promise<string | null> => {
      if (!chartElement) return null;

      // Try html2canvas first (best full-DOM fidelity)
      try {
        const htmlResult = await captureChartHtml(chartElement);
        if (htmlResult) return htmlResult;
      } catch (err) {
        console.warn("html2canvas failed, trying SVG capture:", err);
      }

      // Fallback: direct SVG serialization
      try {
        return await captureChartSvg(chartElement);
      } catch (err) {
        console.error("All chart capture methods failed:", err);
        return null;
      }
    },
    []
  );

  const exportSeriesPdf = useCallback(
    async ({
      series,
      jobName,
      forecasts,
      chartRef,
    }: {
      series: SeriesPdfData;
      jobName: string;
      forecasts: ForecastPoint[];
      chartRef: HTMLElement | null;
    }) => {
      setIsExporting(true);
      setError(null);

      try {
        // Dynamic imports — keep @react-pdf/renderer out of the main bundle
        const [{ pdf }, { SeriesPdfReport }] = await Promise.all([
          import("@react-pdf/renderer"),
          import("@/components/export/SeriesPdfReport"),
        ]);

        const chartImage = await captureChart(chartRef);

        const doc = createElement(SeriesPdfReport, {
          series,
          jobName,
          chartImage,
          forecasts,
          generatedAt: new Date(),
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // @ts-expect-error - @react-pdf/renderer types don't match our usage but it works correctly
        const blob = await pdf(doc).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `LumenIQ_${series.series_id}_${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
      } catch (err) {
        console.error("PDF export failed:", err);
        setError(err instanceof Error ? err.message : "Export failed");
        return false;
      } finally {
        setIsExporting(false);
      }
    },
    [captureChart]
  );

  return {
    exportSeriesPdf,
    isExporting,
    error,
  };
}
