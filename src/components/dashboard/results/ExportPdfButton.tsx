"use client";

import { type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useExportPdf } from "@/hooks/useExportPdf";
import type { SeriesPdfData, ForecastPoint } from "@/types/export";

interface ExportPdfButtonProps {
  series: SeriesPdfData;
  jobName: string;
  forecasts: ForecastPoint[];
  chartRef: RefObject<HTMLElement | null>;
  variant?: "default" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function ExportPdfButton({
  series,
  jobName,
  forecasts,
  chartRef,
  variant = "secondary",
  size = "sm",
}: ExportPdfButtonProps) {
  const { exportSeriesPdf, isExporting } = useExportPdf();

  const handleExport = async () => {
    await exportSeriesPdf({
      series,
      jobName,
      forecasts,
      chartRef: chartRef.current,
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      {isExporting ? "Export..." : "Export PDF"}
    </Button>
  );
}
