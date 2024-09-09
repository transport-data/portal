import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useMatomoTracker = () => {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      //@ts-ignore
      if (window._paq) {
        //@ts-ignore
        window._paq.push(['setCustomUrl', window.location.pathname]);
        //@ts-ignore
        window._paq.push(['trackPageView']);
      }
    });
  }, [router.events]);
};

export default useMatomoTracker;
