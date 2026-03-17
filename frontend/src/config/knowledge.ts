export type DatasetRef = {
  title: string;
  url: string;
};

export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  imageUrl?: string;
  tags: string[] | "auto";
  datasets?: DatasetRef[];
  featured?: boolean;
}

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: "guidance-vehicle-stock",
    title:
      "Guidance n°1: National road vehicle fleet and registration for a bottom-up inventory",
    description:
      "Comprehensive guidance document for collecting and analyzing vehicle stock and new registration data.",
    pdfUrl:
      "/pdfs/Guidance 1 national road vehicle fleet and registration for a bottom-up inventory.pdf",
    imageUrl: "/images/showroom/Guidance 1_image.png",
    tags: ["vehicle registrations", "vehicle stock", "inventory"],
    datasets: [
      {
        title: "Passenger Cars Registrations and Stock, Nigeria 2005-2019",
        url: "https://portal.transport-data.org/@oica/passenger-cars-registrations-and-stock-nigeria-2005-2019",
      },
    ],
    featured: true,
  },

  // ========================================
  // EASY TEMPLATE FOR ADDING NEW KNOWLEDGE MATERIAL
  // ========================================
  /*
  {
    id: "unique-id-here", // required: no spaces, use kebab-case
    title: "Document title",
    description: "Brief description of what this knowledge material covers.",

    // Required: PDF location
    // Option A: file stored in /public/pdfs/
    // pdfUrl: "/pdfs/your-file-name.pdf",
    // Option B: external PDF URL
    // pdfUrl: "https://example.org/your-file.pdf",
    pdfUrl: "/pdfs/your-file-name.pdf",

    // Optional: preview image shown in card/modal
    // Save local images under /public/images/knowledge/
    // imageUrl: "/images/knowledge/your-preview.png",
    imageUrl: "/images/knowledge/your-preview.png",

    // Tags for filtering/search
    // Option A: manual tags
    tags: ["guidance", "methodology", "country-case"],
    // Option B: keep placeholder if auto-tagging gets implemented
    // tags: "auto",

    // Optional: related datasets
    datasets: [
      {
        title: "Dataset title",
        url: "https://portal.transport-data.org/@org/dataset-name",
      },
    ],

    // Optional: highlight on top/featured sections
    featured: false,
  },
  */
];

