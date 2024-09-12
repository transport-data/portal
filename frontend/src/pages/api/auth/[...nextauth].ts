import { env } from '@env.mjs';
import { CkanResponse } from '@schema/ckan.schema';
import NextAuth, { User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID || "",
      clientSecret: env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  // Optional callbacks for customization
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true; // Allows the sign-in
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; // Redirect to the homepage after sign-in
    },
    async session({ session, token, user }) {
      return session; // Pass session information to the client
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'github' && account.access_token) {

        const access_token = account.access_token;

        if (account && account.access_token) {
          const userRes = await fetch(
            `${env.NEXT_PUBLIC_CKAN_URL}/api/3/action/user_login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from_github: true,
                email: user?.email,
                name: user?.name,
                token: access_token,
                client_secret: env.FRONTEND_AUTH_SECRET,
              }),
            }
          );

          const validUser: CkanResponse<
            User & { frontend_token: string }
          > = await userRes.json();

          const userResult = JSON.parse(validUser.result as any);

          if (userResult.errors) {
            // TODO: error from the response should be sent to the client, but it's not working
            throw new Error(userResult.error_summary.auth);
          }

          user = {
            ...user,
            ...userResult,
            image: user?.image ?? userResult?.image ?? '',
            apikey: userResult.frontend_token,
          };

          return { ...token, ...user, sub: userResult.id };
        }
      }

      return token;
    },
  },
});
