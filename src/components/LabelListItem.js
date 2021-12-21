import { LabelEdit } from "./LabelEdit";
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  IssueLabelToken,
  Button,
  Dialog,
  ButtonDanger,
  Text,
} from "@primer/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export const MUTATION_DELETE_LABELS = gql`
  mutation DeleteLabel($deleteLabelId: ID!) {
    deleteLabel(id: $deleteLabelId) {
      success
      message
    }
  }
`;

export function LabelListItem({ label }) {
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const cancelEdit = () => {
    setEditing(false);
  };

  const [deleteLabel] = useMutation(MUTATION_DELETE_LABELS, {
    refetchQueries: ["GetPaginatedLabels"],
    variables: {
      deleteLabelId: label.id,
    },
  });

  const handleLabelDeleted = async () => {
    await deleteLabel();
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        alignItems: ["center", "center", "baseline"],
        borderTopColor: "border.default",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        m: 0,
        p: 3,
      }}
    >
      {editing ? (
        <LabelEdit on={editing} label={label} onCancel={cancelEdit} />
      ) : (
        <>
          <Box sx={{ width: ["75%", "75%", "25%"] }}>
            <IssueLabelToken
              as="a"
              href={location.pathname + "/" + label.name}
              size="large"
              text={label.name}
              fillColor={`#${label.color}`}
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
          >
            <span>{label.description}</span>
          </Box>
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
          >
            <Button
              onClick={(e) => {
                setEditing(true);
              }}
              variant="small"
            >
              Edit
            </Button>
            <Button onClick={() => setIsDialogOpen(true)} variant="small">
              Delete
            </Button>
            <Dialog
              isOpen={isDialogOpen}
              onDismiss={() => setIsDialogOpen(false)}
            >
              <Dialog.Header>Delete</Dialog.Header>
              <Box p={3}>
                <Text>
                  Are you sure? Deleting a label will remove it from all issues.
                </Text>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                  <Button onClick={() => setIsDialogOpen(false)} sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                  <ButtonDanger onClick={handleLabelDeleted}>
                    Delete
                  </ButtonDanger>
                </Box>
              </Box>
            </Dialog>
          </Box>
        </>
      )}
    </Box>
  );
}
