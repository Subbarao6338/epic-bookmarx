import React from "react";
import UnauthorizedImage from "./../assets/error_images/401.png";
import { useHistory } from "react-router";
import { useMsal } from "@azure/msal-react";

function UnAuthorizedAccess() {
  const history = useHistory();
  const { instance } = useMsal();
  const submitForm = (e) => {
    e.preventDefault();
    instance
      .logoutPopup()
      .then(() => {
        //on logout -> go to '/'
        history.push("/login");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="content_center card-container">
      <div className="row">
        <img
          src={UnauthorizedImage}
          alt="UnauthorizedImage"
          style={{
            width: "50vw",
            height: "35vh",
          }}
        />
      </div>
      <br></br>
      <div className="row">
        <p>Authorization Not Found!</p>
      </div>
      <div className="row">
        <span
          style={{ color: "#713595", fontWeight: "bold", fontSize: "24pt" }}
        >
          Please contact administrator before login again.
        </span>
      </div>
      <div className="row">
        <span style={{ color: "black", fontWeight: "bold", fontSize: "12pt" }}>
          Click below button for logout & redirect to login page.
        </span>
      </div>
      <br></br>
      <div className="row">
        <button class="btn btn-microsoft" onClick={submitForm}>
          {/* <img src={azure_offcial} alt="" />  */}
          RETURN LOGIN PAGE
        </button>
      </div>
    </div>
  );
}
export default UnAuthorizedAccess;
