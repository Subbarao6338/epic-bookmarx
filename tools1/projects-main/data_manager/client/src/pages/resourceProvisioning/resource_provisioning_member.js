import * as React from "react";
import { Label } from "@progress/kendo-react-labels";
import { get_user_resources, tenant_id } from "../../commonUtility/api_urls";
import { httpget } from "../../commonUtility/common_http";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { GiSandsOfTime } from "react-icons/gi";

const ResourceProvisioningTeamMember = (userMail) => {
  const [resourceDetails, setResourceDetails] = React.useState([]);
  const [kubernetesClusterDetails, setKubernetesClusterDetails] =
    React.useState([]);
  const [deployedResourcesDetails, setDeployedResourcesDetails] =
    React.useState([]);
  const [isAny, setIsAny] = React.useState(-1);

  const handleEyeClick = (prop) => {
    var str_ = "eye_";
    if (prop.type === "non_slash") {
      document.getElementById(
        str_.concat("slash_" + prop.index)
      ).style.display = "";
      document.getElementById(str_.concat(prop.index)).style.display = "none";
      document.getElementById("actual_pass_" + prop.index).style.display =
        "none";
      document.getElementById("hidden_pass_" + prop.index).style.display = "";
    } else {
      document.getElementById(
        str_.concat("slash_" + prop.index)
      ).style.display = "none";
      document.getElementById(str_.concat(prop.index)).style.display = "";
      document.getElementById("actual_pass_" + prop.index).style.display = "";
      document.getElementById("hidden_pass_" + prop.index).style.display =
        "none";
    }
  };

  React.useEffect(() => {
    const req_value = {
      params: {
        tenant_id: tenant_id,
        account_mail: userMail.AccountMail,
      },
    };
    httpget(get_user_resources, req_value).then((results) => {
      console.log(results);
      if (results.resourceDetails === "No Project") {
        setIsAny(0);
      } else if (
        results.kubernetesCluster.data.length === 0 &&
        results.deployedResources.data.length === 0
      ) {      
        setIsAny(1);
      } else {
        setIsAny(2);
        setResourceDetails(results.resourceDetails.data);
        setKubernetesClusterDetails(results.kubernetesCluster.data);
        setDeployedResourcesDetails(results.deployedResources.data);
      }
    });
  }, []);
  return (
    <>
      <div id="page">
        <div>
          <h3 align="left" id="heading">
            Resource Provisioning
          </h3>
          <p align="left">All about your provisioned resources</p>
          <hr />
          {isAny === 2 ? (
            <>
              <div style={{ fontSize: 22, fontWeight: 500 }}>
                Kubernetes Cluster
              </div>
              {kubernetesClusterDetails.length > 0 ? (
                <div className="text-start from_left">
                  {kubernetesClusterDetails.map((item, index) => (
                    <div
                      className="row border broder-gray m-2"
                      style={{ borderRadius: 10 }}
                    >
                      <div className="col">
                        <tr key={"kub_name_" + index}>
                          <td>Kubernetes Name &nbsp;</td>
                          <td>&nbsp; : {item.kubernetes_name}</td>
                        </tr>
                        <tr key={"res_name_" + index}>
                          <td>Resource Name &nbsp;</td>
                          <td>&nbsp; : {item.resource_name}</td>
                        </tr>
                        <tr key={"res_loc_" + index}>
                          <td>Resource Location &nbsp;</td>
                          <td>&nbsp; : {item.resource_location}</td>
                        </tr>
                        <tr key={"env_" + index}>
                          <td>Environment &nbsp;</td>
                          <td>&nbsp; : {item.environment}</td>
                        </tr>
                        <tr key={"vm_" + index}>
                          <td>AKS Nodes VM Type&nbsp;</td>
                          <td>&nbsp; : {item.aks_nodes_vm_type}</td>
                        </tr>
                        <tr key={"node_count_" + index}>
                          <td>Node Count &nbsp;</td>
                          <td>&nbsp; : {item.node_count}</td>
                        </tr>
                        <tr key={"status_" + index}>
                          <td>Status &nbsp;</td>
                          <td
                            style={
                              item.status === "In-Progress"
                                ? { color: "Orange" }
                                : item.status === "Completed"
                                ? { color: "green" }
                                : {
                                    color: "red",
                                  }
                            }
                          >
                            &nbsp; : {item.status} &nbsp;
                            {item.status === "In-Progress" ? (
                              <GiSandsOfTime />
                            ) : item.status === "Completed" ? (
                              <AiFillCheckCircle />
                            ) : (
                              <AiFillCloseCircle />
                            )}
                          </td>
                        </tr>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>No Kubernetes Cluster</>
              )}

              <br />
              <div style={{ fontSize: 22, fontWeight: 500 }} className="col">
                Deployed Resources
              </div>
              {deployedResourcesDetails.length > 0 ? (
                <div className="text-start from_left">
                  {deployedResourcesDetails.map((item, index) => (
                    <div
                      className="row border broder-gray m-2"
                      style={{ borderRadius: 10 }}
                    >
                      <div className="col">
                        <b>Resource Details -</b>
                        <tr key={"dep_kub_name_" + index}>
                          <td>Kubernetes Name &nbsp;</td>
                          <td>&nbsp; : {item.kubernetes_name}</td>
                        </tr>
                        <tr key={"dep_res_name_" + index}>
                          <td>Resource Name &nbsp;</td>
                          <td>&nbsp; : {item.resource_name}</td>
                        </tr>
                        <tr key={"dep_res_loc_" + index}>
                          <td>Resource Location &nbsp;</td>
                          <td>&nbsp; : {item.resource_location}</td>
                        </tr>
                        <tr key={"dep_status_" + index}>
                          <td>Status &nbsp;</td>
                          <td
                            style={
                              item.status === "In-Progress"
                                ? { color: "Orange" }
                                : item.status === "Completed"
                                ? { color: "green" }
                                : {
                                    color: "red",
                                  }
                            }
                          >
                            &nbsp; : {item.status} &nbsp;
                            {item.status === "In-Progress" ? (
                              <GiSandsOfTime />
                            ) : item.status === "Completed" ? (
                              <AiFillCheckCircle />
                            ) : (
                              <AiFillCloseCircle />
                            )}
                          </td>
                        </tr>
                      </div>
                      <div className="col">
                        <b>Steps & Credentials -</b>
                        <tr className="access_url">
                          <td>Access URL &nbsp;</td>
                          <td>&nbsp;: {"https://localhost:8080"}</td>
                        </tr>
                        <tr className="access_url">
                          <td>Username &nbsp;</td>
                          <td>&nbsp;: {"my_username"}</td>
                        </tr>
                        <tr className="access_url">
                          <td>Password &nbsp; </td>
                          <td id={"hidden_pass_" + index}>
                            &nbsp;:{" "}
                            {"India@123".split("").map(() => (
                              <span>&#8226;</span>
                            ))}
                            &ensp;&ensp;&ensp;&ensp;
                          </td>
                          <td
                            id={"actual_pass_" + index}
                            style={{ display: "none" }}
                          >
                            &nbsp;: {"India@123"}&ensp;&ensp;&ensp;&ensp;
                          </td>
                          <td>
                            <FaEye
                              id={"eye_" + index}
                              style={{ cursor: "pointer", display: "none" }}
                              onClick={() =>
                                handleEyeClick({
                                  index: index,
                                  type: "non_slash",
                                })
                              }
                            />
                            <FaEyeSlash
                              id={"eye_slash_" + index}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleEyeClick({ index: index, type: "slash" })
                              }
                            />
                          </td>
                        </tr>
                        <tr className="steps">
                          <td>Steps&nbsp;</td>
                          <td>&nbsp;: {"content"}</td>
                        </tr>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>No Deployed Resource</>
              )}
            </>
          ) : (
            <div style={{ verticalAlign: "center", fontSize: "25px" }}>
              {isAny === 1
                ? "No Resource Assigned"
                : isAny === 0
                ? "No Project Assigned to the User"
                : "Loading.."}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ResourceProvisioningTeamMember;
