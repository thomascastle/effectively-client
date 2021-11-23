import {
  QUERY_COUNT_ISSUES_BY_STATES,
  QUERY_COUNT_LABELS_AND_OPEN_MILESTONES,
} from "../datasource/queries";
import { Blankslate } from "./Blankslate";
import { IssueListPaginated } from "./IssueListPaginated";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  ButtonPrimary,
  CounterLabel,
  Dropdown,
  FilteredSearch,
  Link,
  StyledOcticon,
  SubNav,
  TextInput,
} from "@primer/components";
import {
  IssueOpenedIcon,
  MilestoneIcon,
  SearchIcon,
  TagIcon,
} from "@primer/octicons-react";
import { useParams } from "react-router-dom";

export const MILESTONES_OPEN_COUNT_QUERY = gql`
  query GetMilestonesOpenCount {
    milestones(states: OPEN) {
      totalCount
    }
  }
`;

export function IssueListContainer({
  after,
  before,
  filter,
  login,
  repositoryName,
}) {
  const { data, error, loading } = useQuery(QUERY_COUNT_ISSUES_BY_STATES, {
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
    <Box className="list-container">
      <Box
        alignItems="flex-end"
        display="flex"
        flexDirection={"row"}
        justifyContent="space-between"
        mb={3}
      >
        <Box
          sx={{
            display: "flex",
            flex: "auto",
            my: [4, 3, 0],
          }}
        >
          <FilteredSearch sx={{ flexGrow: 1 }}>
            <Dropdown>
              <Dropdown.Button>Filters</Dropdown.Button>
              <Dropdown.Menu direction="se" sx={{ width: "auto" }}>
                <Dropdown.Item>Open issues and pull requests</Dropdown.Item>
                <Dropdown.Item>Your issues</Dropdown.Item>
                <Dropdown.Item>Your pull requests</Dropdown.Item>
                <Dropdown.Item>Everything assigned to you</Dropdown.Item>
                <Dropdown.Item>Everything mentioning you</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <TextInput
              icon={SearchIcon}
              sx={{ bg: "bg.secondary", width: "100%" }}
            />
          </FilteredSearch>
          <SubNavWithCount />
        </Box>
        <Box display="flex" justifyContent="space-between" ml={3} width="auto">
          <ButtonPrimary
            as="a"
            href={"/" + login + "/" + repositoryName + "/issues/new"}
          >
            <Box sx={{ display: ["none", "none", "block"] }}>New issue</Box>
            <Box sx={{ display: ["block", "block", "none"] }}>New</Box>
          </ButtonPrimary>
        </Box>
      </Box>
      {countClosed > 0 || countOpen > 0 ? (
        <IssueListPaginated after={after} before={before} filter={filter} />
      ) : (
        <Blankslate icon={IssueOpenedIcon} title="Welcome to Issues!">
          Issues are used to track todos, bugs, feature requests, and more. As
          issues are created, they’ll appear here in a searchable and filterable
          list. To get started, you should{" "}
          <Link href={"/" + login + "/" + repositoryName + "/issues/new"}>
            create an issue
          </Link>
          .
        </Blankslate>
      )}
    </Box>
  );
}

function SubNavWithCount() {
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(
    QUERY_COUNT_LABELS_AND_OPEN_MILESTONES,
    {
      variables: {
        name: repositoryName,
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

  const { totalCount: totalCountLabels } = data.repository.labels;
  const { totalCount: totalCountOpenMilestones } = data.repository.milestones;

  return (
    <Box sx={{ display: ["none", "none", "flex"], ml: 2, pl: 2 }}>
      <SubNav>
        <SubNav.Links>
          <SubNav.Link href={"/" + login + "/" + repositoryName + "/labels"}>
            <span>
              <StyledOcticon icon={TagIcon} /> labels{" "}
              <CounterLabel>{totalCountLabels}</CounterLabel>
            </span>
          </SubNav.Link>
          <SubNav.Link
            href={"/" + login + "/" + repositoryName + "/milestones"}
          >
            <span>
              <StyledOcticon icon={MilestoneIcon} /> milestones{" "}
              <CounterLabel>{totalCountOpenMilestones}</CounterLabel>
            </span>
          </SubNav.Link>
        </SubNav.Links>
      </SubNav>
    </Box>
  );
}
