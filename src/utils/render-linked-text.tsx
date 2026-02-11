import React from "react";

/**
 * Parses markdown-style links [text](url) in a string and returns React elements.
 * Plain text without links is returned as-is (backwards compatible).
 */
export function renderLinkedText(text: string): React.ReactNode {
  if (!text) return text;

  // Match [link text](url)
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const linkText = match[1];
    const href = match[2];
    const isExternal = href.startsWith("http");

    parts.push(
      <a
        key={match.index}
        href={href}
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        className="text-blue-600 underline hover:text-blue-800 transition-colors"
      >
        {linkText}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // No links found — return plain string
  if (parts.length === 0) return text;

  return <>{parts}</>;
}
