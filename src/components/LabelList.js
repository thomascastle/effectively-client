import { LabelListItem } from "./LabelListItem";
import { gql, useQuery } from "@apollo/client";

export const LABELS_QUERY = gql`
  query GetLabels {
    labels {
      color
      description
      id
      name
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

  const { labels } = data;

  return (
    <>
      {labels.map((label) => (
        <LabelListItem key={label.id} label={label} />
      ))}
    </>
  );
}
