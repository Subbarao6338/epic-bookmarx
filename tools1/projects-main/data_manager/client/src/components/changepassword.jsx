import * as React from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { Button } from "@progress/kendo-react-buttons";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import { httpput, addnew_notifications } from "../commonUtility/common_http";
import { Update_user_password } from "../commonUtility/api_urls";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";

loadMessages(enMessages, "en-US");
const Password = () => {
  const history = useHistory();
  const AccountInfo = AccountInfoDetails();
  const [oldpassword, Setoldpassword] = React.useState();
  const [newpassword, Setnewpassword] = React.useState();
  const [retypepassword, Setretypepassword] = React.useState();
  const [errMsg, setErrMsg] = React.useState({});

  // const handlecancel = () => {
  //   history.push('/home')
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (retypepassword === newpassword) {
      const req_value = {
        params: {
          old_password: oldpassword,
          new_password: newpassword,
          user_mail: AccountInfo.AccountMail,
        },
      };

      console.log(req_value);
      httpput(Update_user_password, req_value).then((result) => {
        console.log(result.data["status"]);

        if (result.data["status"] === "Success") {
          // const alert_type = enMessages['cdp_notifications']['alert_type_none']
          // const alert_msg = setErrMsg(result.data['msg'])
          // addnew_notifications(
          //   AccountInfo['AccountName'],
          //   AccountInfo['AccountMail'],
          //   alert_type,
          //   alert_msg,
          // )
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Password updated Successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
          history.push("/");
        }else{
        setErrMsg({
          msg: result.data["msg"],
          status: result.data["status"],
        });
      }

      });
    } else {
      setErrMsg({
        msg: "New and Retype password must be same",
        status: "Failed",
      });
    }
  };

  return (
    <div className="m-3" style={{ fontSize: 15 }}>
      <form onSubmit={handleSubmit} id="pwd">
        <div className="row">
          <div className="col-4">
            <Label>Old Password : </Label>
          </div>
          <div className="col-8">
            <Input
              type="password"
              name={oldpassword}
              style={{ border: "1px solid black" }}
              onChange={(e) => Setoldpassword(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-4">
            <Label>New Password : </Label>
          </div>

          <div className="col-8">
            <Input
              type="password"
              name={newpassword}
              style={{ border: "1px solid black" }}
              onChange={(e) => Setnewpassword(e.target.value)}
            />
          </div>
        </div>

        <br />
        <div className="row">
          <div className="col-4">
            <Label>Retype Password : </Label>
          </div>

          <div className="col-8">
            <Input
              type="password"
              name={retypepassword}
              style={{ border: "1px solid black" }}
              onChange={(e) => Setretypepassword(e.target.value)}
            />
          </div>
        </div>

        <Label
          style={
            errMsg.status === "Success"
              ? { color: "green", fontSize: 10 }
              : { color: "red", fontSize: 10 }
          }
        >
          {errMsg.msg}
        </Label>
        <div className="text-center" style={{ width: "80%" }}>
          <Button type="submit" className="updatebutton" icon="save">
            Update
          </Button>
          &ensp;
          {/* <Button
            type="cancel"
            className="cancelbutton"
            icon="close-outline"
            onClick={handlecancel}
          >
            Cancel
          </Button> */}
        </div>
      </form>
    </div>
  );
};

export default Password;
