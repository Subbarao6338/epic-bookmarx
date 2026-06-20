import React from "react";
import moment from "moment";

export const timeOptions = [
  {
    text: "Last 6 hours",
    value: {
      from: moment().subtract(6, "hours").toISOString(),
      to: moment().toISOString(),
    },
  },
  {
    text: "Last 24 hours",
    value: {
      from: moment().subtract(24, "hours").toISOString(),
      to: moment().toISOString(),
    },
  },
  {
    text: "Last week",
    value: {
      from: moment().subtract(1, "week").toISOString(),
      to: moment().toISOString(),
    },
  },
  {
    text: "Last month",
    value: {
      from: moment().subtract(1, "month").toISOString(),
      to: moment().toISOString(),
    },
  },
  {
    text: "Last 6 months",
    value: {
      from: moment().subtract(6, "months").toISOString(),
      to: moment().toISOString(),
    },
  },
  {
    text: "Last year",
    value: {
      from: moment().subtract(1, "year").toISOString(),
      to: moment().toISOString(),
    },
  },
];

export function SelectTimeRange({ ...props }) {
  return (
    <select className="border rounded p-1" {...props}>
      {timeOptions.map((value) => (
        <option id={value.text} value={JSON.stringify(value.value)}>
          {value.text}
        </option>
      ))}
    </select>
  );
}
