import { fetch_observability_data } from "../../commonUtility/api_urls";
import { useEffect, useState } from "react";
import { httpget } from "../../commonUtility/common_http";

export default function Observability() {
  const [observabilityData, setObservabilityData] = useState({
    sources: 0,
    channels: 0,
    grafana_dashboards: 0,
    alert_rules: 0,
  });

  useEffect(() => {
    const req_value = {
      params: {},
    };
    httpget(fetch_observability_data, req_value).then((results) => {
      let obs_data = {
        sources: results.sources,
        channels: results.channels,
        grafana_dashboards: results.grafana_dashboards,
        alert_rules: results.alert_rules,
      };
      setObservabilityData(obs_data);
    });
  }, []);

  return (
    <div
      className="col m-2"
      style={{ backgroundColor: "#E5E8E8", borderRadius: 8 }}
    >
      <div className="text-center" style={{ color: "black" }}>
        <b>Synergizer</b>
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
            {observabilityData.sources}
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
            {observabilityData.channels}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Channels
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
            {observabilityData.grafana_dashboards}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Dashboards
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
            {observabilityData.alert_rules}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Alert Rules
          </div>
        </div>
      </div>
    </div>
  );
}
