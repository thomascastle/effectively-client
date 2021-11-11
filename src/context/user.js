import { gql, useQuery } from "@apollo/client";
import { createContext, useContext } from "react";

export const UserContext = createContext();

export const VIEWER_QUERY = gql`
  query {
    viewer {
      email
      id
      name
      username
    }
  }
`;

export const UserProvider = ({ children }) => {
  const { data, error, loading } = useQuery(VIEWER_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const { viewer } = data;

  return (
    <UserContext.Provider value={{ user: viewer }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
