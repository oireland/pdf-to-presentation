"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Slide } from "@/types/slide"

interface SlideEditorProps {
    slide: Slide
    slideIndex: number
    totalSlides: number
    onTitleChange: (title: string) => void
    onBulletPointChange: (bulletIndex: number, content: string) => void
    onPreviousSlide: () => void
    onNextSlide: () => void
    canGoPrevious: boolean
    canGoNext: boolean
}

export function SlideEditor({
                                slide,
                                slideIndex,
                                totalSlides,
                                onTitleChange,
                                onBulletPointChange,
                                onPreviousSlide,
                                onNextSlide,
                                canGoPrevious,
                                canGoNext,
                            }: SlideEditorProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Slide {slideIndex + 1} of {totalSlides}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={onPreviousSlide} disabled={!canGoPrevious}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={onNextSlide} disabled={!canGoNext}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="slide-title" className="block text-sm font-medium text-slate-700 mb-2">
                            Slide Title
                        </label>
                        <input
                            id="slide-title"
                            type="text"
                            value={slide.title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                            placeholder="Enter slide title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Bullet Points</label>
                        <div className="space-y-3">
                            {slide.bullets.map((bulletPoint, bulletIndex) => (
                                <div key={bulletIndex} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                                        <span className="text-xs font-medium text-blue-600">{bulletIndex + 1}</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={bulletPoint}
                                        onChange={(e) => onBulletPointChange(bulletIndex, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`Bullet point ${bulletIndex + 1}...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
