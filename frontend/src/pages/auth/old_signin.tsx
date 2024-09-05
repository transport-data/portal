import { ErrorAlert } from "@components/_shared/Alerts";
import Spinner from "@components/_shared/Spinner";
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function LoginPage({ csrfToken }: { csrfToken: string }) {
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
      <div className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-12 text-primary dark:bg-background-dark dark:text-primary-dark sm:px-6 lg:px-8">
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
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-secondary-foreground hover:text-secondary-hover"
                    >
                      Forgot password?
                    </a>
                  </div>
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

          <p className="text-center text-sm leading-6 text-gray-500">
            Not a member?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-secondary-foreground hover:text-secondary-hover"
            >
              sign up here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
