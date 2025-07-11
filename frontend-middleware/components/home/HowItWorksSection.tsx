"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Layers, SquareCode, Play, Check } from "lucide-react";
import { Spotlight } from '@/components/ui/spotlight'
import { ShineBorder } from "@/components/ui/shiny-border";

const TerminalStepDisplay = ({ step, command, output }: { step: string, command: string, output: React.ReactNode }) => (
  <div className="terminal-effect">
    <div className="terminal-header">
      <div className="terminal-dot bg-red-500"></div>
      <div className="terminal-dot bg-yellow-500"></div>
      <div className="terminal-dot bg-green-500"></div>
      <span className="text-xs text-gray-400 ml-2">step-{step}.blocks</span>
    </div>
    <div className="terminal-body">
      <p className="terminal-prompt text-sm mb-2">{command}</p>
      <div className="mt-3 pl-4 border-l-2 border-muted-foreground/30">
        {output}
      </div>
    </div>
  </div>
);

const steps = [
  {
    number: "01",
    title: "Drag & Drop Blocks",
    description:
      "Start by dragging neural network blocks from the toolbox onto the canvas. Connect layers, activation functions, and more.",
    command: "open BlocksNet.workspace",
    output: (
      <div className="space-y-2">
        <p className="text-sm">
          <span className="block-coding block-trigger">when workspace opens</span>
        </p>
        <p className="text-sm">
          <span className="block-coding block-motion">create empty network</span>
        </p>
        <p className="text-green-400 text-xs mt-2">✓ Workspace loaded successfully</p>
      </div>
    ),
  },
  {
    number: "02",
    title: "Configure Your Network",
    description:
      "Set parameters and configure your neural network architecture with intuitive blocks. No coding required.",
    command: "add-blocks neural-network.components",
    output: (
      <div className="space-y-2">
        <p className="text-sm">
          <span className="block-coding block-motion">add input layer</span>
          <span className="block-coding block-data">type: image, shape: [28, 28, 1]</span>
        </p>
        <p className="text-sm">
          <span className="block-coding block-motion">add convolution layer</span>
          <span className="block-coding block-data">filters: 32, kernel: 3×3</span>
        </p>
        <p className="text-sm">
          <span className="block-coding block-motion">add pooling layer</span>
          <span className="block-coding block-data">type: max, size: 2×2</span>
        </p>
        <p className="text-green-400 text-xs mt-2">✓ Network architecture validated</p>
      </div>
    ),
  },
  {
    number: "03",
    title: "Train With One Click",
    description:
      "Upload your data or use our sample datasets and train your neural network with a single click. Watch the training progress in real-time.",
    command: "train-network mnist.dataset",
    output: (
      <div className="space-y-2">
        <p className="text-sm">
          <span className="block-coding block-looks">train network</span>
          <span className="block-coding block-data">dataset: mnist, epochs: 5</span>
        </p>
        <p className="text-xs text-muted-foreground">Epoch 1/5: loss: 0.241 - accuracy: 0.927</p>
        <p className="text-xs text-muted-foreground">Epoch 2/5: loss: 0.103 - accuracy: 0.969</p>
        <p className="text-xs text-muted-foreground">Epoch 3/5: loss: 0.079 - accuracy: 0.976</p>
        <p className="text-xs text-muted-foreground">Epoch 4/5: loss: 0.064 - accuracy: 0.981</p>
        <p className="text-xs text-muted-foreground">Epoch 5/5: loss: 0.054 - accuracy: 0.984</p>
        <p className="text-green-400 text-xs mt-2">✓ Training complete - Final accuracy: 98.4%</p>
      </div>
    ),
  },
  {
    number: "04",
    title: "Evaluate & Deploy",
    description:
      "Test your model's performance, visualize results, and export your trained model for use in other applications.",
    command: "export-model neural-network.blocks",
    output: (
      <div className="space-y-2">
        <p className="text-sm">
          <span className="block-coding block-looks">evaluate model</span>
          <span className="block-coding block-data">test-set: mnist_test</span>
        </p>
        <p className="text-sm">
          <span className="block-coding block-looks">export model</span>
          <span className="block-coding block-data">format: tensorflow.js</span>
        </p>
        <p className="text-xs text-muted-foreground">Test accuracy: 97.8%</p>
        <p className="text-xs text-muted-foreground">Model size: 4.7 MB</p>
        <p className="text-green-400 text-xs mt-2">✓ Model exported successfully to model.json</p>
      </div>
    ),
  },
];

const HowItWorksSection = () => {
  return (
    <section id="work" className="section-spacing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Building neural networks has never been easier. Follow these simple
            steps to create, train, and deploy your AI models.
          </p>
        </div>

        <div className="space-y-20 md:space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 md:gap-12 items-center`}
            >
              <div className="lg:w-1/2 space-y-6">
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-white mr-4">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  {step.description}
                </p>
                {index === steps.length - 1 && (
                  <div className="pt-4">
                    <Button asChild>
                      <a href="#early-access">Get Started Now</a>
                    </Button>
                  </div>
                )}
              </div>
              <div className="lg:w-1/2 flex justify-center items-center w-full">
                <ShineBorder
                  borderWidth={3}
                  duration={10}
                  color={["#FF007F", "#39FF14", "#00FFFF"]}
                  className="h-full w-auto"
                >
                  <TerminalStepDisplay 
                    step={step.number} 
                    command={step.command}
                    output={step.output}
                  />
                </ShineBorder>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;