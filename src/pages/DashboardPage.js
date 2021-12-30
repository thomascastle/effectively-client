import { AppBar } from "../components/AppBar";
import { QUERY_VIEWER_REPOSITORIES } from "../datasource/queries";
import { useQuery } from "@apollo/client";
import { RepoIcon } from "@primer/octicons-react";
import {
  Avatar,
  Box,
  ButtonPrimary,
  Heading,
  Link,
  StyledOcticon,
  Text,
  TextInput,
} from "@primer/react";

export function DashboardPage() {
  return (
    <>
      <AppBar />
      <Box className="main">
        <Box
          sx={{
            backgroundColor: "canvas.inset",
            display: [null, null, "flex"],
            minHeight: "100vh",
          }}
        >
          <Box
            as="aside"
            sx={{
              backgroundColor: "canvas.default",
              borderColor: "border.muted",
              borderBottomColor: "border.default",
              borderBottomStyle: "solid",
              borderBottomWidth: 1,
              borderRightColor: "border.default",
              borderRightStyle: "solid",
              borderRightWidth: 1,
              maxWidth: ["100%", null, 350],
              width: [null, null, "33.33333332%", "24.99999999%"],
            }}
          >
            <Box
              sx={{
                overflow: "auto",
                px: [3, null, 4, 5],
                top: 0,
              }}
            >
              <Box sx={{ mt: 5, mb: 3 }}>
                <Heading
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    fontSize: 14,
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  Repositories
                  <ButtonPrimary as="a" href="/new">
                    <StyledOcticon icon={RepoIcon} size={16} /> New
                  </ButtonPrimary>
                </Heading>
                <Box sx={{ mb: 3, mt: 2 }}>
                  <TextInput
                    contrast
                    placeholder="Find a repository"
                    width="100%"
                  />
                </Box>
                <Repositories />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              flex: "auto",
              px: [3, null, 5],
              width: [null, null, "66.66666664%", "66.66666664%"],
            }}
          >
            <Box sx={{ display: [null, null, "flex"], mx: [null, null, -24] }}>
              <Box
                sx={{
                  mt: 3,
                  mx: [null, null, 24],
                  width: [null, null, "100%", "66.66666664%"],
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flex: "auto",
                    flexDirection: "column",
                    maxWidth: 1400,
                    mx: "auto",
                  }}
                >
                  <Box as="main" sx={{ flex: "auto" }}>
                    <Box className="dashboard" id="dashboard">
                      <Box className="news">
                        <Heading
                          sx={{
                            fontSize: [16, null, 16],
                            fontWeight: 400,
                            pt: [null, null, 3],
                          }}
                        >
                          All activity
                        </Heading>
                        <Box
                          sx={{
                            backgroundColor: "canvas.default",
                            borderColor: "border.default",
                            borderRadius: 6,
                            borderStyle: "solid",
                            borderWidth: 1,
                            mt: 3,
                          }}
                        >
                          <Box sx={{ p: 3 }}>
                            <Box>
                              <strong>Welcome to Effectively!</strong>
                              <Text as="p">
                                A mini-clone of GitHub's Issues
                              </Text>
                              <Text as="p" sx={{ mb: 0 }}>
                                This is a practice project developed while
                                learning new things. It does not do all things
                                offered by GitHub.
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function Repositories() {
  const { data, error, loading } = useQuery(QUERY_VIEWER_REPOSITORIES, {
    variables: {
      orderBy: {
        direction: "DESC",
        field: "CREATED_AT",
      },
    },
  });

  return <RepositoryList data={data} error={error} loading={loading} />;
}

function RepositoryList({ data, error, loading }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { edges } = data.viewer.repositories;

  return (
    <ul style={{ listStyle: "none" }}>
      {edges.map((repo) => (
        <RepositoryListItem key={repo.node.id} repo={repo.node} />
      ))}
    </ul>
  );
}

function RepositoryListItem({ repo }) {
  return (
    <li>
      <Box sx={{ display: "flex", mt: 2, width: "100%" }}>
        <Link
          href={repo.nameWithOwner}
          sx={{ alignItems: "center", display: "flex", mr: 2 }}
        >
          <Avatar src="https://avatars.githubusercontent.com/primer" />
        </Link>
        <Box
          sx={{
            overflowWrap: "break-word",
            wordBreak: "break-word",
            wordWrap: "break-word",
          }}
        >
          <Link
            href={repo.nameWithOwner}
            sx={{ color: "fg.default", lineHeight: 0, mb: 2 }}
          >
            {repo.owner.login} <Text sx={{ color: "fg.muted" }}>/</Text>{" "}
            {repo.name}
          </Link>
        </Box>
      </Box>
    </li>
  );
}
