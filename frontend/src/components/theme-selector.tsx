"use client";

import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { themeConfig } from "@/config/themes";
import type { ColorTheme, BackgroundTheme, SelectedTheme } from "@/types/theme";

interface ThemeSelectorProps {
  selectedTheme: SelectedTheme | null;
  onThemeSelect: (theme: SelectedTheme) => void;
}

export function ThemeSelector({
  selectedTheme,
  onThemeSelect,
}: ThemeSelectorProps) {
  const [activeTab, setActiveTab] = useState<"colors" | "backgrounds">(
    "colors"
  );

  const ColorThemeCard = ({ theme }: { theme: ColorTheme }) => {
    const isSelected =
      selectedTheme?.name === theme.name && selectedTheme?.type === theme.type;

    return (
      <div
        className={cn(
          "relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md dark:hover:shadow-slate-900/50",
          isSelected
            ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 dark:border-blue-400"
            : "border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500"
        )}
        onClick={() => onThemeSelect({ name: theme.name, type: theme.type })}
      >
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">
              {theme.displayName}
            </h4>
            {isSelected && (
              <div className="w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <div
                className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm"
                style={{ backgroundColor: theme.primaryColor }}
                title="Primary Color"
              />
              <div
                className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm"
                style={{ backgroundColor: theme.secondaryColor }}
                title="Secondary Color"
              />
              <div
                className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm"
                style={{ backgroundColor: theme.textColor }}
                title="Text Color"
              />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Primary • Secondary • Text
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BackgroundThemeCard = ({ theme }: { theme: BackgroundTheme }) => {
    const isSelected =
      selectedTheme?.name === theme.name && selectedTheme?.type === theme.type;

    return (
      <div
        className={cn(
          "relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md dark:hover:shadow-slate-900/50",
          isSelected
            ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 dark:border-blue-400"
            : "border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500"
        )}
        onClick={() => onThemeSelect({ name: theme.name, type: theme.type })}
      >
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">
              {theme.displayName}
            </h4>
            {isSelected && (
              <div className="w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="aspect-video rounded-md overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm">
            <img
              src={theme.previewImage || "/placeholder.svg"}
              alt={theme.displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src =
                  "/placeholder.svg?height=120&width=160&text=" +
                  encodeURIComponent(theme.displayName);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const getSelectedThemeDisplayName = () => {
    if (!selectedTheme) return null;

    if (selectedTheme.type === "color") {
      return themeConfig.colors.find((t) => t.name === selectedTheme.name)
        ?.displayName;
    } else {
      return themeConfig.backgrounds.find((t) => t.name === selectedTheme.name)
        ?.displayName;
    }
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Palette className="w-5 h-5" />
            Presentation Theme
          </CardTitle>
          {selectedTheme && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs capitalize dark:border-slate-600 dark:text-slate-300"
              >
                {selectedTheme.type}
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs dark:bg-slate-700 dark:text-slate-300"
              >
                {getSelectedThemeDisplayName()}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <Button
            variant={activeTab === "colors" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 dark:hover:bg-slate-600"
            onClick={() => setActiveTab("colors")}
          >
            Colors
          </Button>
          <Button
            variant={activeTab === "backgrounds" ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 dark:hover:bg-slate-600"
            onClick={() => setActiveTab("backgrounds")}
          >
            Backgrounds
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "colors" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themeConfig.colors.map((theme) => (
              <ColorThemeCard key={theme.name} theme={theme} />
            ))}
          </div>
        )}

        {activeTab === "backgrounds" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themeConfig.backgrounds.map((theme) => (
              <BackgroundThemeCard key={theme.name} theme={theme} />
            ))}
          </div>
        )}

        {!selectedTheme && (
          <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
            Select a theme for your presentation
          </div>
        )}
      </CardContent>
    </Card>
  );
}
