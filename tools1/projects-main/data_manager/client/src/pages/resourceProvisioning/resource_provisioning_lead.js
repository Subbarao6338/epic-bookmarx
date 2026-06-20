import * as React from "react";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import { httpget } from "../../commonUtility/common_http";
import { getresource_userbased_url } from "../../commonUtility/api_urls";
import { Link } from "react-router-dom";
import Data from "../../assets/self_service/Data.png";
loadMessages(enMessages, "en-US");

const ResourceProvisioningLead = () => {
  const AccountInfo = AccountInfoDetails();

  const [resourcedynamic, setResourcedynamic] = React.useState([]);
  React.useEffect(() => {
    const req_value = {
      params: { status: "Active" },
    };
    console.log(req_value);

    console.log(getresource_userbased_url);
    httpget(getresource_userbased_url, req_value).then((result) => {
      console.log(result);
      console.log(result.length);
      setResourcedynamic(result.length === 0 ? "" : result);
    });
  }, []);

  return (
    <React.Fragment>
      <div id="page">
        <div>
          <div>
            <h3 align="left" id="heading">
              {enMessages.cdp_menus.resourceProvisioning}
            </h3>
          </div>
          <p align="left">
            Provision cloud resources, Kubernetes Cluster and VMs for different
            projects.
          </p>
          <hr />
          {resourcedynamic === "" ? (
            <div
              className="float-container"
              style={{ height: 400, width: 1200 }}
            ></div>
          ) : (
            <div
              align="center"
              className="float-container"
              style={{ height: 400 }}
            >
              {resourcedynamic.map((resource) => (
                <div className="float-child3">
                  <div id="card1">
                    <div style={{ padding: 5 }}>
                      <img src={Data} id="icon" alt="data" />
                    </div>
                    <div>
                      <b className=""> {resource.name} </b>
                    </div>
                    <hr />
                    <p
                      id="info"
                      className="projectdesc"
                      title={resource.description}
                    >
                      {resource.description}
                    </p>
                    <span>
                      <Link
                        to={resource.link_page}
                        id="link"
                        style={{ padding: "2px 45px" }}
                      >
                        {resource.button}
                      </Link>
                    </span>
                  </div>
                  {/* </Link> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResourceProvisioningLead;
