"use client";

import { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { UploadArea } from "@/components/upload-area";
import { ProcessingIndicator } from "@/components/processing-indicator";
import { SlideSidebar } from "@/components/slide-sidebar";
import { SlideEditor } from "@/components/slide-editor";
import { ThemeSelector } from "@/components/theme-selector";
import { PowerPointGenerator } from "@/components/powerpoint-generator";
import { processPDF, generatePowerPoint } from "@/lib/pdf-processing";
import type { Slide } from "@/types/slide";
import type { SelectedTheme } from "@/types/theme";
import { ModeToggle } from "./components/mode-toggle";

export default function App() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<SelectedTheme | null>(
    null
  );
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle file upload with detail level
  const handleFileUpload = useCallback(
    async (file: File, detailLevel: number) => {
      if (file.type === "application/pdf") {
        setIsProcessingPDF(true);
        setProcessingProgress(0);

        try {
          const extractedSlides = await processPDF(
            file,
            detailLevel,
            setProcessingProgress
          );
          setSlides(extractedSlides);
          setCurrentSlideIndex(0);
        } catch (error) {
          console.error("Error processing PDF:", error);
        } finally {
          setTimeout(() => {
            setIsProcessingPDF(false);
            setProcessingProgress(0);
          }, 500);
        }
      } else {
        alert("Please upload a PDF file");
      }
    },
    []
  );

  // Slide management
  const updateSlideTitle = (index: number, title: string) => {
    setSlides((prev) =>
      prev.map((slide, i) => (i === index ? { ...slide, title } : slide))
    );
  };

  const updateSlideBullets = (index: number, bullets: string[]) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === index ? { ...slide, bullets, text_block: undefined } : slide
      )
    );
  };

  const updateSlideTextBlock = (index: number, textBlock: string) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === index
          ? { ...slide, text_block: textBlock, bullets: undefined }
          : slide
      )
    );
  };

  const removeSlideImage = (index: number) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === index ? { ...slide, image_filename: undefined } : slide
      )
    );
  };

  const updateSlideContentType = (
    index: number,
    type: "bullets" | "text_block"
  ) => {
    setSlides((prev) =>
      prev.map((slide, i) => {
        if (i === index) {
          if (type === "bullets") {
            return {
              ...slide,
              bullets: slide.bullets || [""],
              text_block: undefined,
            };
          } else {
            return {
              ...slide,
              text_block: slide.text_block || "",
              bullets: undefined,
            };
          }
        }
        return slide;
      })
    );
  };

  const addNewSlide = () => {
    const newSlide: Slide = {
      title: "New Slide Title",
      bullets: ["First bullet point"],
    };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length > 1) {
      setSlides((prev) => prev.filter((_, i) => i !== index));
      if (currentSlideIndex >= slides.length - 1) {
        setCurrentSlideIndex(Math.max(0, slides.length - 2));
      }
    }
  };

  // Generate PowerPoint
  const handleGeneratePowerPoint = async () => {
    if (!selectedTheme) {
      alert("Please select a theme first");
      return;
    }

    setIsGeneratingPPT(true);
    setGenerationProgress(0);

    try {
      await generatePowerPoint(slides, selectedTheme, setGenerationProgress);
    } catch (error) {
      console.error("Error generating PowerPoint:", error);
    } finally {
      setTimeout(() => {
        setIsGeneratingPPT(false);
        setGenerationProgress(0);
      }, 1000);
    }
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                PDF to PowerPoint Editor
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Upload a PDF, edit the extracted content, and generate a
                PowerPoint presentation
              </p>
            </div>
            <ModeToggle />
          </div>
        </div>

        {/* Upload Area */}
        {slides.length === 0 && !isProcessingPDF && (
          <UploadArea
            onFileUpload={handleFileUpload}
            isDragOver={isDragOver}
            setIsDragOver={setIsDragOver}
          />
        )}

        {/* Processing Indicator */}
        {isProcessingPDF && (
          <ProcessingIndicator progress={processingProgress} />
        )}

        {/* Main Editor */}
        {slides.length > 0 && !isProcessingPDF && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Slide Sidebar */}
            <div className="lg:col-span-1">
              <SlideSidebar
                slides={slides}
                currentSlideIndex={currentSlideIndex}
                onSlideSelect={setCurrentSlideIndex}
                onAddSlide={addNewSlide}
                onDeleteSlide={deleteSlide}
              />
            </div>

            {/* Main Editor */}
            <div className="lg:col-span-3">
              {currentSlide && (
                <SlideEditor
                  slide={currentSlide}
                  slideIndex={currentSlideIndex}
                  totalSlides={slides.length}
                  onTitleChange={(title) =>
                    updateSlideTitle(currentSlideIndex, title)
                  }
                  onBulletsChange={(bullets) =>
                    updateSlideBullets(currentSlideIndex, bullets)
                  }
                  onTextBlockChange={(textBlock) =>
                    updateSlideTextBlock(currentSlideIndex, textBlock)
                  }
                  onImageRemove={() => removeSlideImage(currentSlideIndex)}
                  onContentTypeChange={(type) =>
                    updateSlideContentType(currentSlideIndex, type)
                  }
                  onPreviousSlide={() =>
                    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
                  }
                  onNextSlide={() =>
                    setCurrentSlideIndex(
                      Math.min(slides.length - 1, currentSlideIndex + 1)
                    )
                  }
                  canGoPrevious={currentSlideIndex > 0}
                  canGoNext={currentSlideIndex < slides.length - 1}
                />
              )}

              <Separator className="my-6 dark:bg-slate-700" />

              {/* Theme Selector */}
              <ThemeSelector
                selectedTheme={selectedTheme}
                onThemeSelect={setSelectedTheme}
              />

              <Separator className="my-6 dark:bg-slate-700" />

              <PowerPointGenerator
                onGenerate={handleGeneratePowerPoint}
                isGenerating={isGeneratingPPT}
                progress={generationProgress}
                slidesCount={slides.length}
                selectedTheme={selectedTheme}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
