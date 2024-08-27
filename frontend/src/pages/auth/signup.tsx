/* eslint-disable @typescript-eslint/no-misused-promises */
import { ErrorAlert } from "@components/_shared/Alerts";
import Spinner from "@components/_shared/Spinner";
import { Button } from "@components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserFormType, UserSchema } from "@schema/user.schema";
import { getServerAuthSession } from "@server/auth";
import { api } from "@utils/api";
import type { GetServerSideProps } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken: csrfToken ? csrfToken : "",
    },
  };
};

export default function SignUpPage({ csrfToken }: { csrfToken: string }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormType & { confirm: string }>({
    resolver: zodResolver(UserSchema),
  });

  const createUser = api.user.createUser.useMutation({
    onSuccess: async () => {
      await signIn("credentials", {
        callbackUrl: "/dashboard",
        username: watch("name"),
        password: watch("password"),
      });
    },
    onError: (error) => setErrorMessage(error.message),
  });

  return (
    <>
      <NextSeo title="Register an account" />
      <div className="dark:bg-background-dark dark:text-primary-dark flex h-full flex-1 items-center justify-center bg-white text-primary">
        <div className="w-[50%] px-28">
          <h2 className="text-xl font-bold text-[#111928]">
            Contribute to the Transport Data Commons
          </h2>
          <div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <a
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">
                  Sign up with Google
                </span>
              </a>

              <a
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
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
                  Sign up with GitHub
                </span>
              </a>
            </div>
          </div>
          <div className="relative my-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-[#6B7280]">or</span>
            </div>
          </div>
          <div>
            <form
              className="space-y-5"
              onSubmit={handleSubmit((data) => {
                setErrorMessage(null);
                createUser.mutate(data);
              })}
            >
              <input
                name="csrfToken"
                type="hidden"
                defaultValue={csrfToken ? csrfToken : ""}
              />
              <div className="flex justify-between gap-5">
                <div className="w-full">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-[#111928]"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      placeholder="e.g. Bonnie"
                      {...register("name")}
                      className="block w-full rounded-md border-0 py-3.5 text-[#111928] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors && errors.name && (
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errors.name.message}</p>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-[#111928]"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      id="lastName"
                      placeholder="e.g. Green"
                      {...register("lastName")}
                      className="block w-full rounded-md border-0 py-3.5 text-[#111928] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors && errors.lastName && (
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errors.lastName.message}</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-[#111928]"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    placeholder="name@email.com"
                    {...register("email")}
                    className="block w-full rounded-md border-0 py-3.5 text-[#111928] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
                  />
                </div>
                {errors && errors.email && (
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errors.email.message}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-[#111928]"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    placeholder="••••••••••"
                    type="password"
                    {...register("password")}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-3.5 text-[#111928] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
                  />
                </div>
                {errors && errors.password && (
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errors.password.message}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#006064] focus:ring-[#006064]"
                    id="hasAcceptedTerms"
                    {...register("hasAcceptedTerms")}
                  />
                  <div className="text-xs text-[#6B7280]">
                    <label htmlFor="hasAcceptedTerms">
                      By signing up, you are creating a Transport Data Commons
                      account, and you agree to our{" "}
                      {
                        // TODO change these links to the correct one when it's available
                      }
                      <Link
                        className="font-semibold text-[#00ACC1] hover:text-[#008E9D]"
                        href={"https://google.com"}
                        target="_blank"
                      >
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link
                        className="font-semibold text-[#00ACC1] hover:text-[#008E9D]"
                        href={"https://google.com"}
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </label>
                    {errors && errors.hasAcceptedTerms && (
                      <div className="mt-2 text-xs text-red-700">
                        <p>{errors.hasAcceptedTerms.message}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#006064] focus:ring-[#006064]"
                    id="hasConsentedToReceiveEmails"
                    {...register("hasConsentedToReceiveEmails")}
                  />
                  <div className="pb-0.5 text-xs text-[#6B7280]">
                    <label htmlFor="hasConsentedToReceiveEmails">
                      Email me about product updates and resources.
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div className="col-span-full">
                  {match(createUser.isLoading)
                    .with(false, () => (
                      <Button
                        disabled={
                          !!errors.password ||
                          !!errors.email ||
                          !!errors.name ||
                          !!errors.lastName
                        }
                        type="submit"
                        className={
                          "flex w-full justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" +
                          (!!errors.password ||
                          !!errors.email ||
                          !!errors.name ||
                          !!errors.lastName
                            ? " cursor-not-allowed"
                            : "")
                        }
                      >
                        Sign up
                      </Button>
                    ))
                    .otherwise(() => (
                      <Button
                        disabled
                        className="flex w-full justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                      >
                        <Spinner />
                      </Button>
                    ))}
                </div>
              </div>
              <p className="text-sm leading-6 text-[#6B7280]">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-semibold text-[#00ACC1] hover:text-[#008E9D]"
                >
                  Login here
                </Link>
              </p>
              {errorMessage && <ErrorAlert text={errorMessage} />}
            </form>
          </div>
        </div>
        <div className="flex h-[100vh] w-[50%] flex-col justify-center bg-[#DFF64D] px-20">
          <h2 className="pb-7 text-2xl font-semibold text-[#006064]">
            Transport Data Commons
          </h2>
          <h1 className="inline-size-88 pb-3 text-4xl font-extrabold text-[#006064]">
            Unlock the Power of Transportation Data
          </h1>
          <p className="text-[#006064]">
            Transport Data Commons aims to improve access, sharing, and
            analysing transportation data for a more sustainable future.
          </p>
        </div>
      </div>
    </>
  );
}
