import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ChoiceGroup } from "./choice-group"

const LEVELS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
] as const

const TYPES = [
  { value: "behavioral", label: "Behavioral", color: "blush" },
  { value: "technical", label: "Technical", color: "mint" },
] as const

describe("ChoiceGroup (single)", () => {
  it("renders a labelled group of radio buttons", () => {
    render(<ChoiceGroup legend="Level" name="level" options={LEVELS} defaultValue="mid" />)
    const group = screen.getByRole("group", { name: "Level" })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
    expect(screen.getByRole("radio", { name: "Mid-level" })).toBeChecked()
  })

  it("selects one option at a time and reports the value", async () => {
    const onValueChange = vi.fn()
    render(
      <ChoiceGroup
        legend="Level"
        name="level"
        options={LEVELS}
        defaultValue="mid"
        onValueChange={onValueChange}
      />,
    )
    await userEvent.click(screen.getByText("Senior"))
    expect(screen.getByRole("radio", { name: "Senior" })).toBeChecked()
    expect(screen.getByRole("radio", { name: "Mid-level" })).not.toBeChecked()
    expect(onValueChange).toHaveBeenLastCalledWith("senior")
  })

  it("supports arrow keys between options", async () => {
    render(<ChoiceGroup legend="Level" name="level" options={LEVELS} defaultValue="junior" />)
    await userEvent.tab()
    expect(screen.getByRole("radio", { name: "Junior" })).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("radio", { name: "Mid-level" })).toBeChecked()
  })

  it("submits the chosen value with the form", async () => {
    render(
      <form data-testid="form">
        <ChoiceGroup legend="Level" name="level" options={LEVELS} defaultValue="mid" />
      </form>,
    )
    await userEvent.click(screen.getByText("Junior"))
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement)
    expect(data.get("level")).toBe("junior")
  })
})

describe("ChoiceGroup (multiple)", () => {
  it("renders checkboxes and submits every checked option", async () => {
    render(
      <form data-testid="form">
        <ChoiceGroup
          multiple
          variant="chip"
          legend="Question mix"
          name="questionTypes"
          options={TYPES}
          defaultValue={["behavioral", "technical"]}
        />
      </form>,
    )
    expect(screen.getAllByRole("checkbox")).toHaveLength(2)
    await userEvent.click(screen.getByText("Technical"))
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement)
    expect(data.getAll("questionTypes")).toEqual(["behavioral"])
  })

  it("works as a controlled component and keeps the options' order", async () => {
    const onValueChange = vi.fn()
    function Controlled() {
      const [value, setValue] = useState<Array<(typeof TYPES)[number]["value"]>>(["technical"])
      return (
        <ChoiceGroup
          multiple
          legend="Question mix"
          name="questionTypes"
          options={TYPES}
          value={value}
          onValueChange={(next) => {
            onValueChange(next)
            setValue(next)
          }}
        />
      )
    }
    render(<Controlled />)
    await userEvent.click(screen.getByText("Behavioral"))
    expect(onValueChange).toHaveBeenLastCalledWith(["behavioral", "technical"])
    expect(screen.getByRole("checkbox", { name: "Behavioral" })).toBeChecked()
  })

  it("shows an error and marks the group invalid", () => {
    render(
      <ChoiceGroup
        multiple
        legend="Question mix"
        name="questionTypes"
        options={TYPES}
        value={[]}
        error="Pick at least one type of question."
      />,
    )
    const group = screen.getByRole("group", { name: "Question mix" })
    expect(group).toHaveAttribute("aria-invalid", "true")
    expect(group).toHaveAccessibleDescription("Pick at least one type of question.")
  })

  it("disables every option when the group is disabled", () => {
    render(<ChoiceGroup legend="Level" name="level" options={LEVELS} disabled />)
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled()
  })
})
