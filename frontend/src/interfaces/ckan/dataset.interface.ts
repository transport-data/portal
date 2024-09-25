import { Dataset as CKANDataset} from "@portaljs/ckan";

export interface Dataset extends CKANDataset {
    tdc_category:string;
    frequency:string;
    geographies?:string[];
    contributors:string[]
}
  