import { gql, useQuery } from "@apollo/client";
import {
  Box,
  IssueLabelToken,
  LabelGroup,
  Link,
  SelectMenu,
  StyledOcticon,
  Text,
  Truncate,
} from "@primer/components";
import { GearIcon, PencilIcon } from "@primer/octicons-react";
import * as React from "react";
import { useParams } from "react-router-dom";

export const ISSUES_AVAILABLE_TO_APPLY_QUERY = gql`
  query GetLabelsAvailableToApply(
    $name: String!
    $owner: String!
    $first: Int
  ) {
    repository(name: $name, owner: $owner) {
      id
      labels(first: $first) {
        edges {
          node {
            color
            description
            id
            name
          }
        }
      }
      name
      nameWithOwner
    }
  }
`;

export function SelectLabels({ initial, onChange, onFinish }) {
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(ISSUES_AVAILABLE_TO_APPLY_QUERY, {
    variables: {
      name: repositoryName,
      first: 100,
      owner: login,
    },
  });
  const [selectedLabels, setSelectedLabels] = React.useState(initial ?? []);

  const handleItemSelected = (e, l) => {
    e.preventDefault();

    if (selectedLabels.find((sl) => sl.id == l.id)) {
      // There was an entry; remove the item from the list
      setSelectedLabels(selectedLabels.filter((sl) => sl.id !== l.id));
    } else {
      // No entry; put the item into the list
      setSelectedLabels([
        ...selectedLabels,
        { color: l.color, id: l.id, name: l.name },
      ]);
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

  const { labels } = data.repository;

  return (
    <>
      <SelectMenu>
        <SelectorTarget onModalClosed={handleModalClosed} />
        <SelectMenu.Modal align="right">
          <SelectMenu.Header>Apply labels to this issue</SelectMenu.Header>
          <SelectMenu.List>
            {labels.edges.map((l) => (
              <SelectMenu.Item
                as="button"
                key={l.node.id}
                onClick={(e) => {
                  handleItemSelected(e, l.node);
                }}
                selected={!!selectedLabels.find((sl) => sl.id == l.node.id)}
              >
                <Box>
                  <span>{l.node.name}</span>
                  <div>
                    <Truncate maxWidth={"100%"}>{l.node.description}</Truncate>
                  </div>
                </Box>
              </SelectMenu.Item>
            ))}
            <SelectMenu.Footer sx={{ textAlign: "left" }}>
              <Link
                href={"/" + login + "/" + repositoryName + "/labels"}
                sx={{ color: "fg.muted" }}
              >
                <StyledOcticon icon={PencilIcon} size={16} sx={{ mr: 1 }} />
                <Text>Edit labels</Text>
              </Link>
            </SelectMenu.Footer>
          </SelectMenu.List>
        </SelectMenu.Modal>
      </SelectMenu>
      {selectedLabels.length > 0 ? (
        <LabelGroup>
          {selectedLabels.map((sl) => (
            <IssueLabelToken
              fillColor={`#${sl.color}`}
              key={sl.id}
              text={sl.name}
            />
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
