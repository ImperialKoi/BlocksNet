"use client"

import React, { useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components//home/HowItWorksSection";
import UseCasesSection from "@/components//home/UseCasesSection";
import CTASection from "@/components/home/cta-section";
import Footer from "@/components/home/footer";

const Index = () => {
  useEffect(() => {
    // Update the document title
    document.title = "BlocksNet | Build Neural Networks Visually";
    
    // Add a class to the body to help with animations
    document.body.classList.add("blocks-net");
    
    // Apply dark theme to body and set custom styles
    document.documentElement.classList.add("dark");
    document.body.style.backgroundColor = "#000";
    
    // Scroll to top on load
    window.scrollTo(0, 0);
    
    return () => {
      document.body.classList.remove("blocks-net");
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;