import { AppBar } from "../components/AppBar";
import { Blankslate } from "../components/Blankslate";
import {
  QUERY_COUNT_VIEWER_ISSUES_BY_STATES,
  QUERY_VIEWER_ISSUES,
} from "../datasource/queries";
import { useQueryParams } from "../hooks";
import { useQuery } from "@apollo/client";
import {
  Avatar,
  AvatarStack,
  Box,
  ButtonTableList,
  Heading,
  Label,
  LabelGroup,
  Link,
  SelectMenu,
  StyledOcticon,
  SubNav,
  Text,
  TextInput,
  Tooltip,
} from "@primer/components";
import {
  CheckIcon,
  CommentIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  MilestoneIcon,
  SearchIcon,
} from "@primer/octicons-react";
import { formatDistance } from "date-fns";
import { useParams } from "react-router-dom";

export function IssueIndexPage() {
  const { data, error, loading } = useQuery(
    QUERY_COUNT_VIEWER_ISSUES_BY_STATES
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { totalCount: countClosed } = data.viewer.closed;
  const { totalCount: countOpen } = data.viewer.open;

  return (
    <>
      <AppBar />
      <Box className="main">
        <Box as="main">
          <Box
            sx={{
              maxWidth: 1012,
              mx: "auto",
              position: "relative",
              pt: 4,
              px: [3, 40, null, 3],
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: ["column", null, "row"],
                mb: 3,
              }}
            >
              <SubNav>
                <SubNav.Links>
                  <SubNav.Link href="/" selected>
                    Created
                  </SubNav.Link>
                  <SubNav.Link href="/">Assigned</SubNav.Link>
                  <SubNav.Link href="/">Mentioned</SubNav.Link>
                </SubNav.Links>
              </SubNav>
              <Box sx={{ flex: "auto", minWidth: 0 }}>
                <Box
                  sx={{
                    position: "relative",
                    ml: ["12px", null, 3],
                    mt: [3, null, 0],
                  }}
                >
                  <TextInput
                    contrast
                    icon={SearchIcon}
                    placeholder="Search all issues"
                    sx={{ width: "100%" }}
                  />
                </Box>
              </Box>
            </Box>
            {countClosed > 0 || countOpen > 0 ? (
              <IssueListPaginated />
            ) : (
              <Blankslate icon={IssueOpenedIcon} title="Welcome to Issues!">
                Issues are used to track todos, bugs, feature requests, and
                more.
              </Blankslate>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

function CountByStateNav() {
  const queryParams = useQueryParams();

  const q = queryParams.get("q");

  const state = q;

  const { data, error, loading } = useQuery(
    QUERY_COUNT_VIEWER_ISSUES_BY_STATES
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { totalCount: countClosed } = data.viewer.closed;
  const { totalCount: countOpen } = data.viewer.open;

  return (
    <Box flex="auto">
      <Link
        href="/issues?q=is%3Aopen"
        sx={{
          color: !state || state === "is:open" ? "fg.default" : "fg.muted",
          fontWeight: !state || state === "is:open" ? 600 : 400,
          ":hover": {
            color: "fg.default",
            textDecoration: "none",
          },
        }}
      >
        <span>
          <StyledOcticon icon={IssueOpenedIcon} mr="4px" /> {countOpen} Open
        </span>
      </Link>
      <Link
        href="/issues?q=is%3Aclosed"
        sx={{
          color: state === "is:closed" ? "fg.default" : "fg.muted",
          fontWeight: state === "is:closed" ? 600 : 400,
          ml: "10px",
          ":hover": {
            color: "fg.default",
            textDecoration: "none",
          },
        }}
      >
        <span>
          <StyledOcticon icon={CheckIcon} mr="4px" /> {countClosed} Closed
        </span>
      </Link>
    </Box>
  );
}

function IssueListPaginated() {
  const queryParams = useQueryParams();

  const q = queryParams.get("q");

  const state = q;

  const { data, error, loading } = useQuery(QUERY_VIEWER_ISSUES, {
    variables: {
      states: state === "is:closed" ? "CLOSED" : "OPEN",
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { edges } = data.viewer.issues;

  console.log(edges);

  return (
    <Box
      sx={{
        backgroundColor: "canvas.default",
        borderColor: ["border.default", "border.default"],
        borderRadius: [6, 6],
        borderStyle: ["solid", "solid"],
        borderWidth: ["1px", "1px"],
        mx: [15, 0],
      }}
    >
      <Box
        className="Box-header"
        sx={{
          backgroundColor: "canvas.subtle",
          borderColor: "border.default",
          borderStyle: "solid",
          borderWidth: "1px",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          display: "flex",
          justifyContent: "space-between",
          mt: "-1px",
          mx: "-1px",
          p: 3,
        }}
      >
        <Box display="flex" flex="auto" minWidth="0">
          <CountByStateNav state={state} />
          <Box
            display="flex"
            flex="auto"
            justifyContent={["flex-start", "space-between", "flex-end"]}
          >
            <Box display="inline-block" position="relative">
              <SelectMenu display="inline-block" px={3}>
                <ButtonTableList>Visibility</ButtonTableList>
                <SelectMenu.Modal align="right">
                  <SelectMenu.Header>Repository visibility</SelectMenu.Header>
                  <SelectMenu.List>
                    <SelectMenu.Item>Private repositories only</SelectMenu.Item>
                    <SelectMenu.Item>Public repositories only</SelectMenu.Item>
                  </SelectMenu.List>
                </SelectMenu.Modal>
              </SelectMenu>
            </Box>
            <Box display="inline-block" position="relative">
              <SelectMenu display="inline-block" px={3}>
                <ButtonTableList>Organization</ButtonTableList>
                <SelectMenu.Modal align="right">
                  <SelectMenu.Header>Filter by owner</SelectMenu.Header>
                  <SelectMenu.Filter
                    onChange={(e) => e.preventDefault()}
                    placeholder="Filter owners"
                    value=""
                  ></SelectMenu.Filter>
                  <SelectMenu.List>
                    <SelectMenu.Item>Owner name</SelectMenu.Item>
                  </SelectMenu.List>
                </SelectMenu.Modal>
              </SelectMenu>
            </Box>
            <Box display="inline-block" position="relative">
              <SelectMenu pl={3} pr="0">
                <ButtonTableList>Sort</ButtonTableList>
                <SelectMenu.Modal align="right">
                  <SelectMenu.Header>Sort by</SelectMenu.Header>
                  <SelectMenu.List>
                    <SelectMenu.Item>Newest</SelectMenu.Item>
                    <SelectMenu.Item>Oldest</SelectMenu.Item>
                    <SelectMenu.Item>Most commented</SelectMenu.Item>
                    <SelectMenu.Item>Least commented</SelectMenu.Item>
                    <SelectMenu.Item>Recently updated</SelectMenu.Item>
                    <SelectMenu.Item>Least recently updated</SelectMenu.Item>
                  </SelectMenu.List>
                </SelectMenu.Modal>
              </SelectMenu>
            </Box>
          </Box>
        </Box>
      </Box>
      <IssueList issues={edges} />
    </Box>
  );
}

function IssueList({ issues }) {
  const { login, repositoryName } = useParams();

  return issues.length > 0 ? (
    <Box className="list">
      {issues.map((issue) => (
        <IssueListItem
          key={issue.node.id}
          issue={issue.node}
          repositoryBaseUrl={"/" + login + "/" + repositoryName}
        />
      ))}
    </Box>
  ) : (
    <Box
      className="blankslate"
      sx={{
        px: 40,
        py: 80,
        position: "relative",
        textAlign: "center",
      }}
    >
      <StyledOcticon
        icon={IssueOpenedIcon}
        size={24}
        sx={{ color: "fg.muted", mb: 2, mx: 1 }}
      />
      <Heading
        as="h3"
        sx={{ color: "fg.default", fontSize: "24px", mb: 1, mt: 3, mx: 0 }}
      >
        No results matched your search.
      </Heading>
      <Text as="p" sx={{ fontSize: "16px", mb: "10px", mt: 0 }}>
        Refine your search query and try again.
      </Text>
    </Box>
  );
}

function IssueListItem({ issue }) {
  return (
    <Box
      sx={{
        borderTopColor: "border.muted",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        display: "flex",
        position: "relative",
        ":first-of-type": { borderTopColor: "transparent" },
      }}
    >
      <Box flexShrink={0} pl={3} pt={2}>
        <Tooltip
          aria-label={(issue.closed ? "Closed" : "Open") + " issue"}
          direction="e"
        >
          <StyledOcticon
            icon={issue.closed ? IssueClosedIcon : IssueOpenedIcon}
            sx={{ color: issue.closed ? "done.fg" : "success.fg" }}
          />
        </Tooltip>
      </Box>
      <Box flex="auto" minWidth="0" p={2} pr={[1, 2, 2]}>
        <Link
          href={`/${issue.repository.nameWithOwner}`}
          sx={{
            color: "fg.muted",
            fontSize: 16,
            fontWeight: 600,
            pr: 1,
            verticalAlign: "middle",
            ":hover": { color: "accent.fg", textDecoration: "none" },
          }}
        >
          {issue.repository.nameWithOwner}
        </Link>
        <Link
          className="h4 v-align-middle"
          href={`/${issue.repository.nameWithOwner}/issues/${issue.number}`}
          sx={{
            color: "fg.default",
            ":hover": { color: "accent.fg", textDecoration: "none" },
          }}
        >
          {issue.title}
        </Link>
        {issue.labels && (
          <LabelGroup>
            {issue.labels.map((label) => (
              <Label
                key={label.id}
                sx={{
                  bg: "prState.closed.bg",
                  color: "prState.closed.text",
                  ml: 1,
                }}
              >
                {label.name}
              </Label>
            ))}
          </LabelGroup>
        )}
        <Box
          className="text-small"
          sx={{ display: "flex", mt: 1, color: "fg.muted" }}
        >
          {issue.closed ? (
            <span className="closed-at">
              #{issue.number} by{" "}
              <Link
                href="/issues?q=author%Athomascastle"
                sx={{
                  color: "inherit",
                  ":hover": {
                    color: "accent.fg",
                    textDecoration: "none",
                  },
                }}
              >
                {issue.createdBy.login}
              </Link>{" "}
              was closed{" "}
              <time
                dateTime={issue.closedAt}
                title={new Date(issue.closedAt).toString()}
              >
                {formatDistance(new Date(issue.closedAt), new Date(), {
                  addSuffix: true,
                })}
              </time>
            </span>
          ) : (
            <span className="opened-by">
              #{issue.number} opened{" "}
              <time
                dateTime={issue.createdAt}
                title={new Date(issue.createdAt).toString()}
              >
                {formatDistance(new Date(issue.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </time>{" "}
              by{" "}
              <Link
                href="/issues?q=author%Athomascastle"
                sx={{
                  color: "inherit",
                  ":hover": {
                    color: "accent.fg",
                    textDecoration: "none",
                  },
                }}
              >
                {issue.createdBy.login}
              </Link>
            </span>
          )}
          {issue.milestone && (
            <Text
              className="issue-milestone"
              sx={{ display: ["none", null, "inline"], maxWidth: 240, ml: 2 }}
            >
              <Link
                href={"/milestones/" + issue.milestone.number}
                sx={{
                  color: "fg.muted",
                  ":hover": {
                    color: "accent.fg",
                    textDecoration: "none",
                  },
                }}
              >
                <StyledOcticon icon={MilestoneIcon} />{" "}
                <span className="truncate-target">{issue.milestone.title}</span>
              </Link>
            </Text>
          )}
        </Box>
      </Box>
      <Box
        display={["none", "flex"]}
        flexShrink={0}
        pr={3}
        pt={2}
        textAlign="right"
        width="25%"
      >
        <Box sx={{ flex: 1, flexShrink: 0, ml: 2 }}></Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexShrink: 0,
            justifyContent: "flex-end",
            ml: 2,
          }}
        >
          {issue.assignees && (
            <AvatarStack>
              {issue.assignees.map((assignee) => (
                <Avatar
                  alt="thomascastle"
                  key={assignee.id}
                  src="https://avatars.githubusercontent.com/github"
                  sx={{ mt: 1 }}
                />
              ))}
            </AvatarStack>
          )}
        </Box>
        <Box sx={{ flex: 1, flexShrink: 0, ml: 2 }}>
          <Link sx={{ color: "fg.muted" }}>
            <StyledOcticon icon={CommentIcon} verticalAlign="middle" />{" "}
            <Text as="span" sx={{ fontSize: "12px", fontWeight: 600 }}>
              1
            </Text>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
