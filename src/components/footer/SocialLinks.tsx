/**
 * SocialLinks Component
 * Enlaces a redes sociales con iconos
 */

"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { posthogUtils } from "@/lib/posthogClient";
import { socialLinks } from "./footer-config";

const iconMap = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
} as const;

interface SocialLinksProps {
  readonly isVisible: boolean;
}

export function SocialLinks({ isVisible }: SocialLinksProps) {
  const handleSocialClick = (name: string, href: string) => {
    posthogUtils.capture("footer_social_click", {
      platform: name,
      href,
    });
  };

  return (
    <div
      className={`flex items-center gap-4 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
      style={{ transitionDelay: "400ms" }}
    >
      {socialLinks.map((social, index) => {
        const Icon = iconMap[social.icon];
        return (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-110"
            onClick={() => handleSocialClick(social.name, social.href)}
            aria-label={social.name}
            style={{ transitionDelay: `${400 + index * 50}ms` }}
          >
            <Icon className="w-6 h-6" />
          </Link>
        );
      })}
    </div>
  );
}
