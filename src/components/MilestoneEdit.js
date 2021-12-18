import { MUTATION_UPDATE_MILESTONE } from "../datasource/mutations";
import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  ButtonPrimary,
  FormGroup,
  PointerBox,
  TextInput,
} from "@primer/react";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";

export function MilestoneEdit({ milestone }) {
  const history = useHistory();
  const { login, repositoryName } = useParams();
  const [title, setTitle] = React.useState(milestone.title);
  const [dueOn, setDueOn] = React.useState(
    milestone.dueOn ? milestone.dueOn.split("T")[0] : ""
  );
  const [description, setDescription] = React.useState(milestone.description);

  const [updateMilestone, { error }] = useMutation(MUTATION_UPDATE_MILESTONE, {
    variables: {
      input: {
        description: description,
        dueOn: dueOn ? dueOn : null,
        id: milestone.id,
        title: title,
      },
    },
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMilestone();
    } catch (e) {
      // Is it a good call?
      return null;
    }

    history.push(`/${login}/${repositoryName}/milestones`);
  };

  return (
    <form method="post" onSubmit={handleFormSubmit}>
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
          borderBottomColor: "border.muted",
          height: 0,
          mx: 0,
          my: "15px",
          overflow: "hidden",
        }}
      ></Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          as="a"
          href={`/${login}/${repositoryName}/milestones`}
          sx={{ mr: "5px" }}
        >
          Cancel
        </Button>
        <Button sx={{ mr: "5px" }}>Close milestone</Button>
        <ButtonPrimary type="submit">Save changes</ButtonPrimary>
      </Box>
    </form>
  );
}
