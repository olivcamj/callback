import * as React from "react"
import { cn } from "cn"
import { fieldClasses } from "./input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        fieldClasses,
        "field-sizing-content min-h-40 rounded-[1.125rem] py-4 leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
