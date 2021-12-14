import { Box, Heading, StyledOcticon, Text } from "@primer/components";
import { MilestoneIcon } from "@primer/octicons-react";

function BlankslateDefault() {
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

export function Blankslate({ icon, title, children }) {
  return (
    <Box
      sx={{
        backgroundColor: "canvas.default",
        borderLeft: 0,
        borderRight: 0,
        borderColor: [null, "border.default"],
        borderRadius: [0, "6px"],
        borderStyle: [null, "solid"],
        borderWidth: [null, 1],
        mt: 3,
        mx: [15, 0],
      }}
    >
      <Box sx={{ maxWidth: 768, mx: "auto" }}>
        <Box
          className="blankslate blankslate-large blankslate-spacious"
          sx={{ position: "relative", px: 40, py: 80, textAlign: "center" }}
        >
          {icon && (
            <StyledOcticon
              icon={icon}
              size={24}
              sx={{ color: "fg.muted", mb: 2, mx: 1 }}
            />
          )}
          <Heading
            as="h3"
            sx={{ color: "fg.default", fontSize: "24px", mx: 0, my: 3 }}
          >
            {title}
          </Heading>
          <Text
            as="p"
            sx={{ color: "fg.muted", fontSize: "16px", mb: "10px", mt: 0 }}
          >
            {children}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
