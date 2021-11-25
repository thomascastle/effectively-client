import { Layout } from "../components/Layout";
import { MilestoneDetails } from "../components/MilestoneDetails";
import { RepoSubNav } from "../components/RepoSubNav";
import { gql, useQuery } from "@apollo/client";
import { Box, SubNav, StyledOcticon, Link, Button } from "@primer/components";
import { TagIcon, MilestoneIcon } from "@primer/octicons-react";
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

export function RepositoryMilestoneDetailsPage() {
  const { login, number, repositoryName } = useParams();

  const { data, error, loading } = useQuery(MILESTONE_BY_NUMBER_QUERY, {
    variables: {
      milestoneNumber: parseInt(number),
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { milestone } = data;

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: ["column", "column", "row"],
          mb: "20px",
        }}
      >
        <RepoSubNav />
        <Box
          sx={{
            display: ["none", "none", "block"],
            ml: "auto",
            position: "relative",
          }}
        >
          <Button
            as="a"
            href={`/${login}/${repositoryName}/milestones/${number}/edit`}
          >
            Edit milestone
          </Button>
        </Box>
      </Box>
      <MilestoneDetails milestone={milestone} />
    </Layout>
  );
}
