# theme_config.py
# This file serves as the backend's single source of truth for theme properties.
# It mirrors the structure of the frontend's ThemeConfig interface.
# Apart from for backgrounds, where this config has a title and text colour

THEME_CONFIG = {
"colors": [
        {
            "name": "corporate_blue",
            "displayName": "Corporate Blue",
            "primaryColor": "2563eb",
            "secondaryColor": "dbeafe",
            "textColor": "1e40af",
        },
        {
            "name": "elegant_purple",
            "displayName": "Elegant Purple",
            "primaryColor": "7c3aed",
            "secondaryColor": "ede9fe",
            "textColor": "5b21b6",
        },
        {
            "name": "modern_teal",
            "displayName": "Modern Teal",
            "primaryColor": "0d9488",
            "secondaryColor": "ccfbf1",
            "textColor": "0f766e",
        },
        {
            "name": "warm_orange",
            "displayName": "Warm Orange",
            "primaryColor": "ea580c",
            "secondaryColor": "fed7aa",
            "textColor": "c2410c",
        },
        {
            "name": "professional_gray",
            "displayName": "Professional Gray",
            "primaryColor": "4b5563",
            "secondaryColor": "f3f4f6",
            "textColor": "374151",
        },
        {
            "name": "vibrant_green",
            "displayName": "Vibrant Green",
            "primaryColor": "16a34a",
            "secondaryColor": "dcfce7",
            "textColor": "15803d",
        },
    ],
    "backgrounds": [
        {
            "name": "blue_gradient",
            "displayName": "Blue Gradient",
            "image_filename": "blue_gradient.jpg",
            "titleColor": "000000",
            "textColor": "ffffff",
        },
        {
            "name": "geometric_pattern",
            "displayName": "Geometric Pattern",
            "image_filename": "geometric_pattern.jpg",
            "titleColor": "000000",
            "textColor": "000000",
        },
        {
            "name": "green_gradient",
            "displayName": "Green Gradient",
            "image_filename": "green_gradient.jpg",
            "titleColor": "000000",
            "textColor": "ffffff",
        },
    ],
}