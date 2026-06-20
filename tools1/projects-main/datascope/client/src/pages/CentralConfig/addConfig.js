import React, { useEffect, useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { Link, useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { Label } from "@progress/kendo-react-labels";
import ReactTooltip from "react-tooltip";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import { projects_nameslist } from "../../commonUtility/api_urls";
import { httpget } from "../../commonUtility/common_http";

loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/central_config",
    text: "Centralized Configuration",
  },
  {
    id: "add_config",
    route_url: "/central_config/add_config",
    text: "Add New Config",
  },
];

const RemoveButton = (props) => {
  return (
    <Button
      icon="minus-outline"
      style={{ height: "0%", width: "0%" }}
      onClick={() => props.handleRemoveField(props.index)}
    />
  );
};

const AddNewConfig = () => {
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };
  const [configType, setConfigType] = useState("Global");
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState("Loading...");
  const [fieldCount, setFieldCount] = useState([0]);

  const HandleConfigTypeChange = (e) => {
    setConfigType(e.target.value);
    const req_value = {
      params: {},
    };
    httpget(projects_nameslist, req_value).then((results) => {
      setProjectList(results);
      setSelectedProject(results[0]);
    });
  };

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const HandleAddField = () => {
    if (fieldCount.length === 0) {
      setFieldCount([0]);
    } else {
      setFieldCount([...fieldCount, fieldCount.at(-1) + 1]);
    }
  };

  const HandleRemoveField = (index) => {
    setFieldCount(fieldCount.filter((item) => item !== index));
  };

  useEffect(() => {}, []);

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
            <br />
            <h3 id="heading" align="left">
              Add New Configuration
            </h3>
          </div>
          <hr />
        </div>
        <div>
          <div style={{ width: "40vw", float: "left" }}>
            <div className="text-start form_left">
              <div className="row mb-3">
                <div>
                  <Label className="required">
                    Configuration Type: &nbsp;{" "}
                  </Label>
                  <DropDownList
                    className="borderall form_component_width_autodeploy"
                    data={["Global", "Project Based"]}
                    value={configType}
                    onChange={HandleConfigTypeChange}
                  />
                </div>
              </div>
              {configType === "Global" ? (
                <></>
              ) : (
                <div className="row mb-3">
                  <div>
                    <Label className="required">Select Project: &nbsp; </Label>
                    <DropDownList
                      className="borderall form_component_width_autodeploy"
                      data={projectList}
                      value={selectedProject}
                      onChange={handleProjectChange}
                    />
                  </div>
                </div>
              )}
              <div>
                {fieldCount.length !== 0 ? (
                  <div className="row mb-3 form_component_width_autodeploy">
                    <div style={{ width: "40%" }}>
                      <Label>Key: &nbsp; </Label>
                    </div>
                    <div style={{ width: "60%" }}>
                      <Label>Value: &nbsp; </Label>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {fieldCount.map((item) => (
                  <div
                    className="row mb-3 form_component_width_autodeploy"
                    id={"field_" + item}
                  >
                    <div style={{ width: "40%" }}>
                      <Input className="borderall" placeholder="Key" />
                    </div>
                    <div style={{ width: "55%" }}>
                      <Input className="borderall" placeholder="Value" />
                    </div>
                    <div style={{ width: "5%" }}>
                      <RemoveButton
                        index={item}
                        handleRemoveField={HandleRemoveField}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="row mb-3 form_component_width_autodeploy">
                {fieldCount.length === 0 ? (
                  <div>
                    Add key value pairs &nbsp;
                    <Button
                      icon="add-outline"
                      style={{ width: "0%", height: "0%" }}
                      onClick={HandleAddField}
                    />
                  </div>
                ) : (
                  <div>
                    Add more key value pairs &nbsp;
                    <Button
                      icon="add-outline"
                      style={{ width: "0%", height: "0%" }}
                      onClick={HandleAddField}
                    />
                  </div>
                )}
              </div>
              <div
                className="button-container button_right"
                style={{ position: "relative", left: "-7px" }}
              >
                <div>
                  <Button
                    className="savebutton"
                    icon="add-outline"
                    themeColor={"primary"}
                  >
                    Add
                  </Button>
                  &nbsp; &nbsp;
                  <Button className="cancelbutton" icon="close-outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default AddNewConfig;
