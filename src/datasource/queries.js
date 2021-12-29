import { gql } from "@apollo/client";

export const QUERY_COUNT_ISSUES_BY_STATES = gql`
  query GetCountIssuesByState(
    $labels: [String!]
    $name: String!
    $owner: String!
  ) {
    repository(name: $name, owner: $owner) {
      closed: issues(labels: $labels, states: CLOSED) {
        totalCount
      }
      open: issues(labels: $labels, states: OPEN) {
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

export const QUERY_COUNT_MILESTONES_BY_STATE = gql`
  query GetCountMilestonesByState($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      closed: milestones(states: CLOSED) {
        totalCount
      }
      open: milestones(states: OPEN) {
        totalCount
      }
    }
  }
`;

export const QUERY_COUNT_MILESTONE_ISSUES_BY_STATES = gql`
  query GetCountMilestoneIssuesByStates(
    $name: String!
    $number: Int!
    $owner: String!
  ) {
    repository(name: $name, owner: $owner) {
      milestone(number: $number) {
        closedIssues: issues(states: CLOSED) {
          totalCount
        }
        openIssues: issues(states: OPEN) {
          totalCount
        }
      }
    }
  }
`;

export const QUERY_COUNT_VIEWER_ISSUES_BY_STATES = gql`
  query GetCountViewerIssuesByState(
    $filterBy: IssueFilters
    $labels: [String!]
  ) {
    viewer {
      closed: issues(filterBy: $filterBy, labels: $labels, states: CLOSED) {
        totalCount
      }
      open: issues(filterBy: $filterBy, labels: $labels, states: OPEN) {
        totalCount
      }
    }
  }
`;

export const QUERY_REPOSITORY = gql`
  query FindRepository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
    }
  }
`;

export const QUERY_REPOSITORY_ISSUE = gql`
  query FindRepositoryIssue($name: String!, $owner: String!, $number: Int!) {
    repository(name: $name, owner: $owner) {
      id
      issue(number: $number) {
        assignees {
          id
          name
          login
        }
        createdAt
        createdBy {
          login
        }
        id
        labels {
          color
          description
          id
          name
        }
        milestone {
          dueOn
          id
          progressPercentage
          title
        }
        number
        state
        title
      }
    }
  }
`;

export const QUERY_REPOSITORY_ISSUES = gql`
  query GetRepositoryIssues(
    $after: String
    $before: String
    $labels: [String!]
    $name: String!
    $owner: String!
    $states: [IssueState!]
  ) {
    repository(name: $name, owner: $owner) {
      issues(after: $after, before: $before, labels: $labels, states: $states) {
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
            color
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

export const QUERY_REPOSITORY_LABEL = gql`
  query FindRepositoryLabel(
    $labelName: String!
    $name: String!
    $owner: String!
  ) {
    repository(name: $name, owner: $owner) {
      label(name: $labelName) {
        id
        name
      }
    }
  }
`;

export const QUERY_REPOSITORY_LABELS = gql`
  query GetRepositoryLabels(
    $after: String
    $before: String
    $name: String!
    $owner: String!
  ) {
    repository(name: $name, owner: $owner) {
      id
      labels(after: $after, before: $before) {
        nodes {
          color
          description
          id
          name
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  }
`;

export const QUERY_REPOSITORY_LABELS_AVAILABLE_TO_APPLY = gql`
  query GetLabelsAvailableToApply($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
      labels(first: 100) {
        edges {
          node {
            color
            description
            id
            name
          }
        }
      }
      name
      nameWithOwner
    }
  }
`;

export const QUERY_REPOSITORY_MILESTONE = gql`
  query GetMilestoneByNumber(
    $milestoneNumber: Int!
    $name: String!
    $owner: String!
    $states: [IssueState!]
  ) {
    repository(name: $name, owner: $owner) {
      milestone(number: $milestoneNumber) {
        description
        dueOn
        id
        issues(first: 50, states: $states) {
          edges {
            node {
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
                color
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
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
        progressPercentage
        title
      }
    }
  }
`;

export const QUERY_REPOSITORY_MILESTONES = gql`
  query GetRepositoryMilestones(
    $after: String
    $before: String
    $milestonesStates: [MilestoneState!]
    $name: String!
    $owner: String!
  ) {
    repository(name: $name, owner: $owner) {
      id
      milestones(after: $after, before: $before, states: $milestonesStates) {
        edges {
          node {
            closed
            closedAt
            createdAt
            description
            dueOn
            id
            closedIssues: issues(first: 100, states: CLOSED) {
              totalCount
            }
            openIssues: issues(first: 100, states: OPEN) {
              totalCount
            }
            number
            progressPercentage
            title
            updatedAt
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  }
`;

export const QUERY_REPOSITORY_MILESTONES_AVAILABLE_TO_SET = gql`
  query GetMilestonesAvailableToSet($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
      milestones(first: 100) {
        edges {
          node {
            dueOn
            id
            progressPercentage
            title
          }
        }
      }
      name
      nameWithOwner
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

export const QUERY_USER_MINIMUM_PROFILE = gql`
  query GetUserMinimumProfile($login: String!) {
    user(login: $login) {
      login
      name
    }
  }
`;

export const QUERY_USER_POPULAR_REPOSITORIES = gql`
  query GetUserPopularRepositories($login: String!) {
    user(login: $login) {
      repositories {
        description
        id
        name
        visibility
      }
    }
  }
`;

export const QUERY_USER_REPOSITORIES = gql`
  query GetUserRepositories($login: String!) {
    user(login: $login) {
      repositories {
        description
        id
        name
        updatedAt
        visibility
      }
    }
  }
`;

export const QUERY_VIEWER_ISSUES = gql`
  query GetViewerIssues(
    $after: String
    $before: String
    $filterBy: IssueFilters
    $labels: [String!]
    $states: [IssueState!]
  ) {
    viewer {
      id
      issues(
        after: $after
        before: $before
        filterBy: $filterBy
        first: 10
        labels: $labels
        states: $states
      ) {
        edges {
          node {
            assignees {
              id
              login
            }
            body
            closed
            closedAt
            createdAt
            createdBy {
              id
              login
            }
            id
            labels {
              color
              id
              name
            }
            milestone {
              id
              number
              title
            }
            number
            repository {
              id
              name
              nameWithOwner
            }
            title
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
      login
    }
  }
`;

export const QUERY_VIEWER_REPOSITORIES = gql`
  query GetRepositories {
    viewer {
      login
      repositories {
        id
        isPrivate
        name
        nameWithOwner
        owner {
          login
        }
        visibility
      }
    }
  }
`;

export const QUERY_USERS_AVAILABLE_TO_ASSIGN = gql`
  query GetUsersAvailableToAssign {
    users {
      id
      login
      name
    }
  }
`;
