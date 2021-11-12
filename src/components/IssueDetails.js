import { SelectAssignees } from "./SelectAssignees";
import { SelectLabels } from "./SelectLabels";
import { SelectMilestone } from "./SelectMilestone";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  ButtonDanger,
  ButtonPrimary,
  Dialog,
  Heading,
  Label,
  Link,
  SelectMenu,
  StateLabel,
  StyledOcticon,
  TabNav,
  Text,
  TextInput,
} from "@primer/components";
import {
  CircleSlashIcon,
  GearIcon,
  KebabHorizontalIcon,
  SmileyIcon,
  TrashIcon,
} from "@primer/octicons-react";
import { formatDistance } from "date-fns";
import * as React from "react";
import { useHistory } from "react-router-dom";

export const ISSUES_UPDATE_ASSIGNEES_MUTATION = gql`
  mutation UpdateIssueAssignees($updateIssueInput: UpdateIssueInput!) {
    updateIssue(input: $updateIssueInput) {
      issue {
        id
      }
    }
  }
`;

export const ISSUES_UPDATE_TITLE_MUTATION = gql`
  mutation UpdateIssueTitle($updateIssueInput: UpdateIssueInput!) {
    updateIssue(input: $updateIssueInput) {
      issue {
        __typename
        id
        title
      }
    }
  }
`;

export const ISSUES_UPDATE_LABLES_MUTATION = gql`
  mutation UpdateIssueLabels($updateIssueInput: UpdateIssueInput!) {
    updateIssue(input: $updateIssueInput) {
      issue {
        id
        labels {
          color
          description
          id
          name
        }
      }
    }
  }
`;

export const ISSUES_UPDATE_MILESTONE_MUTATION = gql`
  mutation UpdateIssueLabels($updateIssueInput: UpdateIssueInput!) {
    updateIssue(input: $updateIssueInput) {
      issue {
        id
      }
    }
  }
`;

export const ISSUES_DELETE_MUTATION = gql`
  mutation ($deleteIssueId: ID!) {
    deleteIssue(id: $deleteIssueId) {
      success
    }
  }
`;

