import * as React from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { Link } from "react-router-dom";
import EditForm from "./servicecomment_edit";
import { enMessages } from "../messages/en-US";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import {
  httpget,
  httpdelete,
  addnew_notifications,
  httpput,
} from "../commonUtility/common_http";
import { CreateButton } from "./../components/Buttons/buttons";
import {
  fetch_comment_url,
  delete_comment_url,
  update_comment_url,
  // download_sr_file_url,
  details_service_request_url,
  tenant_id,
} from "../commonUtility/api_urls";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
// import { process } from '@progress/kendo-data-query'
import { Button } from "@progress/kendo-react-buttons";
import Swal from "sweetalert2";
import { Label } from "@progress/kendo-react-labels";
import { DropdownFilterCell } from "../components/filter/dropdownFilterCell";
import { GridPDFExport } from "@progress/kendo-react-pdf";

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

  {
    id: "sericerequestdetails",
    route_url: "/servicerequest_details",
    text: "Service Request Details",
  },
];

const list_status = ["Reopened", "In Progress", "Completed"];
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

const StatusFilterCell = (props) => (
  <DropdownFilterCell {...props} data={list_status} defaultItem={"All"} />
);

const initialDataState = {
  sort: [{ field: "code", dir: "asc" }],
  take: 5,
  skip: 0,
};

