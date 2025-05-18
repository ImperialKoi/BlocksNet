"use client"

import React from "react";
import { Code, Rocket, Book, Users, Layers, Search } from "lucide-react";
import Blue from './BlueCard'

const features = [
  {
    icon: <Code className="h-8 w-8" />,
    title: "Visual Block-Based Coding",
    description:
      "Drag and drop neural network layers and components like you would in Scratch, making AI accessible to everyone.",
  },
  {
    icon: <Rocket className="h-8 w-8" />,
    title: "One-Click Training",
    description:
      "Train your neural network with a single click. BlocksNet handles all the complex configuration and optimization behind the scenes.",
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: "Pre-built Components",
    description:
      "Access a library of pre-built neural network components and architectures for common AI tasks.",
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Real-time Visualization",
    description:
      "Visualize your network architecture and training progress in real-time to better understand how your AI is learning.",
  },
  {
    icon: <Book className="h-8 w-8" />,
    title: "Educational Resources",
    description:
      "Built-in tutorials and explanations help you learn AI concepts while you build, making it perfect for students and beginners.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaboration Tools",
    description:
      "Share your neural network designs with others and collaborate on projects in real-time.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-spacing bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Powerful AI, <span className="gradient-text">Simple Interface</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            BlocksNet combines the power of deep learning with the simplicity of
            visual programming, making neural networks accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Blue
              key={index}
              className="bg-background rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300"
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;