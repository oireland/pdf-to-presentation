"use client";

import { CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DownloadSuccessProps {
  onReload: () => void;
}

export function DownloadSuccess({ onReload }: DownloadSuccessProps) {
  return (
    <Card className="dark:bg-slate-800 border-green-200 dark:border-green-800">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              PowerPoint Downloaded Successfully!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              Your presentation has been generated and downloaded to your
              device. Check your downloads folder for the PowerPoint file.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <Button onClick={onReload} className="w-full" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Create New Presentation
            </Button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            <p>
              If the download didn't start automatically, please check your
              browser's download settings.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
