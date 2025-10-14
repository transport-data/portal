import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TDCIcon } from "@lib/icons";

const LOADER_THRESHOLD = 250;

export default function PageLoading() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let forceEndTimer: NodeJS.Timeout;

    const start = () => {
      timer = setTimeout(() => setLoading(true), LOADER_THRESHOLD);

      // Force end loading after 15 seconds as a safety mechanism
      forceEndTimer = setTimeout(() => {
        setLoading(false);
      }, 10000);
    };

    const end = () => {
      if (timer) clearTimeout(timer);
      if (forceEndTimer) clearTimeout(forceEndTimer);
      setLoading(false);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);

      if (timer) clearTimeout(timer);
      if (forceEndTimer) clearTimeout(forceEndTimer);
    };
  }, [router.events]);

  if (!isLoading) return <div></div>;

  return (
    isLoading && (
      <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-start bg-[rgba(255,255,255,.4)] duration-500 animate-in fade-in">
        <div className="w-full">
          <div className="bg-accent-100 h-1 w-full overflow-hidden">
            <div className="progress left-right h-full w-full bg-accent"></div>
          </div>
        </div>
        <div className="mt-auto flex h-full w-full flex-col px-[32px] ">
          <div className="ml-auto mt-auto py-6">
            <div
              className="block h-8 w-8 rounded-full  border-t-transparent  bg-white text-[#00BBC2]"
              role="status"
              aria-label="loading"
            >
              <TDCIcon />
            </div>
            <div className="mb-auto mt-3 flex items-center justify-center space-x-2">
              <div className="h-1 w-1 animate-ping rounded-full bg-accent [animation-delay:-0.4s]"></div>
              <div className="h-1 w-1 animate-ping rounded-full bg-accent [animation-delay:-0.2s]"></div>
              <div className="h-1 w-1 animate-ping rounded-full bg-accent"></div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
