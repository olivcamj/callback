import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StickyNote } from "./sticky-note";

describe("StickyNote", () => {
  it("renders its children inside a sticky note", () => {
    render(<StickyNote>Name the outcome.</StickyNote>);
    const note = screen.getByText("Name the outcome.");
    expect(note).toHaveClass("sticky-note");
  });

  it("applies the tilt and color", () => {
    render(
      <StickyNote tilt={3} color="mint">
        Tilted
      </StickyNote>,
    );
    const note = screen.getByText("Tilted");
    expect(note.style.getPropertyValue("--tilt")).toBe("3deg");
    expect(note).toHaveAttribute("data-color", "mint");
  });

  it("defaults to a yellow note tilted left", () => {
    render(<StickyNote>Default</StickyNote>);
    const note = screen.getByText("Default");
    expect(note.style.getPropertyValue("--tilt")).toBe("-2deg");
    expect(note).toHaveAttribute("data-color", "yellow");
  });

  it("shows a pin, tape, or nothing", () => {
    const { container, rerender } = render(<StickyNote attach="pin">Note</StickyNote>);
    expect(container.querySelector(".note-pin")).toBeInTheDocument();
    expect(container.querySelector(".note-tape")).not.toBeInTheDocument();

    rerender(<StickyNote attach="tape">Note</StickyNote>);
    expect(container.querySelector(".note-tape")).toBeInTheDocument();
    expect(container.querySelector(".note-pin")).not.toBeInTheDocument();

    rerender(<StickyNote>Note</StickyNote>);
    expect(container.querySelector(".note-pin, .note-tape")).not.toBeInTheDocument();
  });

  it("renders an optional label", () => {
    render(<StickyNote label="One fix">End with the outcome.</StickyNote>);
    expect(screen.getByText("One fix")).toBeInTheDocument();
  });

  it("can render as a list item", () => {
    render(
      <ul>
        <StickyNote as="li">Beat one</StickyNote>
      </ul>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Beat one");
  });
});
