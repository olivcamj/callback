import * as React from "react"
import { cn } from "cn"

// Shared look for text fields: 52px tall, 2px ink border, white fill.
const fieldClasses =
  "w-full rounded-[var(--radius-field)] border-2 border-ink bg-white px-4 text-base text-ink transition-shadow outline-none placeholder:text-ink-muted focus-visible:ring-4 focus-visible:ring-coral/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15"

type InputProps = React.ComponentProps<"input"> & {
  /** Visible label. Leave it out only if the field is labelled another way. */
  label?: React.ReactNode
  /** Adds a quiet "(optional)" after the label. */
  optional?: boolean
  /** Helper text under the field. */
  hint?: React.ReactNode
  /** Error text under the field. Also marks the field invalid. */
  error?: React.ReactNode
}

function Input({ className, label, optional, hint, error, id, ...props }: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy =
    [props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined

  const input = (
    <input
      data-slot="input"
      id={inputId}
      aria-invalid={error ? true : props["aria-invalid"]}
      aria-describedby={describedBy}
      className={cn(fieldClasses, "h-13", className)}
      {...props}
    />
  )

  if (!label && !hint && !error) return input

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-[15px] font-bold">
          {label}
          {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
        </label>
      )}
      {input}
      {hint && (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export { Input, fieldClasses }
export type { InputProps }
