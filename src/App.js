import * as React from "react";
import { useAuth } from "./context/auth";
import { UserProvider } from "./context/user";
import { RestrictedPart } from "./RestrictedPart";
import { UnrestrictedPart } from "./UnrestrictedPart";

export default function App() {
  const { token } = useAuth();

  return token ? (
    <UserProvider>
      <RestrictedPart />
    </UserProvider>
  ) : (
    <UnrestrictedPart />
  );
}
