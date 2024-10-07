import { SingInLayout } from "@components/_shared/SignInLayout";
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, signOut, useSession } from "next-auth/react";
import { match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import { ErrorAlert } from "@components/_shared/Alerts";

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
      empty: null,
    },
  };
}

export default function LoginPage({
  csrfToken,
  old_signin,
}: {
  csrfToken?: string;
  old_signin?: boolean;
}) {
  if (old_signin && csrfToken) {
    return <OldLoginPage csrfToken={csrfToken} />;
  }
  return (
    <>
      <NextSeo title="Sign in" />
      <SingInLayout
        paragraphText="Transport Data Commons aims to improve access, sharing, and
            analysing transportation data for a more sustainable future."
        subtitleText="Unlock the Power of Transportation Data"
      >
        <div className="flex h-[100vh] w-full flex-col justify-center bg-white px-28 py-36">
          <h2 className="text-xl font-bold text-[#111928]">Welcome back</h2>
          <div>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <a
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "/dashboard/newsfeed",
                  })
                }
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
                  Sign in with GitHub
                </span>
              </a>
            </div>
          </div>
        </div>
      </SingInLayout>
    </>
  );
}

function OldLoginPage({ csrfToken }: { csrfToken: string }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loggingIn, setLogin] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm<{
    username: string;
    password: string;
  }>();
  return (
    <>
      <NextSeo title="Sign in" />
      <div className="dark:bg-background-dark dark:text-primary-dark flex min-h-full flex-1 items-center justify-center bg-background px-4 py-12 text-primary sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
          <div>
            <a
              aria-label="Home page"
              className="mx-auto flex justify-center text-3xl font-extrabold"
              href="https://portaljs.com"
            >
              <span className="text-primary dark:text-white">🌀 PortalJS</span>
            </a>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary dark:text-white">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              className="space-y-6"
              onSubmit={(event) =>
                void handleSubmit(async (data) => {
                  setLogin(true);
                  const signInStatus = await signIn("credentials", {
                    callbackUrl: "/dashboard/datasets",
                    redirect: false,
                    ...data,
                  });
                  if (signInStatus?.error) {
                    setLogin(false);
                    setErrorMessage(
                      "Could not find user please check your login and password"
                    );
                  } else {
                    void router.push("/dashboard/datasets");
                  }
                })(event)
              }
            >
              <input
                name="csrfToken"
                type="hidden"
                defaultValue={csrfToken ? csrfToken : ""}
              />
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-primary dark:text-white"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    {...register("username")}
                    className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-secondary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-primary dark:text-white"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-secondary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <div className="col-span-full">
                  {match(loggingIn)
                    .with(false, () => (
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold leading-6 text-primary shadow-sm hover:bg-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:text-white"
                      >
                        Sign in
                      </button>
                    ))
                    .otherwise(() => (
                      <button
                        disabled
                        className="flex w-full justify-center rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold leading-6 text-primary shadow-sm hover:bg-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:text-white"
                      >
                        <Spinner />
                      </button>
                    ))}
                </div>
              </div>
            </form>
          </div>
          {errorMessage && <ErrorAlert text={errorMessage} />}
        </div>
      </div>
    </>
  );
}
