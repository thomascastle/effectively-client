import { IssueCreate } from "../components/IssueCreate";
import { Layout } from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const QUERY_REPOSITORY = gql`
  query ($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
    }
  }
`;

export function RepositoryIssueCreatePage() {
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_REPOSITORY, {
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

  const { repository } = data;

  return (
    <Layout>
      <IssueCreate
        login={login}
        repositoryId={repository.id}
        repositoryName={repositoryName}
      />
    </Layout>
  );
}
