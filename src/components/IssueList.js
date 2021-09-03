import { gql, useQuery } from "@apollo/client";
import { IssueListItem } from "./IssueListItem";

export const ISSUES_QUERY = gql`
  query GetIssues($issuesStates: [IssueState!]) {
    issues(states: $issuesStates) {
      nodes {
        closed
        closedAt
        assignees {
          id
          username
        }
        createdAt
        createdBy {
          username
        }
        id
        labels {
          id
          name
        }
        milestone {
          title
        }
        number
        title
      }
    }
  }
`;

export function IssueList({ filter }) {
  const { state } = filter;
  const { data, loading, error } = useQuery(ISSUES_QUERY, {
    variables: {
      issuesStates: state === "is:closed" ? "CLOSED" : "OPEN",
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { nodes } = data.issues;

  return (
    <>
      {nodes.map((issue) => (
        <IssueListItem key={issue.id} issue={issue} />
      ))}
    </>
  );
}
