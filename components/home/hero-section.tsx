"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Code } from "lucide-react";
import { Spotlight } from '@/components/ui/spotlight'

const TerminalBlock = ({ className }: { className?: string }) => (
  <div className={`terminal-effect ${className}`}>
    <div className="terminal-header">
      <div className="terminal-dot bg-red-500"></div>
      <div className="terminal-dot bg-yellow-500"></div>
      <div className="terminal-dot bg-green-500"></div>
      <span className="text-xs text-gray-400 ml-2">blocks-net-terminal</span>
    </div>
    <div className="terminal-body">
      <p className="terminal-prompt text-sm mb-2">
        import <span className="text-green-400">BlocksNet</span> from 
        <span className="text-yellow-400">'blocks-net'</span>
      </p>
      
      <p className="terminal-prompt text-sm mb-2">
        <span className="block-coding block-trigger">when start</span> 
        <span className="block-coding block-control">create neural network</span>
      </p>
      
      <p className="terminal-prompt text-sm mb-2">
        <span className="block-coding block-motion">add input layer</span> 
        <span className="block-coding block-data">image, 28×28</span>
      </p>
      
      <p className="terminal-prompt text-sm mb-2">
        <span className="block-coding block-motion">add convolution</span> 
        <span className="block-coding block-data">filters: 32</span>
      </p>
      
      <p className="terminal-prompt text-sm mb-2">
        <span className="block-coding block-motion">add pooling</span> 
        <span className="block-coding block-data">max, 2×2</span>
      </p>
      
      <p className="terminal-prompt text-sm mb-2">
        <span className="block-coding block-looks">train network</span> 
        <span className="block-coding block-data">mnist, epochs: 5</span>
      </p>
      
      <p className="terminal-prompt text-sm">
        <span className="text-green-400">Accuracy:</span> <span className="text-yellow-400">97.8%</span> <span className="cursor-blink"></span>
      </p>
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <section id="hero" className="pt-20 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <Spotlight />
            <Spotlight />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              The intelligent <span className="gradient-text">block coding</span> for AI.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              BlocksNet makes AI accessible with a visual, drag-and-drop interface.
              Build and train neural networks without writing a single line of code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <a href="#early-access">
                  Get Started <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <a href="#how-it-works">
                  See How It Works <Layers className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative animate-float">
            <TerminalBlock className="lg:ml-auto" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-secondary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection