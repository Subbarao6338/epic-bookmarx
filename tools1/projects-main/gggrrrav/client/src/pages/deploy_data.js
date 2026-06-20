import * as React from "react";

import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";
import { Link } from "react-router-dom";
import DeployImage from "./../assets/self_service/DeployApplication/deploy.png";
import UnDeployImage from "./../assets/self_service/DeployApplication/undeploy.png";
import LogsImage from "./../assets/self_service/DeployApplication/deploy_log.png";
import CostImage from "./../assets/self_service/DeployApplication/deploy_cost.png";
import { httpget_notification } from "../commonUtility/common_http";
import { Loader } from "@progress/kendo-react-indicators";
import { deploy_data_url } from "../commonUtility/api_urls";
import { Label } from "@progress/kendo-react-labels";
import ReactTooltip from "react-tooltip";

loadMessages(enMessages, "en-US");

const navitems = [
  {
    id: "home",
    route_url: "/resourceprovisioning",
    text: "Resource Provisioning",
  },
  {
    id: "deploy_database",
    route_url: "/deploy_data",
    text: "Data",
  },
];

const DeployData = () => {
  //const AccountInfo = AccountInfoDetails();

  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  // const [logs, setlogs] = React.useState("Here you can see the response! ");
  const [logs, setlogs] = React.useState("Start");

  const DeployData = (api_name, api_type) => {
    console.log(api_type);
    setlogs("");
    const req_value = {
      params: {
        api_name: api_name,
        api_type: api_type,
      },
    };

    httpget_notification(deploy_data_url, req_value).then((result) => {
      console.log(result);
      console.log(result.response);
      if (api_type === "GET") {
        setlogs(result.response.split("\n").map((str) => <p>{str}</p>));
      } else {
        const status_code = JSON.parse(result.response).status;
        if (status_code === "200") {
          //setlogs(enMessages["cdp_deploysoftware_response"][api_name]);
          setlogs(
            enMessages["cdp_deploysoftware_response"]["API_RESPONSE"]
              .split("\n")
              .map((str) => <p>{str}</p>)
          );
        } else {
          setlogs(result.response);
        }
      }
    });
  };

  return (
    <React.Fragment>
      <ReactTooltip />
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />
      <div>
        <div>
          <div>
            <h3 id="heading" align="left">
              {enMessages.cdp_menus.Data}
            </h3>
          </div>
          <hr />
        </div>
        <br />
        <div style={{ width: "80vw" }}>
          <div style={{ width: "35vw", float: "left" }}>
            <div class="css_table">
              <div class="css_table_header">
                <div>Name</div>
                <div>Deploy</div>
                <div>Undeploy</div>
              </div>

              <div class="css_table_body">
                <div class="css_table_row">
                  <div>Infra (Kubernetes Cluster)</div>
                  <div>
                    {" "}
                    <Link onClick={() => DeployData("DeployInfra", "POST")}>
                      <img
                        data-tip="Deploy Infra"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={DeployImage}
                        alt="DeployImage"
                        className="deploy_images"
                      />
                    </Link>
                    <Link onClick={() => DeployData("DeployInfraLogs", "GET")}>
                      <img
                        data-tip="Deploy Infra Logs"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={LogsImage}
                        alt="LogsImage"
                        className="deploy_images"
                      />
                    </Link>
                    <br />
                    <Link onClick={() => DeployData("InfraCost", "POST")}>
                      <img
                        data-tip="Infra Cost"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={CostImage}
                        alt="CostImage"
                        className="deploy_images"
                      />
                    </Link>
                    <Link onClick={() => DeployData("InfraCostLogs", "GET")}>
                      <img
                        data-tip="Infra Cost Logs"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={LogsImage}
                        alt="LogsImage"
                        className="deploy_images"
                      />
                    </Link>
                  </div>
                  <div>
                    {" "}
                    <Link onClick={() => DeployData("UnDeployInfra", "POST")}>
                      <img
                        data-tip="Undeploy Infra"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={UnDeployImage}
                        alt="UnDeployImage"
                        className="deploy_images"
                      />
                    </Link>
                    <Link
                      onClick={() => DeployData("UnDeployInfraLogs", "GET")}
                    >
                      <img
                        data-tip="Undeploy Infra Logs"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={LogsImage}
                        alt="LogsImage"
                        className="deploy_images"
                      />
                    </Link>
                  </div>
                </div>
                <div class="css_table_row">
                  <div>Istio (DNS)</div>
                  <div>
                    {" "}
                    <Link onClick={() => DeployData("DeployIstio", "POST")}>
                      <img
                        data-tip="Deploy Istio(DNS)"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={DeployImage}
                        alt="DeployImage"
                        className="deploy_images"
                      />
                    </Link>
                    <Link onClick={() => DeployData("DeployIstioLogs", "GET")}>
                      <img
                        data-tip="Deploy Istio(DNS) Logs"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={LogsImage}
                        alt="LogsImage"
                        className="deploy_images"
                      />
                    </Link>
                  </div>
                  <div></div>
                </div>
                <div class="css_table_row">
                  <div>Database (PostgreSQL)</div>
                  <div>
                    {" "}
                    <Link onClick={() => DeployData("DeployDB", "POST")}>
                      <img
                        data-tip="Deploy Postgres"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={DeployImage}
                        alt="DeployImage"
                        className="deploy_images"
                      />
                    </Link>
                    <Link onClick={() => DeployData("DeployDBLogs", "GET")}>
                      <img
                        data-tip="Deploy Postgres Logs"
                        data-place="bottom"
                        data-background-color="#006ab6"
                        src={LogsImage}
                        alt="LogsImage"
                        className="deploy_images"
                      />
                    </Link>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
          {logs !== "Start" ? (
            <div style={{ width: "45vw", float: "right" }}>
              {logs !== "" ? (
                <Label className="logslabel scroll">{logs}</Label>
              ) : (
                <Label className="logslabel scroll">
                  <Loader
                    size="large"
                    themeColor="info"
                    type="converging-spinner"
                    style={{ marginTop: 100, marginLeft: 250 }}
                  />
                </Label>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default DeployData;
