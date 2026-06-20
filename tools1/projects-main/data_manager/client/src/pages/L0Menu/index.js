import { MenuConfig } from "../../config/RoleBasedMenu";
import * as React from "react";
import NavArrow from "./navArrow";

export default function L0MenuComponent(prop) {
  const items = MenuConfig.l0_menu;
  const items_for_role = items.filter((item) => item.role.includes(prop.role));
  console.log(items_for_role);
  let role_length = items_for_role.length;

  for (let i = 0; i < 10 - role_length; i++) {
    items_for_role.push({ extra: i });
  }

  if (prop.role === "DP Admin") {
    return (
      <>
        <div className="row_l0">
          <div
            className="column_l0 arrow_slide_disabled"
            style={{ opacity: 0 }}
          >
            &#10094;
          </div>
          {items_for_role.slice(0, 5).map((item) => Item(item))}
          <div
            className="column_l0 arrow_slide_disabled"
            style={{ opacity: 0 }}
          >
            &#10095;
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="row_l0">
          <div id="first_l0">
            <NavArrow val={{ side: "left", page: 1 }} />
            {items_for_role.slice(0, 5).map((item) => Item(item))}
            <NavArrow val={{ side: "right", page: 1 }} />
          </div>
          <div id="second_l0" style={{ display: "none" }}>
            <NavArrow val={{ side: "left", page: 2 }} />
            {items_for_role.slice(5).map((item) => Item(item))}
            <NavArrow val={{ side: "right", page: 2 }} />
          </div>
        </div>
        <div className="slick_div">
          <span
            id="slick_dot_1"
            style={{
              cursor: "pointer",
              backgroundColor: "#1761D0",
              height: "5px",
              width: "5px",
              borderRadius: "50%",
              display: "inline-block",
              marginInline: "5px",
            }}
            onClick={() => {
              document.getElementById("second_l0").style.display = "none";
              document.getElementById("first_l0").style.display = "";
              document.getElementById("slick_dot_1").style.backgroundColor =
                "#1761D0";
              document.getElementById("slick_dot_2").style.backgroundColor =
                "#bbb";
            }}
          ></span>
          <span
            id="slick_dot_2"
            style={{
              cursor: "pointer",
              height: "5px",
              width: "5px",
              borderRadius: "50%",
              display: "inline-block",
              backgroundColor: "#bbb",
            }}
            onClick={() => {
              document.getElementById("second_l0").style.display = "";
              document.getElementById("first_l0").style.display = "none";
              document.getElementById("slick_dot_2").style.backgroundColor =
                "#1761D0";
              document.getElementById("slick_dot_1").style.backgroundColor =
                "#bbb";
            }}
          ></span>
        </div>
      </>
    );
  }
}

function Item(item) {
  console.log(item.extra);
  if (item.extra === undefined) {
    const images = require.context("../../assets/app_images", true);
    return (
      <>
        <div className="column_l0 icon_div">
          <div className="icon_item_perm">
            <img
              style={{ cursor: "pointer" }}
              src={images(`./` + item.name + `.png`)}
              alt={item.name}
            ></img>
            <div className="emptyspaceicon_landing"></div>
          </div>

          <div className="hover_content icon_item_temp">
            <a href={item.route}>
              <img
                src={images(`./` + item.name + `-hover.png`)}
                alt={item.name}
                style={{ marginTop: 10 }}
              ></img>
              <div className="emptyspaceicon_landing"></div>
              <p
                style={{
                  color: "white",
                  fontFamily: "Arial",
                  fontSize: "18px",
                  lineHeight: "20px",
                  textAlign: "center",
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  color: "white",
                  fontFamily: "Arial",
                  fontSize: "16px",
                  lineHeight: "18px",
                  textAlign: "center",
                  margin: 2,
                }}
              >
                {item.text}
              </p>
            </a>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="column_l0 icon_div"></div>
      </>
    );
  }
}
