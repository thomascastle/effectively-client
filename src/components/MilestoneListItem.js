import { gql, useMutation } from "@apollo/client";
import { CalendarIcon, ClockIcon } from "@primer/octicons-react";
import {
  Box,
  Heading,
  Link,
  StyledOcticon,
  Text,
  ProgressBar,
  Dialog,
  Flash,
  ButtonDanger,
} from "@primer/react";
import { format, formatDistance } from "date-fns";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";

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
  const { login, repositoryName } = useParams();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [closeMilestone] = useMutation(MILESTONES_CLOSE_MUTATION, {
    refetchQueries: ["GetRepositoryMilestones"],
    variables: {
      closeMilestoneId: milestone.id,
    },
  });

  const [deleteMilestone] = useMutation(MILESTONES_DELETE_MUTATION, {
    refetchQueries: ["GetRepositoryMilestones"],
    variables: {
      deleteMilestoneId: milestone.id,
    },
  });

  const [reopenMilestone] = useMutation(MILESTONES_REOPEN_MUTATION, {
    refetchQueries: ["GetRepositoryMilestones"],
    variables: {
      reopenMilestoneId: milestone.id,
    },
  });

  const handleClosed = async (e) => {
    e.preventDefault();

    await closeMilestone();

    history.push(
      "/" + login + "/" + repositoryName + "/milestones?state=closed"
    );
  };

  const handleDeleted = async () => {
    await deleteMilestone();

    setIsDialogOpen(false);
  };

  const handleReopened = async (e) => {
    e.preventDefault();

    await reopenMilestone();

    history.push("/" + login + "/" + repositoryName + "/milestones");
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
          borderLeftColor: "border.default",
          borderLeftStyle: "solid",
          borderLeftWidth: "1px",
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
            href={
              "/" +
              login +
              "/" +
              repositoryName +
              "/milestones/" +
              milestone.number
            }
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
          borderRightColor: "border.default",
          borderRightStyle: "solid",
          borderRightWidth: "1px",
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
          <Link
            href={`/${login}/${repositoryName}/milestones/${milestone.number}/edit`}
            sx={{ display: "inline-block", mr: 2 }}
          >
            Edit
          </Link>
          {milestone.closed ? (
            <Link
              as="button"
              onClick={handleReopened}
              sx={{ display: "inline-block", mr: 2 }}
            >
              Reopen
            </Link>
          ) : (
            <Link
              as="button"
              onClick={handleClosed}
              sx={{ display: "inline-block", mr: 2 }}
            >
              Close
            </Link>
          )}
          <Link
            as="button"
            onClick={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
            sx={{
              color: "danger.fg",
              display: "inline-block",
              ":hover": {
                textDecoration: "none",
              },
            }}
          >
            Delete
          </Link>
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
