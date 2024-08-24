Admin app (aka cloud app) for PortalJS Cloud. It enables users to:

- Sign up (login)
- Set up a CKAN organization
- Publish datasets
- Manage their PortalJS based frontend apps
- More features are coming.

It uses CKAN via API to manage datasets that belongs to users organization.

## Blob storage

It uses R2 and uploads directly to a public bucket. It is separate from CKAN's bucket so we simply create a resource in CKAN with a URL to a data resource. I.e., upload and download happens completely separate from CKAN.

## Auth

We use legacy API key instead of new tokens at the moment. The API key is obtained when user authenticates. We then store the API key and organization info in the session.

:warning: Note, we believe our current approach is a technical debt and we need to fix this in the future so that users register/login using CKAN app. Eg, they would need to go to CKAN UI and perform all auth related stuff which is already implemented there: registration, login, password reset, registration via invite link etc.

To sign up a user, this app performs:

- Creates a user via API in CKAN (note that we need to use sysadmin key for it). User is created from the information that is provided in the registration form.
- Creates a new organization via API in CKAN (again, we need to use sysadmin key). The org is created from the organization name that user provided in the registration form.
- We assign user as admin of the organization. This way she/he can manage datasets and users of that org.
- We finally login and redirect the user to the dashboard page.

## Frontend app - PortalJS

We deploy a new PortalJS instance when user signs up and creates a new organization:

1. A user registered and a new org is created in CKAN.
2. Git clone template app - https://github.com/datopian/portals-monorepo/tree/main/apps/hybrid-ckan
3. Create a new github repository with name `portal-{org-name}`
4. Connect github repository with Cloudflare Pages so that we get the deployment - https://developers.cloudflare.com/workers/wrangler/commands/#pages
5. Set up custom domain which uses this pattern `org-name.portaljs.com`

Where these jobs are running? We run it in Vercel (i.e., lambda) fro now but need to consider timeout for the jobs...otherwise would need to move to Airflow or similar.

We keep all Data Portal metadata in the organizations metadata:

<img width="806" alt="Screen Shot 2023-08-29 at 1 14 38 AM" src="https://github.com/datopian/cloud.portaljs.com/assets/17809581/c00bf472-b777-469c-88ae-e9030d2b2b89">

Below is how an organization dictionary would look like when querying CKAN API:

```javascript
{
  name: "my-org-name", // we use it for subdomain, eg, my-org-name.portaljs.com
  url: "...", // url to the portaljs instance for this org, by default, it's "my-org-name.portaljs.com" but also can be a custom domain
  title: "My org title", // we can use it for different purposes including meta tag of the website, headline in the hero image etc.
  description: "My longer description of the org", // can use as a meta tag + subtitle below headline.
  logo: "https://blob.datopian.com/org-name/logo.png", // logo of the site
  favicon: "https://blob.datopian.com/org-name/favicon",
  image: "https://blob.datopian.com/org-name/hero.png", // hero image for all pages (home, search, dataet etc.)
}
```
