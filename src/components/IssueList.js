import { gql, useQuery } from "@apollo/client";
import { IssueListItem } from "./IssueListItem";

export const ISSUES_QUERY = gql`
  query GetIssues {
    issues {
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
`;

export function IssueList() {
  const { data, loading, error } = useQuery(ISSUES_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { issues } = data;

  return (
    <>
      {issues.map((issue) => (
        <IssueListItem key={issue.id} issue={issue} />
      ))}
    </>
  );
}
