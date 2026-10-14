import type { QuestionType } from "@/lib/ai/schemas/interview-plan";
import { cn } from "@/lib/utils";

// Same colors as the question type choices on the new plan form.
const TYPE_STYLES = {
  behavioral: { label: "Behavioral", className: "bg-blush" },
  technical: { label: "Technical", className: "bg-mint" },
  role: { label: "Role", className: "bg-butter" },
} as const satisfies Record<QuestionType, { label: string; className: string }>;

export function QuestionTypeChip({ type, className }: { type: QuestionType; className?: string }) {
  const style = TYPE_STYLES[type];

  return (
    <span className={cn("rounded-full px-3 py-1.5 text-sm font-bold", style.className, className)}>
      {style.label}
    </span>
  );
}
