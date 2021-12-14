import { IssueListItem } from "./IssueListItem";
import { Box, Heading, StyledOcticon, Text } from "@primer/components";
import { IssueOpenedIcon } from "@primer/octicons-react";
import { useParams } from "react-router-dom";

export function IssueList({ issues }) {
  const { login, repositoryName } = useParams();

  return issues.length > 0 ? (
    <Box className="list">
      {issues.map((issue) => (
        <IssueListItem
          key={issue.id}
          issue={issue}
          repositoryBaseUrl={"/" + login + "/" + repositoryName}
        />
      ))}
    </Box>
  ) : (
    <Box
      className="blankslate"
      sx={{
        px: 40,
        py: 80,
        position: "relative",
        textAlign: "center",
      }}
    >
      <StyledOcticon
        icon={IssueOpenedIcon}
        size={24}
        sx={{ color: "fg.muted", mb: 2, mx: 1 }}
      />
      <Heading
        as="h3"
        sx={{ color: "fg.default", fontSize: "24px", mb: 1, mt: 3, mx: 0 }}
      >
        No results matched your search.
      </Heading>
      <Text as="p" sx={{ fontSize: "16px", mb: "10px", mt: 0 }}>
        Refine your search query and try again.
      </Text>
    </Box>
  );
}
