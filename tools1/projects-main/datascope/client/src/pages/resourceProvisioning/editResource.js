import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import {
  Input,
  TextArea,
  Slider,
  SliderLabel,
} from "@progress/kendo-react-inputs";
import { enMessages } from "./../../messages/en-US";
import { Label } from "@progress/kendo-react-labels";
import { UpdateButton, CancelButton } from "../../components/Buttons/buttons";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import VMdata from "./VMdata.json";
import VMDetails from "./VMdata1.json";
import location from "./location.json";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import {
  httpget,
  httpput,
  addnew_notifications,
} from "../../commonUtility/common_http";
import {
  fetch_configured_resources,
  update_project_resource_url,
} from "../../commonUtility/api_urls";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "./../../authUtility/AccountInfo";

// const EditResource = (props) => {
//   console.log(props.item)
//   const[aksnodesallowedvmtype,setaksnodesallowedvmtype] = React.useState('')
//   const[aksallowedregions,setaksallowedregions] = React.useState('')
//   // const[aksnodesmaxlimit,setaksnodesmaxlimit] = React.useState('')

//   const handleChange = (event) => {
//     setaksnodesallowedvmtype(event.target.value)
//   }

//   const handleregion = (event) => {
//     setaksallowedregions(event.target.value)
//   }

//   return (
//     <Dialog
//       title={`Edit Resource: ${props.item.projectname}`}
//       onClose={props.cancelEdit}
//       width={350}
//       height={440}
//     >
//       <Form
//         onSubmit={props.onSubmit}
//         initialValues={props.item}
//         render={(formRenderProps) => (
//           <FormElement
//             style={{
//               maxWidth: 550,
//             }}
//           >
//             <fieldset className={'k-form-fieldset'}>
//               <div className="emptyline"> </div>{' '}
//               <div className="mb-3">
//                 <div>
//                   <Label className="required" editorId="VMType">
//                     VM Type: &nbsp;{' '}
//                   </Label>{' '}
//                 </div>{' '}
//                 <Field
//                   className="borderall"
//                   component={DropDownList}
//                   data={VMdata}
//                   name={'aksnodesallowedvmtype'}
//                   onChange={handleChange}
//                   required={true}
//                  value={aksnodesallowedvmtype}
//                 />
//               </div>{' '}
//               <div className="emptyline"> </div>{' '}
//               <div className="mb-3">
//                 <div>
//                   <Label className="required" editorId="region">
//                     Region: &nbsp;{' '}
//                   </Label>{' '}
//                 </div>{' '}
//                 <Field
//                   className="borderall"
//                   component={DropDownList}
//                   data={location}
//                   name={'aksallowedregions'}
//                   onChange={handleregion}
//                   required={true}
//                  value={aksallowedregions}
//                 />
//               </div>{' '}
//               <div className="emptyline"> </div>{' '}
//               <div className="mb-3">
//                 <div>
//                   <Label className="required" editorId="kubernetescluster">
//                     Kubernetes Cluster: &nbsp;{' '}
//                   </Label>{' '}
//                 </div>{' '}
//                 <Field
//                   className="borderall"
//                   name={"aksclusterallocatedcount"}
//                   component={Input}
//                   required={true}
//                   autoComplete="off"
//                 />
//               </div>{' '}

//               <div className="emptyline"> </div>{' '}
//               <div className="mb-3">
//                 <div>
//                   <Label className="required" editorId="nodemaxlimit">
//                     Node Max Limit: &nbsp;{' '}
//                   </Label>{' '}
//                 </div>{' '}
//                 <Field
//                   className="borderall"
//                   name={"aksnodesmaxlimit"}
//                   component={Input}
//                   required={true}
//                   autoComplete="off"
//                 />
//               </div>{' '}
//               <div className="k-form-buttons">
//                 <UpdateButton disabled={!formRenderProps.allowSubmit} />{' '}
//                 <CancelButton handleClick={props.cancelEdit} />{' '}
//               </div>{' '}
//             </fieldset>{' '}
//           </FormElement>
//         )}
//       />{' '}
//     </Dialog>
//   )
// }

