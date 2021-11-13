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
        <Route path="/issues/new">
          <IssueCreatePage />
        </Route>
        <Route path="/issues/:number">
          <IssueDetailsPage />
        </Route>
        <Route path="/issues">
          <IssueIndexPage />
        </Route>
        <Route path="/labels">
          <LabelIndexPage />
        </Route>
        <Route path="/milestones/new">
          <MilestoneCreatePage />
        </Route>
        <Route path="/milestones/:number/edit">
          <MilestoneEditPage />
        </Route>
        <Route path="/milestones/:number">
          <MilestoneDetailsPage />
        </Route>
        <Route path="/milestones">
          <MilestoneIndexPage />
        </Route>
        <Route path="/projects">
          <ProjectIndexPage />
        </Route>
        <Route path="/">
          <DashboardPage />
        </Route>
      </Switch>
    </Router>
  );
}
