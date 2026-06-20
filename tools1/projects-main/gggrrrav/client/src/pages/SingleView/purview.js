import { fetch_purview_data } from "../../commonUtility/api_urls";
import { useEffect, useState } from "react";
import { httpget } from "../../commonUtility/common_http";

export default function Purview() {
  const [purviewData, setPurviewData] = useState({
    sources: 0,
    classification_rules: 0,
    glossary_terms: 0,
    certified_datasets: 0,
  });

  useEffect(() => {
    const req_value = {
      params: {},
    };
    httpget(fetch_purview_data, req_value).then((results) => {
      let purview_data = {
        sources: results.sources,
        classification_rules: results.classification_rules,
        glossary_terms: results.glossary_terms,
        certified_datasets: results.certified_datasets,
      };
      setPurviewData(purview_data);
    });
  }, []);

  return (
    <div
      className="col m-2"
      style={{ backgroundColor: "#E5E8E8", borderRadius: 8 }}
    >
      <div className="text-center" style={{ color: "black" }}>
        <b>Data Catalog & Governance (Azure Purview)</b>
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
            {purviewData.sources}
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
            {purviewData.classification_rules}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Classification Rules
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
            {purviewData.glossary_terms}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Glossary Terms
          </div>
        </div>
        {/* <div
          className="col m-2 shadow"
          style={{ backgroundColor: "#EC7063", borderRadius: 8 }}
        >
          <div
            style={{
              fontSize: "40px",
              fontFamily: "Consolas",
            }}
          >
            {purviewData.certified_datasets}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontFamily: "Consolas",
            }}
          >
            Certified Datasets
          </div>
        </div> */}
      </div>
    </div>
  );
}
