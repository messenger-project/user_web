export const CV_TEMPLATES = [
    {
        id: "classic",
        name: "Classic",
        description: "Traditional ATS-friendly resume",
    },
    {
        id: "modern",
        name: "Modern",
        description: "Contemporary professional design",
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "Clean and simple layout",
    },
    {
        id: "creative",
        name: "Creative",
        description: "Bold design with colorful accents",
    },
] as const;

export type CvTemplateId = (typeof CV_TEMPLATES)[number]["id"];

export const DEFAULT_CV_TEMPLATE: CvTemplateId = "classic";