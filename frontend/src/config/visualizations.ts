// config file for showroom visualizations

export type DatasetRef = {
  /** Human-readable title shown on the showroom page */
  title: string;
  /** Link to the dataset page in the TDC Portal (or canonical dataset URL) */
  url: string;
};

export interface Visualization {
  /**
   * Becomes the page URL: /showroom/<id>
   * Letters, numbers, hyphens and underscores only. Printed links and QR codes
   * point at this, so don't change it once it's published.
   */
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  externalLink?: string;
  thumbnailUrl?: string;
  datasets: { title: string; url: string }[];
  /**
   * Tags for categorization
   * - Set to 'auto' to fetch from referenced datasets at build time
   * - Provide string array for manual tags
   * - Leave undefined for no tags
   */
  tags?: string[] | "auto";
  /**
   * Set to true if the embed adapts to narrow screens. Otherwise it's held at
   * desktop size and scrolls inside its frame on phones, which Tableau and
   * Power BI dashboards generally need.
   */
  responsive?: boolean;
  /**
   * Set to true to list this visualization in the Visualisations tab of the
   * dataset pages it references. Otherwise it only appears in the showroom.
   */
  includeOnDatasetPage?: boolean;
}

/** Throws so that a bad config entry fails the build rather than a live page. */
export function validateVisualizations(visualizations: Visualization[]): void {
  const seenIds = new Set<string>();

  for (const viz of visualizations) {
    if (!/^[A-Za-z0-9_-]+$/.test(viz.id)) {
      throw new Error(
        `Visualization id "${viz.id}" can only contain letters, numbers, hyphens and underscores.`,
      );
    }
    if (seenIds.has(viz.id)) {
      throw new Error(`Visualization id "${viz.id}" is used more than once.`);
    }
    seenIds.add(viz.id);

    if (!viz.datasets || viz.datasets.length < 1) {
      throw new Error(
        `Visualization "${viz.id}" must reference at least one dataset in config.`,
      );
    }
  }
}

/**
 * Helper function: Extract embed URL from Tableau OR Power BI
 * @param input - Can be: Tableau embed code/share link, Power BI share link, or direct embed URL
 * @returns Clean embed URL ready to use in iframe
 */
