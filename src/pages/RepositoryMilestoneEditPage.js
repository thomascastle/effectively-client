import { MilestoneEdit } from "../components/MilestoneEdit";
import { Layout } from "../components/Layout";
import { QUERY_REPOSITORY_MILESTONE } from "../datasource/queries";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export function RepositoryMilestoneEditPage() {
  const { login, number, repositoryName } = useParams();

  const { data, error, loading } = useQuery(QUERY_REPOSITORY_MILESTONE, {
    variables: {
      milestoneNumber: parseInt(number),
      name: repositoryName,
      owner: login,
    },
  });

  if (error) {
    return <p>{error.message}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const { milestone } = data.repository;

  return (
    <Layout>
      <MilestoneEdit milestone={milestone} />
    </Layout>
  );
}
