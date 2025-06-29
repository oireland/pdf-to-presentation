import unittest
import os
import io
from PIL import Image

# Import the function to be tested
from pdf_to_presentation.main import extract_text_and_images_from_pdf


class TestPdfExtractionIntegration(unittest.TestCase):

    def test_with_real_pdf(self):
        """
        Tests the extract_text_and_images_from_pdf function using a real PDF file.
        It verifies that text and at least one image are successfully extracted.
        """
        # --- Setup: Define the path to the test PDF ---

        # Get the directory of the current test file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Construct the full path to the sample PDF
        pdf_path = os.path.join(current_dir, "files", "sample-image-report.pdf")

        # Check that the test file actually exists before running the test
        self.assertTrue(os.path.exists(pdf_path), f"Test file not found at {pdf_path}")

        # --- Execute the Function ---

        # Read the PDF file in binary mode
        with open(pdf_path, "rb") as f:
            pdf_content = f.read()

        # Call the function with the real PDF content
        extracted_text, extracted_images = extract_text_and_images_from_pdf(pdf_content)

        # --- Assertions ---

        # 1. Assert that some text was extracted (customize if you know the exact text)
        self.assertIsInstance(extracted_text, str)
        self.assertGreater(len(extracted_text), 0, "No text was extracted from the PDF.")

        # 2. Assert that at least one image was extracted
        self.assertIsInstance(extracted_images, list)
        self.assertGreater(len(extracted_images), 0, "No images were extracted from the PDF.")

        # 3. Assert the structure of the first extracted image's metadata
        first_image_info = extracted_images[0]
        self.assertIn("filename", first_image_info)
        self.assertIn("context", first_image_info)

        # 4. Verify that the image file was actually created and is a valid image
        image_filepath = os.path.join("extracted_images", first_image_info["filename"])
        self.assertTrue(os.path.exists(image_filepath), f"Extracted image file was not created at {image_filepath}")

        # Try to open the image with Pillow to ensure it's not corrupted
        try:
            with Image.open(image_filepath) as img:
                self.assertGreater(img.width, 0)
                self.assertGreater(img.height, 0)
        except Exception as e:
            self.fail(f"Extracted image file {first_image_info['filename']} is corrupted or invalid: {e}")


if __name__ == '__main__':
    unittest.main()