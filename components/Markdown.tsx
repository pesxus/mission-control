"use client";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className = "" }: MarkdownProps) {
  // Simple markdown parser without external dependencies
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Empty line
      if (!trimmed) {
        elements.push(<div key={index} className="h-2" />);
        return;
      }
      
      // Headers
      if (trimmed.startsWith("### ")) {
        elements.push(
          <h4 key={index} className="text-sm font-semibold text-stone-800 mt-3 mb-1">
            {parseInline(trimmed.slice(4))}
          </h4>
        );
        return;
      }
      if (trimmed.startsWith("## ")) {
        elements.push(
          <h3 key={index} className="text-base font-semibold text-stone-800 mt-4 mb-2">
            {parseInline(trimmed.slice(3))}
          </h3>
        );
        return;
      }
      if (trimmed.startsWith("# ")) {
        elements.push(
          <h2 key={index} className="text-lg font-bold text-stone-900 mt-4 mb-2">
            {parseInline(trimmed.slice(2))}
          </h2>
        );
        return;
      }
      
      // Checkbox unchecked [ ] or checked [x]
      const checkboxMatch = trimmed.match(/^([-*])\s*\[([ xX])\]\s*(.+)$/);
      if (checkboxMatch) {
        const isChecked = checkboxMatch[2].toLowerCase() === "x";
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1">
            <input
              type="checkbox"
              checked={isChecked}
              readOnly
              className="mt-0.5 h-3.5 w-3.5 accent-amber-500"
            />
            <span className={isChecked ? "line-through text-stone-400" : "text-stone-700"}>
              {parseInline(checkboxMatch[3])}
            </span>
          </div>
        );
        return;
      }
      
      // List items (- or *)
      const listMatch = trimmed.match(/^([-*])\s+(.+)$/);
      if (listMatch) {
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1 ml-2">
            <span className="text-stone-400">•</span>
            <span className="text-stone-700">{parseInline(listMatch[2])}</span>
          </div>
        );
        return;
      }
      
      // Numbered list (1. 2. etc)
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (numberedMatch) {
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1 ml-2">
            <span className="text-stone-400 min-w-[1rem]">{numberedMatch[1]}.</span>
            <span className="text-stone-700">{parseInline(numberedMatch[2])}</span>
          </div>
        );
        return;
      }
      
      // Regular paragraph
      elements.push(
        <p key={index} className="text-sm text-stone-700 my-1">
          {parseInline(trimmed)}
        </p>
      );
    });
    
    return elements;
  };
  
  // Parse inline formatting (bold, italic, code)
  const parseInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    
    while (remaining) {
      // Bold **text**
      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        parts.push(<strong key={key++} className="font-semibold">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }
      
      // Italic *text* or _text_
      const italicMatch = remaining.match(/^([*_])(.+?)\1/);
      if (italicMatch) {
        parts.push(<em key={key++} className="italic">{italicMatch[2]}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }
      
      // Inline code `code`
      const codeMatch = remaining.match(/^`(.+?)`/);
      if (codeMatch) {
        parts.push(<code key={key++} className="bg-stone-100 px-1 py-0.5 rounded text-xs font-mono">{codeMatch[1]}</code>);
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }
      
      // Link [text](url)
      const linkMatch = remaining.match(/^\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        parts.push(
          <a key={key++} href={linkMatch[2]} className="text-amber-600 hover:underline">
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }
      
      // Plain text - take one character at a time to preserve spaces
      const char = remaining[0];
      parts.push(char);
      remaining = remaining.slice(1);
      key++;
    }
    
    return <>{parts}</>;
  };
  
  return (
    <div className={className}>
      {parseMarkdown(content)}
    </div>
  );
}

// Compact version for card previews
export function MarkdownPreview({ content, lines = 2 }: { content: string; lines?: number }) {
  const truncate = (text: string, maxLines: number): string => {
    const textLines = text.split("\n");
    const truncated = textLines.slice(0, maxLines);
    return truncated.join("\n");
  };
  
  return (
    <div className={`line-clamp-${lines} text-xs text-stone-500`}>
      <Markdown content={truncate(content, lines)} />
    </div>
  );
}