import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  ButtonPrimary,
  Dialog,
  Link,
  SelectMenu,
  StyledOcticon,
  TabNav,
  Text,
  TextInput,
} from "@primer/components";
import { GearIcon, MarkdownIcon } from "@primer/octicons-react";
import * as React from "react";

export const USERS_AVAILABLE_TO_ASSIGN_QUERY = gql`
  query GetUsersAvailableToAssign {
    users {
      id
      username
      name
    }
  }
`;

export function SelectAssignees({ initial, onChange, onFinish }) {
  const { data, error, loading } = useQuery(USERS_AVAILABLE_TO_ASSIGN_QUERY);
  const [assignees, setAssignees] = React.useState(initial ?? []);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    onChange(assignees);
  }, [assignees]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  const { users } = data;

  const handleItemSelected = (e, u) => {
    e.preventDefault();

    if (assignees.find((a) => a.id == u.id)) {
      // There was an entry; remove the item from the list
      setAssignees(assignees.filter((a) => a.id !== u.id));
    } else {
      // No entry; put the item into the list
      setAssignees([...assignees, { id: u.id, username: u.username }]);
    }
  };

  const handleModalClosed = () => {
    if (onFinish && typeof onFinish === "function") {
      onFinish();
    }
  };

  return (
    <>
      <SelectMenu>
        <SelectorTarget onModalClosed={handleModalClosed} />
        <SelectMenu.Modal align="right">
          <SelectMenu.Header>
            Assign up to 10 people to this issue
          </SelectMenu.Header>
          <SelectMenu.Filter placeholder="Type or choose a user" />
          <SelectMenu.List>
            {assignees.length > 0 ? (
              <SelectMenu.Item
                as="button"
                onClick={() => {
                  setAssignees([]);
                }}
              >
                <Text as="span" sx={{ color: "text.primary" }}>
                  Clear assignees
                </Text>
              </SelectMenu.Item>
            ) : (
              <SelectMenu.Divider>Suggestions</SelectMenu.Divider>
            )}
            {users.map((u) => (
              <SelectMenu.Item
                as="button"
                key={u.id}
                onClick={(e) => {
                  handleItemSelected(e, u);
                }}
                selected={!!assignees.find((a) => a.id == u.id)}
              >
                <Text as="span">
                  <Text as="span" sx={{ fontSize: "14px", fontWeight: 600 }}>
                    {u.username}
                  </Text>{" "}
                  <Text as="span" sx={{ color: "text.secondary" }}>
                    {u.name}
                  </Text>
                </Text>
              </SelectMenu.Item>
            ))}
          </SelectMenu.List>
        </SelectMenu.Modal>
      </SelectMenu>
      {assignees.length > 0 ? (
        <Box>
          {assignees.map((a) => (
            <p key={a.id}>{a.username}</p>
          ))}
        </Box>
      ) : (
        <>
          <Text as="span">
            No one—
            <Link
              as="button"
              onClick={() => {
                setIsOpen(true);
              }}
              sx={{
                color: "text.secondary",
                ":hover": {
                  color: "text.link",
                  textDecoration: "none",
                },
              }}
            >
              assign yourself
            </Link>
          </Text>
          <Dialog
            isOpen={isOpen}
            onDismiss={() => {
              setIsOpen(false);
            }}
          >
            <Dialog.Header>Unimplemented feature</Dialog.Header>
            <Box sx={{ p: 3 }}>
              <Text>This feature will be available soon.</Text>
              <Box sx={{ display: "flex", mt: 3, justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Dialog>
        </>
      )}
    </>
  );
}

function SelectorTarget({ onModalClosed }) {
  const menuContext = React.useContext(SelectMenu.MenuContext);

  React.useEffect(() => {
    if (!menuContext.open) {
      onModalClosed();
    }
  }, [menuContext.open]);

  return (
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
      Asignees
      <StyledOcticon icon={GearIcon} sx={{ float: "right" }} />
    </Box>
  );
}
