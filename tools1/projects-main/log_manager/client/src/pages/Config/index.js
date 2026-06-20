import React, { useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";

import MetricStorage from "./MetricStorage";
import MetricServer from "./MetricServer";
import Visualization from "./Visualization";

const Config = () => {
  const [selected, setSelected] = useState(0);

  const handleSelect = (e) => {
    setSelected(e.selected);
  };

  return (
    <TabStrip selected={selected} onSelect={handleSelect}>
      <TabStripTab title="Metrics Storage">
        <MetricStorage />
      </TabStripTab>
      {/* <TabStripTab title="Metrics Server">
        <MetricServer />
      </TabStripTab> */}
      <TabStripTab title="Visualization">
        <Visualization />
      </TabStripTab>
    </TabStrip>
  );
};

export default Config;
