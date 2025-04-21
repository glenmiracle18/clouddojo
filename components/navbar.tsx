"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs"
import {
  ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/resizable-nav";
 
import React, { useRef, useState } from "react";


export default function Navbar() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const { isSignedIn } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 return (
  <div className="relative w-full">
    <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
              <Link href="/dashboard">
                <NavbarButton variant="primary">Dashboard</NavbarButton>
              </Link>
                <SignOutButton>Sign Out</SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
              Get Started
            </SignInButton>
            )}
          </div>
        </NavBody>
 
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
  </div>
 )
}
