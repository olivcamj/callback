import type { SignIn } from "@clerk/nextjs";

type Appearance = React.ComponentProps<typeof SignIn>["appearance"];

// Render Clerk's form flush against the page instead of as a floating card.
export const flushAppearance = {
  elements: {
    cardBox: {
      width: "100%",
      maxWidth: "25rem",
      boxShadow: "none",
      border: "none",
      borderRadius: 0,
    },
    card: {
      backgroundColor: "transparent",
      boxShadow: "none",
      border: "none",
    },
    footer: {
      background: "none",
    },
    footerActionLink: {
      fontWeight: 700,
      textDecoration: "underline",
    },
  },
} satisfies Appearance;
