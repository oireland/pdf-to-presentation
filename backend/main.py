# main.py
# Import necessary libraries
import os
import fitz  # PyMuPDF
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pptx import Presentation
import json
import io
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List
from pptx.dml.color import RGBColor

# --- Models ---
class Slide(BaseModel):
    title: str = Field(..., description="The title of the slide (maximum 10 words)")
    bullets: List[str] = Field(..., description="List of bullet points (maximum 3 per slide)")

class PresentationContent(BaseModel):
    slides: List[Slide] = Field(..., description="List of slides for the presentation")
    background: str = Field(None, description="Background for slides. Can be a hex color code (e.g., '#FFFFFF'), a predefined color name (blue, light_blue, dark_blue, green, light_green, dark_green, red, light_red, dark_red, yellow, purple, orange, pink, gray, light_gray, dark_gray, black, white), or an image filename from the backgrounds directory (e.g., 'blue_gradient.jpg', 'green_gradient.jpg', 'geometric_pattern.jpg')")

# --- Configuration ---
load_dotenv()
app = FastAPI(title="PDF to Presentation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set.")
    genai.configure(api_key=api_key)
except ValueError as e:
    print(f"ERROR: {e}")


# --- Helper Functions ---

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extracts text content from a PDF file's bytes."""
    full_text = ""
    with fitz.open(stream=pdf_content, filetype="pdf") as doc:
        for page in doc:
            full_text += page.get_text()
    print(f"Successfully extracted {len(full_text)} characters from the PDF.")
    return full_text


def generate_slides_content_with_gemini(text: str) -> List[Slide]:
    """Uses Gemini to generate presentation content from text."""
    print("Generating slide content with Gemini...")
    model = genai.GenerativeModel('gemini-2.0-flash')
    prompt = f"""
    Based on the following text from a report, please generate a summary presentation.
    The output should be a valid JSON object.

    The JSON object must be a single list `[]` containing multiple slide objects {{}}.

    Each slide object must have two keys:
    1. "title": A string for the slide's title (maximum 10 words).
    2. "bullets": A list of strings, where each string is a key takeaway or bullet point (maximum 3 bullet points per slide).

    Summarize the key points and structure them logically for a presentation.

    Here is the text:
    ---
    {text}
    ---
    """
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip().replace("```json", "").replace("```", "")
        raw_slide_data = json.loads(response_text)

        if not isinstance(raw_slide_data, list):
            raise ValueError("AI response is not a list.")
        if raw_slide_data and any("title" not in s or "bullets" not in s for s in raw_slide_data):
            raise ValueError("AI response is missing required keys ('title', 'bullets').")

        # Convert raw dictionaries to Slide objects
        slide_data = [Slide(title=slide["title"], bullets=slide["bullets"]) for slide in raw_slide_data]

        print("Successfully generated and parsed slide data from Gemini.")
        return slide_data
    except Exception as e:
        print(f"An error occurred during Gemini content generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate or parse content from AI.")

def set_slide_background_image(prs, slide, image_path):
    """
    Sets the background of a slide to an image by adding a full-slide picture
    and sending it to the back.

    WARNING: This method uses internal, non-public APIs of python-pptx (e.g., _spTree).
    This means it is subject to breaking changes in future versions of the library
    without prior notice. Use with caution and be prepared to update your code.

    Args:
        prs (pptx.presentation.Presentation): The presentation object.
        slide (pptx.slide.Slide): The slide object to modify.
        image_path (str): The path to the image file.
    """
    left = top = 0
    width = prs.slide_width
    height = prs.slide_height

    # Add the picture to the slide, covering the entire area
    pic = slide.shapes.add_picture(image_path, left, top, width, height)

    # --- START OF INTERNAL API USAGE ---
    # These lines manipulate the internal XML structure (shape tree)
    # to change the Z-order of the picture. This is not part of the
    # public API and might break in future python-pptx versions.
    try:
        # Accessing shape_id forces the shape to be created in the XML tree
        _ = pic.shape_id
        # Remove the picture element from its current position
        slide.shapes._spTree.remove(pic._element)
        # Insert it at index 2 to send it to the back
        # (index 0 and 1 are usually for XML declaration and other core elements)
        slide.shapes._spTree.insert(2, pic._element)
    except AttributeError:
        # Fallback if internal structure changes dramatically (unlikely for _element)
        print("Warning: Could not manipulate Z-order using internal APIs. "
              "Image might not be at the back.")
    # --- END OF INTERNAL API USAGE ---

