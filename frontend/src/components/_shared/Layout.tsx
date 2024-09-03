import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
export default function Layout({
  backgroundEffect,
  children,
  effectSize = '61.27%',
}: {
  backgroundEffect?: boolean;
  effectSize?: string;
  children?: React.ReactNode;
}) {
  const backgroundGradient = `linear-gradient(180deg, #E3F9ED 0%, rgba(255, 255, 255, 0) ${effectSize})`
  console.log('backgroundEffect', backgroundGradient)
  return (
    <div className="layout-default relative">
      <Header backgroundColor={backgroundEffect ? "#E3F9ED" : "white"} />
      <main
        className="min-h-[calc(100vh-89px)]"
        style={{
          background: backgroundEffect
            ? backgroundGradient 
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
