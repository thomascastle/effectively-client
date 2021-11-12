import {
  Avatar,
  AvatarStack,
  Box,
  Label,
  LabelGroup,
  Link,
  StyledOcticon,
  Text,
  Tooltip,
} from "@primer/components";
import {
  CommentIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  MilestoneIcon,
} from "@primer/octicons-react";
import { formatDistance } from "date-fns";

export function IssueListItem({ issue }) {
  return (
    <Box
      borderTopColor="border.muted"
      borderTopStyle="solid"
      borderTopWidth="1px"
      display="flex"
      key={issue.number}
      position="relative"
    >
      <Box flexShrink={0} pl={3} py={2}>
        <input type="checkbox" />
      </Box>
      <Box flexShrink={0} pl={3} pt={2}>
        <Tooltip
          aria-label={(issue.closed ? "Closed" : "Open") + " issue"}
          direction="e"
        >
          <StyledOcticon
            icon={issue.closed ? IssueClosedIcon : IssueOpenedIcon}
            sx={{ color: issue.closed ? "done.fg" : "success.fg" }}
          />
        </Tooltip>
      </Box>
      <Box flex="auto" minWidth="0" p={2} pr={[1, 2, 2]}>
        <Link
          className="h4 v-align-middle"
          href={"/issues/" + issue.number}
          sx={{
            color: "fg.default",
            ":hover": { color: "accent.fg", textDecoration: "none" },
          }}
        >
          {issue.title}
        </Link>
        {issue.labels && (
          <LabelGroup>
            {issue.labels.map((label) => (
              <Label
                key={label.id}
                sx={{
                  bg: "prState.closed.bg",
                  color: "prState.closed.text",
                  ml: 1,
                }}
              >
                {label.name}
              </Label>
            ))}
          </LabelGroup>
        )}
        <Box
          className="text-small"
          sx={{ display: "flex", mt: 1, color: "fg.muted" }}
        >
          {issue.closed ? (
            <span className="closed-at">
              #{issue.number} by{" "}
              <Link
                href="/issues?q=author%Athomascastle"
                sx={{
                  color: "inherit",
                  ":hover": {
                    color: "accent.fg",
                    textDecoration: "none",
                  },
                }}
              >
                {issue.createdBy.login}
              </Link>{" "}
              was closed{" "}
              <time
                dateTime={issue.closedAt}
                title={new Date(issue.closedAt).toString()}
              >
                {formatDistance(new Date(issue.closedAt), new Date(), {
                  addSuffix: true,
                })}
              </time>
            </span>
          ) : (
            <span className="opened-by">
              #{issue.number} opened{" "}
              <time
                dateTime={issue.createdAt}
                title={new Date(issue.createdAt).toString()}
              >
                {formatDistance(new Date(issue.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </time>{" "}
              by{" "}
              <Link
                href="/issues?q=author%Athomascastle"
                sx={{
                  color: "inherit",
                  ":hover": {
                    color: "accent.fg",
                    textDecoration: "none",
                  },
                }}
              >
                {issue.createdBy.login}
              </Link>
            </span>
          )}
          {issue.milestone && (
            <Text
              className="issue-milestone"
              sx={{ display: ["none", null, "inline"], maxWidth: 240, ml: 2 }}
            >
              <Link
                href={"/milestones/" + issue.milestone.number}
                sx={{
                  color: "fg.muted",
                  ":hover": {
                    color: "accent.fg",
                    textDecoration: "none",
                  },
                }}
              >
                <StyledOcticon icon={MilestoneIcon} />{" "}
                <span className="truncate-target">{issue.milestone.title}</span>
              </Link>
            </Text>
          )}
        </Box>
      </Box>
      <Box
        display={["none", "flex"]}
        flexShrink={0}
        pr={3}
        pt={2}
        textAlign="right"
        width="25%"
      >
        <Box sx={{ flex: 1, flexShrink: 0, ml: 2 }}></Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexShrink: 0,
            justifyContent: "flex-end",
            ml: 2,
          }}
        >
          {issue.assignees && (
            <AvatarStack>
              {issue.assignees.map((assignee) => (
                <Avatar
                  alt="thomascastle"
                  key={assignee.id}
                  src="https://avatars.githubusercontent.com/github"
                  sx={{ mt: 1 }}
                />
              ))}
            </AvatarStack>
          )}
        </Box>
        <Box sx={{ flex: 1, flexShrink: 0, ml: 2 }}>
          <Link sx={{ color: "fg.muted" }}>
            <StyledOcticon icon={CommentIcon} verticalAlign="middle" />{" "}
            <Text as="span" sx={{ fontSize: "12px", fontWeight: 600 }}>
              1
            </Text>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
