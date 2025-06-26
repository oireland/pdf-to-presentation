"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PowerPointGeneratorProps {
    onGenerate: () => void
    isGenerating: boolean
    progress: number
    slidesCount: number
}

export function PowerPointGenerator({ onGenerate, isGenerating, progress, slidesCount }: PowerPointGeneratorProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold mb-1">Generate PowerPoint</h3>
                        <p className="text-sm text-slate-600">Create a PowerPoint presentation from your slides</p>
                    </div>
                    <Button onClick={onGenerate} disabled={isGenerating || slidesCount === 0} className="w-full sm:w-auto">
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Generate & Download
                            </>
                        )}
                    </Button>
                </div>

                {isGenerating && (
                    <div className="mt-4">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-slate-500 mt-2 text-center">{progress}% complete</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
