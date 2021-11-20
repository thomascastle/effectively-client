import { StyledOcticon, SubNav } from "@primer/components";
import { MilestoneIcon, TagIcon } from "@primer/octicons-react";
import * as React from "react";
import { useLocation, useParams } from "react-router-dom";

export function RepoSubNav() {
  const location = useLocation();
  const { login, repositoryName } = useParams();

  return (
    <SubNav>
      <SubNav.Links>
        <SubNav.Link
          href={"/" + login + "/" + repositoryName + "/labels"}
          selected={location.pathname.match(/\/labels/)}
        >
          <span>
            <StyledOcticon icon={TagIcon} /> Labels
          </span>
        </SubNav.Link>
        <SubNav.Link
          href={"/" + login + "/" + repositoryName + "/milestones"}
          selected={location.pathname.match(/\/milestones/)}
        >
          <span>
            <StyledOcticon icon={MilestoneIcon} /> Milestones
          </span>
        </SubNav.Link>
      </SubNav.Links>
    </SubNav>
  );
}
