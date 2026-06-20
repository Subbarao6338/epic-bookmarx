import React from "react";
import InternalServerImage from "./../assets/error_images/500.png";
import { useHistory } from "react-router-dom";

function Servers() {
  const history = useHistory();
  const submitForm = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  return (
    <div className="content_center card-container">
      <div className="row">
        <img
          src={InternalServerImage}
          alt="InternalServerImage"
          style={{
            width: "20vw",
            height: "35vh",
          }}
        />
      </div>
      <br></br>
      <div className="row">
        <p>Internal Server Error!</p>
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
export default Servers;
