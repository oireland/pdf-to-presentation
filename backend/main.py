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
from typing import List, Literal
from pptx.dml.color import RGBColor
from theme_config import THEME_CONFIG


# --- Models ---
class Slide(BaseModel):
    title: str = Field(..., description="The title of the slide (maximum 10 words)")
    bullets: List[str] = Field(..., description="List of bullet points (maximum 3 per slide)")


class SlideContent(BaseModel):
    slides: List[Slide] = Field(..., description="List of slides for the presentation")


class PresentationContent(BaseModel):
    slides: List[Slide] = Field(..., description="List of slides for the presentation")
    theme_type: Literal["color", "background"] = Field(..., description="The type of theme to apply.")
    theme_name: str = Field(..., description="The name of the theme to apply (e.g., 'classic_dark', 'blue_gradient').")


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


def create_presentation(slide_data: List[Slide], theme_type: str, theme_name: str) -> io.BytesIO:
    """Creates a PowerPoint presentation from structured data using a predefined theme."""
    print(f"Creating presentation with theme '{theme_name}' (type: {theme_type})")

    prs = Presentation()
    prs.slide_width = 9144000
    prs.slide_height = 5143500
    title_and_content_layout = prs.slide_layouts[1]

    # Find the selected theme from the configuration
    theme = None
    if theme_type == "color":
        theme = next((t for t in THEME_CONFIG["colors"] if t["name"] == theme_name), None)
    elif theme_type == "background":
        theme = next((t for t in THEME_CONFIG["backgrounds"] if t["name"] == theme_name), None)

    if not theme:
        print(f"Warning: Theme '{theme_name}' not found. Using default blank presentation.")

    for slide_info in slide_data:
        slide = prs.slides.add_slide(title_and_content_layout)
        title_shape = slide.shapes.title
        body_shape = slide.placeholders[1]

        # Apply theme if a valid one was found
        if theme:
            if theme_type == "color":
                # 1. Set background color (primary)
                fill = slide.background.fill
                fill.solid()
                fill.fore_color.rgb = RGBColor.from_string(theme["primaryColor"])

                # 2. Set title color (secondary)
                if title_shape:
                    title_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor.from_string(theme["secondaryColor"])

                # 3. Set body text color (text)
                if body_shape:
                    body_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor.from_string(theme["textColor"])

            elif theme_type == "background":
                image_path = os.path.join('backgrounds', theme["image_filename"])
                if os.path.exists(image_path):
                    set_slide_background_image(prs, slide, image_path)
                    # Set default text colors for readability on image backgrounds
                    if title_shape:
                        title_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor.from_string(theme["titleColor"])
                    if body_shape:
                        body_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor.from_string(theme["textColor"])
                else:
                    print(f"Warning: Background image not found at {image_path}. Using default.")

        # Add content to slide
        if title_shape:
            title_shape.text = slide_info.title
        if body_shape:
            tf = body_shape.text_frame
            tf.clear()  # Clear existing text (like "Click to add text")
            # Re-apply font color for paragraphs being added
            if theme and (theme_type == 'color' or theme_type == 'background'):
                tf.paragraphs[0].font.color.rgb = RGBColor.from_string(theme["textColor"])

            for i, bullet_text in enumerate(slide_info.bullets):
                if i == 0:  # Use the first paragraph that's already there
                    p = tf.paragraphs[0]
                    p.text = bullet_text
                else:  # Add new paragraphs for subsequent bullets
                    p = tf.add_paragraph()
                    p.text = bullet_text
                    if theme and (theme_type == 'color' or theme_type == 'background'):
                        p.font.color.rgb = RGBColor.from_string(theme["textColor"])

                p.level = 0

    pptx_stream = io.BytesIO()
    prs.save(pptx_stream)
    pptx_stream.seek(0)
    return pptx_stream


# --- API Endpoints ---
@app.post("/api/generate-slide-content")
async def generate_slide_content(file: UploadFile = File(...)) -> SlideContent:
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
        slide_content = SlideContent(slides=slides)

        print("Sending slide content to client.")
        return slide_content
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"An unexpected server error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")


@app.post("/api/generate-presentation")
async def generate_presentation_endpoint(presentation_content: PresentationContent):
    """
    Receives slide content and a theme reference, creates a PowerPoint,
    and returns it as a downloadable file.
    """
    try:
        pptx_file_stream = create_presentation(
            slide_data=presentation_content.slides,
            theme_type=presentation_content.theme_type,
            theme_name=presentation_content.theme_name
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
