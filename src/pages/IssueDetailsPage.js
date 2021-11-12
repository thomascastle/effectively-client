import { IssueDetails } from "../components/IssueDetails";
import { Layout } from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export const ISSUE_BY_NUMBER_QUERY = gql`
  query getByNumber($issueNumber: Int!) {
    issue(number: $issueNumber) {
      assignees {
        id
        name
        login
      }
      createdAt
      createdBy {
        login
      }
      id
      labels {
        color
        description
        id
        name
      }
      milestone {
        dueOn
        id
        title
      }
      number
      state
      title
    }
  }
`;

export function IssueDetailsPage() {
  const { number } = useParams();
  const { data, error, loading } = useQuery(ISSUE_BY_NUMBER_QUERY, {
    variables: {
      issueNumber: parseInt(number),
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { issue } = data;

  return (
    <Layout>
      <IssueDetails issue={issue} />
    </Layout>
  );
}
