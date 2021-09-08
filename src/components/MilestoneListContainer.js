import { MilestoneList } from "../components/MilestoneList";
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

export const MILESTONES_QUERY = gql`
  query GetMilestones(
    $after: String
    $before: String
    $milestonesStates: [MilestoneState!]
  ) {
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
`;

export function MilestoneListContainer({ after, before, filter }) {
  const { state } = filter;
  const { data, error, loading } = useQuery(MILESTONES_QUERY, {
    variables: {
      after: after,
      before: before,
      milestonesStates: state ? state.toUpperCase() : "OPEN",
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

  const { nodes, pageInfo } = data.milestones;

  return (
    <Box className="list-container">
      <Box
        sx={{
          display: "flex",
          flexDirection: ["column", "column", "row"],
          mb: "20px",
        }}
      >
        <SubNav>
          <SubNav.Links>
            <SubNav.Link href="/labels">
              <span>
                <StyledOcticon icon={TagIcon} /> Labels
              </span>
            </SubNav.Link>
            <SubNav.Link href="/milestones" selected>
              <span>
                <StyledOcticon icon={MilestoneIcon} /> Milestones
              </span>
            </SubNav.Link>
          </SubNav.Links>
        </SubNav>
        <Box
          sx={{
            display: ["none", "none", "block"],
            ml: "auto",
            position: "relative",
          }}
        >
          <Link href="/milestones/new">
            <ButtonPrimary>New Milestone</ButtonPrimary>
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          borderColor: "border.primary",
          borderRadius: 6,
          borderStyle: "solid",
          borderWidth: "1px",
        }}
      >
        <Box
          className="Box-header"
          sx={{
            backgroundColor: "bg.tertiary",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
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
                      borderColor: "border.secondary",
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
                      borderColor: "border.secondary",
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
          color: !state || state === "open" ? "text.primary" : "text.secondary",
          fontWeight: !state || state === "open" ? 600 : 400,
          ":hover": {
            color: "text.primary",
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
          color: state === "closed" ? "text.primary" : "text.secondary",
          fontWeight: state === "closed" ? 600 : 400,
          ml: "10px",
          ":hover": {
            color: "text.primary",
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
