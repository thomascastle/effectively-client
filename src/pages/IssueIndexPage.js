import { IssueListContainer } from "../components/IssueListContainer";
import { Layout } from "../components/Layout";
import { useQueryParams } from "../hooks";

export function IssueIndexPage() {
  const queryParams = useQueryParams();

  const endCursor = queryParams.get("after");
  const startCursor = queryParams.get("before");
  const q = queryParams.get("q");

  return (
    <Layout>
      <IssueListContainer
        after={endCursor}
        before={startCursor}
        filter={{ state: q }}
      />
    </Layout>
  );
}
