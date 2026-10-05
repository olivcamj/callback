import { z } from "zod";

export const JD_MAX_LENGTH = 12_000;

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
  );