export function IssueDetails({ issue }) {
  const history = useHistory();
  const [editing, setEditing] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [shouldDisable, setShouldDisable] = React.useState(false);
  const [title, setTitle] = React.useState(issue.title);
  const [assignees, setAssignees] = React.useState(
    issue.assignees.map((a) => a.id)
  );
  const [labels, setLabels] = React.useState(issue.labels.map((l) => l.id));
  const [milestone, setMilestone] = React.useState(
    issue.milestone ? issue.milestone.id : null
  );

  const [updateIssueAssignees] = useMutation(ISSUES_UPDATE_ASSIGNEES_MUTATION, {
    variables: {
      updateIssueInput: {
        id: issue.id,
        assigneeIds: assignees,
      },
    },
  });

  const [updateIssueTitle, { loading }] = useMutation(
    ISSUES_UPDATE_TITLE_MUTATION,
    {
      optimisticResponse: {
        updateIssue: {
          issue: {
            __typename: "Issue",
            id: issue.id,
            title: title,
          },
        },
      },
      variables: {
        updateIssueInput: {
          id: issue.id,
          title: title,
        },
      },
    }
  );

  const [updateIssueLabels] = useMutation(ISSUES_UPDATE_LABLES_MUTATION, {
    variables: {
      updateIssueInput: {
        id: issue.id,
        labelIds: labels,
      },
    },
  });

  const [updateIssueMilestone] = useMutation(ISSUES_UPDATE_MILESTONE_MUTATION, {
    variables: {
      updateIssueInput: {
        id: issue.id,
        milestoneId: milestone,
      },
    },
  });

  const [deleteIssue, { loading: deleting }] = useMutation(
    ISSUES_DELETE_MUTATION,
    {
      variables: {
        deleteIssueId: issue.id,
      },
    }
  );

  const handleAssigneeSelectionFinished = async () => {
    await updateIssueAssignees();
  };

  const handleLabelSelectionFinished = async () => {
    const initiallySelectedLabels = issue.labels.map((l) => l.id);
    if (
      !(
        initiallySelectedLabels.length === labels.length &&
        labels.every((l) => initiallySelectedLabels.includes(l))
      )
    ) {
      await updateIssueLabels();
    }
  };

  const handleSelectedAssigneesChanged = (assignees) => {
    setAssignees(assignees.map((a) => a.id));
  };

  const handleSelectedLabelsChanged = (labels) => {
    setLabels(labels.map((l) => l.id));
  };

  const handleSelectedMilestoneChanged = (milestone) => {
    setMilestone(milestone ? milestone.id : null);
  };

  const handleFormSubmitted = async (e) => {
    e.preventDefault();

    await updateIssueTitle();

    setEditing(false);
  };

  const handleIssueDeleted = async () => {
    await deleteIssue();

    setIsDialogOpen(false);

    history.push("/issues");
  };

  React.useEffect(() => {
    setShouldDisable(loading || !title);
  }, [loading, title]);

  React.useEffect(async () => {
    await updateIssueAssignees();
  }, [assignees]);

  React.useEffect(async () => {
    await updateIssueMilestone();
  }, [milestone]);

  return (
    <Box>
      <Box sx={{ backgroundColor: "bg.canvas", mb: 3 }}>
        <Box sx={{ display: !editing ? "block" : "none" }}>
          <Box sx={{ display: "flex", flexDirection: ["column", null, "row"] }}>
            <Heading
              as="h1"
              sx={{
                mb: 2,
                mr: 0,
                mt: 0,
                flex: "auto",
                fontSize: ["26px", null, "32px"],
                fontWeight: 400,
                lineHeight: 1.25,
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              <Text as="span">{issue.title}</Text>{" "}
              <Text
                as="span"
                sx={{
                  color: "text.tertiary",
                  fontSize: ["26px", null, "32px"],
                  fontWeight: 300,
                }}
              >
                #{issue.number}
              </Text>
            </Heading>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexShrink: 0,
                mb: [3, null, 0],
                mt: [1, null, 2],
                mx: 0,
                order: [null, null, 1],
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
              <Link href="/issues/new" sx={{ ml: 2 }}>
                <ButtonPrimary variant="small">New issue</ButtonPrimary>
              </Link>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: editing ? "block" : "none",
            mb: 2,
            position: "relative",
          }}
        >
          <form method="post" onSubmit={handleFormSubmitted}>
            <Box
              sx={{ display: "flex", flexDirection: ["column", null, "row"] }}
            >
              <Box sx={{ flex: "auto", flexGrow: 1, mr: [0, null, 3] }}>
                <TextInput
                  contrast
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  ref={(input) => input && input.focus()}
                  sx={{ width: "100%" }}
                  value={title}
                />
              </Box>
              <Box sx={{ mt: [2, null, 0] }}>
                <Button disabled={shouldDisable} sx={{ mr: 2 }} type="submit">
                  {!loading ? "Save" : "Updating"}
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
        <Box
          sx={{
            alignItems: "center",
            borderBottomColor: "border.default",
            borderBottomStyle: "solid",
            borderBottomWidth: "1px",
            color: "fg.muted",
            display: "flex",
            fontSize: "14px",
            flexWrap: "wrap",
            mb: 3,
            mt: 0,
            pb: 2,
          }}
        >
          <Box
            sx={{
              alignSelf: ["flex-start", null, "center"],
              flexShrink: 0,
              mb: 2,
            }}
          >
            <StateLabel
              status={issue.state === "OPEN" ? "issueOpened" : "issueClosed"}
              sx={{ mr: 2 }}
            >
              {issue.state === "OPEN" ? "Open" : "Closed"}
            </StateLabel>
          </Box>
          <Box sx={{ flex: "auto", minWidth: 0, mb: 2 }}>
            <Text as="span">
              <Link
                href="#"
                sx={{
                  color: "fg.muted",
                  fontWeight: 600,
                  ":hover": { color: "accent.fg" },
                }}
              >
                {issue.createdBy.login}
              </Link>{" "}
              opened this issue{" "}
              <time
                dateTime={issue.createdAt}
                title={new Date(issue.createdAt).toString()}
              >
                {formatDistance(new Date(issue.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </time>{" "}
              . 0 comments
            </Text>
          </Box>
        </Box>
        <Box></Box>
        <Box></Box>
      </Box>
      <Box id="discussion_bucket">
        <Box
          sx={{
            display: "flex",
            flexDirection: ["column", null, "row"],
            mx: -3,
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              mb: [4, null, 0],
              px: [0, 2, 3],
              width: ["100%", null, "75%"],
            }}
          >
            <Box
              sx={{
                border: 0,
                ml: [0, null, "40px"],
                pl: [0, null, 3],
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  ml: 3,
                  position: "relative",
                  pb: 3,
                  pt: 0,
                  px: 0,
                }}
              >
                <Box
                  sx={{
                    display: ["none", null, "block"],
                    left: "-72px",
                    position: "absolute",
                  }}
                >
                  <Avatar
                    size="40"
                    src="https://avatars.githubusercontent.com/primer"
                  />
                </Box>
                <Box
                  sx={{
                    color: "timeline.text",
                    flex: "auto",
                    maxWidth: "100%",
                    minWidth: 0,
                    my: 0,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "bg.primary",
                      border: "1px solid",
                      borderColor: "box.borderInfo",
                      borderRadius: "6px",
                      color: "fg.default",
                      ml: -3,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: "center",
                        backgroundColor: "bg.info",
                        borderBottom: "1px solid",
                        borderBottomColor: "box.borderInfo",
                        borderTopLeftRadius: "6px",
                        borderTopRightRadius: "6px",
                        color: "fg.muted",
                        display: ["block", "flex"],
                        flexDirection: "row-reverse",
                        px: 3,
                      }}
                    >
                      <Box sx={{ flexShrink: 0, float: "right", ml: 2 }}>
                        <StyledOcticon icon={SmileyIcon} />
                        <StyledOcticon icon={KebabHorizontalIcon} />
                      </Box>
                      <Box
                        sx={{ alignItems: "center", display: ["none", "flex"] }}
                      >
                        <Label outline small sx={{ fontWeight: 500, ml: 2 }}>
                          Owner
                        </Label>
                      </Box>
                      <Heading
                        as="h3"
                        sx={{
                          flex: "1 1 auto",
                          fontSize: "14px",
                          fontWeight: 400,
                          minWidth: 0,
                          mb: "1px",
                          pb: 2,
                          pt: 2,
                        }}
                      >
                        <strong>
                          <Link
                            href="#"
                            sx={{
                              color: "fg.default",
                              ":hover": {
                                color: "accent.fg",
                              },
                            }}
                          >
                            thomascastle
                          </Link>
                        </strong>{" "}
                        commented on Jul 14
                      </Heading>
                    </Box>
                    <Box>
                      <Box
                        sx={{
                          fontSize: "14px",
                          overflow: "visible",
                          padding: "15px",
                          width: "100%",
                        }}
                      >
                        <h3>Read this</h3>
                        <p>Placeholder. Unimplemented feature</p>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{ flexShrink: 0, px: [0, 2, 3], width: ["100%", null, "25%"] }}
          >
            <Box sx={{ position: "relative" }}>
              <Box sx={{ color: "fg.muted", fontSize: "12px", pt: 3 }}>
                <SelectAssignees
                  initial={issue.assignees}
                  onChange={handleSelectedAssigneesChanged}
                  onFinish={handleAssigneeSelectionFinished}
                />
              </Box>
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: "border.muted",
                  color: "fg.muted",
                  fontSize: "12px",
                  mt: 3,
                  pt: 3,
                }}
              >
                <SelectLabels
                  initial={issue.labels}
                  onChange={handleSelectedLabelsChanged}
                  onFinish={handleLabelSelectionFinished}
                />
              </Box>
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: "border.muted",
                  color: "fg.muted",
                  fontSize: "12px",
                  mt: 3,
                  pt: 3,
                }}
              >
                <SelectMenu>
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
                    Projects
                    <StyledOcticon icon={GearIcon} sx={{ float: "right" }} />
                  </Box>
                  <SelectMenu.Modal align="right">
                    <SelectMenu.Header>Projects</SelectMenu.Header>
                    <SelectMenu.Filter placeholder="Filter projects" />
                  </SelectMenu.Modal>
                </SelectMenu>
                <Text as="span">None yet</Text>
              </Box>
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: "border.muted",
                  color: "fg.muted",
                  fontSize: "12px",
                  mt: 3,
                  pt: 3,
                }}
              >
                <SelectMilestone
                  initial={issue.milestone}
                  onChange={handleSelectedMilestoneChanged}
                />
              </Box>
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: "border.muted",
                  color: "fg.muted",
                  fontSize: "12px",
                  mt: 3,
                  pt: 3,
                }}
              >
                <Box sx={{ fontWeight: 600, mb: 2 }}>Helpfull resources</Box>
                <Text as="span">Community Guidelines</Text>
              </Box>
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: "border.muted",
                  color: "fg.muted",
                  fontSize: "12px",
                  mt: 3,
                  pt: 3,
                }}
              >
                <Box
                  as="summary"
                  onClick={() => {
                    setIsDialogOpen(true);
                  }}
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
                  <Text as="span">
                    <StyledOcticon icon={TrashIcon} /> Delete issue
                  </Text>
                </Box>
                <Dialog
                  isOpen={isDialogOpen}
                  onDismiss={() => {
                    setIsDialogOpen(false);
                  }}
                  sx={{ color: "fg.default" }}
                >
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <StyledOcticon
                      icon={CircleSlashIcon}
                      size={40}
                      sx={{ color: "text.danger" }}
                    />
                    <Box>
                      <Heading as="h4" sx={{ fontSize: "16px", mt: 4 }}>
                        Are you sure you want to delete this issue?
                      </Heading>
                      <Box
                        sx={{
                          mb: 4,
                          mt: 1,
                          mx: "auto",
                          textAlign: "left",
                          width: "75%",
                        }}
                      >
                        <ul>
                          <li>This cannot be undone</li>
                          <li>Only administrators can delete issues</li>
                          <li>
                            Deletion will remove the issue from search and
                            previous references will point to a placeholder
                          </li>
                        </ul>
                      </Box>
                      <ButtonDanger
                        onClick={handleIssueDeleted}
                        sx={{ width: "100%" }}
                      >
                        {!deleting ? "Delete this issue" : "Deleting issue..."}
                      </ButtonDanger>
                    </Box>
                  </Box>
                </Dialog>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
