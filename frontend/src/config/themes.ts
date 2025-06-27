import type { ThemeConfig } from "@/types/theme";

export const themeConfig: ThemeConfig = {
  colors: [
    {
      type: "color",
      name: "corporate_blue",
      displayName: "Corporate Blue",
      primaryColor: "#2563eb",
      secondaryColor: "#dbeafe",
      textColor: "#1e40af",
    },
    {
      type: "color",
      name: "elegant_purple",
      displayName: "Elegant Purple",
      primaryColor: "#7c3aed",
      secondaryColor: "#ede9fe",
      textColor: "#5b21b6",
    },
    {
      type: "color",
      name: "modern_teal",
      displayName: "Modern Teal",
      primaryColor: "#0d9488",
      secondaryColor: "#ccfbf1",
      textColor: "#0f766e",
    },
    {
      type: "color",
      name: "warm_orange",
      displayName: "Warm Orange",
      primaryColor: "#ea580c",
      secondaryColor: "#fed7aa",
      textColor: "#c2410c",
    },
    {
      type: "color",
      name: "professional_gray",
      displayName: "Professional Gray",
      primaryColor: "#4b5563",
      secondaryColor: "#f3f4f6",
      textColor: "#374151",
    },
    {
      type: "color",
      name: "vibrant_green",
      displayName: "Vibrant Green",
      primaryColor: "#16a34a",
      secondaryColor: "#dcfce7",
      textColor: "#15803d",
    },
  ],
  backgrounds: [
    {
      type: "background",
      name: "blue_gradient",
      displayName: "Blue Gradient",
      previewImage: "/placeholder.svg?height=80&width=120&text=Blue+Gradient",
    },
    {
      type: "background",
      name: "geometric_pattern",
      displayName: "Geometric Pattern",
      previewImage: "/placeholder.svg?height=80&width=120&text=Geometric",
    },
    {
      type: "background",
      name: "green_gradient",
      displayName: "Green Gradient",
      previewImage: "/placeholder.svg?height=80&width=120&text=Green+Gradient",
    },
  ],
};
