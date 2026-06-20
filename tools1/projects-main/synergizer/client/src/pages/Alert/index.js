import React, { useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import AlertRule from "./AlertRule";
import AlertChannel from "./ContactPoint";

const Alert = () => {
  const [selected, setSelected] = useState(0);

  const handleSelect = (e) => {
    setSelected(e.selected);
  };

  return (
    <TabStrip selected={selected} onSelect={handleSelect}>
      <TabStripTab title="Alert Rule">
        <AlertRule />
      </TabStripTab>
      <TabStripTab title="Contact Point">
        <AlertChannel />
      </TabStripTab>
    </TabStrip>
  );
};

export default Alert;
