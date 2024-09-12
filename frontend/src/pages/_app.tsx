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
import { TooltipProvider } from "@radix-ui/react-tooltip";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
      <Script
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
      />
      <NotificationContainer />
      <SessionProvider session={session}>
        <TooltipProvider>
          <div className={inter.className}>
            <Component {...pageProps} />
          </div>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
