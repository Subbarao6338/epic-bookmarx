import React from "react";
import { Button } from "@progress/kendo-react-buttons";

function cancelButton(props) {
  return (
    <Button className="cancelbutton"
    icon="close-outline" onClick={props.handleClick}>
      Cancel
    </Button>
  );
}

export default cancelButton;
