import { Box, Button, FormGroup, TextInput } from "@primer/react";
import { AppBar } from "../components/AppBar";

export function NotFoundPage() {
  return (
    <>
      <AppBar />
      <Box sx={{ display: "flex", flex: "auto", flexDirection: "column" }}>
        <main>
          <Box
            sx={{
              position: "relative",
              transition: "all 0.25s ease-in",
              zIndex: 0,
            }}
          >
            <Box
              sx={{
                height: 370,
                left: 0,
                overflow: "hidden",
                position: "absolute",
                top: 0,
                width: "100%",
              }}
            >
              <img
                src="/404-background.jpeg"
                style={{
                  height: "425px",
                  left: "-20px",
                  position: "absolute",
                  top: "-20px",
                  width: "110%",
                  zIndex: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                clear: "both",
                display: "block",
                height: 370,
                mx: "auto",
                my: 0,
                overflow: "hidden",
                position: "relative",
                width: 940,
              }}
            >
              <img
                height="249"
                src="/404-text.png"
                style={{
                  left: "72px",
                  position: "absolute",
                  top: "72px",
                  zIndex: 10,
                }}
                width="271"
              />
              <img
                height="230"
                src="/404-outworlder.png"
                style={{
                  left: "356px",
                  position: "absolute",
                  top: "94px",
                  zIndex: 9,
                }}
                width="188"
              />
              <img
                heigt="156"
                src="/404-spaceship.png"
                style={{
                  left: "432px",
                  position: "absolute",
                  top: "150px",
                  zIndex: 8,
                }}
                width="440"
              />
              <img
                height="49"
                src="/404-shadow-outworlder.png"
                style={{
                  left: "371px",
                  position: "absolute",
                  top: "297px",
                  zIndex: 7,
                }}
                width="166"
              />
              <img
                height="75"
                src="/404-shadow-spaceship.png"
                style={{
                  left: "442px",
                  position: "absolute",
                  top: "263px",
                  zIndex: 6,
                }}
                width="430"
              />
              <img
                height="123"
                src="/404-building-large.png"
                style={{
                  left: "467px",
                  position: "absolute",
                  top: "73px",
                  zIndex: 5,
                }}
                width="304"
              />
              <img
                height="50"
                src="/404-building-small.png"
                style={{
                  left: "762px",
                  position: "absolute",
                  top: "113px",
                  zIndex: 4,
                }}
                width="116"
              />
            </Box>
          </Box>
          <Box sx={{ maxWidth: 1012, mt: 5, mx: "auto", px: 3 }}>
            <form method="get">
              <FormGroup>
                <FormGroup.Label
                  sx={{
                    color: "fg.muted",
                    fontWeight: 400,
                    mb: 1,
                  }}
                >
                  Find code, projects, and people on GitHub:
                </FormGroup.Label>
                <Box sx={{ alignItems: "center", display: "flex" }}>
                  <TextInput sx={{ flex: "auto", mr: 2 }} />
                  <Button type="submit">Search</Button>
                </Box>
              </FormGroup>
            </form>
          </Box>
        </main>
      </Box>
      <Box as="footer" sx={{ position: "relative", pt: 6 }}></Box>
    </>
  );
}
