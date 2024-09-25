import { Activity, Dataset as CKANDataset, Group, Organization, Resource, Tag} from "@portaljs/ckan";

export interface Dataset {
    author?: string;
    author_email?: string;
    creator_user_id?: string;
    id: string;
    isopen?: boolean;
    license_id?: string;
    license_title?: string;
    maintainer?: string;
    maintainer_email?: string;
    metadata_created?: string;
    metadata_modified?: string;
    name: string;
    notes?: string;
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
    organization?: Organization;
    groups?: Array<Group>;
    tags?: Array<Tag>;
    total_downloads?: number;
    tdc_category:string;
    frequency:string;
    geographies?:string[];
    contributors:string[];
}