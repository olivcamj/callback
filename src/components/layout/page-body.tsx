import { cn } from "@/lib/utils";

type PageBodyProps = {
  children: React.ReactNode;
  className?: string;
};

// Content area under a PageHero: same max width and side padding.
export function PageBody({ children, className }: PageBodyProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 pb-16 md:px-16", className)}>
      {children}
    </div>
  );
}
