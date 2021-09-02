import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  ButtonPrimary,
  FormGroup,
  TextInput,
} from "@primer/components";
import * as React from "react";
import { useHistory } from "react-router-dom";

export const MILESTONE_UPDATE_MUTATION = gql`
  mutation UpdateMilestone($updateMilestoneInput: UpdateMilestoneInput!) {
    updateMilestone(input: $updateMilestoneInput) {
      milestone {
        description
        dueOn
        title
      }
    }
  }
`;

export function MilestoneEdit({ milestone }) {
  const history = useHistory();
  const [title, setTitle] = React.useState(milestone.title);
  const [dueOn, setDueOn] = React.useState(
    milestone.dueOn ? milestone.dueOn.split("T")[0] : ""
  );
  const [description, setDescription] = React.useState(milestone.description);

  const [updateMilestone] = useMutation(MILESTONE_UPDATE_MUTATION, {
    variables: {
      updateMilestoneInput: {
        id: milestone.id,
        title: title,
        dueOn: dueOn,
        description: description,
      },
    },
  });

  const handleCanceled = (e) => {
    e.preventDefault();

    history.push("/milestones");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    await updateMilestone();

    history.push("/milestones");
  };

  return (
    <form method="post" onSubmit={handleFormSubmit}>
      <Box sx={{ width: "66.66667%" }}>
        <FormGroup>
          <FormGroup.Label htmlFor="title">Title</FormGroup.Label>
          <TextInput
            contrast
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Title"
            sx={{ width: "440px" }}
            value={title}
          />
        </FormGroup>
        <FormGroup>
          <FormGroup.Label htmlFor="due-date">
            Due date (optional)
          </FormGroup.Label>
          <TextInput
            contrast
            onChange={(e) => {
              setDueOn(e.target.value);
            }}
            pattern="\d\d\d\d-\d\d-\d\d"
            placeholder="yyyy/mm/dd"
            sx={{ width: "440px" }}
            type="date"
            value={dueOn}
          />
        </FormGroup>
        <FormGroup>
          <FormGroup.Label htmlFor="description">Description</FormGroup.Label>
          <TextInput
            as="textarea"
            cols="40"
            contrast
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            rows="20"
            sx={{
              height: "200px",
              lineHeight: 1.5,
              minHeight: "200px",
              py: 2,
              width: "100%",
            }}
            value={description}
          />
        </FormGroup>
      </Box>
      <Box
        sx={{
          background: "transparent",
          border: 0,
          borderBottom: "1px solid",
          borderBottomColor: "border.secondary",
          height: 0,
          mx: 0,
          my: "15px",
          overflow: "hidden",
        }}
      ></Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleCanceled} sx={{ mr: "5px" }}>
          Cancel
        </Button>
        <Button sx={{ mr: "5px" }}>Close milestone</Button>
        <ButtonPrimary type="submit">Save changes</ButtonPrimary>
      </Box>
    </form>
  );
}
