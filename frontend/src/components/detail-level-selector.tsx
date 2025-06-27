"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface DetailLevelSelectorProps {
  detailLevel: number;
  onDetailLevelChange: (level: number) => void;
}

const detailLevels = [
  {
    value: 0,
    label: "Very Concise",
    description: "Minimal content, key points only",
  },
  {
    value: 1,
    label: "Concise",
    description: "Brief content with essential details",
  },
  {
    value: 2,
    label: "Normal",
    description: "Balanced content with good detail",
  },
  {
    value: 3,
    label: "Detailed",
    description: "Comprehensive content with examples",
  },
  {
    value: 4,
    label: "Very Detailed",
    description: "Extensive content with full explanations",
  },
];

export function DetailLevelSelector({
  detailLevel,
  onDetailLevelChange,
}: DetailLevelSelectorProps) {
  const currentLevel = detailLevels[detailLevel];

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <FileText className="w-5 h-5" />
          Content Detail Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Detail Level
            </span>
            <Badge
              variant="secondary"
              className="dark:bg-slate-700 dark:text-slate-300"
            >
              {currentLevel.label}
            </Badge>
          </div>

          <div className="px-2">
            <Slider
              value={[detailLevel]}
              onValueChange={(value) => onDetailLevelChange(value[0])}
              max={4}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
            <span>Very Concise</span>
            <span>Very Detailed</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {currentLevel.label}:
            </span>{" "}
            {currentLevel.description}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-1">
          {detailLevels.map((level, index) => (
            <button
              key={level.value}
              onClick={() => onDetailLevelChange(level.value)}
              className={`p-2 text-xs rounded transition-colors ${
                detailLevel === index
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
