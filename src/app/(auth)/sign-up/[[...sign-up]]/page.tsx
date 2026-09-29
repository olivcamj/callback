import { SignUp } from "@clerk/nextjs";
import { flushAppearance } from "../../appearance";

export default function Page() {
  return <SignUp appearance={flushAppearance} />;
}
