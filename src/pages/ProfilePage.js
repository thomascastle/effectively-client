import { AppBar } from "../components/AppBar";
import {
  QUERY_USER_MINIMUM_PROFILE,
  QUERY_USER_POPULAR_REPOSITORIES,
  QUERY_USER_REPOSITORIES,
} from "../datasource/queries";
import useQueryParams from "../hooks/QueryParams";
import { useQuery } from "@apollo/client";
import { RepoIcon } from "@primer/octicons-react";
import {
  Avatar,
  Box,
  Button,
  ButtonPrimary,
  Heading,
  Label,
  Link,
  SelectMenu,
  StyledOcticon,
  Text,
  TextInput,
  UnderlineNav,
} from "@primer/react";
import { formatDistance } from "date-fns";
import { useParams } from "react-router-dom";

export function ProfilePage() {
  const { login } = useParams();
  const tabName = useQueryParams().get("tab");

  return (
    <>
      <AppBar />
      <Box className="main">
        <Box as="main">
          <Box
            style={{ zIndex: 3 }}
            sx={{
              backgroundColor: "canvas.default",
              borderColor: "border.muted",
              borderBottomColor: "border.default",
              borderBottomStyle: "solid",
              borderBottomWidth: 1,
              display: ["none", null, "block"],
              mt: 4,
              position: "sticky",
              top: 0,
              width: "100%",
            }}
          >
            <Box sx={{ maxWidth: "1280px", mx: "auto", px: [3, null, 4, 5] }}>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ mr: 4, width: [null, 220, 256, 296] }}>
                  <Box
                    sx={{
                      opacity: 0,
                      pointerEvents: "none",
                      position: "fixed",
                      top: 0,
                      transitions: ".2s",
                      width: 233,
                      wordBreak: "break-all",
                      zIndex: 90,
                    }}
                  >
                    <Box
                      sx={{
                        display: "table",
                        height: 54,
                        position: "relative",
                        top: 1,
                        zIndex: 110,
                      }}
                    >
                      <Box
                        as="span"
                        sx={{
                          display: "table-cell",
                          lineHeight: 1,
                          pr: 2,
                          verticalAlign: "middle",
                          width: 32,
                        }}
                      >
                        <Box
                          alt=""
                          as="img"
                          height="32"
                          src="https://avatars.githubusercontent.com/u/46418618?s=64&v=4"
                          sx={{ borderRadius: "50%" }}
                          width="32"
                        ></Box>
                      </Box>
                      <Box
                        as="span"
                        sx={{
                          display: "table-cell",
                          lineHeight: 1.25,
                          verticalAlign: "middle",
                        }}
                      >
                        <Text as="strong">thomascastle</Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1, ml: 4, minWidth: 0 }}>
                  <UnderlineNav>
                    <UnderlineNav.Link
                      href={`/${login}`}
                      selected={
                        tabName !== "repositories" && tabName !== "stars"
                      }
                    >
                      Overview
                    </UnderlineNav.Link>
                    <UnderlineNav.Link
                      href={`/${login}?tab=repositories`}
                      selected={tabName === "repositories"}
                    >
                      Repositories
                    </UnderlineNav.Link>
                    <UnderlineNav.Link
                      href={`/${login}?tab=stars`}
                      selected={tabName === "stars"}
                    >
                      Stars
                    </UnderlineNav.Link>
                  </UnderlineNav>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ maxWidth: "1280px", mx: "auto", px: [3, null, 4, 5] }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ mr: 4, width: [null, 220, 256, 296] }}>
                <Box sx={{ mt: [null, null, -5] }}>
                  <Box
                    sx={{
                      opacity: 0,
                      pointerEvents: "none",
                      position: "fixed",
                      top: 0,
                      transitions: ".2s",
                      width: 233,
                      wordBreak: "break-all",
                      zIndex: 90,
                    }}
                  >
                    <Box
                      sx={{
                        display: "table",
                        height: 54,
                        position: "relative",
                        top: 1,
                        zIndex: 110,
                      }}
                    >
                      <Box
                        as="span"
                        sx={{
                          display: "table-cell",
                          lineHeight: 1,
                          pr: 2,
                          verticalAlign: "middle",
                          width: 32,
                        }}
                      >
                        <Box
                          alt=""
                          as="img"
                          height="32"
                          src="https://avatars.githubusercontent.com/u/46418618?s=64&v=4"
                          sx={{ borderRadius: "50%" }}
                          width="32"
                        ></Box>
                      </Box>
                      <Box
                        as="span"
                        sx={{
                          display: "table-cell",
                          lineHeight: 1.25,
                          verticalAlign: "middle",
                        }}
                      >
                        <Text as="strong">thomascastle</Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <MinimumProfile />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Box
                        sx={{
                          display: ["flex", null, "block"],
                          flexDirection: "column",
                        }}
                      >
                        <Box sx={{ mb: 3 }}>
                          <Button sx={{ width: "100%" }}>Edit profile</Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1, ml: 4, minWidth: 0 }}>
                <TabPanel selectedTabName={tabName} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        as="footer"
        sx={{ maxWidth: 1280, mx: "auto", px: [3, 6, null, 3], width: "100%" }}
      >
        <Box
          sx={{
            alignItems: "center",
            borderColor: "border.muted",
            borderTopColor: "border.default",
            borderTopStyle: "solid",
            borderTopWidth: 1,
            color: "fg.muted",
            display: "flex",
            flexDirection: ["column", null, null, "row"],
            flexWrap: ["wrap", null, null, "nowrap"],
            fontSize: 12,
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

function MinimumProfile() {
  const { login } = useParams();

  const { data, error, loading } = useQuery(QUERY_USER_MINIMUM_PROFILE, {
    variables: {
      login,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data!</div>;
  }

  const { login: username, name } = data.user;

  return (
    <Box
      sx={{
        alignItems: "center",
        display: ["flex", null, "block"],
        mb: [4, null, 0],
      }}
    >
      <Box
        style={{ zIndex: 4 }}
        sx={{
          display: "inline-block",
          flexShrink: 0,
          mr: [3, null, 0],
          position: "relative",
          width: ["16.6666666", null, "100%"],
        }}
      >
        <Avatar
          alt=""
          size={260}
          src="https://avatars.githubusercontent.com/u/46418618?v=4"
          sx={{ height: "auto", width: "100%" }}
        />
      </Box>
      <Box
        sx={{
          position: "sticky",
          py: 3,
          top: 0,
          width: "100%",
        }}
      >
        <Heading as="h1" sx={{ lineHeight: 1 }}>
          <Text
            as="span"
            sx={{
              display: "block",
              fontSize: 26,
              lineHeight: 1.25,
              overflow: "hidden",
            }}
          >
            {name}
          </Text>
          <Text
            as="span"
            sx={{
              color: "fg.muted",
              display: "block",
              fontSize: 20,
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "24px",
            }}
          >
            {username}
          </Text>
        </Heading>
      </Box>
    </Box>
  );
}

function TabPanel({ selectedTabName }) {
  if (selectedTabName === "repositories") {
    return <RepositoryListContainer />;
  }

  if (selectedTabName === "stars") {
    return (
      <Box sx={{ position: "relative" }}>
        <Box sx={{ mt: 4 }}>Coming soon!</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ mt: 4 }}>
        <Heading sx={{ fontSize: 16, fontWeight: 400, mb: 2 }}>
          Popular repositories
        </Heading>
        <Popular />
      </Box>
    </Box>
  );
}

function Popular() {
  const { login } = useParams();

  const { data, error, loading } = useQuery(QUERY_USER_POPULAR_REPOSITORIES, {
    variables: {
      login,
      orderBy: {
        direction: "DESC",
        field: "CREATED_AT",
      },
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data!</div>;
  }

  const { edges } = data.user.repositories;

  return (
    <Box
      as="ol"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        listStyle: "none",
        mb: 4,
        mx: -2,
      }}
    >
      {edges.map((r) => (
        <PopularRepositoryListItem key={r.node.id} repository={r.node} />
      ))}
    </Box>
  );
}

function PopularRepositoryListItem({ repository }) {
  const { login } = useParams();

  return (
    <Box
      as="li"
      sx={{
        alignContent: "stretch",
        display: "flex",
        mb: 3,
        px: 2,
        width: ["100%", null, "49.99999998%", "49.99999998"],
      }}
    >
      <Box
        sx={{
          backgroundColor: "canvas.default",
          borderColor: "border.default",
          borderRadius: 6,
          borderStyle: "solid",
          borderWidth: 1,
          display: "flex",
          padding: 3,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              position: "relative",
              width: "100%",
            }}
          >
            <Link
              href={"/" + login + "/" + repository.name}
              sx={{
                backgroundColor: "transparent",
                color: "accent.fg",
                flex: "auto",
                fontWeight: 600,
                minWidth: 0,
                textDecoration: "none",
              }}
            >
              <Text title={repository.name}>{repository.name}</Text>
            </Link>
            <Label outline sx={{ ml: 1, verticalAlign: "middle" }}>
              {repository.visibility
                .slice(0, 1)
                .concat(repository.visibility.slice(1).toLowerCase())}
            </Label>
          </Box>
          <Text
            as="p"
            sx={{
              color: "fg.muted",
              display: "block",
              flex: "1 0 auto",
              fontSize: 12,
              mb: 3,
              mt: 2,
            }}
          >
            {repository.description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function RepositoryListContainer() {
  const { login } = useParams();

  const { data, error, loading } = useQuery(QUERY_USER_REPOSITORIES, {
    variables: {
      login,
      orderBy: {
        direction: "DESC",
        field: "UPDATED_AT",
      },
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data!</div>;
  }

  const { edges } = data.user.repositories;

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          borderColor: "border.muted",
          borderBottomColor: "border.default",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          py: 3,
        }}
      >
        <ButtonPrimary
          as="a"
          href="/new"
          sx={{
            alignItems: "center",
            display: ["flex", null, "none"],
            justifyContent: "center",
            mb: 4,
            width: "100%",
          }}
        >
          <StyledOcticon icon={RepoIcon} size={16} />
          New
        </ButtonPrimary>
        <Box sx={{ alignItems: "flex-start", display: "flex" }}>
          <form
            acceptCharset="UTF-8"
            method="get"
            role="search"
            style={{ width: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                flex: "auto",
                flexDirection: ["column", null, null, "row"],
              }}
            >
              <Box sx={{ flex: "auto", mb: [1, null, 0], mr: [null, null, 3] }}>
                <TextInput
                  autoComplete="off"
                  placeholder="Find a repository..."
                  sx={{ width: "100%" }}
                  type="search"
                />
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <Box
                  sx={{ mr: 1, mt: [1, null, null, 0], position: "relative" }}
                >
                  <SelectMenu>
                    <Button as="summary">
                      <Text>Type</Text>
                      <Text
                        sx={{
                          borderStyle: "solid",
                          borderBottomColor: "transparent",
                          borderBottomWidth: 0,
                          borderLeftColor: "transparent",
                          borderLeftWidth: 4,
                          borderRightColor: "transparent",
                          borderRightWidth: 4,
                          borderTopWidth: 4,
                          content: "",
                          display: "inline-block",
                          height: 0,
                          ml: 1,
                          opacity: 0.8,
                          verticalAlign: "middle",
                          width: 0,
                        }}
                      />
                    </Button>
                    <SelectMenu.Modal align="right">
                      <SelectMenu.Header>Select type</SelectMenu.Header>
                      <SelectMenu.List>
                        <SelectMenu.Item>All</SelectMenu.Item>
                        <SelectMenu.Item>Public</SelectMenu.Item>
                        <SelectMenu.Item>Private</SelectMenu.Item>
                      </SelectMenu.List>
                    </SelectMenu.Modal>
                  </SelectMenu>
                </Box>
                <Box sx={{ position: "relative" }}>
                  <SelectMenu>
                    <Button as="summary" size="small">
                      <Text>Sort</Text>
                      <Text
                        sx={{
                          borderStyle: "solid",
                          borderBottomColor: "transparent",
                          borderBottomWidth: 0,
                          borderLeftColor: "transparent",
                          borderLeftWidth: 4,
                          borderRightColor: "transparent",
                          borderRightWidth: 4,
                          borderTopWidth: 4,
                          content: "",
                          display: "inline-block",
                          height: 0,
                          ml: 1,
                          opacity: 0.8,
                          verticalAlign: "middle",
                          width: 0,
                        }}
                      />
                    </Button>
                    <SelectMenu.Modal align="right">
                      <SelectMenu.Header>Select order</SelectMenu.Header>
                      <SelectMenu.List>
                        <SelectMenu.Item>Last updated</SelectMenu.Item>
                        <SelectMenu.Item>Name</SelectMenu.Item>
                        <SelectMenu.Item>Stars</SelectMenu.Item>
                      </SelectMenu.List>
                    </SelectMenu.Modal>
                  </SelectMenu>
                </Box>
              </Box>
            </Box>
          </form>
          <Box
            sx={{
              alignItems: [null, null, "center"],
              display: ["none", null, "flex"],
              justifyContent: [null, null, "flex-end"],
            }}
          >
            <ButtonPrimary
              as="a"
              href="/new"
              sx={{ ml: 3, textAlign: "center" }}
            >
              <StyledOcticon icon={RepoIcon} size={16} />
              New
            </ButtonPrimary>
          </Box>
        </Box>
      </Box>
      <Box>
        <RepositoryList list={edges} />
      </Box>
    </Box>
  );
}

function RepositoryList({ list }) {
  return (
    <Box as="ul">
      {list.map((r) => (
        <RepositoryListItem key={r.node.id} repository={r.node} />
      ))}
    </Box>
  );
}

function RepositoryListItem({ repository }) {
  const { login } = useParams();

  return (
    <Box
      as="li"
      sx={{
        borderColor: "border.muted",
        borderBottomColor: "border.default",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        display: "flex",
        py: 4,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "inline-block",
          width: ["83.33333333%", null, null, "74.99999997%"],
        }}
      >
        <Box sx={{ display: "inline-block", mb: 1 }}>
          <Heading as="h3" sx={{ fontSize: 20, wordBreak: "break-all" }}>
            <Link href={"/" + login + "/" + repository.name}>
              {repository.name}
            </Link>
            <Label outline sx={{ mb: 1, ml: 1, verticalAlign: "middle" }}>
              {repository.visibility
                .slice(0, 1)
                .concat(repository.visibility.slice(1).toLowerCase())}
            </Label>
          </Heading>
        </Box>
        <Box>
          <Text
            as="p"
            sx={{
              color: "fg.muted",
              display: "inline-block",
              mb: 2,
              pr: 4,
              width: "74.99999997%",
            }}
          >
            {repository.description}
          </Text>
        </Box>
        <Box sx={{ color: "fg.muted", fontSize: "12px", mt: 2 }}>
          <Text>Updated </Text>
          <time
            dateTime={repository.updatedAt}
            title={new Date(repository.updatedAt).toString()}
          >
            {formatDistance(new Date(repository.updatedAt), new Date(), {
              addSuffix: true,
            })}
          </time>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: ["16.66666666%", null, null, "24.99999999%"],
        }}
      >
        <Box sx={{ textAlign: "right" }}>{/* Coming soon */}</Box>
      </Box>
    </Box>
  );
}
