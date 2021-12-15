import { Layout } from "../components/Layout";
import { MilestoneCreate } from "../components/MilestoneCreate";
import { QUERY_REPOSITORY } from "../datasource/queries";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export function RepositoryMilestoneCreatePage() {
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

  const { id } = data.repository;

  return (
    <Layout>
      <MilestoneCreate repositoryId={id} />
    </Layout>
  );
}
