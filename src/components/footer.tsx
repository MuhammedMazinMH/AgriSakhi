"use client";
import React from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Leaf,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

export function Footer() {
  // Footer link data
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Disease Detection", href: "/detect" },
        { label: "Detection History", href: "/history" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Knowledge Base", href: "/knowledge" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Sign In", href: "/auth/signin" },
        { label: "Sign Up", href: "/auth/signup" },
        { label: "Profile", href: "/dashboard" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Contact Us", href: "mailto:support@agrisakhi.com", pulse: true },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-green-600" />,
      text: "support@agrisakhi.com",
      href: "mailto:support@agrisakhi.com",
    },
    {
      icon: <MapPin size={18} className="text-green-600" />,
      text: "Global",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Youtube size={20} />, label: "YouTube", href: "#" },
  ];

  return (
    <footer className="relative h-fit overflow-hidden m-4 md:m-8 rounded-3xl border border-green-100 dark:border-green-900 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-950 shadow-lg">
      <div className="max-w-7xl mx-auto p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="text-green-600 h-8 w-8" />
              <span className="text-gray-900 dark:text-white text-2xl font-bold">AgriSakhi</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Free AI-powered plant disease detection and agricultural assistance for farmers worldwide.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-gray-900 dark:text-white text-lg font-semibold mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.pulse && (
                      <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-gray-900 dark:text-white text-lg font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-green-200 dark:border-green-800 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6 text-gray-500 dark:text-gray-400">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AgriSakhi. All rights reserved.
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="flex h-[12rem] md:h-[30rem] -mt-20 md:-mt-52 -mb-10 md:-mb-36 pointer-events-none opacity-40 mix-blend-multiply dark:mix-blend-overlay w-full justify-center">
        <TextHoverEffect text="AGRISAKHI" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
