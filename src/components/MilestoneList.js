import { Blankslate } from "./Blankslate";
import { MilestoneListItem } from "./MilestoneListItem";
import { gql } from "@apollo/client";

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
    <>
      {milestones.length > 0 ? (
        milestones.map((milestone) => (
          <MilestoneListItem key={milestone.id} milestone={milestone} />
        ))
      ) : (
        <Blankslate />
      )}
    </>
  );
}
