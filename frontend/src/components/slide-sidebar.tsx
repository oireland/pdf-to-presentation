"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Slide } from "@/types/slide"

interface SlideSidebarProps {
    slides: Slide[]
    currentSlideIndex: number
    onSlideSelect: (index: number) => void
    onAddSlide: () => void
    onDeleteSlide: (index: number) => void
}

export function SlideSidebar({
                                 slides,
                                 currentSlideIndex,
                                 onSlideSelect,
                                 onAddSlide,
                                 onDeleteSlide,
                             }: SlideSidebarProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Slides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            "relative group cursor-pointer rounded-lg border-2 transition-all",
                            currentSlideIndex === index ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300",
                        )}
                        onClick={() => onSlideSelect(index)}
                    >
                        <div className="p-3">
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                    Slide {index + 1}
                                </Badge>
                                {slides.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDeleteSlide(index)
                                        }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" onClick={onAddSlide}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Slide
                </Button>
            </CardContent>
        </Card>
    )
}
