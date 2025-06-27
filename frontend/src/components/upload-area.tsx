"use client";

import type React from "react";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DetailLevelSelector } from "@/components/detail-level-selector";

interface UploadAreaProps {
  onFileUpload: (file: File, detailLevel: number) => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
}

export function UploadArea({
  onFileUpload,
  isDragOver,
  setIsDragOver,
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detailLevel, setDetailLevel] = useState(2); // Default to "Normal"

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    [setIsDragOver]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    },
    [setIsDragOver]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0].type === "application/pdf") {
        setSelectedFile(files[0]);
      } else {
        alert("Please upload a PDF file");
      }
    },
    [setIsDragOver]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].type === "application/pdf") {
        setSelectedFile(files[0]);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleGenerateContent = () => {
    if (selectedFile) {
      onFileUpload(selectedFile, detailLevel);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-8">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
              isDragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-400"
                : "border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <FileText className="mx-auto h-12 w-12 text-green-500 dark:text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    File Selected
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={handleRemoveFile}>
                    Remove File
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Choose Different File
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Upload PDF Document
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <FileText className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <>
          <DetailLevelSelector
            detailLevel={detailLevel}
            onDetailLevelChange={setDetailLevel}
          />

          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1 text-slate-900 dark:text-slate-100">
                    Generate Slide Content
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Extract content from your PDF with the selected detail level
                  </p>
                </div>
                <Button
                  onClick={handleGenerateContent}
                  className="w-full sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Generate Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
