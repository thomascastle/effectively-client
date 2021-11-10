import { gql, useQuery } from "@apollo/client";
import {
  SelectMenu,
  StyledOcticon,
  Box,
  Text,
  Truncate,
  LabelGroup,
  Label,
} from "@primer/components";
import { GearIcon } from "@primer/octicons-react";
import * as React from "react";

export const ISSUES_AVAILABLE_TO_APPLY_QUERY = gql`
  query GetLabelsAvailableToApply {
    labels {
      description
      id
      name
    }
  }
`;

export function SelectLabels({ initial, onChange, onFinish }) {
  const { data, error, loading } = useQuery(ISSUES_AVAILABLE_TO_APPLY_QUERY);
  const [selectedLabels, setSelectedLabels] = React.useState(initial ?? []);

  const handleItemSelected = (e, l) => {
    e.preventDefault();

    if (selectedLabels.find((sl) => sl.id == l.id)) {
      // There was an entry; remove the item from the list
      setSelectedLabels(selectedLabels.filter((sl) => sl.id !== l.id));
    } else {
      // No entry; put the item into the list
      setSelectedLabels([...selectedLabels, { id: l.id, name: l.name }]);
    }
  };

  const handleModalClosed = () => {
    if (onFinish && typeof onFinish === "function") {
      onFinish();
    }
  };

  React.useEffect(() => {
    onChange(selectedLabels);
  }, [selectedLabels]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error while loading data!</p>;

  const { labels } = data;

  return (
    <>
      <SelectMenu>
        <SelectorTarget onModalClosed={handleModalClosed} />
        <SelectMenu.Modal align="right">
          <SelectMenu.Header>Apply labels to this issue</SelectMenu.Header>
          <SelectMenu.List>
            {labels.map((l) => (
              <SelectMenu.Item
                as="button"
                key={l.id}
                onClick={(e) => {
                  handleItemSelected(e, l);
                }}
                selected={!!selectedLabels.find((sl) => sl.id == l.id)}
              >
                <Box>
                  <span>{l.name}</span>
                  <div>
                    <Truncate maxWidth={"100%"}>{l.description}</Truncate>
                  </div>
                </Box>
              </SelectMenu.Item>
            ))}
          </SelectMenu.List>
        </SelectMenu.Modal>
      </SelectMenu>
      {selectedLabels.length > 0 ? (
        <LabelGroup>
          {selectedLabels.map((sl) => (
            <Label key={sl.id}>{sl.name}</Label>
          ))}
        </LabelGroup>
      ) : (
        <Text as="span">None yet</Text>
      )}
    </>
  );
}

function SelectorTarget({ onModalClosed }) {
  const menuContext = React.useContext(SelectMenu.MenuContext);

  React.useEffect(() => {
    if (!menuContext.open) {
      onModalClosed();
    }
  }, [menuContext.open]);

  return (
    <Box
      as="summary"
      sx={{
        fontWeight: 600,
        m: "-4px 0 4px",
        p: "4px 0",
        ":hover": {
          color: "accent.fg",
          cursor: "pointer",
        },
      }}
    >
      Labels
      <StyledOcticon icon={GearIcon} sx={{ float: "right" }} />
    </Box>
  );
}
