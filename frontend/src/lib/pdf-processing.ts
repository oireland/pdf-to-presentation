import type { Slide } from "@/types/slide";
import type { SelectedTheme } from "@/types/theme.ts";

const MOCK_PROCESS_PDF = true;
const mockProcessPDFResponse = [
  {
    title: "Q2 2025 Performance Overview: Introduction",
    bullets: [
      "Comprehensive overview of Q2 2025 performance (April 1st - June 30th)",
      "Key financial metrics, operational achievements, and strategic initiatives examined",
      "Visual aids highlight significant trends and data points",
      "Focus on progress and identifying areas for future growth",
    ],
  },
  {
    title: "Section 1: Financial Highlights",
    bullets: [
      "15% revenue increase compared to Q1",
      "Strong sales in emerging markets",
      "Stable profit margins due to cost management and operational efficiencies",
      "Total Revenue: $12.5 million, Net Profit: $2.1 million, Operating Expenses: $8.8 million",
    ],
    image_filename: "image_1_1_6c468449-138a-4d7e-82df-8d5d1795d444.png",
  },
  {
    title: "Revenue Growth by Segment",
    bullets: [],
    text_block:
      "This slide showcases a visual representation (likely a chart or graph) of the breakdown of Q2 revenue across primary business segments.  It highlights the significant contribution from new product lines, indicating successful product launches and market penetration.",
  },
  {
    title: "Section 2: Operational Achievements",
    bullets: [
      "Improved efficiency and expanded reach",
      "Successful rollout of Project Horizon streamlined the supply chain, reducing delivery times by 10%",
      "Customer satisfaction reached an all-time high of 8.9/10",
    ],
    image_filename: "image_2_1_f38e8fe4-20b6-4ef8-a59e-41e1dc4ddbb0.png",
  },
  {
    title: "Project Horizon Implementation",
    bullets: [],
    text_block:
      "This slide presents a visual (likely a chart) illustrating the reduction in average delivery time before and after implementing Project Horizon.  The data clearly demonstrates the project's success in improving supply chain efficiency.",
  },
  {
    title: "Section 3: Market Presence and Future Outlook",
    bullets: [
      "Expanded market share, particularly in Southeast Asia (20% increase in new customers)",
      "Continued investment in R&D to maintain a competitive edge",
      "Positive Q3 outlook with projections indicating continued growth and market penetration",
    ],
    image_filename: "image_3_1_44ec62af-d485-41e1-a6fc-5ac16f566a4a.png",
  },
  {
    title: "Global Market Expansion",
    bullets: [],
    text_block:
      "This slide displays a geographical map highlighting the company's expanded market presence and strategic growth areas.  It visually represents the company's successful international expansion and identifies key regions for future development.",
  },
  {
    title: "Conclusion: Q2 2025 - A Successful Quarter",
    bullets: [],
    text_block:
      "Q2 2025 demonstrated robust financial health, improved operational efficiencies, and expanding market reach.  These achievements provide a strong foundation for continued growth and success in future quarters.  The company is well-positioned for sustained progress.",
  },
];

export const processPDF = async (
  file: File,
  detailLevel: number,
  onProgress: (progress: number) => void
): Promise<Slide[]> => {
  let currentProgress = 0;
  const progressInterval = setInterval(() => {
    if (currentProgress < 90) {
      currentProgress += 10;
      onProgress(currentProgress);
    }
  }, 200);

  try {
    if (MOCK_PROCESS_PDF) {
      return mockProcessPDFResponse;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("detail_level", detailLevel.toString());

    // Use a relative path. The Vite proxy will handle forwarding this
    // to http://127.0.0.1:8000 during development.
    const response = await fetch("/api/generate-slide-content", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const extractedSlides: Slide[] = (await response.json()).slides;

    clearInterval(progressInterval);
    onProgress(100);

    return extractedSlides;
  } catch (error) {
    console.error("Error processing PDF:", error);
    onProgress(0);
    throw error;
  } finally {
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
    if (currentProgress < 90) {
      currentProgress += 15;
      onProgress(currentProgress);
    }
  }, 300);

  try {
    // Use a relative path here as well.
    const response = await fetch("/api/generate-presentation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slides: slides,
        theme_type: theme.type,
        theme_name: theme.name,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${
          errorText || response.statusText
        }`
      );
    }

    const blob = await response.blob();
    clearInterval(progressInterval);
    onProgress(100);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "presentation.pptx");
    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PowerPoint:", error);
    onProgress(0);
    throw error;
  } finally {
    clearInterval(progressInterval);
  }
};
