import { fetch_hub_and_storage_data } from "../../commonUtility/api_urls";
import { useEffect, useState } from "react";
import { httpget } from "../../commonUtility/common_http";

export default function Hub() {
  const [hubAndStorageData, setHubAndStorageData] = useState({
    event_hub: 0,
    iot_hub: 0,
    storage: 0,
  });

  useEffect(() => {
    const req_value = {
      params: {},
    };
    httpget(fetch_hub_and_storage_data, req_value).then((results) => {
      let hub_data = {
        event_hub: results.event_hub,
        iot_hub: results.iot_hub,
        storage: results.storage,
      };
      setHubAndStorageData(hub_data);
    });
  }, []);

  return (
    <div
      className="col m-2"
      style={{ backgroundColor: "#E5E8E8", borderRadius: 8 }}
    >
      <div className="row m-2">
        <div
          className="shadow p-1 col m-1 text-center"
          style={{ backgroundColor: "#1761D0", borderRadius: 8 }}
        >
          <b>Event Hub</b>

          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {hubAndStorageData.event_hub}
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
          className="shadow p-1 col m-1 text-center"
          style={{ backgroundColor: "#1761D0", borderRadius: 8 }}
        >
          <b>IoT Hub</b>

          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {hubAndStorageData.iot_hub}
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
          className="shadow p-1 col m-1 text-center"
          style={{ backgroundColor: "#1761D0", borderRadius: 8 }}
        >
          <b>Storage</b>

          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {hubAndStorageData.storage}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Counts
          </div>
        </div>
      </div>
    </div>
  );
}
