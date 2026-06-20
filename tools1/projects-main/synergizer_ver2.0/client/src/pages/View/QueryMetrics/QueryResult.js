import React, { useEffect, useState } from "react";
import Papa from "papaparse";

function QueryResult({ queryResult }) {
  const [resultJson, setResultJson] = useState([]);

  useEffect(() => {
    if (!queryResult) return;
    const { data } = Papa.parse(queryResult, {
      // header: true,
      skipEmptyLines: true,
    });
    console.log(data);
    setResultJson(data);
  }, [queryResult]);

  return (
    <div>
      {queryResult && resultJson.length > 0 && (
        <>
          <div>
            <h6 className="mb-2">Query Result Preview</h6>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-border border ">
              <thead className="bg-light">
                <tr>
                  {resultJson[0].map((v) => (
                    <th>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultJson.slice(1, 10).map((row) => (
                  <tr>
                    {row.map((data) => (
                      <td>{data}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default QueryResult;
