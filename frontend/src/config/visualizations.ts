// config file for showroom visualizations

export type DatasetRef = {
  /** Human-readable title shown on the showroom page */
  title: string;
  /** Link to the dataset page in the TDC Portal (or canonical dataset URL) */
  url: string;
};

export type Visualization = {
  id: string;
  title: string;
  description: string;
  tags?: string[];

  /**
   * Use EMBED URLs only (iframe-ready).
   * 
   * EASY METHOD: Just paste the entire Tableau embed code here, 
   * and we'll extract the URL automatically!
   * 
   * Example: embedUrl: extractTableauUrl(`<div class='tableauPlaceholder'...></div>`)
   * 
   * Or provide the direct URL:
   * - Tableau: "https://public.tableau.com/views/..."
   * - Power BI: "https://app.powerbi.com/view?r=..."
   */
  embedUrl: string;

  /**
   * Thumbnail image for gallery view (before clicking to expand)
   * - Option 1: Use extractTableauThumbnail() to auto-extract from embed code
   * - Option 2: Take a screenshot and place in /public/images/showroom/
   * - Option 3: Leave empty to show a placeholder
   */
  thumbnailUrl?: string;

  /** Every visualization MUST reference at least one dataset used. */
  datasets: DatasetRef[];

  /**
   * Optional: Direct link to open dashboard in external site
   */
  externalLink?: string;

  /**
   * Optional: Aspect ratio for the modal/expanded view
   * Default is "16:9" (widescreen)
   */
  aspectRatio?: "16:9" | "4:3" | "21:9" | "free";
  
  /**
   * Only needed if aspectRatio is "free"
   * Specifies minimum height in pixels for the iframe
   */
  minHeightPx?: number;
};

/**
 * Helper function: Extract Tableau embed URL from full embed code OR share link
 * @param input - Can be: full embed code, share link, or direct embed URL
 * @returns Clean embed URL ready to use in iframe
 */
