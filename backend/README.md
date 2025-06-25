# AI Presentation Generator - Backend

This directory contains the Python backend for the AI Presentation Generator application. It is a FastAPI server responsible for processing uploaded PDF files, using the Google Gemini API to generate presentation content, and returning a downloadable PowerPoint (`.pptx`) file.

---

## Prerequisites

- Python 3.8+
- A Google Gemini API Key

---

## Setup Instructions

Follow these steps to set up and run the backend server locally.

### 1. Create a Virtual Environment

It is highly recommended to use a virtual environment to manage project dependencies. From the project's root directory (`presentation_generator/`), create and activate it:

```bash
# Create the virtual environment
python -m venv .venv

# Activate it (Windows)
.\.venv\Scripts\activate

# Activate it (macOS/Linux)
source .venv/bin/activate
```

### 2. Install Dependencies

All required Python packages are listed in `requirements.txt`. Install them using pip:

```bash
# Make sure you are in the 'backend' directory
cd backend

# Install packages
pip install -r requirements.txt
```

### 3. Configure Environment Variables

The application requires a Google Gemini API key to function.

1.  In the `backend` directory, create a new file named `.env`.
2.  Add your API key to this file as shown below:

    ```
    GOOGLE_API_KEY="your_actual_api_key_here"
    ```
    This file is ignored by Git to keep your API key secure.

---

## Running the Server

Once the setup is complete, you can start the development server from the `backend` directory.

```bash
uvicorn main:app --reload
```

- `main`: Refers to the `main.py` file.
- `app`: Refers to the `app = FastAPI()` instance inside `main.py`.
- `--reload`: Enables auto-reloading, so the server restarts automatically when you save code changes.

The server will be running at `http://127.0.0.1:8000`.

---

## API Endpoint

### `POST /api/generate-presentation`

This is the primary endpoint for the application.

-   **Request:** `multipart/form-data`
    -   **`file`**: The PDF file to be processed.
-   **Successful Response (Status 200):**
    -   **Body:** The binary data of the generated `.pptx` file.
    -   **Headers:**
        -   `Content-Type`: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
        -   `Content-Disposition`: `attachment; filename=presentation.pptx`
-   **Error Response (Status 4xx/5xx):**
    -   **Body:** A JSON object with a `detail` key describing the error.
    ```json
    {
      "detail": "Invalid file type. Please upload a PDF."
    }
    ````