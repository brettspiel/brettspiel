import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./features/App";
import * as serviceWorker from "./serviceWorker";
import "antd/dist/antd.css";
import { DEBUG_MODE } from "./constants";

console.log("@DEBUG_MODE", JSON.parse(JSON.stringify(DEBUG_MODE)));

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to registerUrl() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
