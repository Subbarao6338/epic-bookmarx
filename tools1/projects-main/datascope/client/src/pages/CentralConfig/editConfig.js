import React, { useEffect, useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { Link, useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { Label } from "@progress/kendo-react-labels";
import ReactTooltip from "react-tooltip";
import { SaveButton, CancelButton } from "../../components/Buttons/buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";

loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/central_config",
    text: "Centralized Configuration",
  },
  {
    id: "add_config",
    route_url: "/central_config/edit_config",
    text: "Edit Config",
  },
];
const EditConfig = () => {
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
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
            <br />
            <h3 id="heading" align="left">
              Edit Configuration
            </h3>
          </div>
          <hr />
        </div>
        <div style={{ width: "80vw" }}>
          <div style={{ width: "40vw", float: "left" }}>
            <div className="text-start form_left">Table</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default EditConfig;
