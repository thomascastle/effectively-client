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

export const MILESTONES_AVAILABLE_TO_SET_QUERY = gql`
  query GetMilestonesAvailableToSet {
    milestones {
      dueOn
      id
      title
    }
  }
`;

export function SelectMilestone({ initial, onChange }) {
  const { data, error, loading } = useQuery(MILESTONES_AVAILABLE_TO_SET_QUERY);
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

  const { milestones } = data;

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
              color: "text.link",
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
            {milestones.map((m) => (
              <SelectMenu.Item
                as="button"
                key={m.id}
                onClick={(e) => {
                  handleItemSelected(e, m);
                }}
                selected={milestone && milestone.id == m.id}
              >
                <Box>
                  <Text
                    as="p"
                    sx={{ fontSize: "14px", fontWeight: 600, my: 0 }}
                  >
                    {m.title}
                  </Text>
                  <Text as="p" sx={{ color: "text.secondary", my: 0 }}>
                    {m.dueOn ? (
                      <>
                        <StyledOcticon icon={CalendarIcon} /> Due on{" "}
                        <span>
                          {format(new Date(m.dueOn), "MMMM dd, yyyy")}
                        </span>
                      </>
                    ) : (
                      "No due date"
                    )}
                  </Text>
                </Box>
              </SelectMenu.Item>
            ))}
          </SelectMenu.TabPanel>
          <SelectMenu.TabPanel tabName="Closed">
            <Text as="span">Nothing to show</Text>
          </SelectMenu.TabPanel>
        </SelectMenu.Modal>
      </SelectMenu>
      {milestone ? (
        <>
          <ProgressBar progress={40} sx={{ mb: 2, mt: 1 }} />
          <Link
            href="/somewhere"
            sx={{
              color: "text.secondary",
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
