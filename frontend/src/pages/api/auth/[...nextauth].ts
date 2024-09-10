import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
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
    async jwt({ token, user, account, profile, isNewUser }) {
      return token; // Customize JWT token if needed
    },
  },
});