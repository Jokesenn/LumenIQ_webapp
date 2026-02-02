"use client";

import { useCallback, useState, createElement } from "react";
import { pdf } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { SeriesPdfReport } from "@/components/export/SeriesPdfReport";
import type { SeriesPdfData, ForecastPoint } from "@/types/export";

export function useExportPdf() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureChart = useCallback(
    async (chartElement: HTMLElement | null): Promise<string | null> => {
      if (!chartElement) return null;

      try {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: "#0f0f0f",
          scale: 2,
          logging: false,
          useCORS: true,
        });
        return canvas.toDataURL("image/png");
      } catch (err) {
        console.error("Failed to capture chart:", err);
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
        const chartImage = await captureChart(chartRef);

        const doc = createElement(SeriesPdfReport, {
          series,
          jobName,
          chartImage,
          forecasts,
          generatedAt: new Date(),
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const blob = await pdf(doc as any).toBlob();

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
