import { DashboardPage } from "./pages/DashboardPage";
import { IssueCreatePage } from "./pages/IssueCreatePage";
import { IssueDetailsPage } from "./pages/IssueDetailsPage";
import { IssueIndexPage } from "./pages/IssueIndexPage";
import { LabelIndexPage } from "./pages/LabelIndexPage";
import { MilestoneCreatePage } from "./pages/MilestoneCreatePage";
import { MilestoneDetailsPage } from "./pages/MilestoneDetailsPage";
import { MilestoneEditPage } from "./pages/MilestoneEditPage";
import { MilestoneIndexPage } from "./pages/MilestoneIndexPage";
import { ProjectIndexPage } from "./pages/ProjectIndexPage";
import { RepositoryCreatePage } from "./pages/RepositoryCreatePage";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

export function RestrictedPart() {
  return (
    <Router>
      <Switch>
        <Route path="/:login/:repositoryName/issues/new">
          <IssueCreatePage />
        </Route>
        <Route path="/:login/:repositoryName/issues/:number">
          <IssueDetailsPage />
        </Route>
        <Route path="/:login/:repositoryName/issues">
          <IssueIndexPage />
        </Route>
        <Route path="/:login/:repositoryName/labels">
          <LabelIndexPage />
        </Route>
        <Route path="/:login/:repositoryName/milestones/new">
          <MilestoneCreatePage />
        </Route>
        <Route path="/:login/:repositoryName/milestones/:number/edit">
          <MilestoneEditPage />
        </Route>
        <Route path="/:login/:repositoryName/milestones/:number">
          <MilestoneDetailsPage />
        </Route>
        <Route path="/:login/:repositoryName/milestones">
          <MilestoneIndexPage />
        </Route>
        <Route path="/:login/:repositoryName/projects">
          <ProjectIndexPage />
        </Route>
        <Route path="/:login/:repositoryName/settings">
          <ProjectIndexPage />
        </Route>
        <Redirect
          from="/:login/:repositoryName"
          to="/:login/:repositoryName/issues"
        />
        <Route path="/new">
          <RepositoryCreatePage />
        </Route>
        <Route path="/">
          <DashboardPage />
        </Route>
      </Switch>
    </Router>
  );
}
