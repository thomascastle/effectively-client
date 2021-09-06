import { Layout } from "../components/Layout";
import { useQueryParams } from "../hooks";
import { gql } from "@apollo/client";
import * as React from "react";
import { LabelListContainer } from "../components/LabelListContainer";

// TODO Refector the dependent and delete this
export const LABELS_COUNT_QUERY = gql`
  query GetLabelsCount {
    labels {
      totalCount
    }
  }
`;

export function LabelIndexPage() {
  const queryParams = useQueryParams();

  const endCursor = queryParams.get("after");
  const startCursor = queryParams.get("before");

  return (
    <Layout>
      <LabelListContainer after={endCursor} before={startCursor} />
    </Layout>
  );
}
