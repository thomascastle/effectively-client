import { Layout } from "../components/Layout";
import { MilestoneList } from "../components/MilestoneList";
import { useQueryParams } from "../hooks";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  ButtonPrimary,
  ButtonTableList,
  Link,
  SelectMenu,
  SubNav,
  StyledOcticon,
} from "@primer/components";
import { CheckIcon, MilestoneIcon, TagIcon } from "@primer/octicons-react";
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

export function MilestoneIndexPage() {
  const queryParams = useQueryParams();
  const milestoneState = queryParams.get("state");

  return (
    <Layout>
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
            <CountByStateNav state={milestoneState} />
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
            <MilestoneList filter={{ state: milestoneState }} />
          </Box>
        </Box>
      </Box>
    </Layout>
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
