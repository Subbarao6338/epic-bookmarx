import { MenuConfig } from "../../config/RoleBasedMenu";

export default function L0MenuComponent(prop) {
  console.log(prop);
  const items = MenuConfig.l0_menu;
  const items_for_role = items.filter((item) => item.role.includes(prop.role));
  for (let i = 0; i < 10 - items_for_role.length; i++) {
    items_for_role.push({ extra: i });
  }

  console.log(items_for_role);
  return (
    <>
      <div className="row menu_align_landing">
        <a
          id="left_arrow"
          className="left_arrow_slide_disabled"
          onClick={(e) => {
            document.getElementById("second_l0").style.display = "none";
            document.getElementById("first_l0").style.display = "";
            document.getElementById("slick_dot_1").style.backgroundColor =
              "#1761D0";
            document.getElementById("slick_dot_2").style.backgroundColor = "";
            e.currentTarget.className = "left_arrow_slide_disabled";
            document.getElementById("right_arrow").className =
              "right_arrow_slide";
          }}
        >
          &#10094;
        </a>
        <div id="first_l0" className="row">
          {items_for_role.slice(0, 4).map((item) => Item(item))}
        </div>
        <div id="second_l0" className="row" style={{ display: "none" }}>
          {items_for_role.slice(4).map((item) => Item(item))}
        </div>
        <a
          id="right_arrow"
          className="right_arrow_slide"
          onClick={(e) => {
            document.getElementById("second_l0").style.display = "";
            document.getElementById("first_l0").style.display = "none";
            document.getElementById("slick_dot_2").style.backgroundColor =
              "#1761D0";
            document.getElementById("slick_dot_1").style.backgroundColor = "";
            e.currentTarget.className = "right_arrow_slide_disabled";
            document.getElementById("left_arrow").className =
              "left_arrow_slide";
          }}
        >
          &#10095;
        </a>
      </div>
      <div className="row" style={{ display: "inline" }}>
        <span
          id="slick_dot_1"
          className="dot"
          style={{ cursor: "pointer", backgroundColor: "#1761D0" }}
          onClick={() => {
            document.getElementById("second_l0").style.display = "none";
            document.getElementById("first_l0").style.display = "";
            document.getElementById("slick_dot_1").style.backgroundColor =
              "#1761D0";
            document.getElementById("slick_dot_2").style.backgroundColor = "";
            document.getElementById("right_arrow").className =
              "right_arrow_slide";
            document.getElementById("left_arrow").className =
              "left_arrow_slide_disabled";
          }}
        ></span>
        <span
          id="slick_dot_2"
          className="dot"
          style={{ cursor: "pointer" }}
          onClick={() => {
            document.getElementById("second_l0").style.display = "";
            document.getElementById("first_l0").style.display = "none";
            document.getElementById("slick_dot_2").style.backgroundColor =
              "#1761D0";
            document.getElementById("slick_dot_1").style.backgroundColor = "";
            document.getElementById("left_arrow").className =
              "left_arrow_slide";
            document.getElementById("right_arrow").className =
              "right_arrow_slide_disabled";
          }}
        ></span>
      </div>
    </>
  );
}

function Item(item) {
  console.log(item.extra);
  if (item.extra === undefined) {
    const images = require.context("../../assets/app_images", true);
    return (
      <>
        <div className="col col-half-offset data_service_section">
          <div className="menu_icon_landing data_service_perm">
            <img src={images(`./` + item.name + `.png`)} alt={item.name}></img>
            <div className="emptyspaceicon_landing"></div>
          </div>
          <a href={item.route}>
            <div className="hover_div_landing data_service_temp">
              <img
                src={images(`./` + item.name + `-hover.png`)}
                alt={item.name}
              ></img>
              <div className="emptyspaceicon_landing"></div>
              <p className="hover_menu_title">{item.title}</p>
              <p className="hover_menu_content">{item.text}</p>
            </div>
          </a>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="col col-half-offset data_service_section">
          <div className="menu_icon_landing data_service_perm">
            <div className="emptyspaceicon_landing"></div>
            <div className="emptyspaceicon_landing"></div>
            <div className="emptyspaceicon_landing"></div>
            <br />
          </div>
        </div>
      </>
    );
  }
}
