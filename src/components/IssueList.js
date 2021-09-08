import { IssueListItem } from "./IssueListItem";

export function IssueList({ issues }) {
  return (
    <>
      {issues.map((issue) => (
        <IssueListItem key={issue.id} issue={issue} />
      ))}
    </>
  );
}
