"use client";

import { useState } from "react";
import { X, ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SlideImageProps {
  imageFilename?: string;
  onRemoveImage: () => void;
  className?: string;
}

export function SlideImage({
  imageFilename,
  onRemoveImage,
  className,
}: SlideImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!imageFilename) {
    return null;
  }

  const imageUrl = `/images/${imageFilename}`;

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <Card className={cn("dark:bg-slate-800 dark:border-slate-700", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Slide Image
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveImage}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          {imageLoading && (
            <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          )}

          {imageError ? (
            <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">Failed to load image</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {imageFilename}
              </p>
            </div>
          ) : (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Slide image"
              className={cn(
                "w-full rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm",
                imageLoading ? "hidden" : "block"
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p
            className="text-xs text-slate-500 dark:text-slate-400 truncate"
            title={imageFilename}
          >
            {imageFilename}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveImage}
            className="text-xs h-7 px-2 dark:border-slate-600 dark:hover:bg-slate-700 bg-transparent"
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
