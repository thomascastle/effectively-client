import {
  QUERY_COUNT_ISSUES_BY_STATES,
  QUERY_REPOSITORY_ISSUES,
} from "../datasource/queries";
import { useQueryParams } from "../hooks";
import { IssueList } from "./IssueList";
import { useQuery } from "@apollo/client";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  IssueOpenedIcon,
} from "@primer/octicons-react";
import {
  Box,
  ButtonTableList,
  Link,
  SelectMenu,
  StyledOcticon,
  Text,
} from "@primer/react";
import { useParams } from "react-router-dom";

export function IssueListPaginated({ after, before, filters }) {
  const { labelName, state } = filters;
  const { login, repositoryName } = useParams();
  const { data, loading, error } = useQuery(QUERY_REPOSITORY_ISSUES, {
    variables: {
      after: after,
      before: before,
      labels: labelName && labelName.length > 0 ? [...labelName] : null,
      name: repositoryName,
      owner: login,
      states: getStates(state),
    },
  });
  const queryParams = useQueryParams().get("q");

  const q = queryParams ? queryParams : "";

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { nodes, pageInfo } = data.repository.issues;

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
            <CountByStateNav labelName={labelName} state={getStates(state)} />
            <Box
              display="flex"
              flex="auto"
              justifyContent={["flex-start", "space-between", "flex-end"]}
            >
              <Box display="inline-block" position="relative">
                <SelectMenu display="inline-block" px={3}>
                  <ButtonTableList>Author</ButtonTableList>
                  <SelectMenu.Modal align="right">
                    <SelectMenu.Header>Filter by author</SelectMenu.Header>
                    <SelectMenu.Filter
                      onChange={(e) => e.preventDefault()}
                      placeholder="Filter users"
                      value=""
                    ></SelectMenu.Filter>
                    <SelectMenu.List></SelectMenu.List>
                  </SelectMenu.Modal>
                </SelectMenu>
              </Box>
              <Box display="inline-block" position="relative">
                <SelectMenu display="inline-block" px={3}>
                  <ButtonTableList>Label</ButtonTableList>
                  <SelectMenu.Modal align="right">
                    <SelectMenu.Header>Filter by label</SelectMenu.Header>
                    <SelectMenu.Filter
                      onChange={(e) => e.preventDefault()}
                      placeholder="Filter labels"
                      value=""
                    ></SelectMenu.Filter>
                    <SelectMenu.List>
                      <SelectMenu.Item>Unlabeled</SelectMenu.Item>
                    </SelectMenu.List>
                    <SelectMenu.Footer>Use to exclude labels</SelectMenu.Footer>
                  </SelectMenu.Modal>
                </SelectMenu>
              </Box>
              <Box display="inline-block" position="relative">
                <SelectMenu display="inline-block" px={3}>
                  <ButtonTableList>Projects</ButtonTableList>
                  <SelectMenu.Modal align="right">
                    <SelectMenu.Header>Filter by project</SelectMenu.Header>
                    <SelectMenu.Filter
                      onChange={(e) => e.preventDefault()}
                      placeholder="Filter projects"
                      value=""
                    ></SelectMenu.Filter>
                  </SelectMenu.Modal>
                </SelectMenu>
              </Box>
              <Box display="inline-block" position="relative">
                <SelectMenu display="inline-block" px={3}>
                  <ButtonTableList>Milestones</ButtonTableList>
                  <SelectMenu.Modal align="right">
                    <SelectMenu.Header>Filter by milestone</SelectMenu.Header>
                    <SelectMenu.Filter
                      onChange={(e) => e.preventDefault()}
                      placeholder="Filter milestones"
                      value=""
                    ></SelectMenu.Filter>
                    <SelectMenu.List>
                      <SelectMenu.Item>Issues wit no milestone</SelectMenu.Item>
                    </SelectMenu.List>
                  </SelectMenu.Modal>
                </SelectMenu>
              </Box>
              <Box display="inline-block" position="relative">
                <SelectMenu display="inline-block" px={3}>
                  <ButtonTableList>Assignee</ButtonTableList>
                  <SelectMenu.Modal align="right">
                    <SelectMenu.Header>
                      Filter by who's assigned
                    </SelectMenu.Header>
                    <SelectMenu.Filter
                      onChange={(e) => e.preventDefault()}
                      placeholder="Filter users"
                      value=""
                    ></SelectMenu.Filter>
                    <SelectMenu.List>
                      <SelectMenu.Item>Assigned to nobody</SelectMenu.Item>
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
        <IssueList issues={nodes} />
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

function CountByStateNav({ labelName, state }) {
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_COUNT_ISSUES_BY_STATES, {
    variables: {
      labels: labelName && labelName.length > 0 ? [...labelName] : null,
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
    <Box flex="auto">
      <Link
        href={"/" + login + "/" + repositoryName + "/issues?q=is%3Aopen"}
        sx={{
          color: !state || state.includes("OPEN") ? "fg.default" : "fg.muted",
          fontWeight: !state || state.includes("OPEN") ? 600 : 400,
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
        href={"/" + login + "/" + repositoryName + "/issues?q=is%3Aclosed"}
        sx={{
          color: state.includes("CLOSED") ? "fg.default" : "fg.muted",
          fontWeight: state.includes("CLOSED") ? 600 : 400,
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

function getStates(state) {
  if (!state) {
    return ["OPEN"];
  }

  let states = [];

  if (state && state.length > 0) {
    for (let i = 0; i < state.length; i++) {
      if (state[i].toLowerCase() === "closed") {
        states = [...states, "CLOSED"];
      }

      if (state[i].toLowerCase() === "open") {
        states = [...states, "OPEN"];
      }
    }
  }

  return states;
}

function shouldDisplay(hasNextPage, hasPreviousPage) {
  return hasNextPage || hasPreviousPage;
}
