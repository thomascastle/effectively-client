import { useUser } from "../context/user";
import { SelectAssignees } from "./SelectAssignees";
import { SelectLabels } from "./SelectLabels";
import { SelectMilestone } from "./SelectMilestone";
import { gql, useMutation } from "@apollo/client";
import {
  Avatar,
  Box,
  ButtonPrimary,
  Link,
  SelectMenu,
  StyledOcticon,
  TabNav,
  Text,
  TextInput,
} from "@primer/components";
import { GearIcon, MarkdownIcon } from "@primer/octicons-react";
import * as React from "react";
import { useHistory } from "react-router-dom";

export const ISSUES_CREATE_MUTATION = gql`
  mutation CreateIssue($input: CreateIssueInput) {
    createIssue(input: $input) {
      issue {
        id
        number
      }
    }
  }
`;

export function IssueCreate({ login, repositoryId, repositoryName }) {
  const history = useHistory();
  const inputTitle = React.useRef(null);
  const [assignees, setAssignees] = React.useState([]);
  const [body, setBody] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [labels, setLabels] = React.useState([]);
  const [milestone, setMilestone] = React.useState(null);
  const [shouldDisable, setShouldDisable] = React.useState(false);
  const { user } = useUser();

  const [createIssue] = useMutation(ISSUES_CREATE_MUTATION, {
    variables: {
      input: {
        assigneeIds: assignees,
        body: body,
        labelIds: labels,
        milestoneId: milestone,
        repositoryId: repositoryId,
        title: title,
      },
    },
  });

  const handleFormSubmitted = async (e) => {
    e.preventDefault();

    const payload = await createIssue();

    history.push(
      "/" +
        login +
        "/" +
        repositoryName +
        "/issues/" +
        payload.data.createIssue.issue.number
    );
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

  React.useEffect(() => {
    setShouldDisable(!title);
  }, [title]);

  React.useEffect(() => {
    inputTitle.current.focus();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: ["column", null, "row"] }}>
        <Box
          sx={{
            flexShrink: 0,
            mb: [4, null, 0],
            px: [0, 2, 3],
            width: ["100%", null, "75%"],
          }}
        >
          <Box
            className="timeline-comment-wrapper"
            sx={{
              border: 0,
              my: 0,
              pl: [0, null, "56px"],
              position: "relative",
            }}
          >
            <Text
              as="span"
              sx={{
                display: ["none", null, "block"],
                float: "left",
                ml: "-56px",
              }}
            >
              <Avatar
                size="40"
                src="https://avatars.githubusercontent.com/primer"
              />
            </Text>
            <Box
              sx={{
                backgroundColor: "bg.canvas",
                border: [0, null, "1px solid"],
                borderColor: [null, null, "border.default"],
                borderRadius: "6px",
                color: "fg.default",
                mb: "8px",
                position: "relative",
              }}
            >
              <form method="post" onSubmit={handleFormSubmitted}>
                <Box
                  sx={{
                    backgroundColor: "bg.canvas",
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                    mb: [3, null, 0],
                    p: [0, null, 2],
                  }}
                >
                  <TextInput
                    contrast
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    placeholder="Title"
                    ref={inputTitle}
                    required
                    sx={{ width: "100%" }}
                    value={title}
                  />
                </Box>
                <Box
                  className="tab-container"
                  sx={{ p: [0, null, 2], position: "relative" }}
                >
                  <TabNav sx={{ display: "flex", mb: "10px" }}>
                    <TabNav.Link href="#" selected>
                      Write
                    </TabNav.Link>
                    <TabNav.Link href="#">Preview</TabNav.Link>
                  </TabNav>
                  <TextInput
                    as="textarea"
                    contrast
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Leave a comment"
                    sx={{
                      height: "200px",
                      maxHeight: "500px",
                      minHeight: "200px",
                      width: "100%",
                    }}
                    value={body}
                  />
                </Box>
                <Box
                  sx={{
                    alignItems: "center",
                    display: ["none", null, "flex"],
                    justifyContent: "flex-end",
                    mb: 2,
                    mx: 2,
                    px: 0,
                  }}
                >
                  <Box
                    sx={{ alignItems: "center", display: "flex", flex: "auto" }}
                  >
                    <Link
                      sx={{
                        color: "fg.muted",
                        display: "inline-block",
                        fontSize: "12px",
                        m: 0,
                        p: 0,
                      }}
                    >
                      <span>
                        <StyledOcticon icon={MarkdownIcon} /> Styling with
                        Markdown is coming soon!
                      </span>
                    </Link>
                  </Box>
                  <ButtonPrimary disabled={shouldDisable} type="submit">
                    Submit new issue
                  </ButtonPrimary>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ flexShrink: 0, px: [0, 2, 3], width: ["100%", null, "25%"] }}
        >
          <Box sx={{ position: "relative" }}>
            <Box sx={{ color: "fg.muted", fontSize: "12px", pt: 3 }}>
              <SelectAssignees onChange={handleSelectedAssigneesChanged} />
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
              <SelectLabels onChange={handleSelectedLabelsChanged} />
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
                  <SelectMenu.List>
                    <SelectMenu.Item>Will be available soon!</SelectMenu.Item>
                  </SelectMenu.List>
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
              <SelectMilestone onChange={handleSelectedMilestoneChanged} />
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
