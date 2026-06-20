import * as React from "react";

export default function NavArrow(prop) {
  console.log(prop);
  if (prop.val.side === "left") {
    return prop.val.page === 1 ? (
      <div className="column_l0 arrow_slide_disabled">&#10094;</div>
    ) : (
      <div
        className="column_l0 arrow_slide_left"
        onClick={(e) => {
          document.getElementById("second_l0").style.display = "none";
          document.getElementById("first_l0").style.display = "";
          document.getElementById("slick_dot_1").style.backgroundColor =
            "#1761D0";
          document.getElementById("slick_dot_2").style.backgroundColor = "#bbb";
        }}
      >
        <div className="inner_arrow">&#10094;</div>
      </div>
    );
  } else {
    return prop.val.page === 1 ? (
      <div
        className="column_l0 arrow_slide_right"
        onClick={() => {
          document.getElementById("second_l0").style.display = "";
          document.getElementById("first_l0").style.display = "none";
          document.getElementById("slick_dot_2").style.backgroundColor =
            "#1761D0";
          document.getElementById("slick_dot_1").style.backgroundColor = "#bbb";
        }}
      >
        <div className="inner_arrow">&#10095;</div>
      </div>
    ) : (
      <div className="column_l0 arrow_slide_disabled">&#10095;</div>
    );
  }
}
