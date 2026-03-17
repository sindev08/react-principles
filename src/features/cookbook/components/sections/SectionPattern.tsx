import { SectionHeading } from "../SectionHeading";
import { CodeBlock } from "../CodeBlock";

interface SectionPatternProps {
  number: number;
  pattern: { filename: string; code: string };
}

export function SectionPattern({ number, pattern }: SectionPatternProps) {
  return (
    <section className="mb-16" id="pattern">
      <SectionHeading number={number} title="Pattern" />
      <CodeBlock filename={pattern.filename} copyText={pattern.code}>
        {pattern.code}
      </CodeBlock>
    </section>
  );
}
