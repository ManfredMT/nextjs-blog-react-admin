import { Layout } from "antd";
import React from "react";
import "../css/AdminPanel.css";

const { Footer } = Layout;

function PanelFooter() {
  return (
    <Footer style={{ textAlign: "center" }}>
      Blog Admin ©2022 Created by manfred
    </Footer>
  );
}

export default PanelFooter;
