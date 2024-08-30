import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
export default function Layout({
  backgroundEffect,
  children,
}: {
  backgroundEffect?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="layout-default relative">
      <Header backgroundColor={backgroundEffect ? "#E3F9ED" : "white"} />
      <main
        className="min-h-[calc(100vh-89px)]"
        style={{
          background: backgroundEffect
            ? "linear-gradient(180deg, #E3F9ED 0%, rgba(255, 255, 255, 0) 61.27%)"
            : "",
        }}
      >
        {children}
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}
