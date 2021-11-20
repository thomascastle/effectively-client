import { Layout } from "../components/Layout";
import { MilestoneCreate } from "../components/MilestoneCreate";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export const QUERY_REPOSITORY = gql`
  query FindRepository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
    }
  }
`;

export function MilestoneCreatePage() {
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
