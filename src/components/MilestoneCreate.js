import { MUTATION_CREATE_MILESTONE } from "../datasource/mutations";
import { useMutation } from "@apollo/client";
import {
  Box,
  ButtonPrimary,
  FormGroup,
  Heading,
  PointerBox,
  TextInput,
} from "@primer/react";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";

export function MilestoneCreate({ repositoryId }) {
  const history = useHistory();
  const { login, repositoryName } = useParams();
  const [title, setTitle] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [createMilestone, { error }] = useMutation(MUTATION_CREATE_MILESTONE, {
    variables: {
      input: {
        description: description === "" ? null : description, // Quick fix!!!
        dueOn: dueDate === "" ? null : dueDate, // Quick fix!!!
        repositoryId: repositoryId,
        title: title,
      },
    },
  });

  const handleFormSubmitted = async (e) => {
    e.preventDefault();
    try {
      await createMilestone();
    } catch (e) {
      // Is it a good call?
      return null;
    }

    history.push("/" + login + "/" + repositoryName + "/milestones");
  };

  return (
    <Box>
      <Box
        sx={{
          borderBottomColor: "border.muted",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
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
            <FormGroup.Label
              htmlFor="title"
              sx={{
                color: error ? "danger.fg" : "fg.default",
              }}
            >
              Title
            </FormGroup.Label>
            <TextInput
              autoFocus
              contrast
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Title"
              required
              sx={{ width: "440px" }}
              validationStatus={error ? "error" : "none"}
              value={title}
            />
            {error ? (
              <PointerBox
                bg="danger.subtle"
                borderColor="danger.muted"
                caret="top-left"
                sx={{
                  mt: 2,
                  mx: 0,
                  position: "absolute",
                  px: 2,
                  py: 1,
                }}
              >
                {error.message}
              </PointerBox>
            ) : null}
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
