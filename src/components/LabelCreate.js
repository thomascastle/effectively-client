import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  ButtonPrimary,
  Label,
  FormGroup,
  StyledOcticon,
  TextInput,
} from "@primer/components";
import { SyncIcon } from "@primer/octicons-react";
import * as React from "react";

export const MUTATION_CREATE_LABELS = gql`
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

export function LabelCreate({ on, onCancel: cancel, repositoryId }) {
  const [name, setName] = React.useState("");
  const [previewName, setPreviewName] = React.useState("Label preview");
  const [description, setDescription] = React.useState("");
  const [color, setColor] = React.useState("#d93f0b");
  const [shouldDisable, setShouldDisable] = React.useState(false);
  const colorInputElRef = React.useRef(null);

  const updateName = function (e) {
    const value = e.target.value;

    setName(value);
    setPreviewName(value.length > 0 ? value : "Label preview");
  };

  const updateDescription = function (e) {
    const value = e.target.value;

    setDescription(value);
  };

  const handleColorChanged = function (e) {
    const value = e.target.value;

    setColor(value);
    if (!value.match(/^#/)) {
      setColor(`#${value}`);
    }
  };

  const [createLabel, { data, error, loading }] = useMutation(
    MUTATION_CREATE_LABELS,
    {
      update: (cache, { data: { createLabel } }) => {
        cache.modify({
          id: "Repository:" + repositoryId,
          fields: {
            labels(existingLabels = []) {
              // const newLabelRef = cache.writeFragment({
              //   data: createLabel.label,
              //   fragment: gql`
              //     fragment NewLabel on Label {
              //       id
              //     }
              //   `,
              // });
              // return [newLabelRef, ...existingLabels];
            },
          },
        });
      },
      variables: {
        input: {
          color: color,
          description: description,
          name: name,
          repositoryId,
        },
      },
    }
  );

  React.useEffect(() => {
    setShouldDisable(
      colorInputElRef.current.validity.valueMissing ||
        colorInputElRef.current.validity.patternMismatch ||
        !name ||
        loading
    );
  }, [color, loading, name]);

  const handleLabelCreated = async () => {
    await createLabel();
    cancel();
  };

  return (
    <Box
      sx={{
        backgroundColor: "bg.tertiary",
        borderColor: "border.default",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: 2,
        display: on ? "block" : "none",
        mb: 3,
        p: 3,
      }}
    >
      <Box sx={{ mb: 2, mt: 0 }}>
        <Label outline>{previewName}</Label>
      </Box>
      <Box
        sx={{
          alignItems: ["flex-start", null, "flex-end"],
          display: "flex",
          flexDirection: ["column", null, "row"],
          mb: -2,
        }}
      >
        <FormGroup
          sx={{
            my: [2, 2, 3],
            pr: [0, 1, 3],
            width: ["100%", "100%", "25%"],
          }}
        >
          <FormGroup.Label htmlFor="label-name">Label name</FormGroup.Label>
          <TextInput
            autoFocus
            onChange={updateName}
            placeholder="Label name"
            sx={{ width: "100%" }}
            value={name}
          />
        </FormGroup>
        <FormGroup
          sx={{
            flex: "auto",
            my: [2, 2, 3],
            pr: [0, 1, 3],
            width: ["100%", "100%", "25%", "33.33333%"],
          }}
        >
          <FormGroup.Label htmlFor="label-description">
            Description
          </FormGroup.Label>
          <TextInput
            onChange={updateDescription}
            placeholder="Description (optional)"
            sx={{ width: "100%" }}
            value={description}
          />
        </FormGroup>
        <FormGroup sx={{ my: [2, 2, 3], width: ["100%", "100%", "16.66667%"] }}>
          <FormGroup.Label htmlFor="label-color">Color</FormGroup.Label>
          <Box sx={{ display: "flex" }}>
            <Button sx={{ flexShrink: 0, mr: 2 }}>
              <StyledOcticon icon={SyncIcon} />
            </Button>
            <TextInput
              autocomplete="off"
              maxLength="7"
              onChange={handleColorChanged}
              pattern="#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"
              ref={colorInputElRef}
              required
              title="Hex colors should only contain numbers and letters from a-f"
              value={color}
            />
          </Box>
        </FormGroup>
        <Box
          sx={{
            display: "flex",
            justifyContent: ["flex-start", "flex-start", "flex-end"],
            ml: [0, 0, 5],
            my: [2, 2, 3],
            width: ["100%", "100%", "33.33333%", "25%"],
          }}
        >
          <Button
            onClick={cancel}
            sx={{ color: "btn.text", mr: [0, 0, 2], order: [2, 2, 1] }}
          >
            Cancel
          </Button>
          <ButtonPrimary
            disabled={shouldDisable}
            onClick={handleLabelCreated}
            sx={{ mr: [2, null, 0], order: [1, null, 2] }}
          >
            {!loading ? "Create label" : "Saving..."}
          </ButtonPrimary>
        </Box>
      </Box>
    </Box>
  );
}
