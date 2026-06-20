import React from "react";
import PageNotFoundImage from "./../assets/error_images/404.png";
import { useHistory } from "react-router";

function UnAuthorizedAccess() {
  const history = useHistory();
  const submitForm = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  return (
    <div className="content_center card-container">
      <div className="row">
        <img
          src={PageNotFoundImage}
          alt="PageNotFoundImage"
          style={{
            width: "20vw",
            height: "35vh",
          }}
        />
      </div>
      <br></br>
      <div className="row">
        <p>Page Not Found!</p>
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
