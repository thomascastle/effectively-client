import { Blankslate } from "./Blankslate";
import { MilestoneListItem } from "./MilestoneListItem";
import { gql, useQuery } from "@apollo/client";
import { Box } from "@primer/components";
import { MilestoneIcon } from "@primer/octicons-react";
import * as React from "react";
import { useParams } from "react-router-dom";

export const MILESTONES_QUERY = gql`
  query GetMilestones($milestonesStates: [MilestoneState!]) {
    milestones(states: $milestonesStates) {
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
    }
  }
`;

export function MilestoneList({ milestones }) {
  return (
    <Box
      className="list"
      sx={{
        borderBottomColor: "border.default",
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
        color: "fg.muted",
      }}
    >
      {milestones.length > 0 ? (
        milestones.map((milestone) => (
          <MilestoneListItem key={milestone.id} milestone={milestone} />
        ))
      ) : (
        <ConditionalBlankslate />
      )}
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

export const QUERY_COUNT_MILESTONES_BY_STATE = gql`
  query GetCountMilestonesByState($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      closed: milestones(states: CLOSED) {
        totalCount
      }
      open: milestones(states: OPEN) {
        totalCount
      }
    }
  }
`;
