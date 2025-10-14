import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const LOADER_THRESHOLD = 300; // milliseconds before showing loader
const FORCE_END_TIMEOUT = 10000; // fallback timeout in ms

export default function PageLoading() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const forceEndRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const start = () => {
      // Clear any existing timers before setting new ones
      if (timerRef.current) clearTimeout(timerRef.current);
      if (forceEndRef.current) clearTimeout(forceEndRef.current);

      // Delay showing loader to avoid flashing on quick transitions
      timerRef.current = setTimeout(() => {
        requestAnimationFrame(() => setLoading(true));
      }, LOADER_THRESHOLD);

      // Safety: force stop loading after 10s no matter what
      forceEndRef.current = setTimeout(() => {
        requestAnimationFrame(() => setLoading(false));
      }, FORCE_END_TIMEOUT);
    };

    const end = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (forceEndRef.current) clearTimeout(forceEndRef.current);
      timerRef.current = null;
      forceEndRef.current = null;

      // Smooth out flicker
      requestAnimationFrame(() => setLoading(false));
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);

      if (timerRef.current) clearTimeout(timerRef.current);
      if (forceEndRef.current) clearTimeout(forceEndRef.current);
    };
  }, [router.events]);

  // Render overlay only when loading
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