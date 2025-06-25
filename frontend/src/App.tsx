import { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Loader2, AlertCircle } from 'lucide-react';

// Define the shape of our status object for type safety
interface Status {
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
}

// The main application component
export default function App() {
    // State to hold the selected file
    const [file, setFile] = useState<File | null>(null);
    // State to manage the application's status
    const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });
    // Ref to access the hidden file input element
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Handles file selection from the input dialog
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setStatus({ type: 'idle', message: '' }); // Clear any previous errors
        } else {
            setFile(null);
            setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
        }
    };

    // Triggers the hidden file input when the drop zone is clicked
    const handleDropZoneClick = () => {
        fileInputRef.current?.click();
    };

    // Clears the current file selection
    const handleClearFile = () => {
        setFile(null);
        setStatus({ type: 'idle', message: '' });
    };

    // Handles the file generation process
    const handleGenerate = async () => {
        if (!file) return;

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);

        // Set status to loading
        setStatus({ type: 'loading', message: 'Uploading and processing PDF...' });

        try {
            // Make the POST request to the Python backend
            const response = await axios.post('http://127.0.0.1:8000/api/generate-presentation', formData, {
                responseType: 'blob', // Important: expect binary data for SUCCESSFUL responses
            });

            // Create a URL for the returned blob and trigger a download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // Extract filename from headers or default
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'presentation.pptx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch.length > 1) {
                    filename = filenameMatch[1];
                }
            }
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // Clean up by revoking the object URL and removing the link
            window.URL.revokeObjectURL(url);
            link.parentNode?.removeChild(link);


            // Reset the UI
            setStatus({ type: 'success', message: 'Download started successfully!' });
            setFile(null);

        } catch (error) {
            // Handle errors
            let errorMessage = 'An unknown error occurred.';
            // Check if the error is from Axios and has a response from the server
            if (axios.isAxiosError(error) && error.response) {
                // For FastAPI HTTPExceptions, the error data is usually a JSON object.
                const errorData = error.response.data;
                // Check if the parsed data has a 'detail' property, which FastAPI uses.
                if (errorData && typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail;
                } else {
                    errorMessage = 'The server returned an error with an unexpected format.';
                }
            } else if (error instanceof Error) {
                // Handle other types of errors (e.g., network issues)
                errorMessage = error.message;
            }
            setStatus({ type: 'error', message: errorMessage });
        }
    };

    // Render the component
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-lg bg-white dark:bg-slate-900 border dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-2xl text-slate-900 dark:text-slate-50">AI Presentation Generator</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                        Upload a PDF report to instantly convert it into a downloadable PowerPoint presentation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* File Input Area */}
                        <div
                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200"
                            onClick={handleDropZoneClick}
                        >
                            <Upload className="w-12 h-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Drag & drop a file or
                            </p>
                            <Button variant="outline" className="mt-2 pointer-events-none">
                                Choose File
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="application/pdf"
                            />
                        </div>

                        {/* Display selected file */}
                        {file && (
                            <div className="flex items-center justify-center">
                                <Badge variant="secondary" className="flex items-center gap-2 p-2">
                                    <FileText className="h-4 w-4" />
                                    <span>{file.name}</span>
                                    <button onClick={handleClearFile} className="ml-2 focus:outline-none">
                                        <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                                    </button>
                                </Badge>
                            </div>
                        )}

                        {/* Status/Error Alert */}
                        {status.type !== 'idle' && status.type !== 'success' && (
                            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                                {status.type === 'loading' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertTitle>
                                    {status.type === 'loading' ? 'Processing...' : 'Error'}
                                </AlertTitle>
                                <AlertDescription>{status.message}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
                        onClick={handleGenerate}
                        disabled={!file || status.type === 'loading'}
                    >
                        {status.type === 'loading' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Generate Presentation'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
