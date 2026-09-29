import { describe, expect, it } from "vitest";
import { isPublic } from "@/lib/public-routes";

describe("isPublic", () => {
  it.each(["/", "/sign-in", "/sign-up", "/sign-in/factor-one"])("%s is public", (p) => {
    expect(isPublic(p)).toBe(true)
  })

  it.each(["/dashboard", "/sign-inx", "/foo"])("%s is not public", (p) => {
    expect(isPublic(p)).toBe(false)
  })
})