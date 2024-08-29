import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="layout-default relative">
      <Header />
      <main className="min-h-[calc(100vh-89px)]">{children}</main>
      <Toaster />
      <Footer />
    </div>
  );
}
