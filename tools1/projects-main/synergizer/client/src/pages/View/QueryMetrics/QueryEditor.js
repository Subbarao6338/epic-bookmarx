import React from "react";

import Editor from "@monaco-editor/react";

const default_query = `from(bucket: "my-bucket")
|> range(start: -10m)
|> filter(fn: (r) => r["_measurement"] == "")
|> filter(fn: (r) => r["_field"] == "")
`;

function QueryEditor({ setQuery }) {
  function handleQueryChange(newValue) {
    setQuery(newValue);
  }

  return (
    <div style={{ width: "100%", height: 200, border: "1px solid lightgrey" }}>
      <Editor
        options={{
          minimap: {
            enabled: false,
          },
        }}
        defaultValue={default_query}
        onChange={handleQueryChange}
      />
    </div>
  );
}

export default QueryEditor;
