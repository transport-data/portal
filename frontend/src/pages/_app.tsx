import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import NotificationContainer from "@components/_shared/NotificationContainer";
import { DefaultSeo } from "next-seo";

import { Inter } from "next/font/google";
import { env } from "@env.mjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pageview } from "@utils/ga";
import PageLoading from "@components/_shared/PageLoading";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview({ url, analyticsID: env.NEXT_PUBLIC_GA_MEASUREMENT_ID });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      defaultTheme={"light"}
    >
      <DefaultSeo
        defaultTitle="Transport Data Commons"
        titleTemplate="%s - Transport Data Commons"
      />
      {/*<Script
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://tdcdataportalvercelapp.matomo.cloud/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='https://cdn.matomo.cloud/tdcdataportalvercelapp.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
  })();`,
        }}
      />*/}

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `,
        }}
      />

      <NotificationContainer />
      <SessionProvider session={session}>
        <div className={inter.className}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
      <PageLoading />
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
