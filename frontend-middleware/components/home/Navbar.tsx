"use client";

import { useState, useRef, ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import logo from '@/public/Logo.png'

interface NavbarProps {
  children?: ReactNode;
  className?: string;
}

interface NavBodyProps {
  children?: ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children?: ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children?: ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children?: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const Navbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsScrolled(true);
      setVisible(true);
    } else {
      setIsScrolled(false);
      setVisible(false);
    }
  });

  const [isScrolled, setIsScrolled] = useState(false);
  
  const navItems = [
    { name: "Features", link: "/#features" },
    { name: "How It Works", link: "/#work" },
    { name: "Use Cases", link: "/#use" },
  ];

  return (
    <motion.header
      ref={ref}
      className={cn(
        "fixed w-full z-50 transition-all duration-300", 
        isScrolled ? "py-6" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4">
        <NavBody visible={visible}>
          <NavbarLogo isScrolled={isScrolled} />
          <NavItems items={navItems} className="text-slate-700" />
          <NavbarButton variant="primary" href="/login" className="">
            Login
          </NavbarButton>
        </NavBody>

        <MobileNav visible={visible}>
          <MobileNavHeader>
            <NavbarLogo isScrolled={isScrolled} />
            <MobileNavToggle 
              isOpen={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a 
                key={`mobile-${idx}`}
                href={item.link} 
                className="w-full text-slate-700 hover:text-blue-600 py-2 text-base font-medium border-b border-gray-100 last:border-none transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <NavbarButton 
              variant="primary" 
              href="/login" 
              className="w-full mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </div>
    </motion.header>
  );
};

const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "80%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex",
        visible && "bg-black/100",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-white"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-blue-600"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "92%" : "100%",
        paddingRight: visible ? "16px" : "8px",
        paddingLeft: visible ? "16px" : "8px",
        borderRadius: visible ? "16px" : "2rem",
        y: visible ? 16 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-white/90",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut" 
          }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-[92%] mx-auto flex-col items-start justify-start gap-2 rounded-xl bg-white px-4 py-5 shadow-lg",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={onClick}>
      {isOpen ? (
        <X className="text-slate-700 h-5 w-5" />
      ) : (
        <Menu className="text-slate-700 h-5 w-5" />
      )}
    </div>
  );
};

const NavbarLogo = ({ isScrolled }: { isScrolled?: boolean }) => {
  return (
    <a
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      {isScrolled ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center h-10 rounded-full font-bold text-xl"
        >
          <img src={logo.src} alt="logo" className="w-10 mr-6 transition-transform duration-200 hover:scale-110" />
          <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 inline-block text-transparent bg-clip-text text-2xl hover:scale-110">BN</h3>
        </motion.div>
      ) : (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-transform duration-200 hover:scale-110"
        >
          BlocksNet
        </motion.span>
      )}
    </a>
  );
};

const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
  onClick?: () => void;
} & (
  | ComponentPropsWithoutRef<"a">
  | ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
    secondary: "bg-transparent shadow-none",
    dark: "bg-black text-white shadow-md",
    gradient: "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-md",
  };

  const Comp = Tag as any;

  return (
    <Comp
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Navbar;