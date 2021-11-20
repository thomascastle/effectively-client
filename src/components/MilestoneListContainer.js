import { Blankslate } from "./Blankslate";
import { MilestoneList } from "./MilestoneList";
import { RepoSubNav } from "./RepoSubNav";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  ButtonPrimary,
  ButtonTableList,
  Link,
  SelectMenu,
  SubNav,
  StyledOcticon,
  Text,
} from "@primer/components";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MilestoneIcon,
  TagIcon,
} from "@primer/octicons-react";
import * as React from "react";
import { useParams } from "react-router-dom";

export const MILESTONES_COUNT_BY_STATE_QUERY = gql`
  query GetMilestonesCountByState {
    closed: milestones(states: CLOSED) {
      totalCount
    }
    open: milestones(states: OPEN) {
      totalCount
    }
  }
`;

export const QUERY_PAGINATED_MILESTONES = gql`
  query GetPaginatedMilestones(
    $after: String
    $before: String
    $milestonesStates: [MilestoneState!]
    $name: String!
    $owner: String!
  ) {
    repository(name: $name, owner: $owner) {
      id
      milestones(after: $after, before: $before, states: $milestonesStates) {
        nodes {
          closed
          closedAt
          createdAt
          description
          dueOn
          id
          number
          title
          updatedAt
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  }
`;

export function MilestoneListContainer({ after, before, filter }) {
  const { state } = filter;
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_PAGINATED_MILESTONES, {
    variables: {
      after: after,
      before: before,
      milestonesStates: state ? state.toUpperCase() : "OPEN",
      name: repositoryName,
      owner: login,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <div>{error.message}</div>
        <div>Refine your search query parameters</div>
      </div>
    );
  }

  const { nodes, pageInfo } = data.repository.milestones;

  return (
    <Box className="list-container">
      <Box
        sx={{
          display: "flex",
          flexDirection: ["column", "column", "row"],
          mb: "20px",
        }}
      >
        <RepoSubNav />
        <Box
          sx={{
            display: ["none", "none", "block"],
            ml: "auto",
            position: "relative",
          }}
        >
          <ButtonPrimary
            as="a"
            href={"/" + login + "/" + repositoryName + "/milestones/new"}
          >
            New milestone
          </ButtonPrimary>
        </Box>
      </Box>
      {nodes.length < 1 && (
        <Blankslate
          icon={MilestoneIcon}
          title="You haven’t created any Milestones."
        >
          Use Milestones to create collections of Issues for a particular or
          project. Click on the "New milestone" button above to create one.
        </Blankslate>
      )}
      {nodes.length > 0 && (
        <Box
          sx={{
            backgroundColor: "canvas.default",
            borderColor: "border.default",
            borderRadius: 6,
            borderStyle: "solid",
            borderWidth: "1px",
          }}
        >
          <Box
            className="Box-header"
            sx={{
              backgroundColor: "canvas.subtle",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              padding: 16,
            }}
          >
            <CountByStateNav state={state} />
            <SelectMenu sx={{ display: "inline-block", position: "relative" }}>
              <ButtonTableList>Sort</ButtonTableList>
              <SelectMenu.Modal align="right">
                <SelectMenu.Header>Sort</SelectMenu.Header>
                <SelectMenu.List>
                  <SelectMenu.Item>Recently updated</SelectMenu.Item>
                  <SelectMenu.Item>Furthest due date</SelectMenu.Item>
                  <SelectMenu.Item>Closest due date</SelectMenu.Item>
                  <SelectMenu.Item>Lease complete</SelectMenu.Item>
                  <SelectMenu.Item>Most complete</SelectMenu.Item>
                  <SelectMenu.Item>Alphabetically</SelectMenu.Item>
                  <SelectMenu.Item>Reverse alphabetically</SelectMenu.Item>
                  <SelectMenu.Item>Most issues</SelectMenu.Item>
                  <SelectMenu.Item>Least issues</SelectMenu.Item>
                </SelectMenu.List>
              </SelectMenu.Modal>
            </SelectMenu>
          </Box>
          <Box className="list" sx={{ color: "text.tertiary" }}>
            <MilestoneList milestones={nodes} />
          </Box>
        </Box>
      )}
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
                    "/milestones?before=" +
                    pageInfo.startCursor +
                    "&state=" +
                    (state ?? "")
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
                    "/milestones?after=" +
                    pageInfo.endCursor +
                    "&state=" +
                    (state ?? "")
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
  const { data, error, loading } = useQuery(MILESTONES_COUNT_BY_STATE_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { totalCount: countClosed } = data.closed;
  const { totalCount: countOpen } = data.open;

  return (
    <Box>
      <Link
        href="/milestones?state=open"
        sx={{
          color: !state || state === "open" ? "fg.default" : "fg.muted",
          fontWeight: !state || state === "open" ? 600 : 400,
          ":hover": {
            color: "fg.default",
            textDecoration: "none",
          },
        }}
      >
        <span>
          <StyledOcticon icon={MilestoneIcon} /> {countOpen} Open
        </span>
      </Link>
      <Link
        href="/milestones?state=closed"
        sx={{
          color: state === "closed" ? "fg.default" : "fg.muted",
          fontWeight: state === "closed" ? 600 : 400,
          ml: "10px",
          ":hover": {
            color: "fg.default",
            textDecoration: "none",
          },
        }}
      >
        <span>
          <StyledOcticon icon={CheckIcon} /> {countClosed} Closed
        </span>
      </Link>
    </Box>
  );
}

function shouldDisplay(hasNextPage, hasPreviousPage) {
  return hasNextPage || hasPreviousPage;
}
