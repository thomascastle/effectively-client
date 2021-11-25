import { Layout } from "../components/Layout";
import { MilestoneListContainer } from "../components/MilestoneListContainer";
import { useQueryParams } from "../hooks";
import * as React from "react";

export function RepositoryMilestoneIndexPage() {
  const queryParams = useQueryParams();

  const endCursor = queryParams.get("after");
  const startCursor = queryParams.get("before");
  const milestoneState = queryParams.get("state");

  return (
    <Layout>
      <MilestoneListContainer
        after={endCursor}
        before={startCursor}
        filter={{ state: milestoneState }}
      />
    </Layout>
  );
}
