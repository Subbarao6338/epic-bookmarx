import { useIsAuthenticated } from "@azure/msal-react";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { config } from "./config";
import DrawerRouterContainer from "./../components/DrawerRouterContainer.jsx";

function ProtectedRoute({ component, ...props }) {
  const isSSOAuthenticated = useIsAuthenticated();
  const isAuthenticated =
    config["work_env"] === "DEPLOYMENT" ? isSSOAuthenticated : true;
  const ActualComponent = component;

  const isUserAuthorized = localStorage.getItem("isUserAuthorized");

  return (
    <Route
      {...props}
      render={() => {
        return isAuthenticated ? (
          isUserAuthorized === "true" ? (
            props.path === "/home" || props.path === "/welcome" ? (
              <ActualComponent />
            ) : (
              <DrawerRouterContainer>
                <ActualComponent />
              </DrawerRouterContainer>
            )
          ) : (
            <Redirect
              to={{
                pathname: "/unauthorizedAccess",
                state: { from: props.location },
              }}
            />
          )
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }}
    />
  );
}

export default ProtectedRoute;
