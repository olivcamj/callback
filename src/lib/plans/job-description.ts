import { z } from "zod";

export const JD_MAX_LENGTH = 12_000;

// A real posting has responsibilities and requirements; anything shorter
// than this can't support a useful plan.
export const JD_MIN_WORDS = 30;

// A job post repeats words, but it never uses only a handful of them.
const MIN_DISTINCT_WORDS = 10;

// Share of words that must look like real words (see looksLikeWord).
const MIN_WORDLIKE_RATIO = 0.7;

export const JD_TOO_SHORT_MESSAGE = `That's too short to build an interview from. Paste the full job post (at least ${JD_MIN_WORDS} words), including responsibilities and requirements.`;
export const NOT_A_JD_MESSAGE =
  "This doesn't look like a job description. Paste the full post from the company's listing.";

// Cheap, offline gibberish check. A Latin-script word looks real if it has a
// vowel (counting y) and no run of 6+ consonants: "engineer" passes,
// "xkcdqwrtp" does not. Words in other scripts are given the benefit of the
// doubt. The model makes the final call on anything that passes this.
function looksLikeWord(word: string): boolean {
  if (!/^[a-z]+$/.test(word)) return true;
  if (word.length > 25) return false;
  return /[aeiouy]/.test(word) && !/[^aeiouy]{6,}/.test(word);
}

// Returns a user-facing problem with the text, or null if it reads like a
// job description.
export function jobDescriptionProblem(text: string): string | null {
  const words = text.toLowerCase().match(/\p{L}+/gu) ?? [];
  if (words.length < JD_MIN_WORDS) return JD_TOO_SHORT_MESSAGE;

  const distinct = new Set(words).size;
  const wordlike = words.filter(looksLikeWord).length / words.length;
  if (distinct < MIN_DISTINCT_WORDS || wordlike < MIN_WORDLIKE_RATIO) return NOT_A_JD_MESSAGE;

  return null;
}

// Browsers can submit textarea line breaks as CRLF while counting them as one
// character client-side, so normalize before measuring to keep the server
// limit in line with the counter the user sees.
export const jobDescriptionSchema = z
  .string({ error: "Paste a job description." })
  .transform((text) => text.replace(/\r\n?/g, "\n").trim())
  .pipe(
    z
      .string()
      .min(1, "Paste a job description.")
      .max(
        JD_MAX_LENGTH,
        `Job descriptions can be at most ${JD_MAX_LENGTH.toLocaleString("en-US")} characters.`,
      ),
  )
  // A separate step so it only runs once the length checks pass.
  .pipe(
    z.string().superRefine((text, ctx) => {
      const problem = jobDescriptionProblem(text);
      if (problem) ctx.addIssue({ code: "custom", message: problem });
    }),
  );
