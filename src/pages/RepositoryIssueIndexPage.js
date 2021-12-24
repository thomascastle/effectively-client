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

  const searchParams = parseQueryParams(q);

  return (
    <Layout>
      <IssueListContainer
        after={endCursor}
        before={startCursor}
        filters={{
          labelName: searchParams["label"]
            ? [...searchParams["label"], labelName].filter((p) => p)
            : labelName
            ? [labelName]
            : null,
          state: searchParams["is"]
            ? [...searchParams["is"]].filter((p) => p)
            : null,
        }}
        login={login}
        repositoryName={repositoryName}
      />
    </Layout>
  );
}

function parseQueryParams(queryParams) {
  if (!queryParams) {
    return {};
  }

  const pairs = queryParams.split(" ");
  const obj = {};

  for (let i = 0; i < pairs.length; i++) {
    const keyValue = pairs[i].split(":");

    if (obj[keyValue[0]]) {
      obj[keyValue[0]] = [...obj[keyValue[0]], keyValue[1]];
    } else {
      obj[keyValue[0]] = [keyValue[1]];
    }
  }

  return obj;
}
