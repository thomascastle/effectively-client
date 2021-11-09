import { useAuth } from "../context/auth";
import { ApolloConsumer } from "@apollo/client";
import {
  Avatar,
  Box,
  ButtonOutline,
  Dropdown,
  Header,
  Link,
  StyledOcticon,
  UnderlineNav,
} from "@primer/components";
import { IssueOpenedIcon, MarkGithubIcon } from "@primer/octicons-react";
import { useLocation } from "react-router-dom";

export function Layout({ children }) {
  const { updateToken } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem("token");

  return (
    <>
      <Header>
        <Header.Item>
          <StyledOcticon icon={MarkGithubIcon} size={32} />
        </Header.Item>
        <Header.Item full>
          <Header.Link href="/issues">Issues</Header.Link>
        </Header.Item>
        {token && (
          <Header.Item sx={{ mr: 0 }}>
            <Dropdown>
              <summary>
                <Avatar
                  size={30}
                  src="https://avatars.githubusercontent.com/primer"
                />
                <Dropdown.Caret />
              </summary>
              <Dropdown.Menu direction="sw">
                <Dropdown.Item>
                  <Link href="/">
                    Signed in as
                    <br />
                    <strong>username</strong>
                  </Link>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item>
                  <ApolloConsumer>
                    {(client) => (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();

                          localStorage.removeItem("token");
                          updateToken("");
                        }}
                      >
                        <ButtonOutline sx={{ width: "100%" }} type="submit">
                          Sign out
                        </ButtonOutline>
                      </form>
                    )}
                  </ApolloConsumer>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Header.Item>
        )}
      </Header>
      <Box>
        <main>
          <Box sx={{ backgroundColor: "bg.secondary", mb: 5, pt: 3 }}>
            <UnderlineNav className="underlineNav">
              <UnderlineNav.Link
                href="/"
                selected={
                  location.pathname === "/" ||
                  location.pathname.match(/\/issues/) ||
                  location.pathname.match(/\/labels/) ||
                  location.pathname.match(/\/milestones/)
                }
              >
                <span>
                  <StyledOcticon icon={IssueOpenedIcon} /> Issues
                </span>
              </UnderlineNav.Link>
              <UnderlineNav.Link
                href="/projects"
                selected={location.pathname === "/projects"}
              >
                Projects
              </UnderlineNav.Link>
            </UnderlineNav>
          </Box>
          <Box
            maxWidth={["544px", "768px", "1012px", "1280px"]}
            ml="auto"
            mr="auto"
            px={[16, 24, 32]}
          >
            {children}
          </Box>
        </main>
      </Box>
      <Box
        className="footer"
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: ["16px", "40px", null, "16px"],
          width: "100%",
        }}
      >
        <Box
          sx={{
            borderTopColor: "border.primary",
            borderTopStyle: "solid",
            borderTopWidth: "1px",
            color: "text.secondary",
            display: "flex",
            flexDirection: [null, null, null, "row"],
            flexWrap: ["wrap", null, null, "nowrap"],
            fontSize: "12px",
            justifyContent: ["center", null, null, "space-between"],
            mt: 6,
            pb: 2,
            position: "relative",
            pt: 6,
          }}
        ></Box>
      </Box>
    </>
  );
}
