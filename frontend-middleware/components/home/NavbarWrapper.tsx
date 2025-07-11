"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // or wherever your main navbar lives

export default function NavbarWrapper() {
  const pathname = usePathname();

  // if the path starts with '/dashboard', render nothing
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/projects") || pathname?.startsWith("/model")) {
    return null;
  }

  // otherwise render your normal Navbar
  return <Navbar />;
}