const EditResource = (props) => {
  console.log(props);
  const AccountInfo = AccountInfoDetails();
  const page_name = "Configuration Setting";
  console.log(props);
  const [msg, setMsg] = React.useState({ create: false, display: "none" });
  const [aksnodesallowedvmtype, setaksnodesallowedvmtype] = React.useState([]);
  const [aksallowedregions, setaksallowedregions] = React.useState([]);
  const [kubernetesClusterLimit, setKubernetesClusterLimit] = React.useState(
    props.item.aksclusterallocatedcount === "None"
      ? 2
      : props.item.aksclusterallocatedcount
  );
  const [nodeMaxLimit, setNodeMaxLimit] = React.useState(
    props.item.aksnodesmaxlimit === "None" ? 2 : props.item.aksnodesmaxlimit
  );
  const [onChangeFlag, setOnChangeFlag] = React.useState(false);
  const [updateClickedFlag, setUpdateClickedFlag] = React.useState(false);

  const handleVMChange = (e) => {
    setOnChangeFlag(true);
    setaksnodesallowedvmtype(e.target.value);
  };

  const handleRegionChange = (e) => {
    setOnChangeFlag(true);
    setaksallowedregions(e.target.value);
  };

  const handleKubeClusterLimitChange = (e) => {
    setOnChangeFlag(true);
    setKubernetesClusterLimit(Math.round(e.value));
  };

  const handleNodeLimitChange = (e) => {
    setOnChangeFlag(true);
    setNodeMaxLimit(Math.round(e.value));
  };

  const handleOnSubmit = () => {
    setOnChangeFlag(false);
    setUpdateClickedFlag(true);
    if (
      nodeMaxLimit === 0 &&
      kubernetesClusterLimit === 0 &&
      aksnodesallowedvmtype.length === 0 &&
      aksallowedregions.length === 0
    ) {
      setMsg({
        msg: "All fields are mandatory !!",
        color: "red",
        display: "",
      });
    } else if (aksnodesallowedvmtype.length === 0) {
      setMsg({
        msg: "Please select VM Types !!",
        color: "red",
        display: "",
      });
    } else if (aksallowedregions.length === 0) {
      setMsg({
        msg: "Please select Region !!",
        color: "red",
        display: "",
      });
    } else if (kubernetesClusterLimit === 0) {
      setMsg({
        msg: "Please assign some Kubernetes Clusters !!",
        color: "red",
        display: "",
      });
    } else if (nodeMaxLimit === 0) {
      setMsg({
        msg: "Please assign some Nodes !!",
        color: "red",
        display: "",
      });
    } else {
      {
        !msg.create
          ? setMsg({
              msg: "Updating...",
              color: "orange",
              display: "",
            })
          : setMsg({
              msg: "Assigning...",
              color: "orange",
              display: "",
              create: true,
            });
      }
      const req_value = {
        projid: props.item.projid,
        aksnodesallowedvmtype: aksnodesallowedvmtype.toString(),
        aksallowedregions: aksallowedregions.toString(),
        aksclusterallocatedcount: kubernetesClusterLimit,
        aksnodesmaxlimit: nodeMaxLimit,
        create: msg.create,
      };
      console.log(update_project_resource_url);
      console.log(req_value);
      httpput(update_project_resource_url, req_value).then((result) => {
        if (result.data === "Success") {
          const alert_type = enMessages["cdp_notifications"]["alert_type_none"];
          if (!msg.create) {
            setMsg({
              msg: "Configuration Updated Successfully !!",
              color: "green",
              display: "",
            });
            const alert_msg =
              '"' +
              props.item.projectname +
              '" Configuration Updated Successfully.';
            addnew_notifications(
              AccountInfo["AccountName"],
              AccountInfo["AccountMail"],
              page_name,
              alert_type,
              alert_msg
            );
            // window.location.reload();
          } else {
            setMsg({
              msg: "Assigned Successfully !!",
              color: "green",
              display: "",
            });
            const alert_msg =
              '"' +
              props.item.projectname +
              '" Resources configured Successfully.';
            addnew_notifications(
              AccountInfo["AccountName"],
              AccountInfo["AccountMail"],
              page_name,
              alert_type,
              alert_msg
            );
          }
        }
      });
      props.item.aksallowedregions = req_value.aksallowedregions;
      props.item.aksclusterallocatedcount = req_value.aksclusterallocatedcount;
      props.item.aksnodesallowedvmtype = req_value.aksnodesallowedvmtype;
      props.item.aksnodesmaxlimit = req_value.aksnodesmaxlimit;
    }
  };

  const handleCancel = () => {
    // if (updateClickedFlag) {
    //   // window.location.replace("/assignresource");
    //   props.cancelEdit();
    // } else {
    props.cancelEdit();
    // }
  };

  React.useEffect(() => {
    if (
      props.item.aksallowedregions === "None" &&
      props.item.aksnodesmaxlimit === "None" &&
      props.item.aksnodesallowedvmtype === "None" &&
      props.item.aksclusterallocatedcount === "None"
    ) {
      setMsg({
        msg: "Note: This project is yet to be configured.",
        color: "red",
        create: true,
        display: "",
      });
      setaksallowedregions(["Central India"]);
      setaksnodesallowedvmtype([VMdata[0]]);
    } else {
      setaksallowedregions(props.item.aksallowedregions.split(","));
      setaksnodesallowedvmtype(props.item.aksnodesallowedvmtype.split(","));
    }
  }, []);

  return (
    <Dialog
      title={`Configuration Setting : ${props.item.projectname}`}
      onClose={props.cancelEdit}
      width={500}
      // height={470}
    >
      <Form
        // onSubmit={handleOnSubmit}
        render={(formRenderProps) => (
          <FormElement>
            <fieldset className={"k-form-fieldset"}>
              <div style={{ color: msg.color, display: msg.display }}>
                {msg.msg}
                <div className="emptyline"> </div>
              </div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="VMType">
                    VM Type: &nbsp;
                  </Label>
                </div>
                <MultiSelect
                  className="borderall"
                  data={VMdata}
                  value={aksnodesallowedvmtype}
                  onChange={handleVMChange}
                />
              </div>
              {aksnodesallowedvmtype.map((vm) => (
                <div style={{ color: "blue" }}>
                  <span>
                    {vm} - {"("}
                  </span>
                  {Object.keys(VMDetails[vm]).map((key) => (
                    <span>
                      {key} - {VMDetails[vm][key]},&nbsp;
                    </span>
                  ))}
                  <span>{")"}</span>
                </div>
              ))}
              <div className="emptyline"> </div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="region">
                    Region: &nbsp;
                  </Label>
                </div>
                <MultiSelect
                  className="borderall"
                  data={location}
                  value={aksallowedregions}
                  onChange={handleRegionChange}
                />
              </div>
              <div className="emptyline"> </div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="kubernetescluster">
                    Kubernetes Cluster: &nbsp;
                  </Label>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  defaultValue={kubernetesClusterLimit}
                  buttons={true}
                  style={{ width: "100%" }}
                  onChange={handleKubeClusterLimitChange}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                    <SliderLabel position={val}>{val}</SliderLabel>
                  ))}
                </Slider>
              </div>
              <div className="emptyline"> </div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="nodemaxlimit">
                    Node limit Per Kubernetes Cluster: &nbsp;
                  </Label>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  buttons={true}
                  defaultValue={nodeMaxLimit}
                  style={{ width: "100%" }}
                  onChange={handleNodeLimitChange}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                    <SliderLabel position={val}>{val}</SliderLabel>
                  ))}
                </Slider>
              </div>
              <div className="emptyline"> </div>
              <div className="k-form-buttons">
                {msg.create ? (
                  <Button
                    className="savebutton"
                    icon="building-blocks"
                    // disabled={!onChangeFlag}
                    onClick={handleOnSubmit}
                  >
                    Assign
                  </Button>
                ) : (
                  <Button
                    className="updatebutton"
                    icon="pencil"
                    disabled={!onChangeFlag}
                    onClick={handleOnSubmit}
                  >
                    Update
                  </Button>
                )}
                <Button
                  className="cancelbutton"
                  icon="close-outline"
                  onClick={handleCancel}
                >
                  Close
                </Button>
              </div>
            </fieldset>
          </FormElement>
        )}
      />
    </Dialog>
  );
};

export default EditResource;
