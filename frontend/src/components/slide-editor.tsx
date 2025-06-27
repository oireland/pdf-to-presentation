"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  List,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Slide } from "@/types/slide";

interface SlideEditorProps {
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
  onTitleChange: (title: string) => void;
  onBulletsChange: (bullets: string[]) => void;
  onTextBlockChange: (textBlock: string) => void;
  onContentTypeChange: (type: "bullets" | "text_block") => void;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function SlideEditor({
  slide,
  slideIndex,
  totalSlides,
  onTitleChange,
  onBulletsChange,
  onTextBlockChange,
  onContentTypeChange,
  onPreviousSlide,
  onNextSlide,
  canGoPrevious,
  canGoNext,
}: SlideEditorProps) {
  // Determine content type based on slide content
  const getContentTypeFromSlide = (slide: Slide): "bullets" | "text_block" => {
    if (slide.bullets && slide.bullets.length > 0) {
      return "bullets";
    }
    if (slide.text_block && slide.text_block.trim().length > 0) {
      return "text_block";
    }
    // Default to bullets if no content exists
    return "bullets";
  };

  const [contentType, setContentType] = useState<"bullets" | "text_block">(
    getContentTypeFromSlide(slide)
  );

  // Update content type when slide changes (navigation)
  useEffect(() => {
    const newContentType = getContentTypeFromSlide(slide);
    setContentType(newContentType);
  }, [slide]); // Use slide to detect when we've navigated to a different slide

  const handleContentTypeChange = (type: "bullets" | "text_block") => {
    setContentType(type);
    onContentTypeChange(type);
  };

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...(slide.bullets || [])];
    newBullets[index] = value;
    onBulletsChange(newBullets);
  };

  const handleAddBullet = () => {
    const newBullets = [...(slide.bullets || []), ""];
    onBulletsChange(newBullets);
  };

  const handleRemoveBullet = (index: number) => {
    const newBullets = (slide.bullets || []).filter((_, i) => i !== index);
    onBulletsChange(newBullets);
  };

  const getTitleWordCount = (title: string) => {
    return title
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const titleWordCount = getTitleWordCount(slide.title);
  const isOverWordLimit = titleWordCount > 10;

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 dark:text-slate-100">
            Slide {slideIndex + 1} of {totalSlides}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousSlide}
              disabled={!canGoPrevious}
              className="dark:border-slate-600 dark:hover:bg-slate-700 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextSlide}
              disabled={!canGoNext}
              className="dark:border-slate-600 dark:hover:bg-slate-700 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Title Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="slide-title"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Slide Title
              </label>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isOverWordLimit ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {titleWordCount}/10 words
                </Badge>
              </div>
            </div>
            <input
              id="slide-title"
              type="text"
              value={slide.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 dark:placeholder-slate-400",
                isOverWordLimit
                  ? "border-red-300 dark:border-red-600"
                  : "border-slate-300 dark:border-slate-600"
              )}
              placeholder="Enter slide title (max 10 words)..."
            />
            {isOverWordLimit && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Title exceeds 10 word limit. Please shorten it.
              </p>
            )}
          </div>

          {/* Content Type Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Content Type
            </label>
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <Button
                variant={contentType === "bullets" ? "default" : "ghost"}
                size="sm"
                className="flex-1 h-8 dark:hover:bg-slate-600"
                onClick={() => handleContentTypeChange("bullets")}
              >
                <List className="mr-2 h-4 w-4" />
                Bullet Points
              </Button>
              <Button
                variant={contentType === "text_block" ? "default" : "ghost"}
                size="sm"
                className="flex-1 h-8 dark:hover:bg-slate-600"
                onClick={() => handleContentTypeChange("text_block")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Text Block
              </Button>
            </div>
          </div>

          {/* Content Editor */}
          {contentType === "bullets" ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Bullet Points
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddBullet}
                  className="dark:border-slate-600 dark:hover:bg-slate-700 bg-transparent"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Bullet
                </Button>
              </div>
              <div className="space-y-3">
                {(slide.bullets || []).map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mt-1">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {bulletIndex + 1}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) =>
                        handleBulletChange(bulletIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
                      placeholder={`Bullet point ${bulletIndex + 1}...`}
                    />
                    {(slide.bullets || []).length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBullet(bulletIndex)}
                        className="flex-shrink-0 h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {(!slide.bullets || slide.bullets.length === 0) && (
                  <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
                    No bullet points yet. Click "Add Bullet" to get started.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Text Block
              </label>
              <Textarea
                value={slide.text_block || ""}
                onChange={(e) => onTextBlockChange(e.target.value)}
                className="min-h-[200px] resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 dark:placeholder-slate-400 border-slate-300 dark:border-slate-600"
                placeholder="Enter your slide content as a text block..."
              />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Use this mode for longer form content, paragraphs, or when
                bullet points aren't suitable.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
