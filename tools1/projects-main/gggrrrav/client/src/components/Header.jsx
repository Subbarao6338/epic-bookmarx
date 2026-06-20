import * as React from "react";
import * as PropTypes from "prop-types";

import { useLocalization } from "@progress/kendo-react-intl";

import { useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router-dom";
import { Label } from "@progress/kendo-react-labels";
import Notification_Empty from "../assets/notification_empty.svg";
import { useEffect, useState } from "react";
import { Fade } from "@progress/kendo-react-animation";
import { Notification } from "@progress/kendo-react-notification";
import { Icon } from "@progress/kendo-react-common";
import { httpget_notification, httpput } from "../commonUtility/common_http";
import {
  fetch_notifications_url,
  update_notifications_status_url,
  tenant_id,
} from "../commonUtility/api_urls";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import { Avatar } from "@progress/kendo-react-layout";
import "reactjs-popup/dist/index.css";
import Logo from "../assets/graviton.png";
import { config } from "./../authUtility/config";
import { Popup } from "@progress/kendo-react-popup";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { ProfileView } from "./../components/ProfileView";

export const Header = (props) => {
  const AccountInfo = AccountInfoDetails();
  const localizationService = useLocalization();

  const isSSOAuthenticated = useIsAuthenticated();
  const isAuthenticated =
    config["work_env"] === "DEPLOYMENT" ? isSSOAuthenticated : true;

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const notification_check = localStorage.getItem("notification_check");
    if (isAuthenticated && notification_check === "true") {
      const req_value = {
        params: {
          tenant_id: tenant_id,
          AccountMail: AccountInfo["AccountMail"],
        },
      };

      httpget_notification(fetch_notifications_url, req_value).then(
        (result) => {
          console.log(result);
          setNotifications(result);
        }
      );
      localStorage.setItem("notification_check", false);
    }
  });

  const displayNotification = ({ id, alert_msg, alert_type }) => {
    return (
      <div>
        <Fade>
          <Notification
            type={{ style: alert_type }}
            style={{ width: 250, fontWeight: "initial", color: "#0e68aa" }}
            closable={true}
            onClose={() => closeNotification(id)}
          >
            <span>{alert_msg}</span>
          </Notification>
        </Fade>
      </div>
    );
  };

  const closeNotification = (id) => {
    const req_value = {
      display_status: 0,
      tenant_id: tenant_id,
      notifications_id: id,
    };
    httpput(update_notifications_status_url, req_value).then((result) => {});
    setOpen(false);
    localStorage.setItem("notification_check", true);
  };

  const closeNotificationPanel = () => {
    setOpen(false);
  };

  const displayEmptyNotification = () => {
    return (
      <div>
        <div>
          {" "}
          <img src={Notification_Empty} className="EmptyiconImg" alt="" />{" "}
        </div>
        <div className="notificationEmptyPanel">
          {" "}
          <span className="notification">{`No new notifications to display.`}</span>{" "}
        </div>
      </div>
    );
  };

  const anchor = React.useRef(null);

  const [show, setShow] = React.useState(false);
  const onClick = () => {
    setShow(!show);
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(!open);
    setShow(false);
  };

  const handlepopupclose = () => {
    setShow(false);
  };

  return (
    <header
      className="header"
      style={{
        backgroundColor: "#F2F2F2",
      }}
    >
      <div className="nav-container">
        <div className="title">
          <Link to="/home" className="App-link" style={{ marginLeft: -10 }}>
            <h1
              style={{
                color: "#006ab6",
                fontWeight: "bold",
                fontFamily: "Century",
              }}
            >
              <img
                src={Logo}
                alt="logo"
                style={{
                  width: 150,
                  height: "auto",
                  border: 2,
                  borderColor: "blue",
                }}
              />{" "}
              &nbsp;
              <span>
                {localizationService.toLanguageString("cdp_header.cdp_title")}
              </span>
            </h1>
          </Link>
        </div>
        <div className="top-right" onClick={onClick} ref={anchor}>
          <Tooltip anchorElement="target" parentTitle={true} position="bottom">
            <div
              className="user_info_header"
              style={{ fontFamily: "Century", fontWeight: "bold" }}
            >
              <Label className="header_profile_name">
                <span title={AccountInfo["AccountName"]}>
                  {AccountInfo["AccountName"]}
                </span>
              </Label>
              <br />
              <Label
                className="header_profile_name"
                // style={{ fontStyle: "italic" }}
              >
                {AccountInfo["AccountRole"]}
              </Label>
            </div>
          </Tooltip>
          &nbsp;&nbsp;&nbsp;
        </div>
        <Avatar className="profile_image" type="text" size="large">
          <span style={{ fontWeight: "Bold", fontSize: "x-large" }}>
            {AccountInfo["Account_ShortName"]}
          </span>
        </Avatar>
        <Popup anchor={anchor.current} show={show} className="profilepopup">
          <ProfileView popupClose={handlepopupclose} />
        </Popup>
        <div className="icon" onClick={onOpen}>
          <Icon className="iconImg k-icon k-i-notification" size={"medium"} />
          {notifications.length > 0 ? (
            <div className="counter">{notifications.length}</div>
          ) : (
            ""
          )}
        </div>
        &nbsp;&nbsp;&nbsp;
      </div>
      &nbsp;&nbsp;&nbsp;
      {open && (
        <div className="notifications card-container">
          <div className="notificationtitle">
            {localizationService.toLanguageString("cdp_titles.notifications")}
            <span
              class="k-icon k-i-close-outline k-icon-32 noticationPanelClose"
              onClick={closeNotificationPanel}
            ></span>
          </div>
          <br></br>
          <div className="scroll">
            {notifications.length > 0
              ? notifications.map((n) => displayNotification(n))
              : displayEmptyNotification()}
          </div>
        </div>
      )}
    </header>
  );
};

Header.displayName = "Header";
Header.propTypes = {
  page: PropTypes.string,
  onButtonClick: PropTypes.func,
};
