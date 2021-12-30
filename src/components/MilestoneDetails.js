import { QUERY_COUNT_MILESTONE_ISSUES_BY_STATES } from "../datasource/queries";
import { useQueryParams } from "../hooks";
import { useQuery } from "@apollo/client";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
} from "@primer/octicons-react";
import {
  Box,
  Heading,
  IssueLabelToken,
  LabelGroup,
  Link,
  ProgressBar,
  StyledOcticon,
  Text,
  Tooltip,
} from "@primer/react";
import { format, formatDistance } from "date-fns";
import { useParams } from "react-router-dom";

export function MilestoneDetails({ milestone }) {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Heading
          sx={{
            fontWeight: 400,
            fontSize: ["26px", null, "32px"],
            mb: 2,
            mt: 0,
          }}
        >
          {milestone.title}
        </Heading>
        <Box sx={{ width: "75%" }}>
          <ProgressBar
            barSize="large"
            progress={milestone.progressPercentage}
            sx={{ mb: 2, mt: 1, width: "420px" }}
          />
          <Text as="span" sx={{ color: "fg.default", mr: 3 }}>
            {milestone.closed ? (
              <Text sx={{ color: "fg.default", mr: 3 }}>
                <strong>Closed </strong>
                <time
                  dateTime={milestone.closedAt}
                  title={new Date(milestone.closedAt).toString()}
                >
                  {formatDistance(new Date(milestone.closedAt), new Date(), {
                    addSuffix: true,
                  })}
                </time>
              </Text>
            ) : milestone.dueOn ? (
              <Text sx={{ color: "fg.default", mr: 3 }}>
                <StyledOcticon icon={CalendarIcon} /> Due by{" "}
                {format(new Date(milestone.dueOn), "MMMM dd, yyyy")}
              </Text>
            ) : (
              <Text sx={{ color: "fg.default", mr: 3 }}>No due date</Text>
            )}
          </Text>
          <Text as="span" sx={{ color: "fg.default" }}>
            <strong>{Math.round(milestone.progressPercentage)}%</strong>{" "}
            complete
          </Text>
          <Box sx={{ color: "fg.muted", mt: "5px" }}>
            <Text>{milestone.description}</Text>
          </Box>
        </Box>
      </Box>
      <IssueListPaginated
        issues={milestone.issues.edges}
        pageInfo={milestone.issues.pageInfo}
      />
    </Box>
  );
}

