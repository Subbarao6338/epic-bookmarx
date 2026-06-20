import React from "react";
import { Button } from "@progress/kendo-react-buttons";

function updateButton(props) {
  return (
    <Button
      type={"submit"}
      className="updatebutton"
      icon="save"
      //className="k-button k-primary"
      disabled={props.disabled}
    >
      Update
    </Button>
  );
}

export default updateButton;
