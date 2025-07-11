"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CodeBlock = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-xl opacity-50"></div>
    <div className="relative bg-black/80 text-white p-4 rounded-lg font-mono text-sm overflow-hidden">
      <div className="flex items-center mb-2 text-xs">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        <span className="ml-2 text-gray-400">blocks-net.js</span>
      </div>
      <pre className="text-xs sm:text-sm">
        <code className="text-blue-400">import</code>{" "}
        <code className="text-green-400">BlocksNet</code>{" "}
        <code className="text-blue-400">from</code>{" "}
        <code className="text-orange-400">'blocks-net'</code>
        <br />
        <br />
        <code className="text-gray-400">// Create a neural network</code>
        <br />
        <code className="text-purple-400">const</code>{" "}
        <code className="text-yellow-400">network</code> ={" "}
        <code className="text-blue-400">new</code>{" "}
        <code className="text-green-400">BlocksNet</code>()
        <br />
        <br />
        <code className="text-gray-400">// Add input layer with drag & drop</code>
        <br />
        <code className="text-yellow-400">network</code>.
        <code className="text-teal-400">addInputLayer</code>(
        <code className="text-orange-400">'image'</code>, 28, 28, 1)
        <br />
        <br />
        <code className="text-gray-400">// Add hidden layers</code>
        <br />
        <code className="text-yellow-400">network</code>.
        <code className="text-teal-400">addHiddenLayer</code>(
        <code className="text-orange-400">'conv2d'</code>, {"{"}
        <code className="text-blue-400">filters:</code> 32
        {"}"})
        <br />
        <code className="text-yellow-400">network</code>.
        <code className="text-teal-400">addHiddenLayer</code>(
        <code className="text-orange-400">'maxPooling'</code>)
        <br />
        <br />
        <code className="text-gray-400">// Train with one click</code>
        <br />
        <code className="text-blue-400">await</code>{" "}
        <code className="text-yellow-400">network</code>.
        <code className="text-teal-400">train</code>(mnist, {"{"}
        <code className="text-blue-400">epochs:</code> 5
        {"}"})
      </pre>
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <section id="hero" className="pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Build Neural Networks with{" "}
              <span className="gradient-text">Blocks</span>
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
              <Button asChild variant="outline" size="lg">
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>
          </div>
          <div className="relative animate-float">
            <CodeBlock className="lg:ml-auto" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-secondary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;