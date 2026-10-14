import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuestionStepper } from "./question-stepper";

const question = { prompt: "Tell me about a time you disagreed with a teammate.", type: "behavioral" } as const;

describe("QuestionStepper", () => {
  it("shows the question as the page heading", () => {
    render(<QuestionStepper question={question} current={3} total={8} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(question.prompt);
    expect(screen.getByRole("region", { name: question.prompt })).toBeInTheDocument();
  });

  it("shows progress as text", () => {
    render(<QuestionStepper question={question} current={3} total={8} />);

    expect(screen.getByText("Scene 3 of 8")).toBeInTheDocument();
  });

  it("marks done, current and upcoming steps", () => {
    const { container } = render(<QuestionStepper question={question} current={3} total={8} />);
    const dots = container.querySelectorAll("ol[aria-hidden] > li");

    expect(dots).toHaveLength(8);
    expect(dots[1]).toHaveClass("bg-ink");
    expect(dots[2]).toHaveClass("bg-coral");
    expect(dots[3]).toHaveClass("bg-line");
  });

  it("labels the question type", () => {
    const { rerender } = render(<QuestionStepper question={question} current={1} total={8} />);
    expect(screen.getByText("Behavioral")).toHaveClass("bg-blush");

    rerender(<QuestionStepper question={{ ...question, type: "technical" }} current={1} total={8} />);
    expect(screen.getByText("Technical")).toHaveClass("bg-mint");

    rerender(<QuestionStepper question={{ ...question, type: "role" }} current={1} total={8} />);
    expect(screen.getByText("Role")).toHaveClass("bg-butter");
  });
});
