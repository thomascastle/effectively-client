import { LabelListContainer } from "../components/LabelListContainer";
import { Layout } from "../components/Layout";
import { useQueryParams } from "../hooks";
import * as React from "react";

export function RepositoryLabelIndexPage() {
  const queryParams = useQueryParams();

  const endCursor = queryParams.get("after");
  const startCursor = queryParams.get("before");

  return (
    <Layout>
      <LabelListContainer after={endCursor} before={startCursor} />
    </Layout>
  );
}
