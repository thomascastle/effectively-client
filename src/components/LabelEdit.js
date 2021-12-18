import { MUTATION_UPDATE_LABEL } from "../datasource/mutations";
import { useMutation } from "@apollo/client";
import { SyncIcon } from "@primer/octicons-react";
import {
  Box,
  Button,
  ButtonPrimary,
  FormGroup,
  IssueLabelToken,
  PointerBox,
  StyledOcticon,
  TextInput,
} from "@primer/react";
import generateRandomColor from "randomcolor";
import { useEffect, useRef, useState } from "react";

export function LabelEdit({ label, on, onCancel: cancel }) {
  const [formData, setFormData] = useState({
    color: `#${label.color}` ?? "#ededed",
    description: label.description ?? "",
    name: label.name,
  });
  const inputColor = useRef(null);
  const [placeholder, setPlaceholder] = useState(label.name);
  const [shouldDisable, setShouldDisable] = useState(false);

  const changeColor = function (e) {
    const value = e.target.value;

    setFormData({ ...formData, color: value });
    if (!value.match(/^#/)) {
      setFormData({ ...formData, color: `#${value}` });
    }
  };

  const changeDescription = (e) => {
    const value = e.target.value;

    setFormData({ ...formData, description: value });
  };

  const changeName = (e) => {
    const value = e.target.value;

    setFormData({ ...formData, name: value });
    setPlaceholder(value.length > 0 ? value : "Label preview");
  };

  const getProvidedOrDefaultColor = (value) => {
    return isValidColorHex(value) ? value : "#ededed";

    function isValidColorHex(value) {
      return /^#([0-9A-F]{3}){1,2}$/i.test(value);
    }
  };

  const getNewColor = () => {
    setFormData({ ...formData, color: generateRandomColor() });
  };

  const [updateLabel, { error, loading }] = useMutation(MUTATION_UPDATE_LABEL, {
    optimisticResponse: {
      updateLabel: {
        label: {
          __typename: "Label",
          color: formData.color,
          description: formData.description,
          id: label.id,
          name: formData.name,
        },
      },
    },
    variables: {
      updateLabelInput: {
        color: formData.color,
        description: formData.description,
        id: label.id,
        name: formData.name,
      },
    },
  });

  const handleFormSubmitted = async (e) => {
    e.preventDefault();

    try {
      await updateLabel();
    } catch (e) {
      return null;
    }

    cancel();
  };

  useEffect(() => {
    setShouldDisable(
      inputColor.current.validity.valueMissing ||
        inputColor.current.validity.patternMismatch ||
        !formData.name ||
        loading
    );
  }, [formData.color, loading, formData.name]);

  return (
    <>
      <Box sx={{ width: ["75%", "75%", "25%"] }}>
        <IssueLabelToken
          fillColor={getProvidedOrDefaultColor(formData.color)}
          text={placeholder}
          size="large"
        />
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
        <form method="post" onSubmit={handleFormSubmitted}>
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
              <FormGroup.Label
                htmlFor="label-name"
                sx={{
                  color: error ? "danger.fg" : "fg.default",
                }}
              >
                Label name
              </FormGroup.Label>
              <TextInput
                autoFocus
                onChange={changeName}
                placeholder="Label name"
                required
                sx={{ width: "100%" }}
                validationStatus={error ? "error" : "none"}
                value={formData.name}
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
                onChange={changeDescription}
                placeholder="Description (optional)"
                sx={{ width: "100%" }}
                value={formData.description}
              />
            </FormGroup>
            <FormGroup
              sx={{ my: [2, 2, 3], width: ["100%", "100%", "16.66667%"] }}
            >
              <FormGroup.Label htmlFor="label-color">Color</FormGroup.Label>
              <Box sx={{ display: "flex" }}>
                <Button
                  onClick={getNewColor}
                  sx={{ flexShrink: 0, mr: 2, px: "7px" }}
                  type="button"
                >
                  <StyledOcticon icon={SyncIcon} />
                </Button>
                <TextInput
                  autocomplete="off"
                  maxLength="7"
                  onChange={changeColor}
                  pattern="#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"
                  ref={inputColor}
                  required
                  title="Hex colors should only contain numbers and letters from a-f"
                  value={formData.color}
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
                type="button"
              >
                Cancel
              </Button>
              <ButtonPrimary
                disabled={shouldDisable}
                sx={{ mr: [2, null, 0], order: [1, null, 2] }}
                type="submit"
              >
                {!loading ? "Save changes" : "Saving..."}
              </ButtonPrimary>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
}
