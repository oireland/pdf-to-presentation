"use client";

import type React from "react";

import { useCallback, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
}

export function UploadArea({
  onFileUpload,
  isDragOver,
  setIsDragOver,
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (files.length > 0) {
        onFileUpload(files[0]);
      }
    },
    [onFileUpload, setIsDragOver]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-slate-400"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Upload PDF Document
          </h3>
          <p className="text-slate-600 mb-4">
            Drag and drop your PDF file here, or click to browse
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <FileText className="mr-2 h-4 w-4" />
            Choose File
          </Button>
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
  );
}
