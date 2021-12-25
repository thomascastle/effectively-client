import { QUERY_COUNT_MILESTONES_BY_STATE } from "../datasource/queries";
import { Blankslate } from "./Blankslate";
import { MilestoneListItem } from "./MilestoneListItem";
import { useQuery } from "@apollo/client";
import { MilestoneIcon } from "@primer/octicons-react";
import { Box } from "@primer/react";
import * as React from "react";
import { useParams } from "react-router-dom";

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
          <MilestoneListItem
            key={milestone.node.id}
            milestone={milestone.node}
          />
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
