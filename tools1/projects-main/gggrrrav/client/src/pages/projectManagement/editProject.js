import { useState } from "react";
import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Switch, TextArea, Input } from "@progress/kendo-react-inputs";
import { tenant_id, get_users_url } from "../../commonUtility/api_urls";
import { httpget } from "../../commonUtility/common_http";
import { Label } from "@progress/kendo-react-labels";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { UpdateButton, CancelButton } from "../../components/Buttons/buttons";

const EditProject = (props) => {
  let current_lead = props.item.user_name;
 //let current_lead = "select project lead";
 let status_of_active = props.item.status;
 let errmsg =
   typeof props.item.errmsg === "undefined" ? "" : props.item.errmsg;
 const [status, setstatus] = React.useState(true);
 const [statusVal, setStatusVal] = React.useState(status_of_active);
 const [allLeads, setAllLeads] = useState([]);
 //const [user_name,setUser_name] =useState([]);
 const [value, setValue] = React.useState(current_lead);
 const handleChange = (event) => {
   setValue(event.target.value);
 };
 const handleToggleSwitch = () => {
   setstatus(!status);
   if (statusVal === "Active") {
     setStatusVal("InActive");
   } else {
     setStatusVal("Active");
   }
 };
 React.useEffect(() => {
   const req_value = {
     params: {},
   };
   if (statusVal === "Active") {
     setstatus(true);
   } else {
     setstatus(false);
   }
   httpget(get_users_url, req_value).then((results) => {
     var lead_list = results.users.data.map(function (elem) {
       return elem.user_name;
     });
     setAllLeads(lead_list);
   });
 }, []);
 return (
   <Dialog
     title={`Edit Projects: ${props.item.projectname}`}
     onClose={props.cancelEdit}
     width={400}
     height={450}
   >
     <Form
       onSubmit={props.onSubmit}
       initialValues={props.item}
       render={(formRenderProps) => (
         <FormElement
           style={{
             maxWidth: 550,
           }}
         >
           <fieldset className={"k-form-fieldset"}>
             <div className="mb-3">
               <div>
                 <Label className="required" editorId="projectname">
                   Project Name:&nbsp;
                 </Label>
               </div>
               <Field
                 className="borderall"
                 name={"projectname"}
                 component={Input}
                 required={true}
                 autoComplete="off"
               />
             </div>
             {errmsg !== " " ? (
               <div>
                 <Label className="validationmsg">{errmsg}</Label>
               </div>
             ) : (
               <div></div>
             )}
             <div className="mb-3">
               <div>
                 <Label className="" editorId="description">
                   Description:&nbsp;
                 </Label>
               </div>
               <Field
                 className="borderall"
                 name={"description"}
                 component={TextArea}
                 label={"Description"}
                 required={true}
                 autoComplete="off"
               />
             </div>
             <div className="mb-3">
               <div>
                 <Label className="required" editorId="Project Lead">
                   Project Lead:&nbsp;
                 </Label>
               </div>
               <DropDownList
                 className="borderall"
                 // component={DropDownList}
                 data={allLeads}
                // name={"lead_assigned"}
                 name={'user_name'}
                 value={value}
                 required={true}
                 onChange={handleChange}
                 disabled
               />
             </div>
             <div className="mb-3">
               <div>
                 <Label className="required" editorId="Status">
                   Status:&nbsp;
                 </Label>
               </div>
               <Field
                 className="borderall switch_width_popup"
                 name={"status"}
                 component={Switch}
                 onLabel={"Active"}
                 offLabel={"InActive"}
                 //label={'Status'}
                 checked={status}
                 onChange={handleToggleSwitch}
               />
             </div>
           </fieldset>
           <div className="k-form-buttons">
             <UpdateButton disabled={!formRenderProps.allowSubmit}  />
             <CancelButton handleClick={props.cancelEdit} />
           </div>
         </FormElement>
       )}
     />
   </Dialog>
 );
};
export default EditProject;