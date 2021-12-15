import { useAuth } from "../context/auth";
import { useUser } from "../context/user";
import {
  Avatar,
  Box,
  Dropdown,
  Header,
  Link,
  StyledOcticon,
} from "@primer/components";
import { MarkGithubIcon } from "@primer/octicons-react";

export function AppBar() {
  const { updateToken } = useAuth();
  const { user } = useUser();

  const token = localStorage.getItem("token");

  return (
    <Header>
      <Header.Item>
        <Link
          href="/"
          sx={{ color: "header.logo", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          <StyledOcticon icon={MarkGithubIcon} size={32} />
        </Link>
      </Header.Item>
      <Header.Item full>
        <Header.Link href="/issues">Issues</Header.Link>
      </Header.Item>
      {token && (
        <Header.Item sx={{ mr: 0 }}>
          <Dropdown>
            <Box as="summary" sx={{ ":hover": { cursor: "pointer" } }}>
              <Avatar
                size={20}
                src="https://avatars.githubusercontent.com/primer"
              />
              <Dropdown.Caret />
            </Box>
            <Dropdown.Menu direction="sw" sx={{ width: "180px" }}>
              <Dropdown.Item>
                <Link href={"/" + user.login}>
                  Signed in as
                  <br />
                  <strong>{user.login}</strong>
                </Link>
              </Dropdown.Item>
              <div className="dropdown-divider"></div>
              <Dropdown.Item>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    localStorage.removeItem("token");
                    updateToken("");
                  }}
                >
                  <Link
                    as="button"
                    sx={{
                      background: "none",
                      color: "fg.default",
                      border: 0,
                      textAlign: "left",
                      width: "100%",
                      ":hover": { color: "#fff", textDecoration: "none" },
                    }}
                    type="submit"
                  >
                    Sign out
                  </Link>
                </form>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Header.Item>
      )}
    </Header>
  );
}
