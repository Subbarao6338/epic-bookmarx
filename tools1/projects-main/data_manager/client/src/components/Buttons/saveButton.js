import React from "react";
import { Button } from "@progress/kendo-react-buttons";

function saveButton(props) {
  return (
    <Button
      className="savebutton"
      icon="save"
      themeColor={"primary"}
      onClick={props.handleClick}
    >
      Save
    </Button>
  );
}

export default saveButton;