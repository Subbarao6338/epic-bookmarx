import React from 'react';

/**
 * SafeHighlight Component
 * Renders text with search query highlighted using native React elements.
 * Prevents XSS by avoiding dangerouslySetInnerHTML.
 */
const SafeHighlight = ({ text, query }) => {
  if (!text) return null;
  if (!query || !query.trim()) return <>{text}</>;

  try {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i}>{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch (e) {
    return <>{text}</>;
  }
};

export default SafeHighlight;
