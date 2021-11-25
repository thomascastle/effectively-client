import { IssueDetails } from "../components/IssueDetails";
import { Layout } from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export const QUERY_ISSUE_BY_NUMBER = gql`
  query findIssueByNumber($name: String!, $owner: String!, $number: Int!) {
    repository(name: $name, owner: $owner) {
      issue(number: $number) {
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
  }
`;

export function RepositoryIssueDetailsPage() {
  const { login, number, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_ISSUE_BY_NUMBER, {
    variables: {
      name: repositoryName,
      owner: login,
      number: parseInt(number),
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { issue } = data.repository;

  return (
    <Layout>
      <IssueDetails issue={issue} />
    </Layout>
  );
}
