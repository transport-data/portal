// config file for showroom visualizations

export type DatasetRef = {
  /** Human-readable title shown on the showroom page */
  title: string;
  /** Link to the dataset page in the TDC Portal (or canonical dataset URL) */
  url: string;
};

export interface Visualization {
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
  tags?: string[] | 'auto';
  type?: 'iframe' | 'pdf';
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
  if (trimmed.includes('app.powerbi.com/view')) {
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
    
    // Power BI URLs work as-is for embedding
    return url;
  }
  
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
  
  throw new Error('Could not extract embed URL. Please provide a Tableau or Power BI share link.');
}

export const VISUALIZATIONS: Visualization[] = [
  {
    id: "tableau-ndc-measures",
    title: "Transport Mitigation Measures in NDCs",
    description:
      "See how countries include transport measures in their national climate plans (NDCs). Based on each country's latest available NDC, the chart shows the share featuring each transport measure type and the top five countries by category.",
    tags: 'auto',
    
    embedUrl: extractUrl(
      `https://public.tableau.com/shared/RQD536548?:display_count=n&:origin=viz_share_link`
    ),
    
    // thumbnailUrl: "https://public.tableau.com/static/images/RQ/RQD536548/1.png",
    thumbnailUrl: "/images/showroom/ndc-measures.png",
    
    datasets: [
      {
        title: "NDC Transport Tracker",
        url: "https://portal.transport-data.org/@giz/gizslocat-transport-climate-tracker",
      },
    ],
    
    externalLink: "https://public.tableau.com/shared/RQD536548?:display_count=n&:origin=viz_share_link",
  },
  {
    id: "ifeu-vehicles-germany",
    title: "Vehicle stock and new registrations by powertrain | Germany",
    description:
      "The data are based on an analysis conducted by the ifeu - Institute for Energy and Environmental Research Heidelberg, using the German Emission Inventory Model (TREMOD) and information from the German Federal Motor Transport Authority (KBA). Vehicle stock and new registrations refer to December 31 of each year. The sharp decline in new registrations in 2020 is primarily attributable to the effects of the COVID-19 pandemic.",
    tags: 'auto',
    
    embedUrl: extractUrl(
      `https://public.tableau.com/views/VehiclestockandnewregistrationsbypowertrainGermany/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`
    ),
    
    thumbnailUrl: "/images/showroom/ifeu-dashboard.png",
    
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
    
    externalLink: "https://public.tableau.com/views/VehiclestockandnewregistrationsbypowertrainGermany/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
  },
  
  {
    id: "powerbi-g20", 
    title: "G20 Transport Sector Dashboard",
    description: "The dashboard consolidates a structured collection of transport-related indicators for G20 member countries. It integrates data on population, urbanisation, mobility patterns, energy use, greenhouse gas emissions, electric vehicle deployment, national and NDC transport targets, biofuels, subsidies, hydrogen, batteries, and relevant policies.",
    tags: 'auto', 

    embedUrl: extractUrl(
      `https://app.powerbi.com/view?r=eyJrIjoiN2RmODMzNDItMGM2Mi00ZGFiLTljZTAtMzBmNDM3MmIxYWIxIiwidCI6IjY0OWVkOWQ3LTllNTItNDJmNi1hMDJjLTdmZWM4YmRhMjJmYyIsImMiOjl9`
    ),
    
    thumbnailUrl: "/images/showroom/g20-dashboard.png",
    
    datasets: [
      {
        title: "Transport Sector Country Factsheets",
        url: "https://portal.transport-data.org/@agora-verkehrswende/g20-countries-transport-and-climate-action-snapshot"
      }
    ],
    
    externalLink: "https://app.powerbi.com/view?r=eyJrIjoiN2RmODMzNDItMGM2Mi00ZGFiLTljZTAtMzBmNDM3MmIxYWIxIiwidCI6IjY0OWVkOWQ3LTllNTItNDJmNi1hMDJjLTdmZWM4YmRhMjJmYyIsImMiOjl9",
  },

  {
    id: "ndc-generations",
    title: "Transport content in NDC generations",
    description: "See the growth of Transport Targets in NDC generations globally and regions.",
    tags: 'auto',  
    
    embedUrl: extractUrl(
      `https://public.tableau.com/views/NDCgenerations/TransportMeasures?:embed=y&:sid=&:redirect=auth&language=en-GB&:display_count=n&:origin=viz_share_link`
    ),
    
    thumbnailUrl: "/images/showroom/ndc-generations.png",
    
    datasets: [
      {
        title: "NDC Transport Tracker",
        url: "https://portal.transport-data.org/@giz/gizslocat-transport-climate-tracker?org=GIZ&dataset=gizslocat-transport-climate-tracker",
      },
    ],
    
    externalLink: "https://public.tableau.com/views/NDCgenerations/TransportMeasures?:embed=y&:sid=&:redirect=auth&language=en-GB&:display_count=n&:origin=viz_share_link",
  },

  {
    id: "age-distrib",
    title: "Age distribution of car stock 2024 in Germany",
    description: "The data are based on an analysis conducted by the ifeu - Institute for Energy and Environmental Research Heidelberg, using the German Emission Inventory Model (TREMOD) and information from the German Federal Motor Transport Authority (KBA). In Germany, half of the stock is below 10 years of age, but almost 5 million cars remain in the stock which are more than 20 years old. This leads to the fact that the average age of cars is 10.6 years in 2024.",
    tags: ["age distribution", "car stock in Germany"],
    
    embedUrl: extractUrl(
      `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`
    ),
    
    // thumbnailUrl: `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock.png`,
    thumbnailUrl: "/images/showroom/agedistributioncomparisonnewregvs_stock.png",

    datasets: [
      {
        title: "Age Distribution",
        url: "https://portal.transport-data.org/@ifeu/vehicle-age-road-transport-germany"
      }
    ],
    
    externalLink: "https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
  },

  {
    id: "Veh_Stock_TSDK",
    title: "Car stock in African countries – comparison of data sources from Transport Starter Data Kits",
    description: "The analysis is based on data published on the TDC Portal (original source: Transport Starter Data Kits). The graphic compares historical car stock data gathered from various sources for selected countries in Africa. Certain values may differ for the same country depending on the source.",
    tags: ["Vehicle Stock", "Africa","Starter Data Kits"],
    
    embedUrl: extractUrl(
      `https://public.tableau.com/views/CarstockinAfricancountriescomparisonofdatasourcesfromTransportStarterDataKits/Dashboard1?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`
    ),
    
    // thumbnailUrl: `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock.png`,
    thumbnailUrl: "/images/showroom/Vehstock_TDK.png",

    datasets: [
      {
        title: "Vehicle Stock from Transport Starter Data Kits",
        url: "https://portal.transport-data.org/@ccg/vehicle-stock-from-ccg-transport-starter-data-kits"
      }
    ],
    
    externalLink: "https://public.tableau.com/app/profile/ifeu.mobility1285/viz/CarstockinAfricancountriescomparisonofdatasourcesfromTransportStarterDataKits/Dashboard1",
  },

{
    id: "Veh_Stock_Nigeria",
    title: "Stock and new registrations of passenger cars in Nigeria",
    description: "The analysis is based on data published on the TDC Portal.",
    tags: ["Vehicle Stock", "Africa","Nigeria","New registrations"],
    
    embedUrl: extractUrl(
      `https://public.tableau.com/views/StockandnewregistrationsofpassengercarsNigeria/Stock_newregistrations?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`
    ),
    
    // thumbnailUrl: `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock.png`,
    thumbnailUrl: "/images/showroom/Stock_new%20registrations.png",

    datasets: [
      {
        title: "Passenger Cars Registrations and Stock, Nigeria 2005-2019",
        url: "https://portal.transport-data.org/@oica/passenger-cars-registrations-and-stock-nigeria-2005-2019?org=OICA&amp;amp;dataset=passenger-cars-registrations-and-stock-nigeria-2005-2019"
      }
    ],
    
    externalLink: "https://public.tableau.com/app/profile/ifeu.mobility1285/viz/StockandnewregistrationsofpassengercarsNigeria/Stock_newregistrations#1",
  },

  {
    id: "Keyfig_Germany",
    title: "Comparison of road transport key figures | Germany",
    description: "The data are based on an analysis conducted by the ifeu – Institute for Energy and Environmental Research Heidelberg, using the German Emission Inventory Model (TREMOD).",
    tags: ["Vehicle Stock", "Transport performance","Mileage","Energy consumption","GHG emissions"],
    
    embedUrl: extractUrl(
      `https://public.tableau.com/views/ComparisonofroadtransportkeyfiguresGermany/Roadtransport?:language=de-DE&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link`
    ),
    
    // thumbnailUrl: `https://public.tableau.com/views/AgedistributionofcarstockcomparisonwithnewregistrationsGermany/Agedistributioncomparisonnewregvs_stock.png`,
    thumbnailUrl: "/images/showroom/Road%20transport.png",

    datasets: [
      {
        title: "Mileage - Road Transport Germany",
        url: "https://portal.transport-data.org/@ifeu/mileage-road-transport-germany?org=IFEU&dataset=mileage-road-transport-germany"
      },
      {
        title: "Transport performances - Road Transport Germany",
        url: "https://portal.transport-data.org/@ifeu/transport-performances-road-transport-germany?org=IFEU&dataset=transport-performances-road-transport-germany"
      },
       {
         title: "Energy consumption - Road Transport Germany",
        url: "https://portal.transport-data.org/@ifeu/energy-consumption-road-transport-germany?org=IFEU&dataset=energy-consumption-road-transport-germany"
      },
       {
         title: "GHG emissions - Road Transport Germany",
        url: "https://portal.transport-data.org/@ifeu/ghg-emissions-road-transport-germany?org=IFEU&dataset=ghg-emissions-road-transport-germany"
      }
    ],
    
    externalLink: "https://public.tableau.com/app/profile/ifeu.mobility1285/viz/ComparisonofroadtransportkeyfiguresGermany/Roadtransport#1",
  },
  // ========================================
  // EASY TEMPLATE FOR ADDING NEW DASHBOARDS
  // ========================================
  /*
  {
    id: "unique-id-here", //no spaces!
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
  },
  */

  // Add PDF
  {
    id: 'guidance-vehicle-stock',
    title: 'Guidance n°1:  national road vehicle fleet and registration for a bottom-up inventory',
    description: 'Comprehensive guidance document for collecting and analyzing vehicle stock and new registration data.',
    embedUrl: '/pdfs/Guidance1-vehicle-stock-and-new-registrations.pdf',
    type: 'pdf',
    thumbnailUrl: '/images/showroom/guidance-vehicle-thumb.png', // Add your thumbnail
    externalLink: '/pdfs/Guidance1-vehicle-stock-and-new-registrations.pdf', // For download
    datasets: [
      {
        title: 'Passenger Cars Registrations and Stock, Nigeria 2005-2019',
        url: 'https://portal.transport-data.org/@oica/passenger-cars-registrations-and-stock-nigeria-2005-2019'
      }
    ],
    tags: 'auto' // Will fetch tags from the dataset
  },
];
