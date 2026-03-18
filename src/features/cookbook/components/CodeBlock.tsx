"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface CodeBlockProps {
  filename?: string;
  copyText: string;
  children: ReactNode;
  className?: string;
}

type TokenKind =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "literal"
  | "number"
  | "tag"
  | "property"
  | "function"
  | "operator"
  | "punctuation";

interface Token {
  kind: TokenKind;
  value: string;
}

const TOKEN_COLORS: Record<TokenKind, string> = {
  plain: "text-slate-100",
  comment: "text-slate-500 italic",
  string: "text-emerald-300",
  keyword: "text-sky-300",
  literal: "text-rose-300",
  number: "text-orange-300",
  tag: "text-cyan-300",
  property: "text-blue-200",
  function: "text-amber-300",
  operator: "text-slate-200",
  punctuation: "text-slate-300",
};

const TOKEN_RULES: Array<{ kind: TokenKind; regex: RegExp }> = [
  { kind: "comment", regex: /\/\*[\s\S]*?\*\/|\/\/[^\n]*/y },
  { kind: "string", regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/y },
  {
    kind: "keyword",
    regex:
      /\b(?:import|from|export|default|function|return|const|let|var|if|else|for|while|switch|case|break|continue|new|class|extends|interface|type|enum|as|async|await|try|catch|finally|throw|in|of|typeof|instanceof)\b/y,
  },
  { kind: "literal", regex: /\b(?:true|false|null|undefined)\b/y },
  { kind: "number", regex: /\b\d+(?:\.\d+)?\b/y },
  { kind: "tag", regex: /<\/?[A-Za-z][\w.-]*/y },
  { kind: "function", regex: /\b[A-Za-z_$][\w$]*(?=\()/y },
  { kind: "property", regex: /\b[A-Za-z_$][\w$-]*(?==)/y },
  { kind: "operator", regex: /=>|===|!==|==|!=|<=|>=|\+\+|--|&&|\|\||[=+\-*/%<>!&|^~?:]/y },
  { kind: "punctuation", regex: /[{}[\]().,;]/y },
];

function tokenizeCode(code: string): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < code.length) {
    let matched = false;

    for (const rule of TOKEN_RULES) {
      rule.regex.lastIndex = cursor;
      const match = rule.regex.exec(code);
      if (match?.index === cursor) {
        tokens.push({ kind: rule.kind, value: match[0] });
        cursor += match[0].length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ kind: "plain", value: code[cursor] ?? "" });
      cursor += 1;
    }
  }

  return tokens;
}

export function CodeBlock({
  filename,
  copyText,
  children,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const rawCode = typeof children === "string" ? children : copyText;
  const tokens = useMemo(() => tokenizeCode(rawCode), [rawCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        {filename && (
          <span className="text-xs font-medium text-slate-400">{filename}</span>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white ml-auto"
        >
          <span className="material-symbols-outlined text-[14px]">
            {copied ? "check" : "content_copy"}
          </span>
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <div className="p-6 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed">
          {tokens.map((token, index) => (
            <span key={`${token.kind}-${index}`} className={TOKEN_COLORS[token.kind]}>
              {token.value}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}
