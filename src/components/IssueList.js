import { IssueListItem } from "./IssueListItem";
import { useParams } from "react-router-dom";

export function IssueList({ issues }) {
  const { login, repositoryName } = useParams();

  return (
    <>
      {issues.map((issue) => (
        <IssueListItem
          key={issue.id}
          issue={issue}
          repositoryBaseUrl={"/" + login + "/" + repositoryName}
        />
      ))}
    </>
  );
}
