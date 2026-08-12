import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import NavbarShell from "@/components/navbar-shell";

export default async function Header() {
  await checkUser();

  return (
    <NavbarShell>
      {/* Brand Logo & Title */}
      <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 rounded-full overflow-hidden border border-white/20 p-0.5 bg-white/10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={"/logo.png"}
                alt="SenseAI Logo"
                width={36}
                height={36}
                className="rounded-full object-cover h-full w-full"
              />
            </div>
            <span className="font-bold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              SenseAI
            </span>
          </Link>

          {/* Navigation Action Buttons */}
          <div className="flex items-center space-x-3">
            <SignedIn>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-xs font-medium hover:bg-white/10 hover:text-white transition-all duration-200 h-9 px-4"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" />
                  Command Center
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="md:hidden h-9 w-9 rounded-full">
                <Link href="/dashboard" aria-label="Command Center">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              </Button>

              {/* Growth Tools Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 h-9 transition-all duration-200 shadow-md shadow-indigo-600/20"
                  >
                    <StarsIcon className="h-3.5 w-3.5 mr-1.5" />
                    <span className="hidden md:inline">Workspaces</span>
                    <ChevronDown className="h-3 w-3 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5">
                  <DropdownMenuItem asChild>
                    <Link href="/resume" className="flex items-center gap-2 text-xs py-2 rounded-lg cursor-pointer">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      Resume Intelligence Engine
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/ai-cover-letter"
                      className="flex items-center gap-2 text-xs py-2 rounded-lg cursor-pointer"
                    >
                      <PenBox className="h-4 w-4 text-purple-400" />
                      Cover Letter Generator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/interview" className="flex items-center gap-2 text-xs py-2 rounded-lg cursor-pointer">
                      <GraduationCap className="h-4 w-4 text-cyan-400" />
                      Mock Interview Workspace
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button
                  size="sm"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 h-9 transition-all duration-200 shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 rounded-full border border-white/20",
                    userButtonPopoverCard: "shadow-2xl rounded-xl border border-white/10 bg-card",
                    userPreviewMainIdentifier: "font-semibold text-xs",
                  },
                }}
                fallbackRedirectUrl="/"
              />
            </SignedIn>
          </div>
    </NavbarShell>
  );
}
