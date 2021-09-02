import { LabelCreate } from "../components/LabelCreate";
import { LabelList } from "../components/LabelList";
import { Layout } from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  ButtonOutline,
  ButtonPrimary,
  ButtonTableList,
  FormGroup,
  Heading,
  Label,
  SelectMenu,
  StyledOcticon,
  SubNav,
  TextInput,
} from "@primer/components";
import {
  MilestoneIcon,
  SearchIcon,
  SyncIcon,
  TagIcon,
} from "@primer/octicons-react";
import * as React from "react";

export const LABELS_COUNT_QUERY = gql`
  query GetLabelsCount {
    labels {
      totalCount
    }
  }
`;

export function LabelIndexPage() {
  const [onFormLabelCreate, setOnFormLabelCreate] = React.useState(false);

  const displayFormLabelCreate = () => {
    setOnFormLabelCreate(!onFormLabelCreate);
  };

  return (
    <Layout>
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
                color: "text.secondary",
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
          <LabelCreate
            on={onFormLabelCreate}
            onCancel={displayFormLabelCreate}
          />
        )}
        <Box
          sx={{
            borderColor: "border.primary",
            borderRadius: 6,
            borderStyle: "solid",
            borderWidth: "1px",
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
              <TotalCount />
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
            <LabelList />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

function TotalCount() {
  const { data, error, loading } = useQuery(LABELS_COUNT_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { totalCount } = data.labels;

  return <span>{totalCount} labels</span>;
}
