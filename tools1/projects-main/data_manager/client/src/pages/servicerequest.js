import * as React from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { Link } from "react-router-dom";
import EditForm from "./servicerequest_edit";
import { enMessages } from "../messages/en-US";
import {
  httpget,
  httpdelete,
  addnew_notifications,
  httpput,
} from "../commonUtility/common_http";
import {
  fetch_service_url,
  delete_service_request_url,
  update_service_request_url,
  tenant_id,
} from "../commonUtility/api_urls";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import { CreateButton } from "./../components/Buttons/buttons";
var delayInMilliseconds = 1400;
loadMessages(enMessages, "en-US");

const navitems = [
  {
    id: "home",
    route_url: "/resourceprovisioning",
    text: "Resource Provisioning",
  },
  {
    id: "service request",
    route_url: "/servicerequest",
    text: "Service Request",
  },
];

const EditCommandCell = (props) => {
  return (
    <td>
      <Button
        id="btn"
        icon="edit"
        className="k-button k-primary"
        onClick={() => props.enterEdit(props.dataItem)}
      ></Button>
      &nbsp;&nbsp;
      <Button
        id="btn"
        icon="delete"
        className="k-button k-primary"
        onClick={() => props.enterDelete(props.dataItem)}
      ></Button>
    </td>
  );
};

const initialDataState = {
  sort: [{ field: "code", dir: "asc" }],
  take: 5,
  skip: 0,
};

const ServiceRequest = () => {
  const AccountInfo = AccountInfoDetails();
  const page_name = enMessages["cdp_notifications"]["page_servicerequest"];

  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const [openForm, setOpenForm] = React.useState(false);
  const [editItem, setEditItem] = React.useState({ id: 1 });

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    };

    console.log(fetch_service_url);
    httpget(fetch_service_url, req_value).then((result) => {
      console.log(result);
      setData(result);
    });
  }, []);

  const [dataState, setDataState] = React.useState(initialDataState);

  const enterEdit = (item) => {
    setOpenForm(true);
    setEditItem(item);
  };

  const handleSubmit = (event) => {
    let newData = data.map((item) => {
      if (event.id === item.id) {
        item = { ...event };
        console.log(event);
        const req_value = {
          id: event.id,
          sr_id: event.sr_id,
          title: event.title,
          description: event.description,
          acc_details: AccountInfo["AccountMail"],
        };
        httpput(update_service_request_url, req_value).then((result) => {
          if (result.data === "Success") {
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_none"];
            const alert_msg =
              '"' + event.title + '" Service Request Updated Successfully.';
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Service Request Updated Successfully.",
              showConfirmButton: false,
              timer: 1500,
            });

            setTimeout(function () {
              addnew_notifications(
                AccountInfo["AccountName"],
                AccountInfo["AccountMail"],
                page_name,
                alert_type,
                alert_msg
              );
              // window.location.reload();
            }, delayInMilliseconds);
          } else {
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_error"];
            const alert_msg =
              '"' + event.title + '" Service Request Updation Failed.';
            addnew_notifications(
              AccountInfo["AccountName"],
              AccountInfo["AccountMail"],
              page_name,
              alert_type,
              alert_msg
            );
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Service Request Updation Failed.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }

      return item;
    });
    setData(newData);
    setOpenForm(false);
  };

  const handleCancelEdit = () => {
    setOpenForm(false);
  };

  const enterDelete = (item) => {
    Swal.fire({
      title: enMessages["cdp_swal_msg"]["dlt_title"],
      text: item.title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const req_value = {
          params: { id: item.id },
        };

        console.log(delete_service_request_url);
        httpdelete(delete_service_request_url, req_value).then((result) => {
          if (result.data === "Success") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Service Request Deleted Successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_none"];
            const alert_msg =
              '"' + item.title + '" Service Request Deleted Successfully.';

            setTimeout(function () {
              addnew_notifications(
                AccountInfo["AccountName"],
                AccountInfo["AccountMail"],
                page_name,
                alert_type,
                alert_msg
              );
              window.location.reload();
            }, delayInMilliseconds);
          } else {
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_error"];
            const alert_msg =
              '"' + item.title + '" Service Request Deletion Failed.';
            addnew_notifications(
              AccountInfo["AccountName"],
              AccountInfo["AccountMail"],
              page_name,
              alert_type,
              alert_msg
            );
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Service Request Deletion Failed.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    });
  };

  const MyEditCommandCell = (props) => (
    <EditCommandCell
      {...props}
      enterEdit={enterEdit}
      enterDelete={enterDelete}
    />
  );

  return (
    <React.Fragment>
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />

      <div>
        <div>
          <div>
            <h3 id="heading" align="left">
              {enMessages.cdp_menus.servicerequest}
            </h3>
          </div>
          <hr />

          <div className="text-start">
            {" "}
            <Link to="/servicerequest_create">
              <CreateButton
                buttonlabel={
                  enMessages["cdp_button_labels"]["servicerequestcreate"]
                }
              />
            </Link>
          </div>
          <br></br>
          <div>
            <Grid
              pageable={true}
              sortable={true}
              filterable={true}
              data={process(data, dataState)}
              {...dataState}
              onDataStateChange={(e) => {
                setDataState(e.dataState);
              }}
            >
              <Column
                field="slno"
                title="S.No"
                text-align="center"
                filterable={false}
                width="60px"
              />

              {/* <Column
                field="sr_id"
                title="SR ID"
                filterable={true}
                width="120px"
              /> */}
              <Column
                field="sr_id"
                title="SR ID"
                filterable={true}
                width="120px"
                cell={(props) => (
                  <td>
                    <div className="sr">
                      <a
                        style={{ fontSize: 14 }}
                        href={
                          "/servicerequest_details?sr_id=" +
                          props.dataItem.sr_id
                        }
                      >
                        {props.dataItem.sr_id}
                      </a>
                    </div>
                  </td>
                )}
              />
              <Column
                field="title"
                title="Title"
                filterable={true}
                width="150px"
              />
              <Column
                field="description"
                title="Description"
                filterable={true}
              />
              <Column
                field="created_on"
                title="Created On"
                filterable={true}
                width="160px"
                format="{0:dd/MM/yyyy}"
              />
              <Column
                field="sr_status"
                title="Status"
                filterable={true}
                width="120px"
              />
              <Column
                className="tableborder"
                cell={MyEditCommandCell}
                title="Action"
                filterable={false}
                width="90px"
              />
            </Grid>

            {openForm && (
              <EditForm
                cancelEdit={handleCancelEdit}
                onSubmit={handleSubmit}
                item={editItem}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ServiceRequest;
