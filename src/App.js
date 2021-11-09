import * as React from "react";
import { useAuth } from "./context/auth";
import { RestrictedPart } from "./RestrictedPart";
import { UnrestrictedPart } from "./UnrestrictedPart";

export default function App() {
  const { token } = useAuth();

  return token ? <RestrictedPart /> : <UnrestrictedPart />;
}
