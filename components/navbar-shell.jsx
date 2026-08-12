"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function NavbarShell({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure the navbar's real rendered height (including its own top/bottom
  // padding) and publish it as --navbar-height so every layout that needs to
  // clear the fixed navbar reads the true value instead of a guessed constant.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const publishHeight = () => {
      document.documentElement.style.setProperty("--navbar-height", `${el.offsetHeight}px`);
    };

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrolled]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out",
        scrolled ? "pt-2 pb-1" : "pt-3 pb-2"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={cn(
            "w-full rounded-full border flex items-center justify-between transition-all duration-300 ease-out px-6 lg:px-8",
            scrolled
              ? "h-[60px] border-white/15 bg-black/75 backdrop-blur-2xl shadow-2xl"
              : "h-[72px] border-white/10 bg-black/55 backdrop-blur-xl shadow-xl"
          )}
        >
          {children}
        </div>
      </div>
    </header>
  );
}
