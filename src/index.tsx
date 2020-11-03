import "raf/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import "./styles/reset.css";

import App from "./App";

const target = document.getElementById("root");
if (target) {
  ReactDOM.render(<App />, target);
}

if (module && module.hot) {
  module.hot.accept();

  module.hot.addStatusHandler((status) => {
    if (status === "prepare") console.clear();
  });
}
