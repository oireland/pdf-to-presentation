import type { Slide } from "@/types/slide";
import type { SelectedTheme } from "@/types/theme.ts";

const MOCK_DATA = true;

export const processPDF = async (
  file: File,
  detailLevel: number,
  onProgress: (progress: number) => void
): Promise<Slide[]> => {
  let currentProgress = 0;
  const progressInterval = setInterval(() => {
    // Don't let the simulated progress exceed 90% before the API call finishes
    if (currentProgress < 90) {
      currentProgress += 10;
      onProgress(currentProgress);
    }
  }, 200);

  try {
    // Prepare form data for API call
    const formData = new FormData();
    formData.append("file", file);
    formData.append("detail_level", detailLevel.toString());

    // MOCK
    if (MOCK_DATA) {
      return [
        {
          title: "Occam's Razor: Introduction",
          bullets: [
            "Problem-solving principle attributed to William of Ockham.",
            "Choose the hypothesis with fewest assumptions.",
            "The simplest explanation is usually the best.",
          ],
        },
        {
          title: "The Principle Explained: Shaving Away Assumptions",
          text_block:
            "Occam's Razor is a heuristic, not an irrefutable law. It suggests 'shaving away' unnecessary assumptions in theories. Simpler theories are preferable because they are more testable and easier to falsify, leading to more efficient problem-solving.",
        },
        {
          title: "Application: The Case of the Missing Cookies",
          bullets: [
            "Hypothesis A: Roommate ate the cookies (simple).",
            "Hypothesis B: International spies stole cookies (complex).",
            "Occam's Razor favors Hypothesis A.",
            "Fewer assumptions make it the more plausible start",
          ],
        },
        {
          title: "Occam's Razor: A Valuable Tool",
          bullets: [
            "Encourages clarity and simplicity in thinking.",
            "Favors evidence-based explanations.",
            "Rational starting point for investigation.",
          ],
        },
        {
          title: "Conclusion: Simplicity as a Starting Point",
          text_block:
            "While the simplest answer isn't always right, Occam's Razor encourages us to start with the most rational and evidence-supported explanation. This approach helps to streamline problem-solving and avoid unnecessary complexity in our reasoning processes.",
        },
      ];
    }
    // END MOCK

    const response = await fetch(
      "http://127.0.0.1:8000/api/generate-slide-content",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const extractedSlides: Slide[] = (await response.json()).slides;

    // On success, clear the interval and jump progress to 100%
    clearInterval(progressInterval);
    onProgress(100);

    return extractedSlides;
  } catch (error) {
    console.error("Error processing PDF:", error);
    onProgress(0); // Optionally reset progress on error
    throw error; // Re-throw the error for the calling component to handle
  } finally {
    // The finally block is a safety net to ensure the interval is always cleared,
    // regardless of success or failure.
    clearInterval(progressInterval);
  }
};

export const generatePowerPoint = async (
  slides: Slide[],
  theme: SelectedTheme,
  onProgress: (progress: number) => void
): Promise<void> => {
  let currentProgress = 0;
  const progressInterval = setInterval(() => {
    // Simulate progress, stopping at 90% to wait for the API
    if (currentProgress < 90) {
      currentProgress += 15;
      onProgress(currentProgress);
    }
  }, 300);

  try {
    // --- Start of Updated Section ---

    // Call your actual API endpoint to generate the presentation
    const response = await fetch(
      "http://127.0.0.1:8000/api/generate-presentation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slides: slides,
          theme_type: theme.type,
          theme_name: theme.name,
        }),
      }
    );

    // Check if the API request was successful
    if (!response.ok) {
      // Try to parse error details from the response body if available
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${
          errorText || response.statusText
        }`
      );
    }

    // The API response is the actual file data (blob)
    const blob = await response.blob();

    // On success, stop the progress simulation and set to 100%
    clearInterval(progressInterval);
    onProgress(100);

    // Create a temporary URL for the blob and trigger the download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "presentation.pptx"); // Set the desired filename
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and revoking the object URL
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    // --- End of Updated Section ---
  } catch (error) {
    console.error("Error generating PowerPoint:", error);
    onProgress(0); // Reset progress on error
    throw error; // Re-throw so the calling component can handle it
  } finally {
    // Safety net to ensure the interval is always cleared
    clearInterval(progressInterval);
  }
};
