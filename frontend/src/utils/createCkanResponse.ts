import { CkanResponse } from "@schema/ckan.schema";

export function createCkanResponse<T>(data: T): CkanResponse<T> {
  return {
    help: "",
    success: true,
    result: data,
  };
}


