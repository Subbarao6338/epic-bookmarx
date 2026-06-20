import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@progress/kendo-react-buttons";
import axios from "axios";
import Papa from "papaparse";
import styles from "./index.module.css";
import FilterCard from "./FilterCard";
import FromCard from "./FromCard";

function QueryBuilder({ setQuery, timeRange }) {
  const [buckets, setBuckets] = useState([]);
  const [filterOptions, setFilterOPtions] = useState([]);
  const [filterCards, setFilterCards] = useState([]);
  const [queryParams, setQueryParams] = useState({
    bucket: {},
    filterTags: [],
    timeRange: "-1h",
  });

  const loadBuckets = useCallback(() => {
    axios
      .get("http://localhost:8000/api/influxdb/buckets/")
      .then((res) => {
        const buckets = res.data.buckets;
        setBuckets(buckets);
        const defaultBucket = buckets.find(({ type }) => type === "user");
        setQueryParams((prevState) => ({
          ...prevState,
          bucket: defaultBucket,
        }));
        loadFilterOptions(defaultBucket.name);
      })
      .catch((err) => console.error(err));
  }, []);

  function loadFilterOptions(bucket) {
    axios
      .post("http://localhost:8000/api/influxdb/query/", {
        query: `import "regexp"
        from(bucket: "${bucket}")
        |> range(start: -1h, stop: now())
        |> filter(fn: (r) => true)
        |> keys()
        |> keep(columns: ["_value"])
        |> distinct()
        |> filter(fn: (r) => r._value != "_time" and r._value != "_start" and r._value !=  "_stop" and r._value != "_value")
        |> sort()
        |> limit(n: 200)`,
      })
      .then((res) => {
        // console.log(res.data);
        const { data } = Papa.parse(res.data, {
          header: true,
          skipEmptyLines: true,
        });
        const values = data.map(({ _value }) => _value);
        // console.log(values);
        setFilterOPtions(values);
        setFilterCards([{ defaultFilterTag: values[0] }]);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const appendFilterCard = () => {
    const usedFilterTags = queryParams.filterTags.map(
      ({ filterTag }) => filterTag
    );
    const defaultFilterTag = filterOptions.find(
      (value) => !usedFilterTags.includes(value)
    );
    setFilterCards((prevState) => [...prevState, { defaultFilterTag }]);
  };

  function removeLastFilterCard() {
    setFilterCards((prevState) => {
      return [...prevState.slice(0, -1)];
    });
  }

  useEffect(() => {
    loadBuckets();
  }, [loadBuckets]);

  useEffect(() => {
    setQueryParams((prevState) => ({ ...prevState, timeRange }));
  }, [timeRange]);

  useEffect(() => {
    setQuery(
      `from(bucket: "${queryParams.bucket.name}")
      |> range(start: ${queryParams.timeRange})
      ${queryParams.filterTags
        .map((filter) => {
          return filter.selected.length > 0
            ? `|> filter(fn: (r) => ${filter.selected
                .map((selected) => `r["${filter.filterTag}"] == "${selected}"`)
                .join(" or ")})`
            : null;
        })
        .join("\n")}`
    );
  }, [queryParams, setQuery]);

  return (
    <div className={styles.query_container}>
      <div className="me-2">
        <FromCard
          buckets={buckets}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      </div>
      {queryParams.bucket.name &&
        filterOptions.length > 0 &&
        filterCards.map(({ defaultFilterTag }, index) => (
          <div key={index} className="position-relative me-2 ">
            <FilterCard
              filterCardIndex={index}
              defaultFilterTag={defaultFilterTag}
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              filterOptions={filterOptions}
            />
            {filterCards.length === index + 1 && (
              <Button
                icon="close"
                className="position-absolute top-0 end-0 m-2 p-0"
                onClick={removeLastFilterCard}
              ></Button>
            )}
          </div>
        ))}

      <Button onClick={appendFilterCard} icon="plus"></Button>
    </div>
  );
}

export default QueryBuilder;
