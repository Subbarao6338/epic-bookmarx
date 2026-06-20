// import axios from 'axios'
import React, {
  // useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { DropDownList } from "@progress/kendo-react-dropdowns";

const urllist = {
  "Observability Dashboard":
    "http://20.204.104.9:5000/d/9wTL7uunk/observability-dashbord?orgId=1",
  "Airflow Clustering Monitor":
    "http://20.204.104.9:5000/d/lFXqBGxWk/airflow-cluster-monitoring?orgId=1&refresh=5s",
  // 'New Dashboard':
  //   'http://20.204.104.9:5000/d/s3r8Dp37k/new-dashboard?orgId=1&from=now-24h&to=now&viewPanel=2',
  // 'A-Series Dashboard':
  //   'http://20.204.104.9:5000/d/_W6Xiy37k/new-dashboard1?orgId=1&viewPanel=2',
  // 'New Dashboard2':
  //   'http://20.204.104.9/grafana/d/Zmhrmy37z/new-dashboard2?orgId=1&viewPanel=2',
  // 'Activity Failed Runs':
  //   'http://20.204.104.9:5000/d/s3r8Dp37k/new-dashboard?orgId=1&viewPanel=2',
  // 'Default Dashboard': embedUrl,
};
const url_val = Object.values(urllist);
const url_key = Object.keys(urllist);

function Dashboard() {
  const [embedUrl, setEmbedUrl] = useState(urllist[url_key[0]]);
  const [heading, setHeading] = useState(url_key[0]);
  const [urlkey, seturlkey] = useState(url_key[0]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/config/visualization/")
  //     .then((res) => {
  //       const jsonConfig = JSON.parse(res.data.config.value);
  //       setEmbedUrl(jsonConfig.default_embed_url);
  //       setHeading("Default Dashboard");
  //       seturlkey("Default Dashboard");
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  const handleChange = (event) => {
    var u = event.target.value;
    setEmbedUrl(urllist[u]);
    setHeading(event.target.value);
    seturlkey(url_key);
  };

  return (
    <div className="position-relative h-100">
      <DropDownList
        style={{ width: 120, position: "absolute", top: 16, right: 8 }}
        defaultValue={urlkey}
        data={url_key}
        onChange={handleChange}
        id="dropdown"
      />
      {url_val ? (
        <iframe
          src={embedUrl + "&kiosk=tv"}
          title="grafana dashboard"
          width="100%"
          height="100%"
          frameBorder="0"
        ></iframe>
      ) : (
        <div>
          Embed URL is not set. <Link to="/config"> Configure here </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