function ServiceRequestDetails() {
  const AccountInfo = AccountInfoDetails();
  const params = new URLSearchParams(window.location.search);
  const sr_id = params.get("sr_id");
  const page_name =
    enMessages["cdp_notifications"]["page_servicerequest_details"];

  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const [title, setTitle] = React.useState();
  const [details, setDetails] = React.useState();
  const [openForm, setOpenForm] = React.useState(false);
  const [editItem, setEditItem] = React.useState({ id: 1 });
  // const [downloadFile, setdownloadFile] = React.useState()
  const [uploaded_files, setuploaded_files] = React.useState();
  //const [sr_id, setsr_id] = React.useState([]);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const req_value = {
      params: {
        sr_id: sr_id,
      },
    };

    httpget(details_service_request_url, req_value).then((result) => {
      console.log(result.data);
      setTitle(result.data[0].title);
      setDetails(result.data[0].description);
      let uploaded_file_name = "";
      let uploaded_file_path = result.data[0].uploaded_files;

      if (
        uploaded_file_path !== "" &&
        uploaded_file_path !== null &&
        uploaded_file_path !== undefined
      ) {
        let uploaded_file_path_split = uploaded_file_path.split("/");

        uploaded_file_name =
          uploaded_file_path_split[uploaded_file_path_split.length - 1];
      }

      setuploaded_files(uploaded_file_name);
    });
  }, []);

  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id, sr_id: sr_id },
    };

    console.log(fetch_comment_url);
    httpget(fetch_comment_url, req_value).then((result) => {
      console.log(result);

      setData(result);
    });
  }, [sr_id]);

  // const [dataState, setDataState] = React.useState(initialDataState)
  const MyEditCommandCell = (props) => (
    <EditCommandCell
      {...props}
      enterEdit={enterEdit}
      enterDelete={enterDelete}
    />
  );
  const grid = (
    <Grid data={data}>
      <Column
        field="slno"
        title="S.No"
        text-align="center"
        filterable={false}
        width="60px"
      />

      <Column field="comment" title="Comment" filterable={true} width="300px" />

      <Column
        field="created_on"
        title="Comment Date"
        filterable={true}
        width="300px"
        format="{0:dd/MM/yyyy}"
      />

      <Column
        field="status"
        title="Status"
        filterable={true}
        width="300px"
        filterCell={StatusFilterCell}
      />

      <Column
        className="tableborder"
        cell={MyEditCommandCell}
        title="Action"
        filterable={false}
        width="90px"
      />
    </Grid>
  );

  const enterEdit = (item) => {
    setOpenForm(true);
    setEditItem(item);
  };
  const gridPDFExport = React.useRef();

  const exportPDF = () => {
    if (gridPDFExport !== undefined) {
      gridPDFExport.current.save(data);
    }
  };

  const handleSubmit = (event) => {
    let newData = data.map((item) => {
      item = { ...event };
      const req_value = {
        sr_id: sr_id,
        id: event.id,
        comment: event.comment,
        status: event.status,
        acc_details: AccountInfo["AccountName"],
      };

      httpput(update_comment_url, req_value).then((result) => {
        if (result.data === "Success") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Service Request Details Updated Successfully.",
            showConfirmButton: false,
            timer: 1500,
          });

          const alert_type = enMessages["cdp_notifications"]["alert_type_none"];
          const alert_msg =
            '"' +
            event.comment +
            '" Service Request Details Updated Successfully.';

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
            '"' + event.comment + '" Service Request Details Updation Failed.';

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
            title: "Service Request Details Updation Failed.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
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
      text: item.comment,
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
        httpdelete(delete_comment_url, req_value).then((result) => {
          if (result.data === "Success") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Service Request Comment Deleted Successfully.",
              showConfirmButton: false,
              timer: 1500,
            });

            const alert_type =
              enMessages["cdp_notifications"]["alert_type_none"];

            const alert_msg =
              '"' +
              item.comment +
              '" Service Request Comment Deleted Successfully.';

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
              '"' + item.comment + '" Service Request Deletion Failed.';

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
              title: "Service Request Comment Deletion Failed.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    });
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
              {enMessages.cdp_menus.servicerequestdetails}
            </h3>
          </div>

          <hr />

          <div className="text-start">
            <div className="text-start">
              <Label editorId="title">
                <b>Title: </b>&nbsp; {title}{" "}
              </Label>
            </div>

            <br></br>

            <div>
              <Label editorId="details">
                <b>Details:</b>&nbsp; {details}
              </Label>
            </div>

            <br />

            {uploaded_files === "" ? (
              ""
            ) : (
              <div>
                <Label editorId="uploaded_files">
                  <b>Attachment:</b>&nbsp; {uploaded_files}
                </Label>
                &nbsp;
                <a
                  href={
                    "http://localhost:8000/servicerequest/download_sr_file_view?filename=" +
                    uploaded_files
                  }
                  download="uploaded_files"
                >
                  <Button
                    style={{ backgroundColor: "darkblue", color: "white" }}
                    id="my_file"
                    icon="download"
                    themeColor={"primary"}
                  >
                    Download
                  </Button>{" "}
                </a>
              </div>
            )}
            <br />
            <br />
            {/* <div className="text-start">
              {' '}
              <Link to={'/servicerequest_comment?sr_id=' + sr_id}>
                <CreateButton
                  buttonlabel={
                    enMessages['cdp_button_labels']['servicerequestcomment']
                  }
                />
              </Link>
            </div> */}
            <div className="text-start">
              <Link to={"/servicerequest_comment?sr_id=" + sr_id}>
                <CreateButton
                  buttonlabel={
                    enMessages["cdp_button_labels"]["servicerequestcomment"]
                  }
                />
              </Link>

              <Button
                style={{ float: "right" }}
                title="Export PDF"
                //className="k-button k-primary"

                id="btn"
                // icon="edit"

                icon="pdf"
                className="k-button k-primary text-right"
                onClick={exportPDF}
              >
                Export PDF
              </Button>
            </div>
            <br />
            <div>
              {grid}

              <GridPDFExport ref={gridPDFExport} margin="1cm">
                {grid}
              </GridPDFExport>
            </div>
            <br />
          </div>
          <br></br>
        </div>

        <div>
          {/*   <Grid
            pageable={true}
            sortable={true}
            filterable={true}
            data={process(data, dataState)}
            {...dataState}
            onDataStateChange={(e) => {
              setDataState(e.dataState)
            }}
          >
            <Column
              field="slno"
              title="S.No"
              text-align="center"
              filterable={false}
              width="60px"
            />

            <Column
              field="comment"
              title="Comment"
              filterable={true}
              width="300px"
            />

            <Column
              field="created_on"
              title="Comment Date"
              filterable={true}
              width="300px"
              format="{0:dd/MM/yyyy}"
            />

            <Column
              field="status"
              title="Status"
              filterable={true}
              width="300px"
              filterCell={StatusFilterCell}
            />

            <Column
              className="tableborder"
              cell={MyEditCommandCell}
              title="Action"
              filterable={false}
              width="90px"
            />
          </Grid> */}

          {openForm && (
            <EditForm
              cancelEdit={handleCancelEdit}
              onSubmit={handleSubmit}
              item={editItem}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default ServiceRequestDetails;
