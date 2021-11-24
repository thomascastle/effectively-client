import { gql } from "@apollo/client";

export const QUERY_COUNT_ISSUES_BY_STATES = gql`
  query GetCountIssuesByState($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      closed: issues(states: CLOSED) {
        totalCount
      }
      open: issues(states: OPEN) {
        totalCount
      }
    }
  }
`;

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

export const QUERY_REPOSITORY_ISSUES = gql`
  query GetRepositoryIssues(
    $after: String
    $before: String
    $issuesStates: [IssueState!]
    $name: String!
    $owner: String!
  ) {
    repository(name: $name, owner: $owner) {
      issues(after: $after, before: $before, states: $issuesStates) {
        nodes {
          closed
          closedAt
          assignees {
            id
            login
          }
          createdAt
          createdBy {
            login
          }
          id
          labels {
            id
            name
          }
          milestone {
            id
            number
            title
          }
          number
          title
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export const QUERY_REPOSITORY_VISIBILITY = gql`
  query GetRepositoryVisibility($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
      visibility
    }
  }
`;
