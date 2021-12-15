import { Layout } from "../components/Layout";
import { MilestoneDetails } from "../components/MilestoneDetails";
import { RepoSubNav } from "../components/RepoSubNav";
import { QUERY_REPOSITORY_MILESTONE } from "../datasource/queries";
import { useQuery } from "@apollo/client";
import { Box, Button } from "@primer/components";
import { useParams } from "react-router-dom";

export function RepositoryMilestoneDetailsPage() {
  const { login, number, repositoryName } = useParams();

  const { data, error, loading } = useQuery(QUERY_REPOSITORY_MILESTONE, {
    variables: {
      milestoneNumber: parseInt(number),
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

  const { milestone } = data.repository;

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
