import React from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-default">
      <Header />
      <main className="container min-h-[calc(100vh-89px)]">{children}</main>
      <Footer />
    </div>
  );
}
