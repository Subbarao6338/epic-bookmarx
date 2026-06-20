import * as React from "react";
import { Label } from "@progress/kendo-react-labels";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Footer from "../../components/Footer";
import { SplitButton, SplitButtonItem } from "@progress/kendo-react-buttons";

import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import { Avatar } from "@progress/kendo-react-layout";
import Logo from "../../assets/graviton.png";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { AutoComplete } from "@progress/kendo-react-dropdowns";
import { httpget, httpget_notification } from "../../commonUtility/common_http";
import {
  fetch_RecentViewed_url,
  tenant_id,
  projects_config,
  fetch_search_result_url,
  getRecentActivities_url,
} from "../../commonUtility/api_urls";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Popup } from "@progress/kendo-react-popup";
import { ProfileView } from "../../components/ProfileView";
import SingleView from "../SingleView/index";
import L0MenuComponent from "../L0Menu/index";

function WelcomePage() {
  const ref = React.useRef(null);
  const [data, setData] = React.useState([]);
  const [value, setValue] = React.useState("");
  const anchor = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const onClick = () => {
    setShow(!show);
  };
  localStorage.setItem("notification_check", true);
  const AccountInfo = AccountInfoDetails();

  React.useEffect(() => {
    const req_value = {
      params: { AccountMail: AccountInfo["AccountMail"] },
    };
    httpget(projects_config, req_value).then((result) => {
      localStorage.setItem("ProjectName", result[0].projectname);
    });
  }, []);
  const onChangesearch = (event) => {
    if (typeof event.target.value === "string") {
      setValue(event.target.value);
      const req_value = {
        params: { keyword: event.target.value },
      };
      let temp_arr = [];
      httpget_notification(fetch_search_result_url, req_value).then(
        (result) => {
          console.log("searchresults :>>", result);
          result.data.map((item) => {
            temp_arr.push(item);
            return null;
          });
          console.log(temp_arr);
          setData(temp_arr);
        }
      );
    } else {
      const val = document.getElementById("auto_complete").value;
      window.location.href = "/search_result?data=" + val;
    }
  };
  const handleSearch = () => {
    const val = document.getElementById("auto_complete").value;
    window.location.href = "/search_result?data=" + val;
  };
  let suggest_count = 0,
    autocompletecount = 0;
  const itemRender = (li, itemProps) => {
    if (itemProps["dataItem"]["Category"] === "Auto Complete API") {
      suggest_count = suggest_count + 1;
      const url_search =
        "/search_result?data=" + itemProps["dataItem"]["DisplayText"];
      const itemChildren = (
        <a href={url_search} style={{ color: "black", width: "100%" }}>
          <div style={{ fontSize: 16 }}>
            {suggest_count === 1 ? (
              <div>
                <b>Search suggestion</b>
              </div>
            ) : (
              <div></div>
            )}
            <div style={{ fontSize: 12 }}>
              {" "}
              {itemProps["dataItem"]["DisplayText"]}
            </div>
          </div>
        </a>
      );
      return React.cloneElement(li, li.props, itemChildren);
    } else {
      autocompletecount = autocompletecount + 1;
      const url_search =
        "/search_result?data=" + itemProps["dataItem"]["DisplayValue"];
      const itemChildren = (
        <a href={url_search} style={{ color: "black", width: "100%" }}>
          <div style={{ fontSize: 16 }}>
            {autocompletecount === 1 ? (
              <div>
                <div className="divider"></div>
                <div>
                  <b>Asset suggestion</b>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div style={{ fontSize: 12 }}>
              <span>{itemProps["dataItem"]["DisplayValue"]}</span>
              <br />
            </div>
          </div>
        </a>
      );
      return React.cloneElement(li, li.props, itemChildren);
    }
  };

  const [recentActivities, setRecentActivities] = React.useState([]);
  React.useEffect(() => {
    const req_value = {
      params: { AccountMail: AccountInfo["AccountMail"] },
    };
    httpget(getRecentActivities_url, req_value).then((result) => {
      setRecentActivities(result.data);
    });
    // eslint-disable-next-line
  }, []);
  const [recentViewed, setRecentViewed] = React.useState([]);

  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    };
    console.log(fetch_RecentViewed_url);
    httpget(fetch_RecentViewed_url, req_value).then((result) => {
      console.log(result);
      setRecentViewed(result);
    });
  }, []);

  return (
    <React.Fragment>
      <div>
        <div className="smart-business-tablet" style={{ marginLeft: 0 }}>
          <div className="smart-background-img">
            <div className="top-right-header">
              <div className="user_info" onClick={onClick} ref={anchor}>
                <Tooltip
                  anchorElement="target"
                  parentTitle={true}
                  position="bottom"
                >
                  <div
                    style={{
                      textAlign: "end",
                      marginRight: 30,
                      fontFamily: "Century",
                      fontWeight: "bold",
                    }}
                  >
                    <Label className="profile_name">
                      Hello,{" "}
                      <span title={AccountInfo["AccountName"]}>
                        {AccountInfo["AccountName"]}
                      </span>
                    </Label>
                    <br />
                    <Label
                      className="profile_name"
                      // style={{ fontStyle: "italic" }}
                    >
                      Persona: {AccountInfo["AccountRole"]}
                    </Label>
                  </div>
                </Tooltip>
                <Avatar className="profile_image" type="text" size="large">
                  <span style={{ fontWeight: "Bold", fontSize: "x-large" }}>
                    {AccountInfo["Account_ShortName"]}
                  </span>
                </Avatar>
              </div>
              <Popup
                anchor={anchor.current}
                show={show}
                style={{ marginTop: 0, marginLeft: 0 }}
                className="profilepopup"
              >
                <ProfileView />
              </Popup>
            </div>
            <div
              className="top-left-header logo_txt"
              style={{ fontFamily: "Arial", fontWeight: 500, color: "#42168A" }}
            >
              <img
                src={Logo}
                alt="logo"
                style={{
                  width: 200,
                  height: "auto",
                  marginLeft: -20,
                  marginRight: 5,
                  border: 2,
                  borderColor: "blue",
                }}
              />
              {/* GRAVITON */}
            </div>
          </div>
          <div className="centered">
            <p className="welcome-to-cdp-collaboration-w">
              Welcome to DataScope
            </p>
            <p className="this-portal-allows-you-to-acce">
              Manage, govern, and visualize enterprise level data, provision
              resources and use best of breed tools to develop and deliver
              optimal data products
            </p>
          </div>
          <div className="wrap search_landing">
            <div className="search">
              <SplitButton text="All Assets" style={{ borderRadius: "100px" }}>
                <SplitButtonItem text="Models" />
                <SplitButtonItem text="Data" />
                <SplitButtonItem text="Pipeline" />
                <SplitButtonItem text="Dashboard" />
              </SplitButton>
              <AutoComplete
                id="auto_complete"
                style={{
                  padding: 4,
                  width: "450px",
                  height: "50px",
                  borderBlockColor: "black",
                  borderRadius: "0px",
                }}
                data={data}
                value={value}
                itemRender={itemRender}
                onChange={onChangesearch}
                placeholder="What are you looking for?"
              />
              <button
                type="submit"
                className="searchButton"
                style={{
                  padding: 4,
                  width: "50px",
                  height: "50px",
                  borderEndEndRadius: 4,
                  borderStartEndRadius: 4,
                  borderColor: "black",
                }}
                onClick={handleSearch}
              >
                <i className="fa fa-search" style={{ padding: 4 }}></i>
              </button>
            </div>
          </div>
          <L0MenuComponent role={AccountInfo.AccountRole} />
        </div>

        <SingleView />
        <div className="recent_view_items row" style={{ marginBottom: 50 }}>
          <div className="col-md-6">
            <div className="recent_view_item_sec">
              <h1 className="p-2">Recently Viewed Items</h1>
              <div className="card-component border" style={{ width: "auto" }}>
                <Grid data={recentViewed}>
                  <GridColumn
                    field="assettype"
                    title="Name"
                    width="auto"
                    headerClassName="text-center"
                    cell={(props) => (
                      <td>
                        <div className="sr">
                          <a
                            style={{ fontSize: 14 }}
                            href={props.dataItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {props.dataItem.assettype}
                          </a>
                        </div>
                      </td>
                    )}
                  />
                  <GridColumn
                    field="created_on"
                    title="Date"
                    width="auto"
                    headerClassName="text-center"
                  />
                </Grid>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="recent_view_item_sec"
              style={{ marginLeft: 0, marginBottom: 100 }}
            >
              <h1 className="p-2">Recent Activity</h1>
              <div className="card-component border" style={{ width: "auto" }}>
                <Grid data={recentActivities.slice(0, 5)}>
                  <GridColumn
                    field="alert_msg"
                    title="Activity"
                    width="auto"
                    headerClassName="text-center"
                  />
                  <GridColumn
                    field="created_on"
                    title="Date"
                    width="auto"
                    headerClassName="text-center"
                  />
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
export default WelcomePage;
