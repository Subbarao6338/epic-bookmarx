import TilesView from "./Overview";
import StandardView from "./DetailReport";
// import BootstrapSwitchButton from "bootstrap-switch-button-react";
import React, { useState } from "react";
// import ToggleButton from "react-bootstrap/ToggleButton";
import Switch from "@material-ui/core/Switch";

function OverviewIndex() {
  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchButtonSecond = (e) => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <div className="p-1">
        <label>Tiles</label>
        <Switch onChange={handleSwitchButtonSecond} checked={isChecked} />
        <label>Standard</label>
        <br />
      </div>
      {!isChecked ? <TilesView /> : <StandardView />}
    </div>
  );
}
export default OverviewIndex;
