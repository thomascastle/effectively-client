import { LabelEdit } from "./LabelEdit";
import { LABELS_PAGINATED_QUERY } from "./LabelListContainer";
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Label,
  Button,
  Dialog,
  ButtonDanger,
  Text,
} from "@primer/components";
import * as React from "react";

export const LABELS_DELETE_MUTATION = gql`
  mutation DeleteLabel($deleteLabelId: ID!) {
    deleteLabel(id: $deleteLabelId) {
      success
      message
    }
  }
`;

export function LabelListItem({ label }) {
  const [displayEdit, setDisplayEdit] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const cancelEdit = () => {
    setDisplayEdit(false);
  };

  const [deleteLabel] = useMutation(LABELS_DELETE_MUTATION, {
    refetchQueries: [LABELS_PAGINATED_QUERY],
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
      <Box sx={{ width: ["75%", "75%", "25%"] }}>
        <Label sx={{}} variant="large">
          {label.name}
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
            setDisplayEdit(true);
          }}
          variant="small"
        >
          Edit
        </Button>
        <Button onClick={() => setIsDialogOpen(true)} variant="small">
          Delete
        </Button>
        <Dialog isOpen={isDialogOpen} onDismiss={() => setIsDialogOpen(false)}>
          <Dialog.Header>Delete</Dialog.Header>
          <Box p={3}>
            <Text>
              Are you sure? Deleting a label will remove it from all issues.
            </Text>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button onClick={() => setIsDialogOpen(false)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <ButtonDanger onClick={handleLabelDeleted}>Delete</ButtonDanger>
            </Box>
          </Box>
        </Dialog>
      </Box>
      {displayEdit && (
        <LabelEdit on={displayEdit} label={label} onCancel={cancelEdit} />
      )}
    </Box>
  );
}