def create_presentation(slide_data: List[Slide], background: str = None) -> io.BytesIO:
    """Creates a PowerPoint presentation from structured data with optional background."""
    print("Creating a new blank presentation...")

    # Create a new presentation object from scratch
    prs = Presentation()
    # Set a standard widescreen format
    prs.slide_width = 9144000
    prs.slide_height = 5143500

    # Use the standard "Title and Content" layout
    title_and_content_layout = prs.slide_layouts[1]

    # Predefined color map for named colors
    color_map = {
        "blue": "0000FF",
        "light_blue": "ADD8E6",
        "dark_blue": "00008B",
        "green": "008000",
        "light_green": "90EE90",
        "dark_green": "006400",
        "red": "FF0000",
        "light_red": "FFA07A",
        "dark_red": "8B0000",
        "yellow": "FFFF00",
        "purple": "800080",
        "orange": "FFA500",
        "pink": "FFC0CB",
        "gray": "808080",
        "light_gray": "D3D3D3",
        "dark_gray": "A9A9A9",
        "black": "000000",
        "white": "FFFFFF",
    }

    for slide_info in slide_data:
        slide = prs.slides.add_slide(title_and_content_layout)

        # Apply background if provided
        if background:
            # Check if background is a predefined color name
            if background in color_map:
                # Apply solid color background using predefined color
                fill = slide.background.fill
                fill.solid()
                fill.fore_color.rgb = RGBColor.from_string(color_map[background])
                print(f"Applied predefined color background: {background} ({color_map[background]})")
            # Check if background is a hex color code
            elif background.startswith('#') and (len(background) == 7 or len(background) == 9):
                # Apply solid color background
                fill = slide.background.fill
                fill.solid()
                fill.fore_color.rgb = RGBColor.from_string(background.lstrip('#'))
                print(f"Applied custom color background: {background}")
            # Check if background is an image filename
            elif background.endswith(('.jpg', '.jpeg', '.png')):
                # Check if the image exists in the backgrounds directory
                image_path = os.path.join('backgrounds', background)
                if os.path.exists(image_path):
                    # Add the image as a background
                    print(f"Applying image background: {background}")
                    set_slide_background_image(prs, slide, image_path)

                    print(f"Applied image background: {background}")
                else:
                    print(f"Image file not found: {image_path}. Using default background.")
            else:
                print(f"Unsupported background format: {background}. Using default background.")

        # Get the title and body placeholders
        title = slide.shapes.title
        body = slide.placeholders[1]

        if title:
            title.text = slide_info.title

        if body:
            tf = body.text_frame
            tf.clear()
            for bullet in slide_info.bullets:
                p = tf.add_paragraph()
                p.text = bullet
                p.level = 0

    pptx_stream = io.BytesIO()
    prs.save(pptx_stream)
    pptx_stream.seek(0)
    return pptx_stream


# --- API Endpoints ---
@app.post("/api/generate-slide-content")
async def generate_slide_content(file: UploadFile = File(...)) -> PresentationContent:
    """
    This endpoint receives a PDF file, processes it, and returns the proposed slide content as JSON.
    """
    print(f"Received file: {file.filename}")

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    try:
        pdf_contents = await file.read()

        text_content = extract_text_from_pdf(pdf_contents)
        slides = generate_slides_content_with_gemini(text_content)

        # Create a Presentation_Content object
        presentation_content = PresentationContent(slides=slides)

        print("Sending slide content to client.")
        return presentation_content
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"An unexpected server error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")


@app.post("/api/generate-presentation")
async def generate_presentation_endpoint(presentation_content: PresentationContent):
    """
    This endpoint receives slide content directly, creates a PowerPoint presentation,
    and returns it as a downloadable file.
    """
    print(f"Received presentation content with {len(presentation_content.slides)} slides")
    if presentation_content.background:
        print(f"Using background: {presentation_content.background}")


    try:
        pptx_file_stream = create_presentation(
            presentation_content.slides, 
            background=presentation_content.background
        )

        print("Sending PowerPoint presentation to client.")
        return StreamingResponse(
            pptx_file_stream,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename=presentation.pptx"}
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"An unexpected server error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the PDF to Presentation API!"}
