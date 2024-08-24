/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserFormType, UserSchema } from "@schema/user.schema";
import type { GetServerSideProps } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { api } from "@utils/api";
import { useState } from "react";
import { ErrorAlert } from "@components/_shared/Alerts";
import { getServerAuthSession } from "@server/auth";
import Spinner from "@components/_shared/Spinner";
import { match } from "ts-pattern";
import Link from "next/link";
import { ErrorMessage } from "@hookform/error-message";
import { NextSeo } from "next-seo";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/datasets",
        permanent: false,
      },
    };
  }
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

  console.log(errors);
  return (
    <>
      <NextSeo title="Register an account" />
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
              Register
            </h2>
          </div>
          <form
            className="space-y-6"
            onSubmit={handleSubmit((data) => {
              setErrorMessage(null);
              createUser.mutate(data);
            })}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-primary dark:text-white"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  {...register("name")}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-secondary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                />
              </div>
              <ErrorMessage errors={errors} name="name" />
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
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-secondary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                />
              </div>
              <ErrorMessage errors={errors} name="password" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-primary dark:text-white"
                >
                  Confirm password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-secondary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                />
              </div>
              <ErrorMessage errors={errors} name="confirm" />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-primary dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-secondary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                />
              </div>
              <ErrorMessage errors={errors} name="email" />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-primary dark:text-white"
              >
                Organization title
              </label>
              <div className="mt-2">
                <input
                  id="organizationTitle"
                  {...register("organizationTitle")}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-secondary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                />
              </div>
              <ErrorMessage errors={errors} name="organizationTitle" />
            </div>
            <div>
              {match(createUser.isLoading)
                .with(false, () => (
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold leading-6 text-primary shadow-sm hover:bg-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:text-white"
                  >
                    Sign up
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
            {errorMessage && (
              <div className="py-4">
                <ErrorAlert text={errorMessage} />
              </div>
            )}
          </form>

          <p className="text-center text-sm leading-6 text-gray-500">
            Already registered?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-secondary hover:text-secondary-hover"
            >
              Go to login page
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
