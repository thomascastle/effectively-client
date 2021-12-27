import { DashboardPage } from "./pages/DashboardPage";
import { IssueIndexPage } from "./pages/IssueIndexPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RepositoryIssueCreatePage } from "./pages/RepositoryIssueCreatePage";
import { RepositoryIssueDetailsPage } from "./pages/RepositoryIssueDetailsPage";
import { RepositoryIssueIndexPage } from "./pages/RepositoryIssueIndexPage";
import { RepositoryLabelIndexPage } from "./pages/RepositoryLabelIndexPage";
import { RepositoryMilestoneCreatePage } from "./pages/RepositoryMilestoneCreatePage";
import { RepositoryMilestoneDetailsPage } from "./pages/RepositoryMilestoneDetailsPage";
import { RepositoryMilestoneEditPage } from "./pages/RepositoryMilestoneEditPage";
import { RepositoryMilestoneIndexPage } from "./pages/RepositoryMilestoneIndexPage";
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
        <Route exact path="/">
          <DashboardPage />
        </Route>
        <Route exact path="/issues">
          <IssueIndexPage />
        </Route>
        <Route exact path="/new">
          <RepositoryCreatePage />
        </Route>
        <Route path="/issues/assigned">
          <IssueIndexPage />
        </Route>
        <Route path="/issues/mentioned">
          <IssueIndexPage />
        </Route>
        <Route path="/:login/:repositoryName/issues/new">
          <RepositoryIssueCreatePage />
        </Route>
        <Route path="/:login/:repositoryName/issues/:number">
          <RepositoryIssueDetailsPage />
        </Route>
        <Route path="/:login/:repositoryName/issues">
          <RepositoryIssueIndexPage />
        </Route>
        <Route path="/:login/:repositoryName/labels/:labelName">
          <RepositoryIssueIndexPage />
        </Route>
        <Route path="/:login/:repositoryName/labels">
          <RepositoryLabelIndexPage />
        </Route>
        <Route path="/:login/:repositoryName/milestones/new">
          <RepositoryMilestoneCreatePage />
        </Route>
        <Route path="/:login/:repositoryName/milestones/:number/edit">
          <RepositoryMilestoneEditPage />
        </Route>
        <Route path="/:login/:repositoryName/milestones/:number">
          <RepositoryMilestoneDetailsPage />
        </Route>
        <Route path="/:login/:repositoryName/milestones">
          <RepositoryMilestoneIndexPage />
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
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
}
