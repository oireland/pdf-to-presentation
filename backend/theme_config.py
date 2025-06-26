# theme_config.py
# This file serves as the backend's single source of truth for theme properties.
# It mirrors the structure of the frontend's ThemeConfig interface.

THEME_CONFIG = {
    "colors": [
        {
            "name": "classic_dark",
            "displayName": "Classic Dark",
            "primaryColor": "0D1117",   # Background
            "secondaryColor": "58A6FF", # Title Text
            "textColor": "C9D1D9"    # Body Text
        },
        {
            "name": "ocean_blue",
            "displayName": "Ocean Blue",
            "primaryColor": "0077B6",
            "secondaryColor": "FFFFFF",
            "textColor": "E0E0E0"
        },
        {
            "name": "forest_green",
            "displayName": "Forest Green",
            "primaryColor": "2d6a4f",
            "secondaryColor": "f4f1de",
            "textColor": "e0e1e1"
        },
        {
            "name": "corporate_light",
            "displayName": "Corporate Light",
            "primaryColor": "FFFFFF",
            "secondaryColor": "003366",
            "textColor": "333333"
        }
    ],
    "backgrounds": [
        {
            "name": "blue_gradient",
            "displayName": "Blue Gradient",
            "image_filename": "blue_gradient.jpg" # Corresponds to a file in the 'backgrounds' folder
        },
        {
            "name": "green_gradient",
            "displayName": "Green Gradient",
            "image_filename": "green_gradient.jpg"
        },
        {
            "name": "geometric_pattern",
            "displayName": "Geometric Pattern",
            "image_filename": "geometric_pattern.jpg"
        }
    ]
}