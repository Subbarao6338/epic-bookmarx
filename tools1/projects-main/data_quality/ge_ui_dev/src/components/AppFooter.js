import React from "react";

const styles = {
  footer_style: {
    // minHeight: 100,
    backgroundColor: "#0e68aa",
    position: "sticky",
    // top: '100vh',
  },
  fixed_banner: {
    position: "fixed",
    inset: "auto 0 0 0",
    backgroundColor: "#0e68aa",
    fontSize: 13,
  },
  version: {
    position: "absolute",
    right: 5,
    fontSize: 13,
  },
};

function AppFooter() {
  return (
    <footer>
      <div style={styles.fixed_banner} className="text-light">
        <span className="text-left">&ensp;2022 © HCL Technologies Limited</span>
        <span className="text-right" style={styles.version}>
          v0.7
        </span>
      </div>
    </footer>
  );
}

export default AppFooter;
