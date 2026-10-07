import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Button styles from the Callback designs.
//
//   chunky       Coral CTA with a hard ink shadow that presses down.
//                One per screen: "Start mock interview", "Build my interview".
//   default      Dark ink pill: "Done, get feedback", "Next question".
//   outline      White pill with a 2px ink border: "Try again", "Warm up".
//   secondary    Soft lilac pill: "Show all 9".
//   toggle       Selectable pill (level, question type). Set aria-pressed;
//                pressed fills with ink.
//   ghost        No background until hover: nav-style actions.
//   link         Underlined text: "Hide cues (hard mode)".
//   destructive  Quiet red text: "Delete plan".
//   onDark       Light outline for dark sections: "Save to story", footer.
//
// Navigation (anything that goes to another page) must be a real link.
// Put the classes on next/link with buttonVariants():
//   <Link href="/plans/new" className={buttonVariants({ variant: "chunky", size: "lg" })}>
// Don't use <Button render={<Link />}>: Base UI gives the link role="button",
// so screen readers would announce it as a button.

const press = "active:translate-y-px"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center font-bold whitespace-nowrap no-underline select-none",
    "transition-[background-color,color,box-shadow,transform] duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.1em]",
  ],
  {
    variants: {
      variant: {
        chunky: "btn-chunky bg-coral text-ink hover:bg-[#ff9b7a]",
        default: cn("rounded-full bg-ink text-paper hover:bg-ink/85", press),
        outline: cn(
          "rounded-full border-2 border-ink bg-white text-ink hover:bg-paper",
          press,
        ),
        secondary: cn("rounded-full bg-lilac text-ink hover:bg-lilac-200", press),
        toggle: cn(
          "rounded-full border-2 border-ink bg-white text-ink hover:bg-paper",
          "aria-pressed:bg-ink aria-pressed:text-paper aria-pressed:hover:bg-ink/85",
          press,
        ),
        ghost: cn("rounded-full text-ink hover:bg-ink/5", press),
        link: "rounded-sm text-ink underline decoration-2 underline-offset-4 hover:text-coral-deep",
        destructive: cn("rounded-full text-blush-ink hover:bg-blush-50", press),
        onDark: cn(
          "rounded-full border-[1.5px] border-[#cfc8de] text-paper hover:bg-white/10",
          press,
        ),
      },
      size: {
        // Every size keeps a 40px+ touch target.
        sm: "h-10 gap-1.5 px-4 text-sm",
        default: "h-11 gap-2 px-5 text-base",
        lg: "h-14 gap-2.5 px-7 text-lg",
        icon: "size-11",
        "icon-sm": "size-10",
      },
    },
    compoundVariants: [
      // Text links size to their text, not a pill.
      { variant: "link", className: "h-auto px-0 py-2" },
      // The chunky CTA's rounding comes from btn-chunky; keep its corners on icons too.
      { variant: "chunky", size: ["icon", "icon-sm"], className: "px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
