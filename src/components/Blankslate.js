import { Box, Heading, StyledOcticon, Text } from "@primer/components";
import { MilestoneIcon } from "@primer/octicons-react";

export function Blankslate() {
  return (
    <Box
      sx={{
        borderTopColor: "border.default",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        p: 5,
        position: "relative",
        textAlign: "center",
      }}
    >
      <StyledOcticon
        icon={MilestoneIcon}
        size={24}
        sx={{ color: "icon.secondary", mb: 2, mx: 1 }}
      />
      <Heading
        as="h3"
        sx={{ color: "fg.default", fontSize: "24px", mb: 1, mt: 3, mx: 0 }}
      >
        We couldn't find anything!
      </Heading>
      <Text as="p" sx={{ fontSize: "16px", mb: "10px", mt: 0 }}>
        There aren’t any milestones that match. Give it another shot above.
      </Text>
    </Box>
  );
}
