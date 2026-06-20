import React, { useEffect, useState } from "react";

function ViewAccordian(data = {}) {
  return (
    <>
      {data.data.map((value) => (
        <div className="row border-top border-dark">
          <div style={{ textAlign: "left" }} className="col">
            {value.expectation_config.expectation_type}
          </div>
          <div style={{ textAlign: "right" }} className="col">
            10
          </div>
        </div>
      ))}
    </>
  );
}

export default ViewAccordian;
