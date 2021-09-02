import { IssueDetails } from "../components/IssueDetails";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";

export const ISSUE_BY_NUMBER_QUERY = gql`
  query getByNumber($issueNumber: Int!) {
    issue(number: $issueNumber) {
      assignees {
        id
        name
        username
      }
      createdAt
      createdBy {
        username
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
      status
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
