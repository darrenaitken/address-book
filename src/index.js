//  Node Modules
import React from "react";
import ReactDOM from "react-dom";

// Components
import App from "./components/App";
import { apiURL } from "./services/config.json";

// CSS
import "./components/css/index.css";
import "react-toastify/dist/ReactToastify.min.css";

// process is the current process running
console.log("REACT VERSION: ", React.version);
console.log("REACT_APP_NAME: ", process.env.REACT_APP_NAME);
console.log("REACT_APP_VERSION: ", process.env.REACT_APP_VERSION);
console.log("REACT_APP_API_URL: ", apiURL);

ReactDOM.render(<App />, document.getElementById("root"));
