import Loading from "@components/_shared/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, ComponentType } from "react";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // Do nothing while loading
      if (!session && status === "unauthenticated") {
        router.push(`/auth/signin?callbackUrl=${router.asPath}`);
      }
    }, [session, status, router]);

    if (session) {
      return <WrappedComponent {...props} />;
    }
    return <Loading />;
  };

  return ComponentWithAuth;
};

export default withAuth;
