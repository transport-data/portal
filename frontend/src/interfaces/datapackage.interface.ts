export const OptionsFields = [
  "any",
  "array",
  "boolean",
  "date",
  "datetime",
  "duration",
  "geojson",
  "geopoint",
  "integer",
  "number",
  "object",
  "string",
  "time",
  "year",
  "yearmonth",
] as const;

type FieldType = (typeof OptionsFields)[number];

export interface Field {
  name: string;
  type: FieldType;
}

export interface Schema {
  fields: Field[];
}

export interface Resource {
  format?: string;
  name: string;
  description?: string;
  title?: string;
  schema?: Schema;
  profile?: string;
  path?: string;
  size?: number;
}

export interface License {
  name: string;
  path?: string;
  title?: string;
}

export interface DataPackage {
  name: string;
  title?: string;
  description?: string;
  profile?: string;
  resources: Resource[];
  path?: string;
  size?: number;
  private: boolean;
  language?: string;
  author?: string;
  author_email?: string;
  coverage?: string;
  rights?: string;
  conforms_to?: string;
  has_version?: string;
  is_version_of?: string;
  contact_point?: string;
  owner_org?: string;
  groupsId?: string[];
}

export interface Term {
  name: string;
  title?: string;
  description?: string;
  collections: Array<string>;
}

export interface Collection {
  name: string;
  title?: string;
  description?: string;
  terms: Array<string>;
}
