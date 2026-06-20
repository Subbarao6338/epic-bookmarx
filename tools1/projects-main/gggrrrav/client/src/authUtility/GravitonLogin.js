import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./../msalConfig";
import Logo from "./../assets/graviton.png";
import { useHistory } from "react-router";
import { config } from "./config";
import { httpget } from "../commonUtility/common_http";
import { checkUserAuthorized_url } from "../commonUtility/api_urls";
import { checkUserAuthorized_url1 } from "../commonUtility/api_urls";

import { Link } from "react-router-dom";

import "./styles.css";

const GravitonLogin = () => {
  const { instance } = useMsal();
  const history = useHistory();

  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const errors = {
    uname: "Plese enter valid username or password",
    // pass: "invalid password"
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (config["work_env"] === "DEPLOYMENT") {
      instance
        .loginPopup(loginRequest)
        .then((res) => {
          console.log(res["account"]["username"].toLowerCase());
          //on success -> goto home / welcome page
          const req_value = {
            params: {
              AccountMail: res["account"]["username"].toLowerCase(),
            },
          };
          httpget(checkUserAuthorized_url, req_value).then((result) => {
            if (result.length === 0) {
              localStorage.setItem("isUserAuthorized", false);
              history.push("/unauthorizedAccess");
            } else {
              localStorage.setItem("isUserAuthorized", true);
              localStorage.setItem("role_name", result[0]["role_name"]);
              history.push("/home");
            }
          });
        })
        .catch((err) => {
          console.error(err);
          history.push("/home");
        });
    } else {
      // history.push("/home");
      var { uname, pass } = document.forms[0];
      const req_value = {
        params: {
          username: uname.value,
          password: pass.value,
        },
      };
      console.log(req_value);
      httpget(checkUserAuthorized_url1, req_value).then((result) => {
        console.log(result);
        debugger;
        // let userData = result.data[0]["user_name"]===!uname.value;
        if (result.length == 1) {
          localStorage.setItem("isUserAuthorized", true);
          localStorage.setItem("role_name", result[0]["role_name"]);
          localStorage.setItem("user_name", result[0]["user_name"]);
          localStorage.getItem("user_mail", result[0]["user_mail"]);
          history.push("/home");
        }

        if (result.length == 0) {
          setErrorMessages({ name: "uname", message: errors.uname });
          localStorage.setItem("isUserAuthorized", false);
          // history.push("/unauthorizedAccess");
        }
      });
    }
  };
  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className="form">
      <form>
        <div className="input-container">
          <label>User name </label>
          <input
            type="text"
            name="uname"
            placeholder="Enter user name"
            required
          />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input
            type="password"
            name="pass"
            placeholder="Enter Password"
            required
          />
          <p className="demo">Forget Password?</p>
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" value="Login" onClick={submitForm} />
          <br />
          <input type="cancel" value="Cancel" />
        </div>
        {/* <Link to="/GravitonsineUp">If you don't have an account click to sign Up</Link> */}
      </form>
    </div>
  );

  return {
    ...(config["work_env"] === "DEVELOPMENT" ? (
      <div>
        <div class="topleft">
          <img
            src={Logo}
            alt="logo"
            style={{
              width: 200,
              height: "auto",
              border: 2,
              borderColor: "blue",
            }}
          />
        </div>
        <div className="bg-image"> </div>
        <div className="app">
          <div className="bg-text-window1">
            <div className="title">DataScope - Login</div>

            {isSubmitted ? <div> Successful</div> : renderForm}
          </div>
        </div>
      </div>
    ) : (
      <div>
        <div className="bg-image"></div>
        <div class="topleft">
          <img
            src={Logo}
            alt="logo"
            style={{
              width: 200,
              height: "auto",
              border: 2,
              borderColor: "blue",
            }}
          />
        </div>
        <div className="bg-text-window"></div>
        <div className="bg-text">
          <br />
          <p className="bg-text-border" style={{ fontSize: "36px" }}>
            DataScope
          </p>
          <br />
          <button
            class="btn btn-block btn-social btn-microsoft"
            onClick={submitForm}
          >
            {/* <img src={azure_offcial} alt="" />  */}
            <span class="fa fa-windows"></span> Login With Azure AD
          </button>
        </div>
      </div>
    )),
  };
};

export default GravitonLogin;
