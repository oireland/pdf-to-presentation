# AI Presentation Generator

This project is a full-stack web application that transforms PDF documents into downloadable PowerPoint presentations. It uses a FastAPI backend to handle PDF processing and AI content generation, and a React frontend to provide a modern, interactive user interface.

## Features

-   **PDF Upload**: Upload any PDF document through a drag-and-drop interface.
-   **AI Content Generation**: Leverages the Google Gemini API to analyze the PDF's text and generate logical, summarized slide content.
-   **Image Extraction**: Automatically extracts images from the PDF, handles transparency, and suggests them for inclusion in the presentation.
-   **Dynamic Slide Editor**: An interactive editor to review, modify, add, or delete the AI-generated slides.
-   **Theming**: Apply color schemes or background images to the presentation for a professional look.
-   **Dynamic Layouts**: Automatically adjusts slide layouts to cleanly present text and images side-by-side.
-   **PowerPoint Export**: Generates and downloads a `.pptx` file based on your final content and theme selection.

---

## Tech Stack

-   **Frontend**:
    -   React (with TypeScript)
    -   Vite for a fast development experience
    -   Tailwind CSS for styling
    -   Shadcn/ui components
    -   Lucide for icons
-   **Backend**:
    -   FastAPI for the API server
    -   Python 3.8+
    -   PyMuPDF (fitz) for PDF text and image extraction
    -   Google Generative AI for content summarization
    -   `python-pptx` for creating PowerPoint files
    -   Pillow for image processing

---

## Project Structure

```
pdf-to-presentation/
├── backend/
│   ├── .venv/
│   ├── pyproject.toml         # Backend dependencies and project config
│   ├── src/
│   │   └── pdf_to_presentation/ # Main backend Python package
│   │       ├── __init__.py
│   │       ├── main.py
│   │       └── ...
│   └── tests/
│       └── test_main.py
│
├── frontend/
│   ├── public/
│   ├── src/                   # Main frontend source code
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration with backend proxy
│
└── README.md                  # This file
```

---

## Setup and Installation

Follow these steps to set up and run the project locally.

### 1. Backend Setup

First, set up the Python backend server.

1.  **Navigate to the Backend Directory**:
    ```bash
    cd backend
    ```

2.  **Create and Activate a Virtual Environment**:
    ```bash
    # Create the virtual environment
    python -m venv .venv

    # Activate it (Windows)
    .\.venv\Scripts\activate

    # Activate it (macOS/Linux)
    source .venv/bin/activate
    ```

3.  **Install Dependencies**: The project uses `pyproject.toml` to manage dependencies. Install the project in "editable" mode (`-e`), which allows code changes to apply without reinstalling.
    ```bash
    pip install -e .
    ```

4.  **Configure Environment Variables**: The backend requires a Google Gemini API key.
    -   Create a new file named `.env` inside the `backend` directory.
    -   Add your API key to this file:
        ```
        GOOGLE_API_KEY="your_actual_api_key_here"
        ```

### 2. Frontend Setup

Next, set up the React frontend.

1.  **Navigate to the Frontend Directory**:
    ```bash
    cd frontend
    ```

2.  **Install NPM Dependencies**:
    ```bash
    npm install
    ```

---

## Running the Application

To run the application, you need to start both the backend and frontend servers in separate terminals.

1.  **Start the Backend Server**:
    -   Make sure you are in the `backend` directory and your virtual environment is activated.
    -   Run the Uvicorn server:
        ```bash
        uvicorn pdf_to_presentation.main:app --reload
        ```
    -   The backend will be running at `http://127.0.0.1:8000`.

2.  **Start the Frontend Server**:
    -   Open a **new terminal** and navigate to the `frontend` directory.
    -   Run the Vite development server:
        ```bash
        npm run dev
        ```
    -   The frontend will be running at `http://localhost:5173` (or another port if 5173 is busy).

You can now open your browser and navigate to the frontend URL to use the application. The frontend is configured to proxy API requests to the backend, so everything should work together seamlessly.
