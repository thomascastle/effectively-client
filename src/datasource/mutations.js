import { gql } from "@apollo/client";

export const MUTATION_CREATE_ISSUE = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      issue {
        id
        number
      }
    }
  }
`;

export const MUTATION_CREATE_LABEL = gql`
  mutation CreateLabel($input: CreateLabelInput!) {
    createLabel(input: $input) {
      success
      message
      label {
        color
        description
        id
        name
      }
    }
  }
`;

export const MUTATION_CREATE_MILESTONE = gql`
  mutation CreateMilestone($input: CreateMilestoneInput!) {
    createMilestone(input: $input) {
      message
      success
    }
  }
`;

export const MUTATION_CREATE_REPOSITORY = gql`
  mutation CreateRepository($input: CreateRepositoryInput!) {
    createRepository(input: $input) {
      message
      repository {
        name
        nameWithOwner
      }
      success
    }
  }
`;

export const MUTATION_UPDATE_ISSUE = gql`
  mutation UpdateIssueAssignees($updateIssueInput: UpdateIssueInput!) {
    updateIssue(input: $updateIssueInput) {
      issue {
        __typename
        id
        labels {
          color
          description
          id
          name
        }
        title
      }
    }
  }
`;

export const MUTATION_UPDATE_LABEL = gql`
  mutation UpdateLabel($updateLabelInput: UpdateLabelInput!) {
    updateLabel(input: $updateLabelInput) {
      label {
        __typename
        color
        description
        id
        name
      }
    }
  }
`;

export const MUTATION_UPDATE_MILESTONE = gql`
  mutation UpdateMilestone($input: UpdateMilestoneInput!) {
    updateMilestone(input: $input) {
      milestone {
        description
        dueOn
        title
      }
    }
  }
`;
