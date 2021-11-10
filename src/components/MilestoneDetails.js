import {
  Box,
  StyledOcticon,
  Link,
  Heading,
  ProgressBar,
  Text,
  Tooltip,
  Label,
} from "@primer/components";
import {
  CalendarIcon,
  CheckIcon,
  CommentIcon,
  IssueOpenedIcon,
} from "@primer/octicons-react";
import { format, formatDistance } from "date-fns";

export function MilestoneDetails({ milestone }) {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Heading
          sx={{
            fontWeight: 400,
            fontSize: ["26px", null, "32px"],
            mb: 2,
            mt: 0,
          }}
        >
          {milestone.title}
        </Heading>
        <Box sx={{ width: "75%" }}>
          <ProgressBar barSize="large" sx={{ mb: 2, mt: 1, width: "420px" }} />
          <Text as="span" sx={{ color: "fg.default", mr: 3 }}>
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
          <Text as="span" sx={{ color: "fg.default" }}>
            <strong>0%</strong> complete
          </Text>
          <Box sx={{ color: "fg.muted", mt: "5px" }}>
            <Text>{milestone.description}</Text>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          borderColor: "border.default",
          borderRadius: 6,
          borderStyle: "solid",
          borderWidth: "1px",
          marginTop: "20px",
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
          <Box sx={{ mr: 3 }}>
            <input type="checkbox" />
          </Box>
          <Box sx={{ display: "flex", flex: "auto", minWidth: 0 }}>
            <Box sx={{ flex: "auto" }}>
              <Link href="/?q=eafe">
                <StyledOcticon icon={IssueOpenedIcon} sx={{ mr: "4px" }} />
                Open
              </Link>
              <Link href="/?q=eefeef" ml="10px">
                <StyledOcticon icon={CheckIcon} sx={{ mr: "4px" }} />
                Closed
              </Link>
            </Box>
          </Box>
        </Box>
        <Box className="Issues">
          <Box
            borderTopColor="border.default"
            borderTopStyle="solid"
            borderTopWidth="1px"
            display="flex"
            position="relative"
          >
            <Box flexShrink={0} pl={3} py={2}>
              <input type="checkbox" />
            </Box>
            <Box flexShrink={0} pl={3} pt={2}>
              <Tooltip aria-label="Open issue" direction="e">
                <StyledOcticon icon={IssueOpenedIcon} />
              </Tooltip>
            </Box>
            <Box flex="auto" minWidth="0" p={2} pr={[1, 2, 2]}>
              <Link
                className="h4 v-align-middle"
                color="fg.default"
                href="/issues/3"
              >
                Title 3
              </Link>
              <Label sx={{ ml: 1 }}>question</Label>
              <Box
                className="text-small"
                sx={{ display: "flex", mt: 1, color: "fg.muted" }}
              >
                <span className="opened-by">
                  #4 opened{" "}
                  <time
                    dateTime="2021-07-31T07:39:25Z"
                    title="Jul 31, 2021, 2:09 PM GMT+6:30"
                  >
                    {formatDistance(
                      new Date("2021-07-31T07:39:25Z"),
                      new Date(),
                      { addSuffix: true }
                    )}
                  </time>{" "}
                  by{" "}
                  <Link href="/issues?q=author%Athomascastle">
                    thomascastle
                  </Link>
                </span>
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
              <Box sx={{ flex: 1, flexShrink: 0, ml: 2 }}></Box>
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
        </Box>
      </Box>
    </Box>
  );
}