function IssueListPaginated({ issues, pageInfo }) {
  const { login, repositoryName } = useParams();
  const queryParams = useQueryParams().get("q");
  const state = useQueryParams().get("closed");

  const q = queryParams ? queryParams : "";

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "canvas.default",
          borderColor: ["border.default", "border.default"],
          borderRadius: [6, 6],
          borderStyle: ["solid", "solid"],
          borderWidth: ["1px", "1px"],
          mt: 3,
          mx: [null, 0],
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
          <Box mr={3}>
            <input type="checkbox" />
          </Box>
          <Box display="flex" flex="auto" minWidth="0">
            <CountByStateNav state={state} />
          </Box>
        </Box>
        <IssueList issues={issues} />
      </Box>
      <Box className="pagination">
        {shouldDisplay(pageInfo.hasNextPage, pageInfo.hasPreviousPage) && (
          <Box sx={{ mb: 5, mt: 4, textAlign: "center" }}>
            <Box
              aria-label="Navigation"
              role="navigation"
              sx={{ display: "inline-block" }}
            >
              {pageInfo.hasPreviousPage ? (
                <Link
                  href={
                    "/" +
                    login +
                    "/" +
                    repositoryName +
                    "/issues?before=" +
                    pageInfo.startCursor +
                    "&q=" +
                    encodeURIComponent(q).replace(/\s|%20/g, "+")
                  }
                  rel="prev"
                  sx={{
                    border: "1px solid",
                    borderColor: "transparent",
                    borderRadius: "6px",
                    display: "inline-block",
                    fontStyle: "normal",
                    lineHeight: "20px",
                    minWidth: "32px",
                    padding: "5px 10px",
                    transition: "border-color .2s cubic-bezier(0.3, 0, 0.5, 1)",
                    verticalAlign: "middle",
                    ":hover": {
                      borderColor: "border.muted",
                      textDecoration: "none",
                    },
                  }}
                >
                  <StyledOcticon icon={ChevronLeftIcon} /> Previous
                </Link>
              ) : (
                <Text
                  sx={{
                    border: "1px solid",
                    borderColor: "transparent",
                    borderRadius: "6px",
                    color: "text.disabled",
                    cursor: "default",
                    display: "inline-block",
                    fontStyle: "normal",
                    lineHeight: "20px",
                    minWidth: "32px",
                    padding: "5px 10px",
                    verticalAlign: "middle",
                  }}
                >
                  <StyledOcticon icon={ChevronLeftIcon} /> Previous
                </Text>
              )}
              {pageInfo.hasNextPage ? (
                <Link
                  href={
                    "/" +
                    login +
                    "/" +
                    repositoryName +
                    "/issues?after=" +
                    pageInfo.endCursor +
                    "&q=" +
                    encodeURIComponent(q).replace(/\s|%20/g, "+")
                  }
                  rel="next"
                  sx={{
                    border: "1px solid",
                    borderColor: "transparent",
                    borderRadius: "6px",
                    display: "inline-block",
                    fontStyle: "normal",
                    lineHeight: "20px",
                    minWidth: "32px",
                    padding: "5px 10px",
                    transition: "border-color .2s cubic-bezier(0.3, 0, 0.5, 1)",
                    verticalAlign: "middle",
                    ":hover": {
                      borderColor: "border.muted",
                      textDecoration: "none",
                    },
                  }}
                >
                  Next <StyledOcticon icon={ChevronRightIcon} />
                </Link>
              ) : (
                <Text
                  sx={{
                    border: "1px solid",
                    borderColor: "transparent",
                    borderRadius: "6px",
                    color: "text.disabled",
                    cursor: "default",
                    display: "inline-block",
                    fontStyle: "normal",
                    lineHeight: "20px",
                    minWidth: "32px",
                    padding: "5px 10px",
                    verticalAlign: "middle",
                  }}
                >
                  Next <StyledOcticon icon={ChevronRightIcon} />
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function CountByStateNav({ state }) {
  const { login, number, repositoryName } = useParams();
  const { data, error, loading } = useQuery(
    QUERY_COUNT_MILESTONE_ISSUES_BY_STATES,
    {
      variables: {
        name: repositoryName,
        number: parseInt(number),
        owner: login,
      },
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { totalCount: countClosed } = data.repository.milestone.closedIssues;
  const { totalCount: countOpen } = data.repository.milestone.openIssues;

  return (
    <Box flex="auto">
      <Link
        href={"/" + login + "/" + repositoryName + "/milestones/" + number}
        sx={{
          color: !state || state !== "1" ? "fg.default" : "fg.muted",
          fontWeight: !state || state !== "1" ? 600 : 400,
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
        href={
          "/" +
          login +
          "/" +
          repositoryName +
          "/milestones/" +
          number +
          "?closed=1"
        }
        sx={{
          color: state === "1" ? "fg.default" : "fg.muted",
          fontWeight: state === "1" ? 600 : 400,
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

function shouldDisplay(hasNextPage, hasPreviousPage) {
  return hasNextPage || hasPreviousPage;
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

function IssueListItem({ issue, repositoryBaseUrl }) {
  const q = useQueryParams().get("q");

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
      <Box flexShrink={0} pl={3} py={2}>
        <input type="checkbox" />
      </Box>
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
          className="h4 v-align-middle"
          href={repositoryBaseUrl + "/issues/" + issue.number}
          sx={{
            color: "fg.default",
            mr: 1,
            ":hover": { color: "accent.fg", textDecoration: "none" },
          }}
        >
          {issue.title}
        </Link>
        {issue.labels && (
          <LabelGroup>
            {issue.labels.map((label) => (
              <IssueLabelToken
                as="a"
                fillColor={`#${label.color}`}
                href={
                  repositoryBaseUrl +
                  "/issues" +
                  "?" +
                  defaultQueryString(q) +
                  "+label%3A" +
                  label.name
                }
                key={label.id}
                text={label.name}
              />
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
                href={
                  repositoryBaseUrl +
                  "/issues?" +
                  defaultQueryString(q) +
                  "+author%3A" +
                  issue.createdBy.login
                }
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
                href={
                  repositoryBaseUrl +
                  "/issues?" +
                  defaultQueryString(q) +
                  "+author%3A" +
                  issue.createdBy.login
                }
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
        ></Box>
        <Box sx={{ flex: 1, flexShrink: 0, ml: 2 }}></Box>
      </Box>
    </Box>
  );
}

function defaultQueryString(q) {
  if (q === null || q === "") {
    return "q=is%3Aopen";
  }

  if (/is:closed/.test(q)) {
    return "q=is%3Aclosed";
  }

  return "q=is%3Aopen";
}
