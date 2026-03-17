# Knowledge Hub

This page explains how to add new guidance and knowledge materials (PDF documents) to the **TDC Knowledge Hub**.

## Overview

Knowledge Hub content is configured in:

- `frontend/src/config/knowledge.ts`

Each entry in `KNOWLEDGE_ITEMS` appears as a card in:

- `/knowledge-hub`

---

## 1) Add the PDF file

Place the PDF in:

- `frontend/public/pdfs/`

Example:

- `frontend/public/pdfs/guidance-vehicle-emissions.pdf`

> Keep file names simple and stable (lowercase, hyphens if possible).

---

## 2) (Optional) Add a preview image

Place preview images in:

- `frontend/public/images/knowledge/`

Example:

- `frontend/public/images/knowledge/guidance-vehicle-emissions.png`

If no image is provided, the UI shows a generic PDF placeholder.

---

## 3) Add a new `KNOWLEDGE_ITEMS` entry

Open:

- `frontend/src/config/knowledge.ts`

Use the built-in template already included in that file:

````typescript
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
````