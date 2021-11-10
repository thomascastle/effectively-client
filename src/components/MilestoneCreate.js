import { gql, useMutation } from "@apollo/client";
import {
  Box,
  ButtonPrimary,
  FormGroup,
  Heading,
  TextInput,
} from "@primer/components";
import * as React from "react";
import { useHistory } from "react-router-dom";

export const MILESTONES_CREATE_MUTATION = gql`
  mutation CreateMilestone($createMilestoneInput: CreateMilestoneInput!) {
    createMilestone(input: $createMilestoneInput) {
      message
      success
    }
  }
`;

export function MilestoneCreate() {
  const history = useHistory();
  const [title, setTitle] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [createMilestone] = useMutation(MILESTONES_CREATE_MUTATION, {
    variables: {
      createMilestoneInput: {
        title: title,
        dueOn: dueDate,
        description: description,
      },
    },
  });

  const handleFormSubmitted = async (e) => {
    e.preventDefault();

    await createMilestone();

    history.push("/milestones");
  };

  return (
    <Box>
      <Box
        sx={{
          borderBottom: "1px solid",
          borderBottomColor: "border.muted",
          display: "flex",
          flexFlow: "row wrap",
          mb: 3,
        }}
      >
        <Heading
          sx={{
            flex: "1 1 auto",
            fontSize: "24px",
            fontWeight: 400,
            mb: 2,
            order: 1,
          }}
        >
          New milestone
        </Heading>
        <Box
          sx={{
            color: "fg.muted",
            flex: "1 100%",
            fontSize: "14px",
            mb: 3,
            mt: -2,
            order: 3,
          }}
        >
          Create a new milstone to help organize your issues.
        </Box>
      </Box>
      <form method="post" onSubmit={handleFormSubmitted}>
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
                setDueDate(e.target.value);
              }}
              pattern="\d\d\d\d-\d\d-\d\d"
              placeholder="yyyy/mm/dd"
              sx={{ width: "440px" }}
              type="date"
              value={dueDate}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.Label htmlFor="description">Description</FormGroup.Label>
            <TextInput
              as="textarea"
              cols="40"
              contrast
              rows="20"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              sx={{
                height: "200px",
                lineHeight: 1.5,
                minHeight: "200px",
                py: 2,
                width: "100%",
              }}
              value={description}
            ></TextInput>
          </FormGroup>
        </Box>
        <Box
          sx={{
            background: "transparent",
            border: 0,
            borderBottom: "1px solid",
            borderBottomColor: "border.muted",
            height: 0,
            mx: 0,
            my: "15px",
            overflow: "hidden",
          }}
        ></Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonPrimary type="submit">Create milestone</ButtonPrimary>
        </Box>
      </form>
    </Box>
  );
}
