/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { UserResetSchema, type UserResetFormType } from "@schema/user.schema";
import type { GetServerSideProps } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { api } from "@utils/api";
import { useState } from "react";
import { ErrorAlert } from "@components/_shared/Alerts";
import { getServerAuthSession } from "@server/auth";
import Spinner from "@components/_shared/Spinner";
import { match } from "ts-pattern";
import { ErrorMessage } from "@hookform/error-message";
import { env } from "@env.mjs";
import { NextSeo } from "next-seo";
import { getUser } from "@utils/user";

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
  if (!context.query.userId || !context.query.reset_key) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const user = await getUser({
    apiKey: env.SYS_ADMIN_API_KEY,
    id: context.query.userId as string,
  });
  return {
    props: {
      csrfToken: csrfToken ? csrfToken : "",
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
        reset_key: context.query.reset_key,
      },
    },
  };
};

export default function ResetUserPage({
  csrfToken,
  user,
}: {
  csrfToken: string;
  user: { name: string; email: string; id: string; reset_key: string };
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserResetFormType & { confirm: string }>({
    resolver: zodResolver(UserResetSchema),
    defaultValues: {
      ...user,
    },
  });

  const resetUser = api.user.resetUser.useMutation({
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
      <NextSeo title="Reset your password" />
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
              Reset Your Password
            </h2>
            <p>You can also change username. It can not be modified later.</p>
          </div>
          <form
            className="space-y-6"
            onSubmit={handleSubmit((data) => {
              setErrorMessage(null);
              resetUser.mutate({
                ...user,
                reset_key: data.reset_key,
                name: data.name,
                password: data.password,
              });
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
                  className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                />
              </div>
              <ErrorMessage errors={errors} name="confirm" />
            </div>

            <div>
              {match(resetUser.isLoading)
                .with(false, () => (
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-primary shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:text-white"
                  >
                    Update password
                  </button>
                ))
                .otherwise(() => (
                  <button
                    disabled
                    className="flex w-full justify-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-primary shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:text-white"
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
        </div>
      </div>
    </>
  );
}
