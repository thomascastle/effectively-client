import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  ButtonPrimary,
  Link,
  ProgressBar,
  SelectMenu,
  StyledOcticon,
  TabNav,
  Text,
  TextInput,
} from "@primer/components";
import { CalendarIcon, GearIcon, MarkdownIcon } from "@primer/octicons-react";
import { format } from "date-fns";
import * as React from "react";
import { useParams } from "react-router-dom";

export const MILESTONES_AVAILABLE_TO_SET_QUERY = gql`
  query GetMilestonesAvailableToSet(
    $name: String!
    $owner: String!
    $first: Int
  ) {
    repository(name: $name, owner: $owner) {
      id
      milestones(first: $first) {
        edges {
          node {
            dueOn
            id
            title
          }
        }
      }
      name
      nameWithOwner
    }
  }
`;

export function SelectMilestone({ initial, onChange }) {
  const { login, repositoryName } = useParams();
  const { data, error, loading } = useQuery(MILESTONES_AVAILABLE_TO_SET_QUERY, {
    variables: {
      name: repositoryName,
      first: 100,
      owner: login,
    },
  });
  const [milestone, setMilestone] = React.useState(initial);

  const handleItemSelected = (e, m) => {
    if (milestone && milestone.id == m.id) {
      e.preventDefault();
    }
    setMilestone(m);
  };

  React.useEffect(() => {
    onChange(milestone);
  }, [milestone]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error while loading data! {error.message}</p>;

  const { milestones } = data.repository;

  return (
    <>
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
          Milestones
          <StyledOcticon icon={GearIcon} sx={{ float: "right" }} />
        </Box>
        <SelectMenu.Modal align="right">
          <SelectMenu.Header>Set milestone</SelectMenu.Header>
          <SelectMenu.Filter placeholder="Filter milestones" />
          <SelectMenu.Tabs>
            <SelectMenu.Tab index={0} tabName="Open"></SelectMenu.Tab>
            <SelectMenu.Tab index={1} tabName="Closed"></SelectMenu.Tab>
          </SelectMenu.Tabs>
          <SelectMenu.TabPanel tabName="Open">
            {milestone && (
              <SelectMenu.Item
                as="button"
                onClick={() => {
                  setMilestone(null);
                }}
              >
                Clear this milestone
              </SelectMenu.Item>
            )}
            {milestones.edges.map((m) => (
              <SelectMenu.Item
                as="button"
                key={m.node.id}
                onClick={(e) => {
                  handleItemSelected(e, m.node);
                }}
                selected={milestone && milestone.id == m.node.id}
              >
                <Box>
                  <Text
                    as="p"
                    sx={{ fontSize: "14px", fontWeight: 600, my: 0 }}
                  >
                    {m.node.title}
                  </Text>
                  <Text as="p" sx={{ color: "fg.muted", my: 0 }}>
                    {m.node.dueOn ? (
                      <>
                        <StyledOcticon icon={CalendarIcon} /> Due on{" "}
                        <span>
                          {format(new Date(m.node.dueOn), "MMMM dd, yyyy")}
                        </span>
                      </>
                    ) : (
                      "No due date"
                    )}
                  </Text>
                </Box>
              </SelectMenu.Item>
            ))}
            {milestones.edges.length === 0 && (
              <Box sx={{ color: "fg.muted", cursor: "auto", p: "9px" }}>
                <Text as="span">Nothing to show</Text>
              </Box>
            )}
          </SelectMenu.TabPanel>
          <SelectMenu.TabPanel tabName="Closed">
            <Box sx={{ color: "fg.muted", cursor: "auto", p: "9px" }}>
              <Text as="span">Nothing to show</Text>
            </Box>
          </SelectMenu.TabPanel>
        </SelectMenu.Modal>
      </SelectMenu>
      {milestone ? (
        <>
          <ProgressBar progress={40} sx={{ mb: 2, mt: 1 }} />
          <Link
            href="/somewhere"
            sx={{
              color: "fg.muted",
              display: "block",
              fontWeight: 600,
              mt: 1,
            }}
          >
            {milestone.title}
          </Link>
        </>
      ) : (
        <Text as="span">No milestone</Text>
      )}
    </>
  );
}