export function extractTableauUrl(input: string): string {
  // Clean up the input
  const trimmed = input.trim();
  
  // Method 1: If it's a Tableau share link (contains /views/)
  if (trimmed.includes('public.tableau.com/views/') || trimmed.includes('public.tableau.com/shared/')) {
    let url = trimmed;
    
    // Extract URL if it's wrapped in HTML
    const urlMatch = trimmed.match(/https?:\/\/[^\s'"<>]+/);
    if (urlMatch) {
      url = urlMatch[0];
    }
    
    // Ensure it has the base structure
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    // Add required embed parameters
    if (!url.includes(':embed=true')) {
      url += (url.includes('?') ? '&' : '?') + ':embed=true';
    }
    if (!url.includes(':showVizHome=')) {
      url += '&:showVizHome=no';
    }
    
    return url;
  }
  
  // Method 2: Extract from <param name='path'> in object tag (old embed code format)
  const pathMatch = trimmed.match(/name='path'\s+value='([^']+)'/);
  if (pathMatch) {
    let path = (pathMatch[1] ?? '')
      .replace(/&#47;/g, '/')
      .replace(/&amp;/g, '&');
    
    // Ensure embed parameters are present
    if (!path.includes(':embed=true')) {
      path += (path.includes('?') ? '&' : '?') + ':embed=true';
    }
    if (!path.includes(':showVizHome=')) {
      path += '&:showVizHome=no';
    }
    
    return `https://public.tableau.com/${path}`;
  }
  
  // Method 3: Extract from <param name='name'> (newer embed code format)
  const nameMatch = trimmed.match(/name='name'\s+value='([^']+)'/);
  if (nameMatch) {
    let name = (nameMatch[1] ?? '')
      .replace(/&#47;/g, '/');
    
    // Build the URL
    let url = `https://public.tableau.com/views/${name}?:embed=true&:showVizHome=no`;
    return url;
  }
  
  // Method 4: Extract from iframe src (if present)
  const iframeMatch = trimmed.match(/src=['"]([^'"]+)['"]/);
  if (iframeMatch) {
    let url = iframeMatch[1]!;
    
    // Ensure embed parameters are present
    if (!url.includes(':embed=true')) {
      url += (url.includes('?') ? '&' : '?') + ':embed=true';
    }
    if (!url.includes(':showVizHome=')) {
      url += '&:showVizHome=no';
    }
    
    return url;
  }
  
  throw new Error('Could not extract Tableau URL. Please provide a share link, embed code, or direct URL.');
}

/**
 * Helper function: Extract or construct Tableau thumbnail URL
 * @param input - Can be: embed code, share link, or workbook ID
 * @returns Thumbnail URL or undefined
 */
export function extractTableauThumbnail(input: string): string | undefined {
  // Method 1: Extract from <param name='static_image'>
  const thumbnailMatch = input.match(/name='static_image'\s+value='([^']+)'/);
  if (thumbnailMatch) {
    const thumbnail = thumbnailMatch[1];
    if (thumbnail) {
      return thumbnail
        .replace(/&#47;/g, '/')
        .replace(/&amp;/g, '&');
    }
  }
  
  // Method 2: Extract from noscript <img>
  const imgMatch = input.match(/src='([^']+\.png)'/);
  if (imgMatch) {
    const imgSrc = imgMatch[1];
    if (imgSrc) {
      return imgSrc
        .replace(/&#47;/g, '/')
        .replace(/&amp;/g, '&')
        .replace(/_rss\.png$/, '.png'); // Remove _rss suffix if present
    }
  }
  
  // Method 3: Construct from share link URL
  // Format: https://public.tableau.com/views/WorkbookName/ViewName
  const viewMatch = input.match(/\/views\/([^\/\?]+)\/([^\/\?&]+)/);
  if (viewMatch) {
    const workbookId = viewMatch[1];
    const viewName = viewMatch[2];
    return `https://public.tableau.com/static/images/${workbookId?.substring(0, 2)}/${workbookId}/${viewName}/1.png`;
  }
  
  return undefined;
}

export const VISUALIZATIONS: Visualization[] = [
  {
    id: "tableau-ndc-measures",
    title: "Transport Mitigation Measures in NDCs",
    description:
      "Interactive Tableau dashboard exploring transport mitigation measures in NDCs as provided by data in NDC Tracker.",
    tags: ["GHG", "NDC", "Climate", "Policy"],
    
    // EASIEST METHOD: Just paste the Tableau Share Link!
    embedUrl: extractTableauUrl(
      `https://public.tableau.com/shared/RQD536548?:display_count=n&:origin=viz_share_link`
    ),
    
    // Thumbnail - provide manually or use extractTableauThumbnail with embed code
    thumbnailUrl: "https://public.tableau.com/static/images/RQ/RQD536548/1.png",
    
    datasets: [
      {
        title: "NDC Transport Tracker",
        url: "https://portal.transport-data.org/@giz/gizslocat-transport-climate-tracker?org=GIZ&dataset=gizslocat-transport-climate-tracker",
      },
    ],
    
    aspectRatio: "16:9",
    externalLink: "https://public.tableau.com/shared/RQD536548?:display_count=n&:origin=viz_share_link",
  },
  {
    id: "ifeu-vehicles-germany",
    title: "Vehicle stock and new registrations by powertrain | Germany",
    description:
      "The data are based on an analysis conducted by the ifeu - Institute for Energy and Environmental Research Heidelberg, using the German Emission Inventory Model (TREMOD) and information from the German Federal Motor Transport Authority (KBA). Vehicle stock figures refer to January 1 of each year, while new registrations are reported as of December 31. The sharp decline in new registrations in 2020 is primarily attributable to the effects of the COVID-19 pandemic.",
    tags: ["Cars", "Truck", "Germany"],
    
    // STEP 1: Get share link from Tableau
    // Go to your dashboard → Share button → Copy Link
    // Paste it here:
    embedUrl: extractTableauUrl(
      `https://public.tableau.com/views/VehiclestockandnewregistrationsbypowertrainGermany/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`
    ),
    
    // STEP 2: Thumbnail options (choose one):
    
    // Option A: Auto-construct (works for most Tableau Public dashboards)
    // thumbnailUrl: extractTableauThumbnail(`https://public.tableau.com/views/VehiclestockandnewregistrationsbypowertrainGermany/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`),
    
    // Option B: Provide direct thumbnail URL
    // thumbnailUrl: "https://public.tableau.com/static/images/XX/YourWorkbook/1.png",
    
    // Option C: Use your own screenshot
    thumbnailUrl: "/images/showroom/vehicles-germany-ifeu.png",
    
    // Option D: No thumbnail (shows placeholder)
    // thumbnailUrl: undefined,
    
    // STEP 3: Link to datasets used
    datasets: [
      {
        title: "New registrations - road vehicle in Germany",
        url: "https://portal.transport-data.org/@ifeu/new-registrations-road-vehicle-in-germany"
      },
      {
        title: "Road Vehicle Stock Germany",
        url: "https://portal.transport-data.org/@ifeu/road-vehicle-stock-germany"
      }
    ],
    
    // Optional:
    externalLink: "https://public.tableau.com/views/VehiclestockandnewregistrationsbypowertrainGermany/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
    aspectRatio: "16:9",
  },

  /*
  {
    id: "tableau-eu-superstore",
    title: "EU Superstore Sales Dashboard",
    description: 
      "Example dashboard visualizing sales performance, profit margins, and shipping metrics across European regions. Demonstrates interactive filtering and drill-down capabilities.",
    tags: ["Tableau", "Example", "Sales"],
    
    // Just paste the share link!
    embedUrl: extractTableauUrl(
      `https://public.tableau.com/views/EUSuperstoreDashboard_16685220141570/White_Mode?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`
    ),
    
    // Auto-construct thumbnail from share link
    thumbnailUrl: extractTableauThumbnail(
      `https://public.tableau.com/views/EUSuperstoreDashboard_16685220141570/White_Mode?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`
    ),
    
    datasets: [
      {
        title: "Sample Superstore Dataset",
        url: "https://public.tableau.com/app/learn/sample-data"
      }
    ],
    
    aspectRatio: "16:9",
    externalLink: "https://public.tableau.com/views/EUSuperstoreDashboard_16685220141570/White_Mode"
  },
  */

  // ========================================
  // EASY TEMPLATE FOR ADDING NEW DASHBOARDS
  // ========================================
  /*
  {
    id: "unique-id-here",
    title: "Your Dashboard Title",
    description: "Describe what insights this dashboard provides.",
    tags: ["tag1", "tag2"],
    
    // STEP 1: Get share link from Tableau
    // Go to your dashboard → Share button → Copy Link
    // Paste it here:
    embedUrl: extractTableauUrl(
      `PASTE_YOUR_TABLEAU_SHARE_LINK_HERE`
    ),
    
    // STEP 2: Thumbnail options (choose one):
    
    // Option A: Auto-construct (works for most Tableau Public dashboards)
    thumbnailUrl: extractTableauThumbnail(`PASTE_YOUR_SHARE_LINK_HERE`),
    
    // Option B: Provide direct thumbnail URL
    // thumbnailUrl: "https://public.tableau.com/static/images/XX/YourWorkbook/1.png",
    
    // Option C: Use your own screenshot
    // thumbnailUrl: "/images/showroom/my-dashboard.png",
    
    // Option D: No thumbnail (shows placeholder)
    // thumbnailUrl: undefined,
    
    // STEP 3: Link to datasets used
    datasets: [
      {
        title: "Dataset Name",
        url: "https://portal.transport-data.org/..."
      }
    ],
    
    // Optional:
    externalLink: "PASTE_YOUR_SHARE_LINK_HERE",
    aspectRatio: "16:9",
  },
  */
];
