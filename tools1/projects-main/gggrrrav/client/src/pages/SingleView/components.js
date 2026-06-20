import { fetch_component_data } from "../../commonUtility/api_urls";
import { useEffect, useState } from "react";
import { httpget } from "../../commonUtility/common_http";

export default function Components() {
  const [componentData, setComponentData] = useState({
    hawkeye_dqc: 0,
    data_genie: 0,
    hawkeye_ads: 0,
  });

  useEffect(() => {
    const req_value = {
      params: {},
    };
    httpget(fetch_component_data, req_value).then((results) => {
      let comp_data = {
        hawkeye_dqc: results.hawkeye_dqc,
        data_genie: results.data_genie,
        hawkeye_ads: results.hawkeye_ads,
      };
      console.log(comp_data);
      setComponentData(comp_data);
    });
  }, []);

  return (
    <div
      className="col m-2"
      // style={{ backgroundColor: "#AED6F1", borderRadius: 8 }}
      style={{ backgroundColor: "#E5E8E8", borderRadius: 8 }}
    >
      <div className="row m-2">
        <div
          className="shadow p-1 col m-1 text-center"
          // style={{ backgroundColor: "#5DADE2", borderRadius: 8 }}
          style={{ backgroundColor: "#1761D0", borderRadius: 8 }}
        >
          <b>Marshal - Data Quality</b>
          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {componentData.hawkeye_dqc}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Rules
          </div>
        </div>
        <div
          className="shadow shadow-dark p-1 col m-1 text-center"
          style={{ backgroundColor: "#1761D0", borderRadius: 8 }}
        >
          <b>DataGenie</b>

          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {componentData.data_genie}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Models
          </div>
        </div>
        <div
          className="shadow p-1 col m-1 text-center"
          style={{ backgroundColor: "#1761D0", borderRadius: 8 }}
        >
          <b>Marshal - Anomaly Det.</b>

          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {componentData.hawkeye_ads}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Sources
          </div>
        </div>
      </div>
    </div>
  );
}
