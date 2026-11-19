// Where a session should pick up, e.g. after a refresh: the first question,
// in plan order, that has no answer yet. Answers can arrive in any order.
// Returns null when every question is answered, so callers must handle the
// finished session explicitly instead of indexing past the end.
export function nextUnansweredIndex(
  questions: ReadonlyArray<{ id: string }>,
  answers: ReadonlyArray<{ questionId: string }>,
): number | null {
  const answered = new Set(answers.map((answer) => answer.questionId));
  const index = questions.findIndex((question) => !answered.has(question.id));
  return index === -1 ? null : index;
}
