// Node Modules
import React from "react";

// CSS
import CSS from "./css/footer.module.css";


/* 
The footer is the element at the very bottom of the page
*/
function Footer() {
  return (
    <footer className={CSS.footer}>
        &copy; Copyright {new Date().getFullYear()} Darren Aitken
    </footer>
  );
}

export default Footer;