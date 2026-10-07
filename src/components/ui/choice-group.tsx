import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "cn"

// A group of pill or chip choices built on real radio buttons (pick one) or
// checkboxes (pick several). Native inputs mean keyboard support (Tab into
// the group, arrow keys between radios, Space to toggle), screen reader
// announcements and plain FormData submission all work without extra code.
//
//   variant="pill"  Rounded-full; checked fills ink.            (Level)
//   variant="chip"  12px corners; checked fills the option's
//                   color and shows a check mark.               (Stage, Question mix)

export type ChoiceColor = "ink" | "lilac" | "blush" | "mint" | "butter"

// Full class names so Tailwind can find them.
const CHECKED_COLORS: Record<ChoiceColor, string> = {
  ink: "group-has-checked:bg-ink group-has-checked:text-paper",
  lilac: "group-has-checked:bg-lilac",
  blush: "group-has-checked:bg-blush",
  mint: "group-has-checked:bg-mint",
  butter: "group-has-checked:bg-butter",
}

const VARIANTS = {
  pill: { shape: "rounded-full px-5", color: "ink" as ChoiceColor, check: false },
  chip: { shape: "rounded-xl px-4", color: "lilac" as ChoiceColor, check: true },
}

export type ChoiceOption<V extends string = string> = {
  value: V
  label: React.ReactNode
  /** Fill when checked. Defaults to the variant's color. */
  color?: ChoiceColor
  disabled?: boolean
}

type BaseProps<V extends string> = {
  legend: React.ReactNode
  /** Form field name. Checkboxes submit one entry per checked option. */
  name: string
  options: ReadonlyArray<ChoiceOption<V>>
  variant?: keyof typeof VARIANTS
  disabled?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  className?: string
}

type SingleProps<V extends string> = BaseProps<V> & {
  multiple?: false
  // NoInfer: the option type comes from `options` alone.
  value?: NoInfer<V>
  defaultValue?: NoInfer<V>
  onValueChange?: (value: NoInfer<V>) => void
  required?: boolean
}

type MultipleProps<V extends string> = BaseProps<V> & {
  multiple: true
  value?: NoInfer<V>[]
  defaultValue?: NoInfer<V>[]
  onValueChange?: (value: NoInfer<V>[]) => void
}

export type ChoiceGroupProps<V extends string> = SingleProps<V> | MultipleProps<V>

export function ChoiceGroup<V extends string>(props: ChoiceGroupProps<V>) {
  const { legend, name, options, variant = "pill", disabled, hint, error, className } = props
  const id = React.useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const style = VARIANTS[variant]

  const isChecked = (value: V): boolean | undefined => {
    if (props.multiple) return props.value?.includes(value)
    return props.value === undefined ? undefined : props.value === value
  }
  const isDefaultChecked = (value: V): boolean | undefined => {
    if (props.value !== undefined) return undefined
    if (props.multiple) return props.defaultValue?.includes(value)
    return props.defaultValue === value
  }

  const handleChange = (value: V, checked: boolean) => {
    if (props.multiple) {
      const current = props.value ?? props.defaultValue ?? []
      const next = checked ? [...current, value] : current.filter((v) => v !== value)
      // Keep the options' order, not the click order.
      props.onValueChange?.(options.map((o) => o.value).filter((v) => next.includes(v)))
    } else if (checked) {
      props.onValueChange?.(value)
    }
  }

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
      aria-invalid={error ? true : undefined}
      className={cn("m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0", className)}
    >
      <legend className="mb-2.5 p-0 text-[15px] font-bold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const color = option.color ?? style.color
          return (
            <label key={option.value} className="group relative cursor-pointer has-disabled:cursor-not-allowed">
              <input
                type={props.multiple ? "checkbox" : "radio"}
                name={name}
                value={option.value}
                checked={isChecked(option.value)}
                defaultChecked={isDefaultChecked(option.value)}
                onChange={(event) => handleChange(option.value, event.target.checked)}
                disabled={option.disabled}
                required={!props.multiple ? props.required : undefined}
                className="sr-only"
              />
              <span
                className={cn(
                  "inline-flex h-11 items-center gap-1.5 border-2 border-ink bg-white text-[15px] font-bold text-ink select-none",
                  "transition-[background-color,color,transform] duration-150 group-active:translate-y-px",
                  "group-hover:shadow-[0_2px_0_var(--color-ink)]",
                  "group-has-focus-visible:ring-4 group-has-focus-visible:ring-coral/40",
                  "group-has-disabled:opacity-50",
                  error && "border-destructive",
                  style.shape,
                  CHECKED_COLORS[color],
                )}
              >
                {style.check && (
                  <Check
                    aria-hidden
                    strokeWidth={3}
                    className="-ml-0.5 hidden size-4 group-has-checked:inline"
                  />
                )}
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
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
    </fieldset>
  )
}
