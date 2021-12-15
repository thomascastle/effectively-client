import { IssueCreate } from "../components/IssueCreate";
import { Layout } from "../components/Layout";
import { QUERY_REPOSITORY } from "../datasource/queries";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

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
