// Node Modules
import React from "react";

// Components
import Results from "./common/results";

// CSS
import CSS from "./css/content.module.css";

/* 
The Content is the main section that shows the search results and all the contacts
*/
function Content(props) {

  // PROPS
  const {arrContacts, searchName, handle_ContactSelected} = props;

  // VARIABLES
  let arrResults = [];

  // FUNCTIONS
  function getSearchResults() {
    // By default show everything
    arrResults = arrContacts;

    // If some text has been entered (ignoring just white space)
    if(searchName.trim().length > 0) {
      arrResults = arrContacts.filter(item => item.name.toLowerCase().includes(searchName) )
    }
  }

  getSearchResults();

  return (
  <div id="MainContent" className={CSS.content}>
    <div id="ResultCount" className={CSS[`results-total`]}>
      {searchName.trim().length === 0 ? `All Contacts (Total: ${arrResults.length})` : 
                                        `Search Results: ` + (arrResults.length === 0 ? 'None Found' : 
                                        `${arrResults.length}/${arrContacts.length}`) }
    </div>

    <Results
      arrContacts={arrResults}
      searchName={searchName}
      handle_ContactSelected={handle_ContactSelected}
    />
  </div>
  );
}

export default Content;