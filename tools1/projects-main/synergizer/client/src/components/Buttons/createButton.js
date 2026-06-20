import React from "react";
import { Button } from "@progress/kendo-react-buttons";

function createButton(props) {
  return (
    <Button className="createbutton" icon="plus-outline">
      {props.buttonlabel}
    </Button>
  );
}

export default createButton;
