import { SignIn } from "@clerk/nextjs";
import { flushAppearance } from "../../appearance";

export default function Page() {
  return <SignIn appearance={flushAppearance} />;
}
