"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"

const testimonials = [
  {
    quote:
      "BlocksNet made it possible for my students to experiment with neural networks without getting lost in complex code. A game-changer for AI education.",
    name: "Sarah L.",
    designation: "Computer Science Professor",
    src: "/placeholder.svg?height=500&width=500",
  },
  {
    quote:
      "I went from knowing nothing about AI to building a working image classifier in just one afternoon. The visual blocks approach makes all the difference.",
    name: "Michael T.",
    designation: "Design Student",
    src: "/placeholder.svg?height=500&width=500",
  },
  {
    quote:
      "As someone who teaches data science, BlocksNet has revolutionized how I introduce neural networks to beginners. The visual feedback is invaluable.",
    name: "David K.",
    designation: "Data Science Instructor",
    src: "/placeholder.svg?height=500&width=500",
  },
  {
    quote:
      "BlocksNet simplified neural networks for our research team. Now we can quickly test ideas without writing extensive code.",
    name: "Jennifer R.",
    designation: "AI Researcher",
    src: "/placeholder.svg?height=500&width=500",
  },
  {
    quote:
      "The visual approach to neural networks helped me understand concepts I struggled with for months. Now I can focus on solving problems, not just writing code.",
    name: "Alex M.",
    designation: "Computer Engineering Student",
    src: "/placeholder.svg?height=500&width=500",
  },
]

const CodeBlock = ({ code, title }: { code: string; title: string }) => (
  <div className="terminal-effect w-full h-full rounded-lg overflow-hidden border border-gray-700 bg-gray-900 shadow-xl">
    <div className="terminal-header bg-gray-800 p-3 flex items-center">
      <div className="flex space-x-2">
        <div className="terminal-dot bg-red-500 h-3 w-3 rounded-full"></div>
        <div className="terminal-dot bg-yellow-500 h-3 w-3 rounded-full"></div>
        <div className="terminal-dot bg-green-500 h-3 w-3 rounded-full"></div>
      </div>
      <span className="text-xs text-gray-400 ml-4">{title}</span>
    </div>
    <div className="terminal-body p-4 text-sm text-gray-300 font-mono overflow-auto max-h-[400px]">
      <pre className="whitespace-pre-wrap">{code}</pre>
    </div>
  </div>
)

const useCases = [
  {
    id: "education",
    title: "Education",
    description: "Teach neural network concepts with visual, interactive tools.",
    content: `Teaching neural network concepts, student projects and experiments, and interactive AI demonstrations.
    
Our educational tools make it easy to visualize complex neural network concepts, allowing students to experiment without getting lost in code.`,
    code: `// Educational example
blocks.create({
  type: "neural-network",
  blocks: [
    { type: "input", params: { shape: [28, 28, 1] } },
    { type: "conv2d", params: { filters: 16 } },
    { type: "output", params: { units: 10 } }
  ]
});`,
    items: ["Teaching neural network concepts", "Student projects and experiments", "Interactive AI demonstrations"],
  },
  {
    id: "prototyping",
    title: "Rapid Prototyping",
    description: "Test architectures and ideas in minutes, not hours.",
    content: `Quick model experimentation, testing different architectures, and proof of concept development.
    
Prototype your neural network ideas in minutes instead of hours, allowing for rapid iteration and experimentation.`,
    code: `// Prototype example
blocks.createModel({
  layers: [
    // Add multiple layers quickly
    "input:image(32,32,3)",
    "conv:32:3x3:relu", 
    "pool:max:2x2",
    "dense:10:softmax"
  ],
  compile: { optimizer: "adam" }
});`,
    items: ["Quick model experimentation", "Testing different architectures", "Proof of concept development"],
  },
  {
    id: "research",
    title: "Learning & Research",
    description: "Visualize and understand AI behavior at a deeper level.",
    content: `Self-paced AI education, exploring model behavior, and accessible research tools.
    
Gain deeper insights into how neural networks function with our visualization tools, making research more intuitive.`,
    code: `// Research example
const model = blocks.load("pretrained");
blocks.visualize({
  model: model,
  layer: "conv_2",
  filter: 5,
  activations: true,
  heatmap: true
});`,
    items: ["Self-paced AI education", "Exploring model behavior", "Accessible research tools"],
  },
]

const UseCasesSection = () => {
  const [activeUseCase, setActiveUseCase] = useState(useCases[0].id)

  return (
    <section id="use" className="section-spacing bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Use Cases & Testimonials
            </span>
          </h2>
          <p className="text-gray-300 text-lg">
            BlocksNet is helping people in education, research, and industry build neural networks without the
            traditional barriers to entry.
          </p>
        </div>

        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Content */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  {useCases.find((uc) => uc.id === activeUseCase)?.title}
                </span>
              </h3>
              <p className="text-xl text-gray-300">{useCases.find((uc) => uc.id === activeUseCase)?.description}</p>
              <div className="text-gray-300 whitespace-pre-line">
                {useCases.find((uc) => uc.id === activeUseCase)?.content}
              </div>

              <div className="pt-4">
                <h4 className="text-lg font-semibold mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {useCases
                    .find((uc) => uc.id === activeUseCase)
                    ?.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex space-x-4 pt-6">
                {useCases.map((useCase) => (
                  <button
                    key={useCase.id}
                    onClick={() => setActiveUseCase(useCase.id)}
                    className={cn(
                      "px-4 py-2 rounded-md transition-all",
                      activeUseCase === useCase.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700",
                    )}
                  >
                    {useCase.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="h-full flex items-center justify-center">
              <CodeBlock
                code={useCases.find((uc) => uc.id === activeUseCase)?.code || ""}
                title={`${useCases.find((uc) => uc.id === activeUseCase)?.title.toLowerCase()}-example.js`}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            What Our Users Say
          </h3>

          <div className="max-w-4xl mx-auto">
            <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default UseCasesSection