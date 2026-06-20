import React, { useEffect, useMemo, useState } from "react";

import { Input } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs";
import Fuse from "fuse.js";
import styles from "./index.module.css";

function FromCard({
  buckets = [],
  queryParams = {},
  setQueryParams = () => {},
}) {
  const [filteredBuckets, setFilteredBuckets] = useState(buckets);
  const fuse = useMemo(() => new Fuse(buckets, { keys: ["name"] }), [buckets]);

  const handleSearchFilter = (e) => {
    const value = e.target.value.trim();
    const result = fuse.search(value);
    setFilteredBuckets(value ? result.map(({ item }) => item) : buckets);
  };

  const handleBucketSelect = (bucket) => {
    setQueryParams({ ...queryParams, bucket });
  };

  useEffect(() => {
    setFilteredBuckets(buckets);
  }, [buckets]);

  return (
    <div className={styles.query_card_container}>
      <div className="mb-2">
        <b>FROM</b>
      </div>
      <div className="">
        <Input
          placeholder="Search and filter"
          style={{ width: "100%", borderColor: "lightgrey" }}
          onChange={handleSearchFilter}
        />
      </div>
      <div className="mt-2">
        <ul className={styles.list_style}>
          {filteredBuckets.map((bucket) => (
            <li key={bucket.id} className={styles.text_nowrap}>
              <Checkbox
                defaultChecked={false}
                checked={bucket.id === queryParams.bucket.id}
                label={bucket.name}
                onClick={() => handleBucketSelect(bucket)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FromCard;
