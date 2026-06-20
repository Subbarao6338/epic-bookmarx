import React, { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Input } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs";
import Papa from "papaparse";
import Fuse from "fuse.js";
import styles from "./index.module.css";

function FilterCard({
  filterCardIndex,
  defaultFilterTag,
  filterOptions,
  queryParams,
  setQueryParams,
}) {
  const [results, setResults] = useState([]);
  const [filteredResuts, setFilteredResults] = useState([]);
  const fuse = useMemo(() => new Fuse(results), [results]);

  const loadFilterResults = useCallback(() => {
    const { bucket, filterTags, timeRange } = queryParams;
    const filterTag = queryParams.filterTags?.[filterCardIndex]?.filterTag;

    if (!(bucket && filterTag && timeRange)) return;

    axios
      .post("http://localhost:8000/api/influxdb/query/", {
        query: `import "regexp"
        from(bucket: "${bucket.name}")
        |> range(start: ${timeRange}, stop: now())
        ${filterTags
          .map((filter, index) => {
            return (index !== filterCardIndex) & (filter.selected.length > 0)
              ? `|> filter(fn: (r) => ${filter.selected
                  .map(
                    (selected) => `r["${filter.filterTag}"] == "${selected}"`
                  )
                  .join(" or ")})`
              : null;
          })
          .join("\n")}
        |> keep(columns: ["${filterTag}"])
        |> group()
        |> distinct(column: "${filterTag}")
        |> limit(n: 200)
        |> sort()`,
      })
      .then((res) => {
        // console.log(res.data);
        const { data } = Papa.parse(res.data, {
          header: true,
          skipEmptyLines: true,
        });
        const values = data.map(({ _value }) => _value);
        // console.log(values);
        setResults(values);
        setFilteredResults(values);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [filterCardIndex, queryParams]);

  function handleFilterTagChange({ value }) {
    const filterConfig = {
      filterTag: value,
      selected: [],
    };

    setQueryParams((prevState) => {
      prevState.filterTags[filterCardIndex] = filterConfig;
      return { ...prevState };
    });
  }

  function handleSearchFilter(e) {
    const value = e.target.value.trim();
    const result = fuse.search(value);
    setFilteredResults(value ? result.map(({ item }) => item) : results);
  }

  const handleFilterSelect = ({ label, value, ...e }) => {
    const filterConfig = queryParams.filterTags[filterCardIndex];
    if (value) {
      filterConfig.selected.push(label);
    } else {
      filterConfig.selected = filterConfig.selected.filter((v) => v !== label);
    }
    setQueryParams((prevState) => {
      prevState.filterTags[filterCardIndex] = filterConfig;
      return { ...prevState };
    });
  };

  useEffect(() => {
    loadFilterResults();
  }, [loadFilterResults]);

  useEffect(() => {
    const filterConfig = {
      filterTag: defaultFilterTag,
      selected: [],
    };
    setQueryParams((prevState) => {
      const filterTags = [...prevState.filterTags, filterConfig];
      return { ...prevState, filterTags };
    });

    return () => {
      setQueryParams((prevState) => {
        const filterTags = prevState.filterTags;
        filterTags.splice(filterCardIndex, 1);
        return { ...prevState, filterTags };
      });
    };
  }, [defaultFilterTag, filterCardIndex, setQueryParams]);

  return (
    <div className={styles.query_card_container}>
      <div className="mb-2">
        <b>FILTER</b>
      </div>
      <div className="mb-2">
        <DropDownList
          data={filterOptions}
          style={{ width: "100%", borderColor: "lightgrey" }}
          defaultValue={defaultFilterTag}
          onChange={handleFilterTagChange}
        />
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
          {filteredResuts.map((value) => (
            <li key={value} className={styles.text_nowrap}>
              <Checkbox
                defaultChecked={false}
                label={value}
                onChange={(e) => handleFilterSelect({ label: value, ...e })}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FilterCard;
