# Docker Compose setup for TDC

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [1. User guide (For non devs)](#1-user-guide-for-non-devs)
- [2. Quickstart](#2-quickstart)
  - [Run the backend](#run-the-backend)
  - [Run the frontend](#run-the-frontend)
  - [Run tests](#run-tests)
- [3. Applying patches](#3-applying-patches)
- [4. envvars](#4-envvars)
- [5. Manage new users](#5-manage-new-users)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## 1. User guide (For non devs)

Instructions on how to use the final product once deployed can be found in the [docs folder](docs), below is a table of contents with all the current documentation pages

- [1. About-Us page](/docs/about-us/README.md)
- [2. Analytics](/docs/analytics/README.md)
- [3. Contact-Us page](/docs/contact-us/README.md)
- [4. Overview of the Dashboard](/docs/dashboard/README.md)
- [5. Overview of the Dataset Creation/Edit and Delete Process](/docs/datasets/README.md)
- [6. How to save a dataset as draft](/docs/datasets-draft/README.md)
- [7. Geographies](/docs/geographies/README.md)
- [8. The Home page](/docs/home-page/README.md)
- [9. The metadata Schema](/docs/metadata-schema/README.md)
- [10. The newsfeed (Part of the dashboard)](/docs/newsfeed/README.md)
- [11. Onboarding process](/docs/onboarding/README.md)
- [12. Create/Edit/Delete Organizations](/docs/orgs/README.md)
- [13. Page Loading Component](/docs/page-loading-component/README.md)
- [14. Protected Routes](/docs/protected-routes/README.md)
- [15. SDMX Integration](/docs/sdmx/README.md)
- [16. The search bar component](/docs/search-bar-component/README.md)
- [17. Single Sign-On (Github Signin)](/docs/sso/README.md)
- 18 Static Pages
    - [18.1. Events](/docs/static-pages/events/README.md)
    - [18.2. FAQ](/docs/static-pages/faq/README.md)
    - [18.3. People](/docs/static-pages/people/README.md)
    - [18.4. Testimonials](/docs/static-pages/testimonials/README.md)
- [19. Create/Edit/Delete Topics](/docs/topics/README.md)
- [20. Approval Workflow](/docs/approval-workflow/README.md)
- [21. Data Provider Page](/docs/data-provider/README.md)
- [22. Follow and Unfollow](/docs/follow-unfollow/README.md)
- [23. Account settings](/docs/settings/README.md)
- [24. Newsletter section](/docs/newsletter/README.md)
- [25. Page loading](/docs/page-loading-component/README.md)
- [26. Visualization Showroom](/docs/showroom/README.md)

## 2. Quickstart

### Run the backend

- `cp .env.example .env`
- `docker compose -f docker-compose.dev.yml up --build`

### Run the frontend

- `cd frontend`
- `cp .env.example .env`
- `npm i && npm run dev`

### Run tests

- `cd frontend`
- Create an API Token in the CKAN UI and then paste into `cypress.config.js`
- `npm run test` or `npm run open`

## 3. Applying patches

When building your project specific CKAN images (the ones defined in the `ckan/` folder), you can apply patches 
to CKAN core or any of the built extensions. To do so create a folder inside `ckan/patches` with the name of the
package to patch (ie `ckan` or `ckanext-??`). Inside you can place patch files that will be applied when building
the images. The patches will be applied in alphabetical order, so you can prefix them sequentially if necessary.

For instance, check the following example image folder:

```
ckan
├── patches
│   ├── ckan
│   │   ├── 01_datasets_per_page.patch
│   │   ├── 02_groups_per_page.patch
│   │   ├── 03_or_filters.patch
│   └── ckanext-harvest
│       └── 01_resubmit_objects.patch
├── setup
└── Dockerfile.dev

```

## 4. envvars

The ckanext-envvars extension is used in the CKAN Docker base repo to build the base images.
This extension checks for environmental variables conforming to an expected format and updates the corresponding CKAN config settings with its value.

For the extension to correctly identify which env var keys map to the format used for the config object, env var keys should be formatted in the following way:

  All uppercase  
  Replace periods ('.') with two underscores ('__')  
  Keys must begin with 'CKAN' or 'CKANEXT', if they do not you can prepend them with '`CKAN___`' 

For example:

  * `CKAN__PLUGINS="envvars image_view text_view recline_view datastore datapusher"`
  * `CKAN__DATAPUSHER__CALLBACK_URL_BASE=http://ckan:5000`
  * `CKAN___BEAKER__SESSION__SECRET=CHANGE_ME`

These parameters can be added to the `.env` file 

For more information please see [ckanext-envvars](https://github.com/okfn/ckanext-envvars)

## 5. Manage new users

1. Create a new user from the Docker host, for example to create a new user called 'admin'

   `docker exec -it <container-id> ckan -c ckan.ini user add admin email=admin@localhost`

   To delete the 'admin' user

   `docker exec -it <container-id> ckan -c ckan.ini user remove admin`

2. Create a new user from within the ckan container. You will need to get a session on the running container

   `ckan -c ckan.ini user add admin email=admin@localhost`

   To delete the 'admin' user

   `ckan -c ckan.ini user remove admin`
