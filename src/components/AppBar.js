import { useAuth } from "../context/auth";
import { useUser } from "../context/user";
import {
  Avatar,
  ButtonOutline,
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
                  <ButtonOutline sx={{ width: "100%" }} type="submit">
                    Sign out
                  </ButtonOutline>
                </form>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Header.Item>
      )}
    </Header>
  );
}