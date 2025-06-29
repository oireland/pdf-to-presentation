# AI Presentation Generator - Backend

This directory contains the Python backend for the AI Presentation Generator application. It is a FastAPI server responsible for processing uploaded PDF files (including text and images), using the Google Gemini API to generate presentation content, and returning a downloadable PowerPoint (`.pptx`) file with a selected theme.

---

## Project Structure

This project follows a standard "src layout" structure for better organization and maintainability.

```
backend/
├── .venv/
├── pyproject.toml             # Project configuration and dependencies
├── src/
│   └── pdf_to_presentation/   # The main application package
│       ├── __init__.py
│       ├── main.py            # FastAPI application logic
│       ├── theme_config.py    # Theme definitions
│       └── backgrounds/       # Background image assets
└── tests/
    └── test_main.py           # Unit tests
```

---

## Setup Instructions

Follow these steps to set up and run the backend server locally.

### 1. Create a Virtual Environment

It is highly recommended to use a virtual environment to manage project dependencies. From the `backend` directory, create and activate it:

```bash
# Create the virtual environment
python -m venv .venv

# Activate it (Windows)
.\.venv\Scripts\activate

# Activate it (macOS/Linux)
source .venv/bin/activate
```

### 2. Install Dependencies

This project uses `pyproject.toml` to manage dependencies. Once your virtual environment is activated, install the project in "editable" mode. This allows any changes you make to the source code to be immediately available without needing to reinstall.

From the `backend` directory, run:
```bash
pip install -e .
```

### 3. Configure Environment Variables

The application requires a Google Gemini API key to function.

1.  In the `backend` directory, create a new file named `.env`.
2.  Add your API key to this file as shown below:

    ```
    GOOGLE_API_KEY="your_actual_api_key_here"
    ```
    Git ignores this file to keep your API key secure.

---

## Running the Server

Once the setup is complete, you can start the development server. Ensure you are in the `backend` directory and your virtual environment is activated.

```bash
uvicorn pdf_to_presentation.main:app --reload
```

* `pdf_to_presentation.main`: Refers to the `main.py` file inside your source package.
* `app`: Refers to the `app = FastAPI()` instance inside `main.py`.
* `--reload`: Enables auto-reloading, so the server restarts automatically when you save code changes.

The server will be running at `http://127.0.0.1:8000`.

---

## Running Tests

To run the unit tests for the project, use the following command from the `backend` directory:
```bash
python -m unittest discover tests
```

---

## API Endpoints

### `POST /api/generate-slide-content`

This endpoint processes a PDF file, extracts its text and images, and generates slide content.

* **Request:** `multipart/form-data`
    * **`file`**: The PDF file to be processed.
    * **`detail_level`**: An integer from 0 (very concise) to 4 (very detailed).
* **Successful Response (Status 200):**
    * **Body:** JSON object containing the generated slide content. Filename will reference any extracted images.
    ```json
    {
      "slides": [
        {
          "title": "Slide with an Image",
          "bullets": null,
          "text_block": "This slide discusses the included image.",
          "image_filename": "image_1_1_a1b2c3d4.png"
        }
      ]
    }
    ```

### `POST /api/generate-presentation`

This endpoint creates a PowerPoint presentation from provided slide content and a theme.

* **Request:** `application/json`
    * **Body:**
    ```json
    {
      "slides": [
        {
          "title": "Slide Title",
          "bullets": ["Bullet point 1"],
          "image_filename": "image_1_1_a1b2c3d4.png"
        }
      ],
      "theme_type": "color",
      "theme_name": "corporate_blue"
    }
    ```
* **Successful Response (Status 200):**
    * **Body:** The binary data of the generated `.pptx` file.
    * **Headers:**
        * `Content-Type`: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
        * `Content-Disposition`: `attachment; filename=presentation.pptx`

### `GET /images/{image_filename}`

Serves the static image files extracted from the PDF.

* **Path Parameter:**
    * `image_filename`: The name of the image file returned by the `/api/generate-slide-content` endpoint.
* **Successful Response (Status 200):**
    * **Body:** The image file.
```