import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
export default function Layout({
  className = "",
  backgroundEffect,
  children,
  effectSize = "61.27%",
  fullScreen = true,
}: {
  className?: string;
  backgroundEffect?: boolean;
  effectSize?: string;
  fullScreen?: boolean;
  children?: React.ReactNode;
}) {
  const backgroundGradient = `linear-gradient(180deg, #E3F9ED 0%, rgba(255, 255, 255, 0) ${effectSize})`;

  return (
    <div className={`layout-default relative ${className}`}>
      <Header backgroundColor={backgroundEffect ? "#E3F9ED" : "white"} />
      <main
        className={`${fullScreen ? "lg:min-h-[calc(100vh-89px)]" : ""}`}
        style={{
          background: backgroundEffect ? backgroundGradient : "",
        }}
      >
        {children}
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}
