<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Protected Routes](#protected-routes)
      - [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Protected Routes

In the TDC Portal, the protected pages are:

- /dashboard
- all child pages of /dashboard

This is managed in the `middleware.ts` file, which intercepts the requested URL and checks if it is in the list of protected routes.

- If the route is protected, the user is redirected to the login page.
- After logging in, the user is redirected to the initially requested protected URL.

#### Example

if a user clicks on a button that directs to `/dashboard/dataset/create`, authentication is required to view the page. If the user is not authenticated, the system will redirect to the sign-in page. After logging in, the user will be automatically taken back to the page initially requested.
