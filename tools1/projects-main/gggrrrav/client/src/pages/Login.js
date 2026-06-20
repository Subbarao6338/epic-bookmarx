import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./../msalConfig";
import { useHistory } from "react-router";

function Login() {
  const { instance } = useMsal();
  const history = useHistory();

  useEffect(() => {
    instance
      .loginPopup(loginRequest)
      .then(() => {
        //on login success -> go to the page from where you were redirected to here |or| portal page.
        history.replace(history.location.state?.from || "/home");
      })
      .catch((err) => {
        console.error(err);
        //on login error -> go 1 step back |or| '/' incase of no history
        history.length > 2 ? history.goBack() : history.replace("/");
      });
  }, [instance, history]);

  return <div>This is Login Page</div>;
}

export default Login;
