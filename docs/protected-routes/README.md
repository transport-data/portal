# Protected Routes

In the TDC Portal, the protected pages are:

- /dashboard
- all child pages of /dashboard

This is managed in the `middleware.ts` file, which intercepts the requested URL and checks if it is in the list of protected routes.

- If the route is protected, the user is redirected to the login page.
- After logging in, the user is redirected to the initially requested protected URL.
