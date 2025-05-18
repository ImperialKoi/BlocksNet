"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Code } from "lucide-react";

const TerminalAnimation = () => (
  <div className="terminal-effect w-full max-w-lg mx-auto mb-8">
    <div className="terminal-header">
      <div className="terminal-dot bg-red-500"></div>
      <div className="terminal-dot bg-yellow-500"></div>
      <div className="terminal-dot bg-green-500"></div>
      <span className="text-xs text-gray-400 ml-2">join-blocksnet.sh</span>
    </div>
    <div className="terminal-body">
      <p className="terminal-prompt text-sm mb-2">
        <span className="block-coding block-trigger">when email submitted</span>
      </p>
      <p className="terminal-prompt text-sm mb-2">
        <span className="block-coding block-motion">add to waitlist</span>
        <span className="block-coding block-data">email</span>
      </p>
      <p className="terminal-prompt text-sm mb-2">
        <span className="block-coding block-looks">send confirmation</span>
      </p>
      <p className="text-sm text-green-400">✓ Access granted to early preview <span className="cursor-blink"></span></p>
    </div>
  </div>
);

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been added to our early access list!",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="early-access" className="section-spacing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Get Early Access to <span className="gradient-text">BlocksNet</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our early access program and be among the first to experience
              the future of neural network building. Limited spots available.
            </p>
          </div>

          <TerminalAnimation />

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-grow bg-background border-border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? "Submitting..." : "Join Waitlist"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3 text-center">
              We'll never share your email with anyone else.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CTASection;