import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";
import ReactTooltip from "react-tooltip";
import { Button } from "@progress/kendo-react-buttons";
import { process } from "@progress/kendo-data-query";
import { fetch_projectmgmt_url, tenant_id } from "../commonUtility/api_urls";
import { httpget } from "../commonUtility/common_http";
import { AccountInfoDetails } from "../authUtility/AccountInfo"

loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/dpadminresource",
    text: "Resource Provisioning",
  },
  {
    id: "projectresource",
    route_url: "/assignresource",
    text:"Resource",
  },
];

const EditCommandCell = (props) => {
  return (
    <td>
      <Button
        className="k-button k-primary"
        id="btn"
        icon="plus"
        onClick={() =>
        window.open("/addresource?projid="+ props.dataItem.projid)}
      ></Button>
      &nbsp;&nbsp;
    </td>
  );
};
const initialDataState = {
  sort: [{ field: "code", dir: "asc" }],
  take: 5,
  skip: 0,
};
const Projectresource = () => {
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const AccountInfo = AccountInfoDetails();
  const [data, setData] = React.useState([]);
  const [dataState, setDataState] = React.useState(initialDataState);
  const [openForm, setOpenForm] = React.useState(false);
  const [editItem, setEditItem] = React.useState({ id: 1 });
  const [value,setValue] = React.useState([]);

  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };


  const MyEditCommandCell = (props) => (
    <EditCommandCell
      {...props}
    />
  );
  const MyTimeCell = (props) => {
   
    return (
      <td>{new Date(props.dataItem.created_on).toLocaleDateString()}</td>
    );
  };

  useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    };
    httpget(fetch_projectmgmt_url, req_value).then((results) => {
      setData(results.projects.data);
    });
  }, []);

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
              Resource
            </h3>
          </div>
          <hr />
        </div>
        <br />
        <div style={{ maxWidth: 1200 }}>
          <Grid
            pageable={true}
            sortable={true}
            // filterable={true}
            data={process(data, dataState)}
            {...dataState}
            onDataStateChange={(e) => {
              setDataState(e.dataState);
            }}
          >
            <Column field="slno" title="S.No" width="60px" filterable={false} />
            <Column
              field="projectname"
              title="Project"
              width="300px"
              filterable={false}
            />
            
            <Column
              field="user_name"
              title="Project Lead"
              width="300px"
              filterable={false}
            />
            
            <Column
              field="created_on"
              title="Start Date"
              width="300px"
              filterable={false}
             cell={MyTimeCell}
            />
            <Column
              field="action"
              cell={MyEditCommandCell}
              title="Action"
              width="220px"
              filterable={false}
            />
          </Grid>
          
        </div>
      </div>
    </React.Fragment>
  );
};
export default Projectresource;
