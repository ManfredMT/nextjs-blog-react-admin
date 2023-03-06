import { Layout } from "antd";
import React from "react";
import "../css/AdminPanel.css";

const { Footer } = Layout;

function PanelFooter() {
  return (
    <Footer style={{ textAlign: "center" }}>
      Blog Admin ©{new Date().getFullYear()} Created by manfred
    </Footer>
  );
}

export default PanelFooter;
