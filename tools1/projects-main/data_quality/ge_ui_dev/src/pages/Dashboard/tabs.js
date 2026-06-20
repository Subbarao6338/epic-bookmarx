import React, { useState } from "react";
import styled from "styled-components";
import Introduction from "./Introduction";
// import Overview from "./DetailReport";
import Trends from "./Trends";
import ComparativeAnalysis from "./ComparativeAnalysis";
import CostofQuality from "./CostofQuality";
import Details from "./Details";
// import Intro from "./intro";
// import Overview from "./Overview";
import OverviewIndex from "./Overview_index";

const Tab = styled.button`
  font-size: 16px;
  padding: 5px 50px;
  cursor: pointer;
  color: white;
  opacity: 0.7;
  background: #045fb4;
  border: 0;
  outline: 0;
  ${({ active }) =>
    active &&
    `
    border-bottom: 3px solid #045fb4;
    opacity: 1;
    color: white;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
`;
const types = [
  "Introduction",
  "Overview",
  "Quality Trends",
  // "Comparative Analysis",
  "Cost of Quality",
  "Details",
];

export default function TabGroup() {
  const [active, setActive] = useState(types[0]);
  return (
    <>
      <ButtonGroup>
        {types.map((type) => (
          <Tab
            key={type}
            active={active === type}
            onClick={() => setActive(type)}
          >
            {type}
          </Tab>
        ))}
      </ButtonGroup>
      <br />
      {active === "Introduction" && <Introduction />}
      {active === "Overview" && <OverviewIndex />}
      {active === "Quality Trends" && <Trends />}
      {/* {active === "Comparative Analysis" && <ComparativeAnalysis />} */}
      {active === "Cost of Quality" && <CostofQuality />}
      {active === "Details" && <Details />}
    </>
  );
}
