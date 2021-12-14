import { AppBar } from "./AppBar";
import { Box } from "@primer/components";

export function LayoutDefault({ children }) {
  return (
    <>
      <AppBar />
      <Box className="main">{children}</Box>
    </>
  );
}
