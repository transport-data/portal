import { ErrorAlert } from "@components/_shared/Alerts";
import { SingInLayout } from "@components/_shared/SignInLayout";
import { clearAllAuxAuthCookies } from "@utils/auth";
import { setCookie } from "cookies-next";
import { signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage({ isSignUp = false }: { isSignUp: boolean }) {
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    clearAllAuxAuthCookies();
  }, []);

  const pageTitle = isSignUp ? "Register an account" : "Sign in";
  const pageHeading = isSignUp
    ? "Contribute to the Transport Data Commons"
    : "Welcome back";
  const action = isSignUp ? "Sign up" : "Sign in";
  const origin = isSignUp ? "signup" : "signin";

  let callbackUrl = (query?.callbackUrl as string) ?? "/dashboard";

  return (
    <>
      <NextSeo title={pageTitle} />
      <SingInLayout
        paragraphText="Transport Data Commons aims to improve access, sharing, and
            analysing transportation data for a more sustainable future."
        subtitleText="Unlock the Power of Transportation Data"
      >
        <div className="flex h-[100vh] w-full flex-col justify-center bg-white px-28 py-36">
          <h2 className="text-xl font-bold text-[#111928]">{pageHeading}</h2>
          <div>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <a
                onClick={() => {
                  if (isSignUp && "invite_id" in query) {
                    setCookie("invite_id", query["invite_id"], {
                      maxAge: 60 * 15,
                    });
                  }

                  setCookie("origin", origin, {
                    maxAge: 60 * 5,
                  });

                  signIn("github", {
                    callbackUrl,
                  });
                }}
                className="col-span-12 flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent md:col-span-6"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-5 w-5 fill-[#24292F]"
                >
                  <path
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">
                  {action} with GitHub
                </span>
              </a>
            </div>
          </div>

          {/*<p className="mt-5 text-sm opacity-50">
            *By {infinitiveAction} with GitHub you are agreeing with our{" "}
            <Link
              href="/terms-and-conditions"
              className="text-accent underline"
            >
              Terms and Conditions
            </Link>.
          </p>*/}
          {query.error && (
            <div className="mt-5">
              <ErrorAlert text={query.error as string} />
            </div>
          )}
        </div>
      </SingInLayout>
    </>
  );
}