export function extractUrl(input: string): string {
  // Clean up the input
  const trimmed = input.trim();

  // NEW: Check if it's a Power BI link first
  if (trimmed.includes("app.powerbi.com/view")) {
    let url = trimmed;

    // Extract URL if it's wrapped in HTML
    const urlMatch = trimmed.match(/https?:\/\/[^\s'"<>]+/);
    if (urlMatch) {
      url = urlMatch[0];
    }

    // Ensure it has the base structure
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    // Power BI URLs work as-is for embedding
    return url;
  }

  // Method 1: If it's a Tableau share link (contains /views/)
  if (
    trimmed.includes("public.tableau.com/views/") ||
    trimmed.includes("public.tableau.com/shared/")
  ) {
    let url = trimmed;

    // Extract URL if it's wrapped in HTML
    const urlMatch = trimmed.match(/https?:\/\/[^\s'"<>]+/);
    if (urlMatch) {
      url = urlMatch[0];
    }

    // Ensure it has the base structure
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    // Add required embed parameters
    if (!url.includes(":embed=true")) {
      url += (url.includes("?") ? "&" : "?") + ":embed=true";
    }
    if (!url.includes(":showVizHome=")) {
      url += "&:showVizHome=no";
    }

    return url;
  }

  // Method 2: Extract from <param name='path'> in object tag (old embed code format)
  const pathMatch = trimmed.match(/name='path'\s+value='([^']+)'/);
  if (pathMatch) {
    let path = (pathMatch[1] ?? "")
      .replace(/&#47;/g, "/")
      .replace(/&amp;/g, "&");

    // Ensure embed parameters are present
    if (!path.includes(":embed=true")) {
      path += (path.includes("?") ? "&" : "?") + ":embed=true";
    }
    if (!path.includes(":showVizHome=")) {
      path += "&:showVizHome=no";
    }

    return `https://public.tableau.com/${path}`;
  }

  // Method 3: Extract from <param name='name'> (newer embed code format)
  const nameMatch = trimmed.match(/name='name'\s+value='([^']+)'/);
  if (nameMatch) {
    let name = (nameMatch[1] ?? "").replace(/&#47;/g, "/");

    // Build the URL
    let url = `https://public.tableau.com/views/${name}?:embed=true&:showVizHome=no`;
    return url;
  }

  // Method 4: Extract from iframe src (if present)
  const iframeMatch = trimmed.match(/src=['"]([^'"]+)['"]/);
  if (iframeMatch) {
    let url = iframeMatch[1]!;

    // Ensure embed parameters are present
    if (!url.includes(":embed=true")) {
      url += (url.includes("?") ? "&" : "?") + ":embed=true";
    }
    if (!url.includes(":showVizHome=")) {
      url += "&:showVizHome=no";
    }

    return url;
  }

  throw new Error(
    "Could not extract embed URL. Please provide a Tableau or Power BI share link.",
  );
}

export const VISUALIZATIONS: Visualization[] = [
  // ========================================
  // TEMPLATE FOR ADDING NEW DASHBOARDS
  // ========================================
  /*
  {
    id: "unique-id-here", // becomes the URL /showroom/unique-id-here. Letters, numbers, - and _ only
    title: "Your Dashboard Title",
    description: "Describe what insights this dashboard provides.",
    // Option A: Auto-fetch tags from datasets
    tags: 'auto', // Will auto-fetch tags from referenced datasets (if supported by the dataset config)
    // Option B: Manual tags
    tags: ["tag1", "tag2"],
    
    // STEP 1: Get share link
    // 
    // FOR TABLEAU:
    // Go to your dashboard → Share button → Copy Link
    // 
    // FOR POWER BI:
    // Go to your dashboard → File → Share → Embed report → Copy the link
    // (Or use the view link directly from app.powerbi.com/view?r=...)
    //
    // Paste it here:
    embedUrl: extractUrl(
      `PASTE_YOUR_TABLEAU_OR_POWERBI_SHARE_LINK_HERE`
    ),
    // ALTERNATIVE
    // If your visualization is accesible via an own URL, you can directly paste it here
    embedURL: "your-URL",
    
    // STEP 2: Thumbnail options (choose one):
    
    // Option A: Provide direct web link to thumbnauil image
    thumbnailUrl: `PASTE_LINK_HERE`,
    
    // Option B: Use a screenshot
    // 1. Take a screenshot of your dashboard
    // 2. Save to: /public/images/showroom/your-dashboard.png
    // 3. Reference it:
    // thumbnailUrl: "/images/showroom/your-dashboard.png",
    
    // Option C: No thumbnail (shows placeholder)
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
    responsive: true, // only if the embed works on phones without a desktop-sized frame
    includeOnDatasetPage: true, // also list it in the Visualisations tab of the datasets above
  },
  */
  {
    id: "asia-freight-monitor",
    title: "Asia Freight Decarbonisation Monitor",
    description:
      "A regional monitor for freight-related CO₂ emissions, air pollutants, fleet & fuel demand, and the policy landscape driving decarbonisation in China, India, Indonesia and Vietnam.",
    tags: "auto",
    embedUrl: "https://asia-freight.katha.media/",
    thumbnailUrl: "/images/showroom/asia-freight-monitor.png",
    datasets: [
      {
        title: "Freight Transport - Tonne-km (Total)",
        url: "https://portal.transport-data.org/@asian%20transport%20observatory/freight-transport-tonne-km-total-all-ato",
      },
      {
        title: "Freight Transport - Rail",
        url: "https://portal.transport-data.org/@asian%20transport%20observatory/freight-transport-rail-ato",
      },
      {
        title: "Total Freight Kilometer Travel Mode Share",
        url: "https://portal.transport-data.org/@asian%20transport%20observatory/total-freight-kilometer-travel-mode-share-all-ato",
      },
    ],
    externalLink: "https://asia-freight.katha.media/",
  },
  {
    id: "ndc-tia-freight",
    title: "NDC-TIA Freight Dashboard",
    description:
      "Assessment of freight transport and logistics in NDCs from China, India and Viet Nam, and comparison to Asia.",
    tags: "auto",
    embedUrl: "https://slocat-partnership.github.io/ndc-tia-freight-overview/",
    thumbnailUrl: "/images/showroom/ndc-tia-freight.png",
    datasets: [
      {
        title: "NDC-TIA Freight Dashboard",
        url: "https://portal.transport-data.org/@slocat/ndc-tia-freight-dashboard",
      },
    ],
    externalLink:
      "https://slocat-partnership.github.io/ndc-tia-freight-overview/",
  },
  {
    id: "ndcs-regional",
    title: "Regional Insights on Transport in Third-Generation NDCs",
    description: "Regional Insights on Transport in Third-Generation NDCs.",
    tags: "auto",
    embedUrl: "https://slocat-partnership.github.io/ndc-transport-regions/",
    thumbnailUrl: "/images/showroom/ndc-regional.png",
    datasets: [
      {
        title: "NDC Transport Tracker",
        url: "https://portal.transport-data.org/@giz/gizslocat-transport-climate-tracker?org=GIZ&dataset=gizslocat-transport-climate-tracker",
      },
    ],
    externalLink: "https://slocat-partnership.github.io/ndc-transport-regions/",
  },
  {
    id: "tumi-fuel-prices",
    title: "TUMI Fuel Price App",
    description:
      "The fuel price dashboard provides insights into global fuel prices. Explore fuel prices worldwide, analyze country-specific data, and track trends over time.",
    tags: ["fuel", "prices", "energy"],

    embedUrl: "https://fuelprices.app/",

    thumbnailUrl: "/images/showroom/fuelprice-app.png",

    datasets: [
      {
        title: "TUMI Mobility Data Hub",
        url: "https://portal.transport-data.org/@tumi/tumi-mobility-data-hub",
      },
    ],

    externalLink: "https://fuelprices.app/",
  },
  {
    id: "Keyfig_Germany",
    title: "Comparison of road transport key figures | Germany",
    description:
      "The data are based on an analysis conducted by the ifeu – Institute for Energy and Environmental Research Heidelberg, using the German Emission Inventory Model (TREMOD).",
    tags: [
      "Vehicle Stock",
      "Transport performance",
      "Mileage",
      "Energy consumption",
      "GHG emissions",
    ],

    embedUrl: extractUrl(
      `https://public.tableau.com/views/ComparisonofroadtransportkeyfiguresGermany/Roadtransport?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`,
    ),

    // thumbnailUrl: `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock.png`,
    thumbnailUrl: "/images/showroom/Road%20transport.png",

    datasets: [
      {
        title: "Mileage - Road Transport Germany",
        url: "https://portal.transport-data.org/@ifeu/mileage-road-transport-germany?org=IFEU&dataset=mileage-road-transport-germany",
      },
      {
        title: "Transport performances - Road Transport Germany",
        url: "https://portal.transport-data.org/@ifeu/transport-performances-road-transport-germany?org=IFEU&dataset=transport-performances-road-transport-germany",
      },
      {
        title: "Energy consumption - Road Transport Germany",
        url: "https://portal.transport-data.org/@ifeu/energy-consumption-road-transport-germany?org=IFEU&dataset=energy-consumption-road-transport-germany",
      },
      {
        title: "GHG emissions - Road Transport Germany",
        url: "https://portal.transport-data.org/@ifeu/ghg-emissions-road-transport-germany?org=IFEU&dataset=ghg-emissions-road-transport-germany",
      },
    ],

    externalLink:
      "https://public.tableau.com/app/profile/ifeu.mobility1285/viz/ComparisonofroadtransportkeyfiguresGermany/Roadtransport#1",
  },
  {
    id: "Veh_Stock_Nigeria",
    title: "Stock and new registrations of passenger cars in Nigeria",
    description: "The analysis is based on data published on the TDC Portal.",
    tags: ["Vehicle Stock", "Africa", "Nigeria", "New registrations"],

    embedUrl: extractUrl(
      `https://public.tableau.com/views/StockandnewregistrationsofpassengercarsNigeria/Stock_newregistrations?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`,
    ),

    // thumbnailUrl: `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock.png`,
    thumbnailUrl: "/images/showroom/Stock_new%20registrations.png",

    datasets: [
      {
        title: "Passenger Cars Registrations and Stock, Nigeria 2005-2019",
        url: "https://portal.transport-data.org/@oica/passenger-cars-registrations-and-stock-nigeria-2005-2019?org=OICA&amp;amp;dataset=passenger-cars-registrations-and-stock-nigeria-2005-2019",
      },
    ],

    externalLink:
      "https://public.tableau.com/app/profile/ifeu.mobility1285/viz/StockandnewregistrationsofpassengercarsNigeria/Stock_newregistrations#1",
  },
  {
    id: "Veh_Stock_TSDK",
    title:
      "Car stock in African countries – comparison of data sources from Transport Starter Data Kits",
    description:
      "The analysis is based on data published on the TDC Portal (original source: Transport Starter Data Kits). The graphic compares historical car stock data gathered from various sources for selected countries in Africa. Certain values may differ for the same country depending on the source.",
    tags: ["Vehicle Stock", "Africa", "Starter Data Kits"],

    embedUrl: extractUrl(
      `https://public.tableau.com/views/CarstockinAfricancountriescomparisonofdatasourcesfromTransportStarterDataKits/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`,
    ),

    // thumbnailUrl: `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock.png`,
    thumbnailUrl: "/images/showroom/Vehstock_TDK.png",

    datasets: [
      {
        title: "Vehicle Stock from Transport Starter Data Kits",
        url: "https://portal.transport-data.org/@ccg/vehicle-stock-from-ccg-transport-starter-data-kits",
      },
    ],

    externalLink:
      "https://public.tableau.com/app/profile/ifeu.mobility1285/viz/CarstockinAfricancountriescomparisonofdatasourcesfromTransportStarterDataKits/Dashboard1",
  },
  {
    id: "age-distrib",
    title: "Age distribution of car stock 2024 in Germany",
    description:
      "The data are based on an analysis conducted by the ifeu - Institute for Energy and Environmental Research Heidelberg, using the German Emission Inventory Model (TREMOD) and information from the German Federal Motor Transport Authority (KBA). In Germany, half of the stock is below 10 years of age, but almost 5 million cars remain in the stock which are more than 20 years old. This leads to the fact that the average age of cars is 10.6 years in 2024.",
    tags: ["age distribution", "car stock in Germany"],

    embedUrl: extractUrl(
      `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`,
    ),

    // thumbnailUrl: `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock.png`,
    thumbnailUrl:
      "/images/showroom/agedistributioncomparisonnewregvs_stock.png",

    datasets: [
      {
        title: "Age Distribution",
        url: "https://portal.transport-data.org/@ifeu/vehicle-age-road-transport-germany",
      },
    ],

    externalLink:
      "https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
  },
  {
    id: "ndc-generations",
    title: "Transport content in NDC generations",
    description:
      "See the growth of Transport Targets in NDC generations globally and regions.",
    tags: "auto",

    embedUrl: extractUrl(
      `https://public.tableau.com/views/NDCgenerations/TransportMeasures?:embed=y&:sid=&:redirect=auth&language=en-GB&:display_count=n&:origin=viz_share_link`,
    ),

    thumbnailUrl: "/images/showroom/ndc-generations.png",

    datasets: [
      {
        title: "NDC Transport Tracker",
        url: "https://portal.transport-data.org/@giz/gizslocat-transport-climate-tracker?org=GIZ&dataset=gizslocat-transport-climate-tracker",
      },
    ],

    externalLink:
      "https://public.tableau.com/views/NDCgenerations/TransportMeasures?:embed=y&:sid=&:redirect=auth&language=en-GB&:display_count=n&:origin=viz_share_link",
  },
  {
    id: "powerbi-g20",
    title: "G20 Transport Sector Dashboard",
    description:
      "The dashboard consolidates a structured collection of transport-related indicators for G20 member countries. It integrates data on population, urbanisation, mobility patterns, energy use, greenhouse gas emissions, electric vehicle deployment, national and NDC transport targets, biofuels, subsidies, hydrogen, batteries, and relevant policies.",
    tags: "auto",

    embedUrl: extractUrl(
      `https://app.powerbi.com/view?r=eyJrIjoiN2RmODMzNDItMGM2Mi00ZGFiLTljZTAtMzBmNDM3MmIxYWIxIiwidCI6IjY0OWVkOWQ3LTllNTItNDJmNi1hMDJjLTdmZWM4YmRhMjJmYyIsImMiOjl9`,
    ),

    thumbnailUrl: "/images/showroom/g20-dashboard.png",

    datasets: [
      {
        title: "Transport Sector Country Factsheets",
        url: "https://portal.transport-data.org/@agora-verkehrswende/g20-countries-transport-and-climate-action-snapshot",
      },
    ],

    externalLink:
      "https://app.powerbi.com/view?r=eyJrIjoiN2RmODMzNDItMGM2Mi00ZGFiLTljZTAtMzBmNDM3MmIxYWIxIiwidCI6IjY0OWVkOWQ3LTllNTItNDJmNi1hMDJjLTdmZWM4YmRhMjJmYyIsImMiOjl9",
  },
  {
    id: "ifeu-vehicles-germany",
    title: "Vehicle stock and new registrations by powertrain | Germany",
    description:
      "The data are based on an analysis conducted by the ifeu - Institute for Energy and Environmental Research Heidelberg, using the German Emission Inventory Model (TREMOD) and information from the German Federal Motor Transport Authority (KBA). Vehicle stock and new registrations refer to December 31 of each year. The sharp decline in new registrations in 2020 is primarily attributable to the effects of the COVID-19 pandemic.",
    tags: "auto",

    embedUrl: extractUrl(
      `https://public.tableau.com/views/VehiclestockandnewregistrationsbypowertrainGermany/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`,
    ),

    thumbnailUrl: "/images/showroom/ifeu-dashboard.png",

    datasets: [
      {
        title: "New registrations - road vehicle in Germany",
        url: "https://portal.transport-data.org/@ifeu/new-registrations-road-vehicle-in-germany",
      },
      {
        title: "Road Vehicle Stock Germany",
        url: "https://portal.transport-data.org/@ifeu/road-vehicle-stock-germany",
      },
    ],

    externalLink:
      "https://public.tableau.com/views/VehiclestockandnewregistrationsbypowertrainGermany/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
  },
  {
    id: "tableau-ndc-measures",
    title: "Transport Mitigation Measures in NDCs",
    description:
      "See how countries include transport measures in their national climate plans (NDCs). Based on each country's latest available NDC, the chart shows the share featuring each transport measure type and the top five countries by category.",
    tags: "auto",

    embedUrl: extractUrl(
      `https://public.tableau.com/shared/RQD536548?:display_count=n&:origin=viz_share_link`,
    ),

    // thumbnailUrl: "https://public.tableau.com/static/images/RQ/RQD536548/1.png",
    thumbnailUrl: "/images/showroom/ndc-measures.png",

    datasets: [
      {
        title: "NDC Transport Tracker",
        url: "https://portal.transport-data.org/@giz/gizslocat-transport-climate-tracker",
      },
    ],

    externalLink:
      "https://public.tableau.com/shared/RQD536548?:display_count=n&:origin=viz_share_link",
  },
];
