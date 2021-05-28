// Node Modules
import React, { useState, useEffect } from "react";

// CSS
import CSS from "./css/header.module.css";

// Images
import imgLogo from "./images/companyLogo.png";

/* 
The Header is at the very top. Contains the logo, app title and a clock timestamp
*/
function Header() {
  // STATE
  const [state, setState] = useState({
    currentTimestamp: "Obtaining Time...",
  });

  // COMPONENT LOADS
  useEffect(() => {
    // When component loads set interval to run every second updating the state
    // (This is so we always have an up-to-date timestamp on displayed on the header)
    const timer = setInterval(() => {
      const now = new Date();
      const currentTimestamp = `${now.toDateString()} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      setState({ currentTimestamp });
    }, 1000);

    // When component unloads clear the timer
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={CSS.header}>
      <img className={CSS.logo} src={imgLogo} alt="Company Logo" />
      <span className={CSS["app-title"]}>Address Book</span>
      <span className={CSS.timestamp}>{state.currentTimestamp}</span>
    </header>
  );
}

export default Header;
