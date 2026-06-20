import Papa from "papaparse";

export function csv2json(
  csvString = "",
  { skipTop = 0, skipEmptyLines = true, ...config }
) {
  csvString = csvString.split("\n").slice(skipTop).join("\n");
  const { data } = Papa.parse(csvString, { ...config, skipEmptyLines });
  return data;
}

export function json2csv(json, config) {
  const csv = Papa.unparse(json, config);
  return csv;
}
