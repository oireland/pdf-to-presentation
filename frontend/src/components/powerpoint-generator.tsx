"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SelectedTheme } from "@/types/theme";

interface PowerPointGeneratorProps {
  onGenerate: () => void;
  isGenerating: boolean;
  progress: number;
  slidesCount: number;
  selectedTheme: SelectedTheme | null;
}

export function PowerPointGenerator({
  onGenerate,
  isGenerating,
  progress,
  slidesCount,
  selectedTheme,
}: PowerPointGeneratorProps) {
  const canGenerate = slidesCount > 0 && selectedTheme && !isGenerating;

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">
              Generate PowerPoint
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create a PowerPoint presentation from your slides
              {!selectedTheme && (
                <span className="block text-amber-600 dark:text-amber-400 mt-1">
                  Please select a theme first
                </span>
              )}
            </p>
          </div>
          <Button
            onClick={onGenerate}
            disabled={!canGenerate}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate & Download
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
              {progress}% complete
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
