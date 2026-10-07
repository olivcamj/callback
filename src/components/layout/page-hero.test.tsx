import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHero } from "./page-hero";

describe("PageHero", () => {
  it("renders the title as the page's h1 and labels the section with it", () => {
    render(<PageHero title="Set the scene." />);
    expect(screen.getByRole("heading", { level: 1, name: "Set the scene." })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Set the scene." })).toBeInTheDocument();
  });

  it("renders eyebrow, description, actions and aside when given", () => {
    render(
      <PageHero
        title="Plan"
        eyebrow="Your interview plan"
        description="9 questions"
        actions={<button type="button">Start mock interview</button>}
        aside={<p>Read the why lines first.</p>}
      />,
    );
    expect(screen.getByText("Your interview plan")).toBeInTheDocument();
    expect(screen.getByText("9 questions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start mock interview" })).toBeInTheDocument();
    expect(screen.getByText("Read the why lines first.")).toBeInTheDocument();
  });

  it("leaves out optional parts that aren't given", () => {
    render(<PageHero title="Plan" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("region").querySelectorAll("p")).toHaveLength(0);
  });

  it("defaults to the butter tone and accepts others", () => {
    const { rerender } = render(<PageHero title="Plan" />);
    expect(screen.getByRole("region")).toHaveAttribute("data-tone", "butter");

    rerender(<PageHero title="Plan" tone="lilac" />);
    expect(screen.getByRole("region")).toHaveAttribute("data-tone", "lilac");
  });
});
