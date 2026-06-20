import { fetch_pipeline_data } from "../../commonUtility/api_urls";
import { useEffect, useState } from "react";
import { httpget } from "../../commonUtility/common_http";

export default function Pipeline() {
  const [pipelineData, setPipelineData] = useState({
    adf_counts: 0,
    airflow_dags: 0,
  });

  useEffect(() => {
    const req_value = {
      params: {},
    };
    httpget(fetch_pipeline_data, req_value).then((results) => {
      let pipeline_data = {
        adf_counts: results.adf_counts,
        airflow_dags: results.airflow_dags,
      };
      setPipelineData(pipeline_data);
    });
  }, []);

  return (
    <div
      className="col m-2"
      style={{ backgroundColor: "#E5E8E8", borderRadius: 8 }}
    >
      <div className="text-center" style={{ color: "black" }}>
        <b>Data Pipelines</b>
      </div>
      <div className="row m-2 text-center">
        <div
          className="col m-2 shadow"
          style={{ backgroundColor: "#1761D0", borderRadius: 8, height: 100 }}
        >
          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {pipelineData.adf_counts}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            ADF Counts
          </div>
        </div>
        <div
          className="col m-2 shadow"
          style={{ backgroundColor: "#1761D0", borderRadius: 8, height: 100 }}
        >
          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {pipelineData.airflow_dags}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Airflow DAGs
          </div>
        </div>
      </div>
    </div>
  );
}
