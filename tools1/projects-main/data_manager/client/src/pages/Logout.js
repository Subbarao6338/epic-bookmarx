import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { logoutRequest } from "./../msalConfig";
import { useHistory } from "react-router-dom";

function Logout() {
  const { instance } = useMsal();
  const history = useHistory();

  useEffect(() => {
    instance
      .logoutPopup(logoutRequest)
      .then(() => {
        //on login success -> go to the page from where you were redirected to here |or| portal page.
        history.replace(history.location.state?.from || "/");
      })
      .catch((err) => {
        console.error(err);
        //on login error -> go 1 step back |or| '/' incase of no history
        history.length > 2 ? history.goBack() : history.replace("/");
      });
  }, [instance, history]);

  return <div>This is Logout Page</div>;
}

export default Logout;
