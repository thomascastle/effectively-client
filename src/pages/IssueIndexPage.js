import {
  Box,
  ButtonPrimary,
  ButtonTableList,
  CounterLabel,
  Dropdown,
  FilteredSearch,
  Link,
  SelectMenu,
  StyledOcticon,
  SubNav,
  TextInput,
} from "@primer/components";
import {
  CheckIcon,
  IssueOpenedIcon,
  MilestoneIcon,
  SearchIcon,
  TagIcon,
} from "@primer/octicons-react";
import { IssueList } from "../components/IssueList";
import { Layout } from "../components/Layout";

export function IssueIndexPage() {
  return (
    <Layout>
      <Box
        alignItems="flex-end"
        display="flex"
        flexDirection={"row"}
        justifyContent="space-between"
        mb={3}
      >
        <Box
          sx={{
            display: "flex",
            flex: "auto",
            my: [4, 3, 0],
            width: "100%",
          }}
        >
          <FilteredSearch sx={{ width: "100%" }}>
            <Dropdown>
              <Dropdown.Button>Filters</Dropdown.Button>
              <Dropdown.Menu direction="se" sx={{ width: "auto" }}>
                <Dropdown.Item>Open issues and pull requests</Dropdown.Item>
                <Dropdown.Item>Your issues</Dropdown.Item>
                <Dropdown.Item>Your pull requests</Dropdown.Item>
                <Dropdown.Item>Everything assigned to you</Dropdown.Item>
                <Dropdown.Item>Everything mentioning you</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <TextInput
              icon={SearchIcon}
              sx={{ bg: "bg.secondary", width: "100%" }}
            />
          </FilteredSearch>
          <Box sx={{ display: ["none", "none", "flex"], ml: 2, pl: 2 }}>
            <SubNav>
              <SubNav.Links>
                <SubNav.Link href="/labels">
                  <StyledOcticon icon={TagIcon} />
                  labels
                  <CounterLabel>3</CounterLabel>
                </SubNav.Link>
                <SubNav.Link href="/milestones">
                  <StyledOcticon icon={MilestoneIcon} />
                  milestones
                  <CounterLabel>1</CounterLabel>
                </SubNav.Link>
              </SubNav.Links>
            </SubNav>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" ml={3} width="auto">
          <ButtonPrimary as="a" href="/issues/new">
            <Box sx={{ display: ["none", "none", "block"] }}>New issue</Box>
            <Box sx={{ display: ["block", "block", "none"] }}>New</Box>
          </ButtonPrimary>
        </Box>
      </Box>
      <Box>
        <Box
          borderColor="border.primary"
          borderRadius={6}
          borderStyle="solid"
          borderWidth="1px"
          mt={3}
        >
          <Box
            className="Box-header"
            display="flex"
            justifyContent="space-between"
            p={3}
            sx={{
              backgroundColor: "bg.tertiary",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          >
            <Box mr={3}>
              <input type="checkbox" />
            </Box>
            <Box display="flex" flex="auto" minWidth="0">
              <Box flex="auto">
                <Link href="/?q=eafe">
                  <StyledOcticon icon={IssueOpenedIcon} mr="4px" />
                  Open
                </Link>
                <Link href="/?q=eefeef" ml="10px">
                  <StyledOcticon icon={CheckIcon} mr="4px" />
                  Closed
                </Link>
              </Box>
              <Box
                display="flex"
                flex="auto"
                justifyContent={["flex-start", "space-between", "flex-end"]}
              >
                <Box display="inline-block" position="relative">
                  <SelectMenu display="inline-block" px={3}>
                    <ButtonTableList>Author</ButtonTableList>
                    <SelectMenu.Modal align="right">
                      <SelectMenu.Header>Filter by author</SelectMenu.Header>
                      <SelectMenu.Filter
                        onChange={(e) => e.preventDefault()}
                        placeholder="Filter users"
                        value=""
                      ></SelectMenu.Filter>
                      <SelectMenu.List></SelectMenu.List>
                    </SelectMenu.Modal>
                  </SelectMenu>
                </Box>
                <Box display="inline-block" position="relative">
                  <SelectMenu display="inline-block" px={3}>
                    <ButtonTableList>Label</ButtonTableList>
                    <SelectMenu.Modal align="right">
                      <SelectMenu.Header>Filter by label</SelectMenu.Header>
                      <SelectMenu.Filter
                        onChange={(e) => e.preventDefault()}
                        placeholder="Filter labels"
                        value=""
                      ></SelectMenu.Filter>
                      <SelectMenu.List>
                        <SelectMenu.Item>Unlabeled</SelectMenu.Item>
                      </SelectMenu.List>
                      <SelectMenu.Footer>
                        Use to exclude labels
                      </SelectMenu.Footer>
                    </SelectMenu.Modal>
                  </SelectMenu>
                </Box>
                <Box display="inline-block" position="relative">
                  <SelectMenu display="inline-block" px={3}>
                    <ButtonTableList>Projects</ButtonTableList>
                    <SelectMenu.Modal align="right">
                      <SelectMenu.Header>Filter by project</SelectMenu.Header>
                      <SelectMenu.Filter
                        onChange={(e) => e.preventDefault()}
                        placeholder="Filter projects"
                        value=""
                      ></SelectMenu.Filter>
                    </SelectMenu.Modal>
                  </SelectMenu>
                </Box>
                <Box display="inline-block" position="relative">
                  <SelectMenu display="inline-block" px={3}>
                    <ButtonTableList>Milestones</ButtonTableList>
                    <SelectMenu.Modal align="right">
                      <SelectMenu.Header>Filter by milestone</SelectMenu.Header>
                      <SelectMenu.Filter
                        onChange={(e) => e.preventDefault()}
                        placeholder="Filter milestones"
                        value=""
                      ></SelectMenu.Filter>
                      <SelectMenu.List>
                        <SelectMenu.Item>
                          Issues wit no milestone
                        </SelectMenu.Item>
                      </SelectMenu.List>
                    </SelectMenu.Modal>
                  </SelectMenu>
                </Box>
                <Box display="inline-block" position="relative">
                  <SelectMenu display="inline-block" px={3}>
                    <ButtonTableList>Assignee</ButtonTableList>
                    <SelectMenu.Modal align="right">
                      <SelectMenu.Header>
                        Filter by who's assigned
                      </SelectMenu.Header>
                      <SelectMenu.Filter
                        onChange={(e) => e.preventDefault()}
                        placeholder="Filter users"
                        value=""
                      ></SelectMenu.Filter>
                      <SelectMenu.List>
                        <SelectMenu.Item>Assigned to nobody</SelectMenu.Item>
                      </SelectMenu.List>
                    </SelectMenu.Modal>
                  </SelectMenu>
                </Box>
                <Box display="inline-block" position="relative">
                  <SelectMenu pl={3} pr="0">
                    <ButtonTableList>Sort</ButtonTableList>
                    <SelectMenu.Modal align="right">
                      <SelectMenu.Header>Sort by</SelectMenu.Header>
                      <SelectMenu.List>
                        <SelectMenu.Item>Newest</SelectMenu.Item>
                        <SelectMenu.Item>Oldest</SelectMenu.Item>
                        <SelectMenu.Item>Most commented</SelectMenu.Item>
                        <SelectMenu.Item>Least commented</SelectMenu.Item>
                        <SelectMenu.Item>Recently updated</SelectMenu.Item>
                        <SelectMenu.Item>
                          Least recently updated
                        </SelectMenu.Item>
                      </SelectMenu.List>
                    </SelectMenu.Modal>
                  </SelectMenu>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="list">
            <IssueList />
          </Box>
        </Box>
      </Box>
      <Box
        className="paginate-container"
        display={["flex"]}
        justifyContent={["center"]}
      ></Box>
    </Layout>
  );
}
