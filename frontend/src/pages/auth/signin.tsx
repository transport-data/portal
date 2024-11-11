import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import LoginPage from "@components/auth/LoginPage";
import OldLoginPage from "@components/auth/OldLoginPage";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { old_signin } = context.query;
  if (old_signin && (old_signin as string).toLowerCase() === "true") {
    return {
      props: {
        csrfToken: await getCsrfToken(context),
        old_signin: true,
      },
    };
  }
  return {
    props: {
    },
  };
}

export default function SignInPage({
  csrfToken,
  old_signin,
}: {
  csrfToken?: string;
  old_signin?: boolean;
}) {
  if (old_signin && csrfToken) {
    return <OldLoginPage csrfToken={csrfToken} />;
  }
  return <LoginPage isSignUp={false} />;
}
