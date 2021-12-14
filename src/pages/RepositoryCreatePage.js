import { LayoutDefault } from "../components/LayoutDefault";
import { MUTATION_CREATE_REPOSITORY } from "../datasource/mutations";
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  ButtonPrimary,
  FormGroup,
  Heading,
  StyledOcticon,
  Text,
  TextInput,
} from "@primer/components";
import { RepoIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export function RepositoryCreatePage() {
  return (
    <LayoutDefault>
      <Box sx={{ maxWidth: 768, mx: "auto", my: 6, px: [3, null, 4, 5] }}>
        <Form />
      </Box>
    </LayoutDefault>
  );
}

function Form() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    description: "",
    name: "",
    visibility: "PUBLIC",
  });
  const [shouldDisable, setShouldDisable] = useState(false);

  useEffect(() => {
    setShouldDisable(formData.name === "");
  }, [formData.name]);

  const [createRepository] = useMutation(MUTATION_CREATE_REPOSITORY, {
    variables: {
      input: {
        description: formData.description,
        name: formData.name,
        visibility: formData.visibility,
      },
    },
  });

  const handleDescriptionChanged = (event) => {
    setFormData({ ...formData, description: event.target.value });
  };

  const handleFormSubmitted = async (event) => {
    event.preventDefault();

    const payload = await createRepository();

    history.push(
      payload.data.createRepository.repository.nameWithOwner + "/issues"
    );
  };

  const handleNameChanged = (event) => {
    setFormData({ ...formData, name: event.target.value });
  };

  const handleVisibilityChanged = (event) => {
    setFormData({ ...formData, visibility: event.target.value });
  };

  return (
    <form method="post" onSubmit={handleFormSubmitted}>
      <Box
        sx={{
          borderBottomColor: "border.muted",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "flex-end",
          mb: 5,
          pb: 2,
        }}
      >
        <Heading
          as="h1"
          sx={{ flex: "1 1 auto", fontSize: 24, fontWeight: 400 }}
        >
          Create a new repository
        </Heading>
        <Box sx={{ color: "fg.muted", flex: "1 100%", fontSize: 14 }}>
          <Box sx={{ display: "flex", flex: "auto" }}>
            <Text as="p" sx={{ mt: 0, mb: "10px" }}>
              A repository contains issues where you can track your project's
              progress.
            </Text>
          </Box>
        </Box>
      </Box>
      <FormGroup>
        <FormGroup.Label>Repository name</FormGroup.Label>
        <TextInput
          autoFocus
          contrast
          onChange={handleNameChanged}
          sx={{ maxWidth: "100%", width: "250px" }}
          value={formData.name}
        />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Description (optional)</FormGroup.Label>
        <TextInput
          contrast
          onChange={handleDescriptionChanged}
          sx={{ width: "100%" }}
          value={formData.description}
        />
      </FormGroup>
      <Box
        as="hr"
        sx={{
          background: "transparent",
          border: 0,
          borderBottomColor: "border.muted",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          height: 0,
          overflow: "hidden",
          mx: 0,
          my: "15px",
        }}
      />
      <Box sx={{ mx: 0, my: 15, pl: 20 }}>
        <label>
          <input
            checked={"PUBLIC" === formData.visibility}
            id="repository_visibility_public"
            onChange={handleVisibilityChanged}
            name="repository[visibility]"
            style={{
              float: "left",
              margin: "5px 0 0 -20px",
              marginTop: "8px",
              verticalAlign: "middle",
            }}
            type="radio"
            value="PUBLIC"
          />
          <Text sx={{ fontWeight: 600 }}>Public</Text>
        </label>
        <StyledOcticon
          icon={RepoIcon}
          size={32}
          sx={{
            color: "fg.muted",
            float: "left",
            mr: 2,
            mt: 1,
          }}
        />
        <Text
          sx={{
            color: "fg.muted",
            display: "block",
            fontSize: 12,
            fontWeight: 400,
            m: 0,
            minHeight: 17,
          }}
        >
          Anyone on the internet can see this repository.
        </Text>
      </Box>
      <Box sx={{ mx: 0, my: 15, pl: 20 }}>
        <label>
          <input
            checked={"PRIVATE" === formData.visibility}
            id="repository_visibility_private"
            onChange={handleVisibilityChanged}
            name="repository[visibility]"
            style={{
              float: "left",
              margin: "5px 0 0 -20px",
              marginTop: "8px",
              verticalAlign: "middle",
            }}
            type="radio"
            value="PRIVATE"
          />
          <Text sx={{ fontWeight: 600 }}>Private</Text>
        </label>
        <StyledOcticon
          icon={RepoIcon}
          size={32}
          sx={{
            color: "attention.fg",
            float: "left",
            mr: 2,
            mt: 1,
          }}
        />
        <Text
          sx={{
            color: "fg.muted",
            display: "block",
            fontSize: 12,
            fontWeight: 400,
            m: 0,
            minHeight: 17,
          }}
        >
          You choose who can see this repository.
        </Text>
      </Box>
      <Box
        as="hr"
        sx={{
          background: "transparent",
          border: 0,
          borderBottomColor: "border.muted",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          height: 0,
          overflow: "hidden",
          mx: 0,
          my: "15px",
        }}
      />
      <ButtonPrimary disabled={shouldDisable} type="submit">
        Create repository
      </ButtonPrimary>
    </form>
  );
}
