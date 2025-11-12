"use client"; // Indique que ce composant s'exécute côté client

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface SanitizedHTMLProps {
  html: string | null | undefined;
  className?: string;
}

export default function SanitizedHTML({ html, className }: SanitizedHTMLProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState<string>("");

  useEffect(() => {
    // Initialiser DOMPurify côté client
    const purify = DOMPurify(window);
    const cleanHTML = html ? purify.sanitize(html, {
      ALLOWED_TAGS: [
        'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'a', 'img', 'ul', 'ol', 'li', 'strong', 'em', 'br',
        'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: [
        'class', 'href', 'src', 'alt', 'target', 'rel',
        'aria-*', 'data-*', 'style'
      ],
      ALLOWED_URI_REGEXP: /^(?:http|https|\/)/i,
      FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    }) : "";

    setSanitizedHTML(cleanHTML);
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}