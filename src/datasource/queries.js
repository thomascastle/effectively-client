import { gql } from "@apollo/client";

export const QUERY_COUNT_LABELS = gql`
  query GetCountLabels($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      labels {
        totalCount
      }
    }
  }
`;

export const QUERY_COUNT_LABELS_AND_OPEN_MILESTONES = gql`
  query GetCountLabelsAndMilestones($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      labels {
        totalCount
      }
      milestones(states: OPEN) {
        totalCount
      }
    }
  }
`;
