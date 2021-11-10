import { MILESTONES_QUERY } from "./MilestoneList";
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Heading,
  Link,
  StyledOcticon,
  Text,
  ProgressBar,
  ButtonInvisible,
  Dialog,
  Flash,
  ButtonDanger,
} from "@primer/components";
import { CalendarIcon, ClockIcon } from "@primer/octicons-react";
import { format, formatDistance } from "date-fns";
import * as React from "react";
import { useHistory } from "react-router-dom";

export const MILESTONES_CLOSE_MUTATION = gql`
  mutation ($closeMilestoneId: ID!) {
    closeMilestone(id: $closeMilestoneId) {
      message
      success
    }
  }
`;

export const MILESTONES_DELETE_MUTATION = gql`
  mutation DeleteMilestone($deleteMilestoneId: ID!) {
    deleteMilestone(id: $deleteMilestoneId) {
      message
      success
    }
  }
`;

export const MILESTONES_REOPEN_MUTATION = gql`
  mutation ($reopenMilestoneId: ID!) {
    reopenMilestone(id: $reopenMilestoneId) {
      message
      success
    }
  }
`;

export function MilestoneListItem({ milestone }) {
  const history = useHistory();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [closeMilestone] = useMutation(MILESTONES_CLOSE_MUTATION, {
    refetchQueries: [MILESTONES_QUERY],
    variables: {
      closeMilestoneId: milestone.id,
    },
  });

  const [deleteMilestone] = useMutation(MILESTONES_DELETE_MUTATION, {
    refetchQueries: [MILESTONES_QUERY],
    variables: {
      deleteMilestoneId: milestone.id,
    },
  });

  const [reopenMilestone] = useMutation(MILESTONES_REOPEN_MUTATION, {
    refetchQueries: [MILESTONES_QUERY],
    variables: {
      reopenMilestoneId: milestone.id,
    },
  });

  const handleClosed = async () => {
    await closeMilestone();

    history.push("/milestones?state=closed");
  };

  const handleDeleted = async () => {
    await deleteMilestone();

    setIsDialogOpen(false);
  };

  const handleReopened = async () => {
    await reopenMilestone();

    history.push("/milestones");
  };

  return (
    <Box
      sx={{
        borderTopColor: "border.default",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Box
        sx={{
          px: "20px",
          py: "15px",
          width: "500px",
        }}
      >
        <Heading
          sx={{
            fontHeight: 1.2,
            fontSize: "24px",
            fontWeight: 400,
            mb: "5px",
            mt: 0,
          }}
        >
          <Link
            href={"/milestones/" + milestone.number}
            sx={{ color: "fg.default", ":hover": { color: "accent.fg" } }}
          >
            {milestone.title}
          </Link>
        </Heading>
        <Box sx={{ fontSize: "14px" }}>
          {milestone.closed ? (
            <Text sx={{ mr: "10px" }}>
              <strong>Closed </strong>
              <span>
                {formatDistance(new Date(milestone.closedAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </Text>
          ) : (
            <Text sx={{ mr: "10px" }}>
              {milestone.dueOn ? (
                <>
                  <StyledOcticon icon={CalendarIcon} /> Due on{" "}
                  <span>
                    {format(new Date(milestone.dueOn), "MMMM dd, yyyy")}
                  </span>
                </>
              ) : (
                "No due date"
              )}
            </Text>
          )}
          <Text sx={{ mr: "10px" }}>
            <StyledOcticon icon={ClockIcon} /> Last updated{" "}
            <span>
              {formatDistance(new Date(milestone.updatedAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </Text>
        </Box>
        {milestone.description && (
          <Box sx={{ display: "flex", mt: "5px" }}>
            <Box sx={{ fontSize: "16px", lineHeight: 1.5, width: "100%" }}>
              <Text as="p" sx={{ mb: 3, mt: 0 }}></Text>
              <Text as="p" sx={{ mb: 3, mt: 0 }}>
                {milestone.description}
              </Text>
              <Text as="p" sx={{ mb: 3, mt: 0 }}></Text>
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          px: "20px",
          py: "15px",
        }}
      >
        <ProgressBar progress={0} sx={{ mb: 2, mt: 1 }} />
        <Box>
          <Box
            sx={{
              display: "inline-block",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            <Text>0%</Text>
            <Text sx={{ fontWeight: 400 }}> complete</Text>
          </Box>
          <Box
            sx={{
              display: "inline-block",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              ml: 3,
            }}
          >
            <Text>0</Text>
            <Text sx={{ fontWeight: 400 }}> open</Text>
          </Box>
          <Box
            sx={{
              display: "inline-block",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              ml: 3,
            }}
          >
            <Text>0</Text>
            <Text sx={{ fontWeight: 400 }}> closed</Text>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link href={`/milestones/${milestone.number}/edit`}>
            <ButtonInvisible sx={{ ml: "-12px" }} variant="small">
              Edit
            </ButtonInvisible>
          </Link>
          {milestone.closed ? (
            <ButtonInvisible onClick={handleReopened} variant="small">
              Reopen
            </ButtonInvisible>
          ) : (
            <ButtonInvisible onClick={handleClosed} variant="small">
              Close
            </ButtonInvisible>
          )}
          <ButtonInvisible
            onClick={() => setIsDialogOpen(true)}
            sx={{ color: "text.danger" }}
            variant="small"
          >
            Delete
          </ButtonInvisible>
          <Dialog
            isOpen={isDialogOpen}
            onDismiss={() => setIsDialogOpen(false)}
          >
            <Dialog.Header>Are you sure?</Dialog.Header>
            <Flash full variant="warning">
              Deletions are final!
            </Flash>
            <Box p={3}>
              <Text as="p" sx={{ mt: 0 }}>
                Once you delete this milestone you will not be able to see it
                again. If you would like to close the milestone, remove any
                issues from the milestone and it will automatically close.
              </Text>
              <Text as="p">
                Deleting this milestone will not delete or close the associated
                issues.
              </Text>
            </Box>
            <Box
              sx={{
                background: "transparent",
                border: 0,
                borderBottom: "1px solid",
                borderBottomColor: "border.muted",
                height: 0,
                mx: 0,
                overflow: "hidden",
              }}
            ></Box>
            <Box p={3}>
              <ButtonDanger onClick={handleDeleted} sx={{ width: "100%" }}>
                Delete this milestone
              </ButtonDanger>
            </Box>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}
