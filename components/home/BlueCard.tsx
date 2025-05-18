import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "group relative p-6 rounded-xl border border-blue-800 hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-[22rem] md:h-[17rem] overflow-hidden",
        className
      )}
    >
      <div className="bg-blue-200 p-3 text-black rounded-full inline-flex mb-5 group-hover:bg-blue-400 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-white">{description}</p>
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 w-0 group-hover:w-full transition-all duration-300"></div>
    </div>
  );
};

export default FeatureCard;