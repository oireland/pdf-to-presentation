export interface Slide {
  title: string;
  bullets?: string[];
  text_block?: string;
  image_filename?: string;
}

export interface SlideContent {
  slides: Slide[];
}

export interface PresentationContent {
  slides: Slide[];
  theme_type: "color" | "background";
  theme_name: string;
}
