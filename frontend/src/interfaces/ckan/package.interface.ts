import { PackageSearchOptions } from "@portaljs/ckan"

export interface PackageSearch extends PackageSearchOptions {
    include_drafts?:boolean;
    token?:string;
}