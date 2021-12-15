import { IssueDetails } from "../components/IssueDetails";
import { Layout } from "../components/Layout";
import { QUERY_REPOSITORY_ISSUE } from "../datasource/queries";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export function RepositoryIssueDetailsPage() {
  const { login, number, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_REPOSITORY_ISSUE, {
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

  const { id, issue } = data.repository;

  return (
    <Layout>
      <IssueDetails issue={issue} repositoryId={id} />
    </Layout>
  );
}
