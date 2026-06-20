import * as React from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Link } from "react-router-dom";
import {
  httpget,
  httpput,
  httpdelete,
  addnew_notifications,
} from "../commonUtility/common_http";
import {
  fetch_organization_url,
  update_organization_url,
  delete_organization_url,
  tenant_id,
  is_organization_exist,
} from "../commonUtility/api_urls";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "./../messages/en-US";
import EditForm from "./organization_edit";
import { Button } from "@progress/kendo-react-buttons";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import { CreateButton } from "./../components/Buttons/buttons";
var delayInMilliseconds = 1400;
loadMessages(enMessages, "en-US");

const navitems = [
  {
    id: "home",
    route_url: "/home",
    text: "Home",
  },
  {
    id: "organizationsummary",
    route_url: "/organization_summary",
    text: "Organization Summary",
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
      &nbsp;
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

const OrganizationSummary = () => {
  const AccountInfo = AccountInfoDetails();
  const page_name = enMessages["cdp_notifications"]["page_organization"];

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

    console.log(fetch_organization_url);
    httpget(fetch_organization_url, req_value).then((result) => {
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
    const req_value = {
      params: { id: event.id, name: event.name, page_type: "edit" },
    };

    httpget(is_organization_exist, req_value).then((result) => {
      var org_count = result[0].count;
      if (parseInt(org_count) > 0) {
        event.errmsg =
          "Entered Organization Name Already Exists. Please Enter Unique Organization Name.";
        setOpenForm(true);
        setEditItem(event);
      } else {
        let newData = data.map((item) => {
          if (event.id === item.id) {
            item = { ...event };
            const req_value = {
              name: event.name,
              id: event.id,
              details: event.details,
              acc_details: AccountInfo["AccountMail"],
            };

            httpput(update_organization_url, req_value).then((result) => {
              if (result.data === "Success") {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Organization Updated Successfully.",
                  showConfirmButton: false,
                  timer: 1500,
                });
                const alert_type =
                  enMessages["cdp_notifications"]["alert_type_none"];
                const alert_msg =
                  '"' + event.name + '" Organization Updated Successfully.';

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
                  '"' + event.name + '" Organization Updation Failed.';
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
                  title: "Organization Updation Failed.",
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
      }
    });
  };

  const handleCancelEdit = () => {
    setOpenForm(false);
  };
  const enterDelete = (item) => {
    Swal.fire({
      title: enMessages["cdp_swal_msg"]["dlt_title"],
      text: item.name,
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

        console.log(delete_organization_url);
        httpdelete(delete_organization_url, req_value).then((result) => {
          if (result.data === "Success") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Organization Deleted Successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_none"];
            const alert_msg =
              '"' + item.name + '" Organization Deleted Successfully.';
            addnew_notifications(
              AccountInfo["AccountName"],
              AccountInfo["AccountMail"],
              page_name,
              alert_type,
              alert_msg
            );
            setTimeout(function () {
              window.location.reload();
            }, delayInMilliseconds);
          } else {
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_error"];
            const alert_msg =
              '"' + item.name + '" Organization Deletion Failed.';
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
              title: "Organization Deletion Failed.",
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
  const headerCellChange = (prop) => {
    return <b className="k-text-center">{prop.title}</b>;
  };

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
              {enMessages.cdp_menus.organizationsummary}
            </h3>
          </div>
          <hr />
          <div align="left">
            <Link to="/organization_create">
              {/* <Button id="btn" icon="plus-outline"></Button> */}
              <CreateButton
                buttonlabel={
                  enMessages["cdp_button_labels"]["organizationcreate"]
                }
              />
            </Link>
          </div>
          <br />
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
                width="100px"
                headerCell={headerCellChange}
                filterable={false}
              />

              <Column
                field="name"
                title="Organization Name"
                width="300px"
                headerCell={headerCellChange}
              />
              <Column
                field="details"
                title="Details"
                width="500px"
                headerCell={headerCellChange}
              />
              <Column
                field="action"
                cell={MyEditCommandCell}
                title="Action"
                width="140px"
                headerCell={headerCellChange}
                filterable={false}
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

export default OrganizationSummary;
