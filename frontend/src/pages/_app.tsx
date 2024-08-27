import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pageview } from "@portaljs/core";
import NotificationContainer from "@components/_shared/NotificationContainer";
import { DefaultSeo } from "next-seo";

import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: { url: string; analyticsID: string }) => {
      pageview(url);
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
        defaultTitle="PortalJS Cloud"
        titleTemplate="%s - PortalJS Cloud"
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-2B46LMHQT4`}
      />
      <Script
        id="gtag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2B46LMHQT4', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
      <NotificationContainer />
      <SessionProvider session={session}>
        <div className={inter.className}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
