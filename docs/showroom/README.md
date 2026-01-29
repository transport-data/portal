# Visualization Showroom

The **Showroom** is a gallery page that displays interactive dashboards and visualizations built with Transport Data Commons datasets. Users can browse thumbnails and click to interact with full dashboards in a modal view.

**Page URL:** `/showroom`

---

## Table of Contents

- [Overview](#overview)
- [Adding a New Dashboard](#adding-a-new-dashboard)
  - [Quick Start (3 Steps)](#quick-start-3-steps)
  - [Step-by-Step Guide](#step-by-step-guide)
- [Configuration Options](#configuration-options)
- [Supported Platforms](#supported-platforms)
- [Troubleshooting](#troubleshooting)

---

## Overview

The showroom provides:

- **Gallery view**: Grid of dashboard cards with preview thumbnails
- **Interactive modal**: Click any card to view and interact with the full dashboard
- **Dataset linking**: Each dashboard links to the TDC datasets used to create it
- **Responsive design**: Works on mobile, tablet, and desktop
- **Easy configuration**: Simply edit one file to add new dashboards

### Features

- ✅ Embed Tableau Public dashboards
- ✅ Embed Power BI reports
- ✅ Auto-extract thumbnails from Tableau
- ✅ Automatic aspect ratio handling
- ✅ External link to open in new tab
- ✅ Tag system for categorization

---

## Adding a New Dashboard

### Quick Start (3 Steps)

1. **Get your Tableau/PowerBI share link**
   - Go to your Tableau/PowerBI Public dashboard
   - Click the **Share** button
   - Click **Copy Link**

2. **Edit the config file**
   - Open `frontend/src/config/visualizations.ts`
   - Copy the template at the bottom of the file
   - Paste your share link into `extractUrl()`

3. **Add dataset references**
   - Link to the TDC datasets you used
   - Save the file - done!

### Step-by-Step Guide

#### 1. Open the configuration file

```bash
# Navigate to the config file
cd frontend/src/config
# Open in your editor
code visualizations.ts
```

#### 2. Find the template

Scroll to the bottom of `visualizations.ts` and find the commented template:

```typescript
// ========================================
// EASY TEMPLATE FOR ADDING NEW DASHBOARDS
// ========================================
/*
{
  id: "unique-id-here",
  title: "Your Dashboard Title",
  description: "Describe what insights this dashboard provides.",
  tags: ["tag1", "tag2"],
  ...
}
*/
```

#### 3. Copy and customize the template

**Uncomment the template** and fill in your details:

```typescript
{
  id: "my-transport-dashboard",  // Use lowercase-with-dashes
  title: "Urban Mobility Trends 2024",
  description: "Analysis of urban transport patterns across major cities, showing modal split, emissions, and accessibility metrics.",
  tags: ["Urban", "Mobility", "Emissions"],  // Add relevant tags
  
  // STEP A: Paste your Tableau share link
  embedUrl: extractUrl(
    `https://public.tableau.com/views/YourWorkbook/YourView?:display_count=n&:origin=viz_share_link`
  ),
  
  // STEP B: Choose a thumbnail method
  // Option 1 (Easiest): Auto-extract from Tableau
  thumbnailUrl: extractTableauThumbnail(
    `https://public.tableau.com/views/YourWorkbook/YourView`
  ),
  
  // Option 2: Provide direct URL
  // thumbnailUrl: "https://public.tableau.com/static/images/XX/YourWorkbook/1.png",
  
  // Option 3: Use custom screenshot (place in /public/images/showroom/)
  // thumbnailUrl: "/images/showroom/my-dashboard.png",
  
  // STEP C: Link to the datasets you used
  datasets: [
    {
      title: "Urban Transport Dataset",
      url: "https://portal.transport-data.org/@your-org/your-dataset"
    },
    {
      title: "Emissions Data",
      url: "https://portal.transport-data.org/@your-org/emissions-dataset"
    }
  ],
  
  // Optional: Link to open dashboard externally
  externalLink: "https://public.tableau.com/views/YourWorkbook/YourView",
  
  // Optional: Adjust aspect ratio if needed
  aspectRatio: "16:9",  // Options: "16:9", "4:3", "21:9", "free"
},
```

#### 4. Save and test

```bash
# Start the development server
npm run dev

# Visit the showroom page
# http://localhost:3001/showroom

# Your new dashboard should appear in the gallery!
```

---

## Configuration Options

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier (lowercase-with-dashes) | `"ndc-transport-tracker"` |
| `title` | string | Dashboard title shown in gallery | `"Transport Measures in NDCs"` |
| `description` | string | Brief description of the dashboard | `"Analysis of transport mitigation..."` |
| `embedUrl` | string | Embed URL (use `extractUrl()`) | See examples below |
| `datasets` | array | Array of dataset references (min: 1) | See datasets section |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `tags` | string[] | `[]` | Tags for categorization | 
| `thumbnailUrl` | string | placeholder | Preview image URL |
| `externalLink` | string | none | Link to open dashboard externally |
| `aspectRatio` | string | `"16:9"` | Modal aspect ratio |
| `minHeightPx` | number | `900` | Min height (if `aspectRatio: "free"`) |

### Dataset Reference Format

```typescript
datasets: [
  {
    title: "Human-readable dataset name",
    url: "https://portal.transport-data.org/@org/dataset-name"
  }
]
```

### Aspect Ratio Options

- `"16:9"` - Standard widescreen (default, works for most dashboards)
- `"4:3"` - Traditional format
- `"21:9"` - Ultra-wide
- `"free"` - No fixed ratio, set `minHeightPx` instead

---

## Supported Platforms

### ✅ Tableau Public

**Method 1: Share Link (Easiest)**

```typescript
embedUrl: extractUrl(
  `https://public.tableau.com/views/YourWorkbook/ViewName?:display_count=n&:origin=viz_share_link`
),
```

**Auto-extract thumbnail:**

```typescript
thumbnailUrl: extractTableauThumbnail(
  `https://public.tableau.com/views/YourWorkbook/ViewName`
),
```

### ✅ Power BI

**Share Link Method:**

1. Open your Power BI report
2. Click **File** → **Share** → **Embed report**
3. Copy the link (starts with `https://app.powerbi.com/view?r=...`)
4. Paste into config:

```typescript
embedUrl: extractUrl(
  `https://app.powerbi.com/view?r=YOUR_ENCODED_TOKEN`
),
```

**⚠️ Note:** Power BI doesn't provide automatic thumbnails. You must use a screenshot:

```typescript
thumbnailUrl: "/images/showroom/your-powerbi-dashboard.png",
```

**How to create a thumbnail:**
1. Take a screenshot of your Power BI dashboard
2. Crop to ~1200x675px (16:9 ratio)
3. Save as PNG to: `frontend/public/images/showroom/your-dashboard.png`
4. Reference in config as shown above

### ✅ Other iframe-embeddable platforms

Any platform that provides an iframe embed URL will work. Just provide:
- The embed URL directly
- A custom thumbnail screenshot

---

## Troubleshooting

### Dashboard doesn't show in modal

**Issue:** Modal opens but dashboard doesn't load

**Solutions:**
1. Check browser console for errors
2. Verify the embed URL has `:embed=true` parameter
3. Try opening the `externalLink` to verify the dashboard works
4. Some dashboards have embedding restrictions - check platform settings

### Thumbnail not loading

**Issue:** Placeholder shows instead of thumbnail

**Solutions:**
1. For Tableau: Verify the dashboard is published to Tableau Public (not Private)
2. Check if the thumbnail URL is accessible in a browser
3. Use a custom screenshot instead:
   ```typescript
   // Take a screenshot, save to /public/images/showroom/
   thumbnailUrl: "/images/showroom/your-dashboard.png",
   ```

### Dashboard is cut off or zoomed incorrectly

**Issue:** Dashboard doesn't fit well in modal

**Solutions:**
1. Try different `aspectRatio` values:
   ```typescript
   aspectRatio: "4:3",  // Try different ratios
   ```
2. Use free aspect ratio with custom height:
   ```typescript
   aspectRatio: "free",
   minHeightPx: 1000,  // Adjust height
   ```

### Build errors when adding dashboard

**Issue:** TypeScript errors when saving

**Solutions:**
1. Ensure all required fields are present (`id`, `title`, `description`, `embedUrl`, `datasets`)
2. Check that `datasets` array has at least one entry
3. Verify no syntax errors (missing commas, brackets, quotes)
4. Make sure you're editing inside the `VISUALIZATIONS` array

---

## File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   └── showroom.tsx              # Main showroom page component
│   ├── config/
│   │   └── visualizations.ts         # Dashboard configuration (EDIT THIS)
│   └── middleware.ts                 # Route handling (includes /showroom)
├── public/
│   └── images/
│       └── showroom/                 # Custom thumbnail images (optional)
│           ├── dashboard-1.png
│           └── dashboard-2.png
└── docs/
    └── showroom/
        └── README.md                 # This file
```

---

## Examples

### Example 1: Tableau Dashboard with Auto-Thumbnail

```typescript
{
  id: "urban-emissions-tracker",
  title: "Urban Transport Emissions Tracker",
  description: "Real-time monitoring of transport emissions in major cities worldwide.",
  tags: ["Emissions", "Urban", "Climate"],
  
  embedUrl: extractUrl(
    `https://public.tableau.com/views/UrbanEmissions/Dashboard1`
  ),
  
  thumbnailUrl: extractTableauThumbnail(
    `https://public.tableau.com/views/UrbanEmissions/Dashboard1`
  ),
  
  datasets: [
    {
      title: "Urban Emissions Dataset",
      url: "https://portal.transport-data.org/@climate/urban-emissions"
    }
  ],
  
  externalLink: "https://public.tableau.com/views/UrbanEmissions/Dashboard1",
  aspectRatio: "16:9",
},
```

### Example 2: Power BI Dashboard with Custom Thumbnail

```typescript
{
  id: "freight-logistics-dashboard",
  title: "Global Freight & Logistics",
  description: "Overview of freight movements, modal shifts, and logistics efficiency.",
  tags: ["Freight", "Logistics", "Trade"],
  
  embedUrl: extractUrl( 
    "https://app.powerbi.com/view?r=abc123def456",
  ),
  
  thumbnailUrl: "/images/showroom/freight-dashboard.png",
  
  datasets: [
    {
      title: "Freight Movement Data",
      url: "https://portal.transport-data.org/@freight/movements"
    },
    {
      title: "Logistics Performance Index",
      url: "https://portal.transport-data.org/@worldbank/lpi"
    }
  ],
  
  externalLink: "https://app.powerbi.com/view?r=abc123def456",
  aspectRatio: "16:9",
},
```

### Example 3: Free Aspect Ratio for Tall Dashboards

```typescript
{
  id: "detailed-country-report",
  title: "Transport Sector Deep Dive - Germany",
  description: "Comprehensive analysis covering all transport modes, infrastructure, and policy measures.",
  tags: ["Germany", "Policy", "Infrastructure"],
  
  embedUrl: extractUrl(
    `https://app.powerbi.com/view?r=eyJrIjoiN2RmODMzNDItMGM2Mi00ZGFiLTljZTAtMzBmNDM3MmIxYWIxIiwidCI6IjY0OWVkOWQ3LTllNTItNDJmNi1hMDJjLTdmZWM4YmRhMjJmYyIsImMiOjl9`
  ),
  
  // Power BI requires custom thumbnail
  thumbnailUrl: "/images/showroom/freight-dashboard.png",
  
  datasets: [
    {
      title: "Freight Movement Data",
      url: "https://portal.transport-data.org/@freight/movements"
    }
  ],
  
  externalLink: "https://app.powerbi.com/view?r=eyJrIjoiN2RmODMzNDItMGM2Mi00ZGFiLTljZTAtMzBmNDM3MmIxYWIxIiwidCI6IjY0OWVkOWQ3LTllNTItNDJmNi1hMDJjLTdmZWM4YmRhMjJmYyIsImMiOjl9",
  aspectRatio: "16:9",
},
```

---

## Questions?

If you encounter issues or have questions about adding dashboards to the showroom:

1. Check the troubleshooting section above
2. Review existing dashboard configurations in `visualizations.ts`
3. Contact the development team

**Related Documentation:**
- [Main README](../../README.md)
- [Dashboard Overview](../dashboard/README.md)
- [Dataset Management](../datasets/README.md)