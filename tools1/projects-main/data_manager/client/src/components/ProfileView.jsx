import * as React from "react";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import { useMsal } from "@azure/msal-react";
import { Avatar } from "@progress/kendo-react-layout";
import { Label } from "@progress/kendo-react-labels";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@progress/kendo-react-buttons";
// import { Loader } from '@progress/kendo-react-indicators'
import Popup from "reactjs-popup";
import Password from "./changepassword";

export const ProfileView = (props) => {
  const AccountInfo = AccountInfoDetails();
  const { instance } = useMsal();
  const history = useHistory();

  const logout = () => {
    if (history.length > 2) {
      history.push("/");
      localStorage.setItem("isUserAuthorized", false);
    }
  };

  // const handleLogout = () => {
  //   instance
  //     .logoutPopup()
  //     .then(() => {
  //       //on logout -> go to '/'
  //       history.push('/')
  //     })
  //     .catch((err) => console.error(err))
  // }

  return (
    <div>
      <div style={{ width: 250, marginLeft: 10 }}>
        <div style={{ width: 70, float: "left", marginTop: 10 }}>
          <Avatar type="text" size="large" style={{ width: 60, height: 60 }}>
            <span style={{ fontWeight: "Bold", fontSize: "x-large" }}>
              {AccountInfo["Account_ShortName"]}
            </span>
          </Avatar>
        </div>
        <div
          style={{
            width: 180,
            float: "left",
          }}
        >
          <Label
            className="header_profile_name"
            style={{ paddingTop: "10px", fontWeight: "bold" }}
          >
            {AccountInfo["AccountName"]}
          </Label>
          <br />
          {/* <span style={{ fontStyle: "italic" }}> */}
          <span>
            {AccountInfo["AccountRole"] === "Data Engineer - Team Lead"
              ? "Team Lead"
              : AccountInfo["AccountRole"] === "Data Engineer - Team Member"
              ? "Data Engineer"
              : "DP Admin"}
          </span>
        </div>
      </div>
      <div>
        <Popup
          trigger={
            <div
              style={{
                textAlign: "end",
                margin: 8,
                marginTop: 85,
              }}
            >
              <Link style={{ fontSize: "small", textDecoration: "none" }}>
                Change Password
              </Link>
            </div>
          }
          modal
          nested
        >
          {(close) => (
            <div
              className="modal"
              style={{
                fontSize: 12,
                position: "unset",
                display: "block",
                backgroundColor: "#fff",
              }}
            >
              <Button className="close" onClick={close}>
                &times;
              </Button>
              <div className="head">Change Password</div>
              <div className="cont">
                <Password />
                <div
                  className="text-end"
                  style={{ width: "65%", marginTop: -45 }}
                >
                  <Button
                    className="cancelbutton"
                    icon="close-outline"
                    onClick={close}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Popup>
      </div>
      <div
        className="row p-2 "
        style={{
          margin: 0,
          alignSelf: "center",
          float: "right",
          width: 100,
        }}
      >
        {/* <Button className="cancelbutton" icon="logout" onClick={handleLogout}>
          Logout
        </Button> */}
        <Button className="cancelbutton" icon="logout" onClick={logout}>
          Logout
        </Button>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};
