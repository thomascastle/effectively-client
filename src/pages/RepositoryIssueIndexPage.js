import { IssueListContainer } from "../components/IssueListContainer";
import { Layout } from "../components/Layout";
import { useQueryParams } from "../hooks";
import { useParams } from "react-router-dom";

export function RepositoryIssueIndexPage() {
  const { labelName, login, repositoryName } = useParams();
  const queryParams = useQueryParams();

  const endCursor = queryParams.get("after");
  const startCursor = queryParams.get("before");
  const q = queryParams.get("q");

  return (
    <Layout>
      <IssueListContainer
        after={endCursor}
        before={startCursor}
        filter={{ labelName, state: q }}
        login={login}
        repositoryName={repositoryName}
      />
    </Layout>
  );
}
