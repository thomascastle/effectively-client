import { gql } from "@apollo/client";

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
