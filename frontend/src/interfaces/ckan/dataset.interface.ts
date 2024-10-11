import {
  Activity,
  Dataset as CKANDataset,
  Group,
  Organization,
  Resource,
  Tag,
} from "@portaljs/ckan";

export interface Dataset {
  author?: string;
  author_email?: string;
  creator_user_id?: string;
  creator_user?: {
    name: string;
    fullname?: string;
    email: string;
  };
  contributors_data: Array<{
    name: string;
    fullname?: string;
    email: string;
  }>;
  id: string;
  isopen?: boolean;
  license_id?: string;
  license_title?: string;
  license_url: string;
  maintainer?: string;
  maintainer_email?: string;
  metadata_created?: string;
  metadata_modified?: string;
  name: string;
  notes?: string;
  overview_text?: string;
  introduction_text?: string;
  num_resources: number;
  num_tags: number;
  owner_org?: string;
  private?: boolean;
  state?: "active" | "inactive" | "deleted" | "draft";
  title?: string;
  type?: "dataset";
  url?: string;
  version?: string;
  activity_stream?: Array<Activity>;
  resources: Array<Resource>;
  comments: Array<{
    initials: string;
    comment: string;
    date: string;
  }>;
  sources?: Array<{
    title: string;
    url?: string;
  }>;
  related_datasets?: Array<string>;
  temporal_coverage_start?: string;
  temporal_coverage_end?: string;
  topics?: Array<string>;
  modes?: Array<string>;
  sectors?: Array<string>;
  services?: Array<string>;
  units: Array<string>;
  organization?: Organization & { url?: string; email?: string };
  groups?: Array<Group>;
  tags?: Array<Tag>;
  total_downloads?: number;
  tdc_category: string;
  indicators?: string[];
  frequency: string;
  geographies?: string[];
  regions?: string[];
  contributors: string[];
}
