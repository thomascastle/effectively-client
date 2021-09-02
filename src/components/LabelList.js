import { LabelListItem } from "./LabelListItem";
import { gql, useQuery } from "@apollo/client";

export const LABELS_QUERY = gql`
  query GetLabels {
    labels {
      nodes {
        color
        description
        id
        name
      }
    }
  }
`;

export function LabelList() {
  const { data, error, loading } = useQuery(LABELS_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { nodes } = data.labels;

  return (
    <>
      {nodes.map((label) => (
        <LabelListItem key={label.id} label={label} />
      ))}
    </>
  );
}
