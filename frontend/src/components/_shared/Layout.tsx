import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
export default function Layout({
  children,
  greenGradiendBackground,
}: {
  children?: React.ReactNode;
  greenGradiendBackground?: boolean;
}) {
  return (
    <div className="layout-default relative">
      <Header greenGradiendBackground={greenGradiendBackground} />
      <main className="min-h-[calc(100vh-89px)]">{children}</main>
      <Toaster />
      <Footer />
    </div>
  );
}
