import { useIsAuthenticated } from "@azure/msal-react";
import React from "react";
import { Redirect } from "react-router";

function AuthWrapper(props) {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? (
    props.children
  ) : (
    <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
  );
}

export default AuthWrapper;
