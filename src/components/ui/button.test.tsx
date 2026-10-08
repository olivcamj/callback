import Link from "next/link"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button, buttonVariants } from "./button"

describe("Button", () => {
  it("renders a dark pill by default", () => {
    render(<Button>Next question</Button>)
    const button = screen.getByRole("button", { name: "Next question" })
    expect(button).toHaveAttribute("data-variant", "default")
    expect(button).toHaveClass("bg-ink", "rounded-full", "h-11")
  })

  it("renders the chunky coral CTA", () => {
    render(
      <Button variant="chunky" size="lg">
        Start mock interview
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Start mock interview" })
    expect(button).toHaveClass("btn-chunky", "bg-coral", "h-14")
  })

  it("exposes the pressed state of a toggle", () => {
    render(
      <Button variant="toggle" aria-pressed="true">
        Mid-level
      </Button>,
    )
    expect(screen.getByRole("button", { name: "Mid-level" })).toHaveAttribute("aria-pressed", "true")
  })

  it("lets a link variant size to its text", () => {
    render(<Button variant="link">Hide cues</Button>)
    expect(screen.getByRole("button", { name: "Hide cues" })).toHaveClass("h-auto", "px-0")
  })

  it("calls onClick and does not when disabled", async () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    )
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("styles a real link through buttonVariants", () => {
    render(
      <Link href="/plans/new" className={buttonVariants({ variant: "chunky", size: "lg" })}>
        New interview
      </Link>,
    )
    const link = screen.getByRole("link", { name: "New interview" })
    expect(link).toHaveAttribute("href", "/plans/new")
    expect(link).toHaveClass("btn-chunky", "h-14")
  })

  it("exports the classes for use on next/link", () => {
    expect(buttonVariants({ variant: "outline", size: "sm" })).toContain("border-ink")
  })
})
