/**
 * Utility to fetch tags from CKAN datasets at build time
 */

interface CKANTag {
  display_name: string;
  id: string;
  name: string;
  state: string;
  vocabulary_id: string | null;
}

interface CKANDataset {
  tags?: CKANTag[];
  name?: string;
}

interface CKANResponse {
  success: boolean;
  result: CKANDataset;
  error?: {
    message: string;
    __type: string;
  };
}

/**
 * Extract dataset ID from TDC Portal URL
 * Example: "https://portal.transport-data.org/@org/dataset-name" → "dataset-name"
 */
export function extractDatasetId(url: string): string | null {
  // Match pattern: /@orgname/dataset-id or /dataset/dataset-id
  const match = url.match(/\/@[^\/]+\/([^\/\?#]+)|\/dataset\/([^\/\?#]+)/);
  return match ? (match[1] || match[2]) : null;
}

/**
 * Fetch tags from a single CKAN dataset
 */
export async function fetchDatasetTags(datasetUrl: string): Promise<string[]> {
  const datasetId = extractDatasetId(datasetUrl);
  
  if (!datasetId) {
    console.warn(`Could not extract dataset ID from URL: ${datasetUrl}`);
    return [];
  }

  try {
    // Use your CKAN API URL
    const ckanApiUrl = process.env.NEXT_PUBLIC_CKAN_URL || 'https://ckan.tdc.prod.datopian.com';
    const apiEndpoint = `${ckanApiUrl}/api/action/package_show?id=${datasetId}`;
    
    console.log(`Fetching tags from: ${apiEndpoint}`);
    
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      console.warn(`Failed to fetch dataset ${datasetId}: ${response.statusText}`);
      return [];
    }

    const data: CKANResponse = await response.json();
    
    if (!data.success) {
      console.warn(`API returned error for ${datasetId}:`, data.error?.message);
      return [];
    }
    
    if (!data.result.tags || data.result.tags.length === 0) {
      console.log(`No tags found for dataset ${datasetId}`);
      return [];
    }

    // Extract tag names
    const tags = data.result.tags.map(tag => tag.display_name || tag.name);
    console.log(`Found ${tags.length} tags for ${datasetId}:`, tags);
    
    return tags;
  } catch (error) {
    console.error(`Error fetching tags for ${datasetId}:`, error);
    return [];
  }
}

/**
 * Fetch and merge tags from multiple dataset URLs
 * Returns unique tags sorted alphabetically
 */
export async function fetchTagsFromDatasets(datasetUrls: string[]): Promise<string[]> {
  console.log(`Fetching tags from ${datasetUrls.length} datasets...`);
  
  const tagPromises = datasetUrls.map(url => fetchDatasetTags(url));
  const tagArrays = await Promise.all(tagPromises);
  
  // Flatten, deduplicate, and sort
  const allTags = tagArrays.flat();
  const uniqueTags = Array.from(new Set(allTags));
  
  console.log(`Total unique tags found: ${uniqueTags.length}`);
  
  return uniqueTags.sort((a, b) => a.localeCompare(b));
}