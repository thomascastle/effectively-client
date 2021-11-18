import { Blankslate } from "./Blankslate";
import { LabelCreate } from "./LabelCreate";
import { LabelList } from "./LabelList";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  ButtonPrimary,
  ButtonTableList,
  Heading,
  Link,
  SelectMenu,
  StyledOcticon,
  SubNav,
  Text,
  TextInput,
} from "@primer/components";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MilestoneIcon,
  SearchIcon,
  TagIcon,
} from "@primer/octicons-react";
import * as React from "react";
import { useParams } from "react-router-dom";

export const QUERY_PAGINATED_LABELS = gql`
  query GetPaginatedLabels(
    $after: String
    $before: String
    $name: String!
    $owner: String!
  ) {
    repository(name: $name, owner: $owner) {
      labels(after: $after, before: $before) {
        nodes {
          color
          description
          id
          name
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  }
`;

export function LabelListContainer({ after, before }) {
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(QUERY_PAGINATED_LABELS, {
    variables: {
      after: after,
      before: before,
      name: repositoryName,
      owner: login,
    },
  });
  const [onFormLabelCreate, setOnFormLabelCreate] = React.useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { nodes, pageInfo, totalCount } = data.repository.labels;

  const displayFormLabelCreate = () => {
    setOnFormLabelCreate(!onFormLabelCreate);
  };

  return (
    <Box className="list-container">
      <Box
        sx={{
          display: "flex",
          flexDirection: ["column", "column", "row"],
          mb: "20px",
        }}
      >
        <SubNav>
          <SubNav.Links>
            <SubNav.Link href="/labels" selected>
              <span>
                <StyledOcticon icon={TagIcon} /> Labels
              </span>
            </SubNav.Link>
            <SubNav.Link href="/milestones">
              <span>
                <StyledOcticon icon={MilestoneIcon} /> Milestones
              </span>
            </SubNav.Link>
          </SubNav.Links>
        </SubNav>
        <Box sx={{ mt: [3, 1, 0], pl: [0, 1, 2], pr: [0, 2, 4] }}>
          <TextInput
            icon={SearchIcon}
            placeholder="Search all labels"
            sx={{
              backgroundColor: "bg.secondary",
              color: "fg.muted",
              width: ["100%", "100%", "50%", "320px"],
            }}
          />
        </Box>
        <Box
          sx={{
            display: ["none", "none", "block"],
            ml: "auto",
            position: "relative",
          }}
        >
          <ButtonPrimary onClick={displayFormLabelCreate}>
            New label
          </ButtonPrimary>
        </Box>
      </Box>
      {onFormLabelCreate && (
        <LabelCreate on={onFormLabelCreate} onCancel={displayFormLabelCreate} />
      )}
      {nodes.length < 1 && (
        <Blankslate icon={TagIcon} title="No labels!">
          There aren’t any labels for this repository quite yet. Click on the
          "New Label" button above to create one.
        </Blankslate>
      )}
      {nodes.length > 0 && (
        <Box
          sx={{
            backgroundColor: "canvas.default",
            borderColor: "border.default",
            borderRadius: 6,
            borderStyle: "solid",
            borderWidth: 1,
          }}
        >
          <Box
            className="Box-header"
            sx={{
              backgroundColor: "bg.tertiary",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
            }}
          >
            <Heading className="f5" as="h3">
              <span>{totalCount} labels</span>
            </Heading>
            <SelectMenu sx={{ display: "inline-block", position: "relative" }}>
              <ButtonTableList>Sort</ButtonTableList>
              <SelectMenu.Modal align="right">
                <SelectMenu.Header>Sort</SelectMenu.Header>
                <SelectMenu.List>
                  <SelectMenu.Item>Alphabetically</SelectMenu.Item>
                  <SelectMenu.Item>Reverse alphabetically</SelectMenu.Item>
                  <SelectMenu.Item>Most issues</SelectMenu.Item>
                  <SelectMenu.Item>Fewest issues</SelectMenu.Item>
                </SelectMenu.List>
              </SelectMenu.Modal>
            </SelectMenu>
          </Box>
          <Box className="list">
            <LabelList labels={nodes} />
          </Box>
        </Box>
      )}
      <Box className="pagination">
        {shouldDisplay(pageInfo.hasNextPage, pageInfo.hasPreviousPage) && (
          <Box sx={{ mb: 5, mt: 4, textAlign: "center" }}>
            <Box
              aria-label="Navigation"
              role="navigation"
              sx={{ display: "inline-block" }}
            >
              {pageInfo.hasPreviousPage ? (
                <Link
                  href={"/labels?before=" + pageInfo.startCursor}
                  rel="prev"
                  sx={{
                    border: "1px solid",
                    borderColor: "transparent",
                    borderRadius: "6px",
                    display: "inline-block",
                    fontStyle: "normal",
                    lineHeight: "20px",
                    minWidth: "32px",
                    padding: "5px 10px",
                    transition: "border-color .2s cubic-bezier(0.3, 0, 0.5, 1)",
                    verticalAlign: "middle",
                    ":hover": {
                      borderColor: "border.muted",
                      textDecoration: "none",
                    },
                  }}
                >
                  <StyledOcticon icon={ChevronLeftIcon} /> Previous
                </Link>
              ) : (
                <Text
                  sx={{
                    border: "1px solid",
                    borderColor: "transparent",
                    borderRadius: "6px",
                    color: "text.disabled",
                    cursor: "default",
                    display: "inline-block",
                    fontStyle: "normal",
                    lineHeight: "20px",
                    minWidth: "32px",
                    padding: "5px 10px",
                    verticalAlign: "middle",
                  }}
                >
                  <StyledOcticon icon={ChevronLeftIcon} /> Previous
                </Text>
              )}
              {pageInfo.hasNextPage ? (
                <Link
                  href={"/labels?after=" + pageInfo.endCursor}
                  rel="next"
                  sx={{
                    border: "1px solid",
                    borderColor: "transparent",
                    borderRadius: "6px",
                    display: "inline-block",
                    fontStyle: "normal",
                    lineHeight: "20px",
                    minWidth: "32px",
                    padding: "5px 10px",
                    transition: "border-color .2s cubic-bezier(0.3, 0, 0.5, 1)",
                    verticalAlign: "middle",
                    ":hover": {
                      borderColor: "border.muted",
                      textDecoration: "none",
                    },
                  }}
                >
                  Next <StyledOcticon icon={ChevronRightIcon} />
                </Link>
              ) : (
                <Text
                  sx={{
                    border: "1px solid",
                    borderColor: "transparent",
                    borderRadius: "6px",
                    color: "text.disabled",
                    cursor: "default",
                    display: "inline-block",
                    fontStyle: "normal",
                    lineHeight: "20px",
                    minWidth: "32px",
                    padding: "5px 10px",
                    verticalAlign: "middle",
                  }}
                >
                  Next <StyledOcticon icon={ChevronRightIcon} />
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function shouldDisplay(hasNextPage, hasPreviousPage) {
  return hasNextPage || hasPreviousPage;
}
