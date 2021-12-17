import { AppBar } from "./AppBar";
import { Box } from "@primer/react";

export function LayoutDefault({ children }) {
  return (
    <>
      <AppBar />
      <Box className="main">{children}</Box>
    </>
  );
}
