"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProcessingIndicatorProps {
    progress: number
}

export function ProcessingIndicator({ progress }: ProcessingIndicatorProps) {
    return (
        <Card className="mb-8">
            <CardContent className="p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">Processing PDF...</h3>
                    <p className="text-slate-600 mb-4">Extracting content from your document</p>
                    <Progress value={progress} className="w-full max-w-md mx-auto" />
                    <p className="text-sm text-slate-500 mt-2">{progress}% complete</p>
                </div>
            </CardContent>
        </Card>
    )
}
