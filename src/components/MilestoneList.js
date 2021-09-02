import { Blankslate } from "./Blankslate";
import { MilestoneListItem } from "./MilestoneListItem";
import { gql, useQuery } from "@apollo/client";

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

export function MilestoneList({ filter }) {
  const { state } = filter;
  const { data, error, loading } = useQuery(MILESTONES_QUERY, {
    variables: {
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

  const { nodes } = data.milestones;

  return (
    <>
      {nodes.length > 0 ? (
        nodes.map((milestone) => (
          <MilestoneListItem key={milestone.id} milestone={milestone} />
        ))
      ) : (
        <Blankslate />
      )}
    </>
  );
}
