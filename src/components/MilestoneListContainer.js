import {
  QUERY_COUNT_MILESTONES_BY_STATE,
  QUERY_REPOSITORY_MILESTONES,
} from "../datasource/queries";
import { Blankslate } from "./Blankslate";
import { MilestoneList } from "./MilestoneList";
import { RepoSubNav } from "./RepoSubNav";
import { useQuery } from "@apollo/client";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MilestoneIcon,
} from "@primer/octicons-react";
import {
  Box,
  ButtonPrimary,
  ButtonTableList,
  Link,
  SelectMenu,
  StyledOcticon,
  Text,
} from "@primer/react";
import * as React from "react";
import { useParams } from "react-router-dom";

export function MilestoneListContainer({ after, before, filter }) {
  const { state } = filter;
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_REPOSITORY_MILESTONES, {
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

  const { edges, pageInfo } = data.repository.milestones;

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
      <Box
        sx={{
          backgroundColor: "canvas.default",
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
        <MilestoneList milestones={edges} />
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
                    "/" +
                    login +
                    "/" +
                    repositoryName +
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

function ConditionalBlankslate() {
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_COUNT_MILESTONES_BY_STATE, {
    variables: {
      name: repositoryName,
      owner: login,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { totalCount: countClosed } = data.repository.closed;
  const { totalCount: countOpen } = data.repository.open;

  return countClosed === 0 && countOpen === 0 ? (
    <Blankslate
      icon={MilestoneIcon}
      title="You haven’t created any Milestones."
    >
      Use Milestones to create collections of Issues for a particular or
      project. Click on the "New milestone" button above to create one.
    </Blankslate>
  ) : (
    <Blankslate icon={MilestoneIcon} title="We couldn’t find anything!">
      There aren’t any milestones that match. Give it another shot above.
    </Blankslate>
  );
}

function CountByStateNav({ state }) {
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_COUNT_MILESTONES_BY_STATE, {
    variables: {
      name: repositoryName,
      owner: login,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { totalCount: countClosed } = data.repository.closed;
  const { totalCount: countOpen } = data.repository.open;

  return (
    <Box>
      <Link
        href={"/" + login + "/" + repositoryName + "/milestones?state=open"}
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
        href={"/" + login + "/" + repositoryName + "/milestones?state=closed"}
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
