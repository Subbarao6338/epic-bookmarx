import React from "react";

import DrawerRouterContainer from "../../components/DrawerRouterContainer.jsx";

function Help() {
  return (
    <div>
      <div>
        <DrawerRouterContainer />
      </div>
      <div
        className="p-4"
        style={{
          backgroundColor: "white",
          padding: 10,
          marginBottom: 10,
          marginLeft: 100,
          marginRight: 100,
          marginTop: -480,
        }}
      >
        {/* <h4 className="text-center">
          <b>Help</b>
        </h4> */}
        <p className="content-justify">
          <p>
            <b>What is Data Quality ?</b>
          </p>
          <p>
            Organizations make decisions based on data and those decisions are
            only as good as the data they’re based on. If a business makes a
            decision based on low-quality data, the outcome is not likely to
            meet expectations. Data quality measures how reliable a dataset is
            for making a data-driven decision or, in a word, the data’s
            trustworthiness.
          </p>
          <p>
            <b>Data Quality Dimensions</b>
          </p>
          <p>
            There are eight dimensions of data quality. Each one impacts
            business decisions in a different way, but must also be considered
            in relation to the others.
          </p>
          <p>The eight dimensions are: </p>
          <p>1. Accessibility</p>
          <p>2. Accuracy</p>
          <p>3. Completeness</p>
          <p>4. Consistency</p>
          <p>5. Integrity</p>
          <p>6. Precision</p>
          <p>7. Uniqueness</p>
          <p>8. Validity</p>
          <p>
            Here are some use cases across various industries that demonstrate
            how each of these attributes might affect an organization’s data
            decisions.
          </p>
          <p>
            <b>Getting started with 'Marshal' - Graviton DQC Component </b>
            <a href="/dashboard">Click</a>
          </p>
        </p>
      </div>
    </div>
  );
}

export default Help;
