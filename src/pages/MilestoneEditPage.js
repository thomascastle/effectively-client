import { MilestoneEdit } from "../components/MilestoneEdit";
import { Layout } from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export const MILESTONE_BY_NUMBER_QUERY = gql`
  query GetMilestoneByNumber($milestoneNumber: Int!) {
    milestone(number: $milestoneNumber) {
      description
      dueOn
      id
      title
    }
  }
`;

export function MilestoneEditPage() {
  const { number } = useParams();

  const { data, error, loading } = useQuery(MILESTONE_BY_NUMBER_QUERY, {
    variables: {
      milestoneNumber: parseInt(number),
    },
  });

  if (error) {
    return <p>{error.message}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const { milestone } = data;

  return (
    <Layout>
      <MilestoneEdit milestone={milestone} />
    </Layout>
  );
}
