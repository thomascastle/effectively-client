import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  ButtonPrimary,
  FormGroup,
  Label,
  StyledOcticon,
  TextInput,
} from "@primer/components";
import { SyncIcon } from "@primer/octicons-react";
import * as React from "react";

export const MUTATION_UPDATE_LABELS = gql`
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

export function LabelEdit({ label, on, onCancel: cancel }) {
  const [name, setName] = React.useState(label.name);
  const [description, setDescription] = React.useState(label.description ?? "");
  const [color, setColor] = React.useState(label.color ?? "");
  const [shouldDisable, setShouldDisable] = React.useState(false);
  const inputColor = React.useRef(null);

  const [updateLabel, { loading }] = useMutation(MUTATION_UPDATE_LABELS, {
    optimisticResponse: {
      updateLabel: {
        label: {
          __typename: "Label",
          color: color,
          description: description,
          id: label.id,
          name: name,
        },
      },
    },
    variables: {
      updateLabelInput: {
        color: color,
        description: description,
        id: label.id,
        name: name,
      },
    },
  });

  const saveChanges = async () => {
    await updateLabel();
    cancel();
  };

  const handleColorChanged = function (e) {
    const value = e.target.value;

    setColor(value);
    if (!value.match(/^#/)) {
      setColor(`#${value}`);
    }
  };

  React.useEffect(() => {
    setShouldDisable(
      inputColor.current.validity.valueMissing ||
        inputColor.current.validity.patternMismatch ||
        !name ||
        loading
    );
  }, [color, loading, name]);

  return (
    <>
      <Box sx={{ width: ["75%", "75%", "25%"] }}>
        <Label sx={{}} variant="large">
          {name}
        </Label>
      </Box>
      <Box
        className="f6"
        sx={{
          color: "fg.muted",
          display: ["none", "none", "block"],
          pr: 3,
          width: "33.33333%",
        }}
      ></Box>
      <Box
        className="f6"
        sx={{
          color: "fg.muted",
          display: ["none", "none", "block"],
          pr: 3,
          width: "25%",
        }}
      ></Box>
      <Box
        className="f6"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: ["25%", "25%", "16.66667%"],
        }}
      ></Box>
      <Box
        display={!on ? "none" : null}
        className="labels-edit"
        sx={{
          width: "100%",
        }}
      >
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
              onChange={(e) => {
                setName(e.target.value);
              }}
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
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="Description (optional)"
              sx={{ width: "100%" }}
              value={description}
            />
          </FormGroup>
          <FormGroup
            sx={{ my: [2, 2, 3], width: ["100%", "100%", "16.66667%"] }}
          >
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
                ref={inputColor}
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
              onClick={() => {
                cancel();
              }}
              sx={{
                color: "btn.text",
                mr: [0, 0, 2],
                order: [2, 2, 1],
              }}
            >
              Cancel
            </Button>
            <ButtonPrimary
              disabled={shouldDisable}
              onClick={saveChanges}
              sx={{ mr: [2, null, 0], order: [1, null, 2] }}
            >
              {!loading ? "Save changes" : "Saving..."}
            </ButtonPrimary>
          </Box>
        </Box>
      </Box>
    </>
  );
}
