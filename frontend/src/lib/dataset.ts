import {PackageSearch} from "@interfaces/ckan/package.interface"
import CkanRequest from "@datopian/ckan-api-client-js"
import { env } from "@env.mjs"

export async function packageSearch(
    options: Partial<PackageSearch>,
) {
    const ckanUrl =env.NEXT_PUBLIC_CKAN_URL;
    const baseAction = `package_search`

    let queryParams: string[] = []

    if (options?.query) {
        queryParams.push(`q=${options.query}`)
    }

    if (options?.offset) {
        queryParams.push(`start=${options.offset}`)
    }

    if (options?.limit || options?.limit == 0) {
        queryParams.push(`rows=${options.limit}`)
    }

    if (options?.sort) {
        queryParams.push(`sort=${options?.sort}`)
    }

    if (options?.include_drafts) {
        queryParams.push(`include_drafts=${options?.include_drafts}`)
    }


    const apiKey = {
        ...(options.token ? {
            apiKey: options.token
        }:{})
    }

    const action = `${baseAction}?${queryParams.join("&")}`
    const res = await CkanRequest.get<any>(action, { ckanUrl, ...apiKey})

    return res.result
}