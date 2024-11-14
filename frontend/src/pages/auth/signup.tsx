import type { GetServerSideProps } from "next";
import { getCsrfToken } from "next-auth/react";
import LoginPage from "@components/auth/LoginPage";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken: csrfToken ? csrfToken : "",
    },
  };
};

export default function SignUpPage() {
  return <LoginPage isSignUp={true} />;
}
