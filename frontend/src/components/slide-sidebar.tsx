"use client";

import { Plus, Trash2, List, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Slide } from "@/types/slide";

interface SlideSidebarProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideSelect: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
}

export function SlideSidebar({
  slides,
  currentSlideIndex,
  onSlideSelect,
  onAddSlide,
  onDeleteSlide,
}: SlideSidebarProps) {
  const getSlideContentType = (slide: Slide) => {
    if (slide.bullets && slide.bullets.length > 0) return "bullets";
    if (slide.text_block) return "text_block";
    return "empty";
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "bullets":
        return <List className="h-3 w-3" />;
      case "text_block":
        return <FileText className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "bullets":
        return "Bullets";
      case "text_block":
        return "Text";
      default:
        return "Empty";
    }
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Slides
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {slides.map((slide, index) => {
          const contentType = getSlideContentType(slide);
          return (
            <div
              key={slide.id}
              className={cn(
                "relative group cursor-pointer rounded-lg border-2 transition-all",
                currentSlideIndex === index
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-400"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-700/50"
              )}
              onClick={() => onSlideSelect(index)}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="secondary"
                    className="text-xs dark:bg-slate-700 dark:text-slate-300"
                  >
                    Slide {index + 1}
                  </Badge>
                  {slides.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 dark:hover:bg-slate-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSlide(index);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate flex-1 mr-2">
                    {slide.title || "Untitled Slide"}
                  </p>
                  <div className="flex items-center gap-1">
                    {getContentTypeIcon(contentType)}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {getContentTypeLabel(contentType)}
                    </span>
                  </div>
                </div>
                {contentType === "bullets" && slide.bullets && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {slide.bullets.length} bullet
                    {slide.bullets.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          className="w-full dark:border-slate-600 dark:hover:bg-slate-700 bg-transparent"
          onClick={onAddSlide}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Slide
        </Button>
      </CardContent>
    </Card>
  );
}
