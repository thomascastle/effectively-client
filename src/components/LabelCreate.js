import { MUTATION_CREATE_LABEL } from "../datasource/mutations";
import { QUERY_REPOSITORY_LABEL } from "../datasource/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SyncIcon } from "@primer/octicons-react";
import {
  Box,
  Button,
  ButtonPrimary,
  IssueLabelToken,
  FormGroup,
  StyledOcticon,
  TextInput,
  Tooltip,
  PointerBox,
} from "@primer/react";
import generateRandomColor from "randomcolor";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export function LabelCreate({ onCancel: cancel, repositoryId }) {
  const { login, repositoryName } = useParams();
  const colorInputElRef = useRef(null);
  const [formData, setFormData] = useState({
    color: generateRandomColor(),
    description: "",
    name: "",
  });
  const [placeholder, setPlaceholder] = useState("Label preview");
  const [shouldDisable, setShouldDisable] = useState(false);

  const [createLabel, { data, error, loading }] = useMutation(
    MUTATION_CREATE_LABEL,
    {
      refetchQueries: ["GetRepositoryLabels"],
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
          color: formatColor(formData.color),
          description: formData.description,
          name: formData.name,
          repositoryId,
        },
      },
    }
  );

  const [
    findLabel,
    { data: labelData, error: labelError, loading: labelLoading },
  ] = useLazyQuery(QUERY_REPOSITORY_LABEL, {
    variables: {
      labelName: formData.name,
      name: repositoryName,
      owner: login,
    },
  });

  const getNewColor = () => {
    setFormData({ ...formData, color: generateRandomColor() });
  };

  const getProvidedOrDefaultColor = (value) => {
    return isValidColorHex(value) ? value : "#ededed";

    function isValidColorHex(value) {
      return /^#([0-9A-F]{3}){1,2}$/i.test(value);
    }
  };

  const handleLabelCreated = async (e) => {
    e.preventDefault();
    try {
      await createLabel();
    } catch (e) {
      // Is it a good call?
      return null;
    }
    cancel();
  };

  const updateColor = function (e) {
    const value = e.target.value;

    setFormData({ ...formData, color: value });
    if (!value.match(/^#/)) {
      setFormData({ ...formData, color: `#${value}` });
    }
  };

  const updateDescription = function (e) {
    const value = e.target.value;

    setFormData({ ...formData, description: value });
  };

  const updateName = function (e) {
    const value = e.target.value;

    setFormData({ ...formData, name: value });
    setPlaceholder(value.length > 0 ? value : "Label preview");
  };

  useEffect(() => {
    setShouldDisable(
      colorInputElRef.current.validity.valueMissing ||
        colorInputElRef.current.validity.patternMismatch ||
        !formData.name ||
        loading
    );
  }, [formData.color, formData.name, loading]);

  return (
    <Box
      sx={{
        backgroundColor: "bg.tertiary",
        borderColor: "border.default",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: 2,
        mb: 3,
        p: 3,
      }}
    >
      <Box sx={{ mb: 2, mt: 0 }}>
        <IssueLabelToken
          fillColor={getProvidedOrDefaultColor(formData.color)}
          text={placeholder}
          size="large"
        />
      </Box>
      <form method="post" onSubmit={handleLabelCreated}>
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
              position: "relative",
              pr: [0, 1, 3],
              width: ["100%", "100%", "25%"],
            }}
          >
            <FormGroup.Label
              htmlFor="label-name"
              sx={{
                color: labelData?.repository?.label?.name
                  ? "danger.fg"
                  : "fg.default",
              }}
            >
              Label name
            </FormGroup.Label>
            <TextInput
              autoFocus
              onChange={updateName}
              onKeyUp={() => {
                findLabel();
              }}
              placeholder="Label name"
              required
              sx={{ width: "100%" }}
              validationStatus={
                labelData?.repository?.label?.name ? "error" : "none"
              }
              value={formData.name}
            />
            {labelData?.repository?.label?.name ? (
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
                Name has already been taken
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
              onChange={updateDescription}
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
              <Tooltip aria-label="Get a new color" direction="w">
                <Button
                  onClick={getNewColor}
                  sx={{
                    flexShrink: 0,
                    mr: 2,
                    px: "7px",
                  }}
                  type="button"
                >
                  <StyledOcticon icon={SyncIcon} />
                </Button>
              </Tooltip>
              <TextInput
                autocomplete="off"
                maxLength="7"
                onChange={updateColor}
                pattern="#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"
                ref={colorInputElRef}
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
              onClick={cancel}
              sx={{ color: "btn.text", mr: [0, 0, 2], order: [2, 2, 1] }}
              type="button"
            >
              Cancel
            </Button>
            <ButtonPrimary
              disabled={shouldDisable}
              sx={{ mr: [2, null, 0], order: [1, null, 2] }}
              type="submit"
            >
              {!loading ? "Create label" : "Saving..."}
            </ButtonPrimary>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

function formatColor(value) {
  return value.slice(1);
}
