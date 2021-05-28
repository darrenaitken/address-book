// Node Modules
import React, {useEffect, useRef} from "react";

// CSS
import CSS from "./css/optionsbar.module.css";


/* 
The OptionsBar is the section at the top that allows you 
to search and add new addresses
*/
function OptionsBar(props) {

  // PROPS
  const {handle_SearchKeyUp, handle_AddNewContact} = props;

  //  REFS
  const refSearch = useRef()

  // Load: Simulates componentDidMount() method.
  // This will only run once - when the component has mounted
  useEffect(() => {

    // Set the focus to the search field
    refSearch.current.focus();
      
  },[])

  return (
  <form className={CSS["options-bar"]}>
    <input id="txtSearch" 
          className={CSS.options} 
          type="text"  
          placeholder="Search Name..." 
          ref={refSearch}
          onKeyUp={handle_SearchKeyUp}></input>
    <button id="btnAddContact" className="standard" onClick={handle_AddNewContact}>Add New Contact</button>
  </form>)
  ;
}

export default OptionsBar;
