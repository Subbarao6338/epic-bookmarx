import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import config from "../../config";

function SourceCode({ dag }) {
  const { file_token } = dag;
  const [sourceCode, setSourceCode] = useState({ content: "Loading..." });

  const getDagSource = useCallback(() => {
    axios
      .get(config.synergizer_api_url + "/airflow/dag_source/" + file_token)
      .then((res) => {
        // console.log(res.data);
        setSourceCode(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [file_token]);

  useEffect(() => {
    getDagSource();
  }, [getDagSource]);

  return (
    <div className="mt-2">
      <ReactSyntaxHighlighter language="python" style={atomOneLight}>
        {sourceCode.content}
      </ReactSyntaxHighlighter>
    </div>
  );
}

export default SourceCode;
