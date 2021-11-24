import { useAuth } from "../context/auth";
import { useUser } from "../context/user";
import { QUERY_REPOSITORY_VISIBILITY } from "../datasource/queries";
import { ApolloConsumer, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  ButtonOutline,
  Dropdown,
  Header,
  Heading,
  Label,
  Link,
  StyledOcticon,
  Text,
  UnderlineNav,
} from "@primer/components";
import {
  GearIcon,
  IssueOpenedIcon,
  MarkGithubIcon,
  ProjectIcon,
  RepoIcon,
} from "@primer/octicons-react";
import { useLocation, useParams } from "react-router-dom";

export function Layout({ children }) {
  const { updateToken } = useAuth();
  const location = useLocation();
  const { login, repositoryName } = useParams();
  const { user } = useUser();

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
                    <strong>{user.login}</strong>
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
          <Box sx={{ backgroundColor: "canvas.subtle", mb: 5, pt: 3 }}>
            <Box
              sx={{
                display: "flex",
                mb: 3,
                px: [3, null, 4, 5],
              }}
            >
              <Box sx={{ flex: "auto", maxWidth: "100%", minWidth: 0, mr: 3 }}>
                <Heading
                  as="h1"
                  sx={{
                    alignItems: "center",
                    fontSize: [18, null, 20],
                    fontWeight: 400,
                    flexWrap: "wrap",
                    display: "flex",
                    wordBreak: "break-word",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <StyledOcticon
                    icon={RepoIcon}
                    size={16}
                    sx={{ color: "fg.muted", mr: 2 }}
                  />
                  <Text sx={{ alignSelf: "stretch" }}>
                    <Link href={`/${login}`}>{login}</Link>
                  </Text>
                  <Text sx={{ alignSelf: "stretch", color: "fg.muted", mx: 1 }}>
                    /
                  </Text>
                  <Text as="strong" sx={{ alignSelf: "stretch", mr: 2 }}>
                    <Link href={`/${login}/${repositoryName}`}>
                      {repositoryName}
                    </Link>
                  </Text>
                  <LabelRepositoryVisibility />
                </Heading>
              </Box>
              <ul></ul>
            </Box>
            <UnderlineNav className="underlineNav">
              <UnderlineNav.Link
                href={`/${login}/${repositoryName}/issues`}
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
                href={`/${login}/${repositoryName}/projects`}
                selected={location.pathname.match(/\/projects/)}
              >
                <StyledOcticon icon={ProjectIcon} /> Projects
              </UnderlineNav.Link>
              <UnderlineNav.Link
                href={`/${login}/${repositoryName}/settings`}
                selected={location.pathname.match(/\/settings/)}
              >
                <StyledOcticon icon={GearIcon} /> Settings
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
            borderTopColor: "border.default",
            borderTopStyle: "solid",
            borderTopWidth: "1px",
            color: "fg.muted",
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

function LabelRepositoryVisibility() {
  const { login, repositoryName } = useParams();

  const { data, error, loading } = useQuery(QUERY_REPOSITORY_VISIBILITY, {
    variables: {
      name: repositoryName,
      owner: login,
    },
  });

  if (loading) {
    return <Label outline>...</Label>;
  }

  if (error) {
    return <span>{error.message}</span>;
  }

  const { visibility } = data.repository;

  return (
    <Label outline>
      {visibility.slice(0, 1).concat(visibility.slice(1).toLowerCase())}
    </Label>
  );
}
