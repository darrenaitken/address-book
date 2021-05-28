// Node Modules
import React from "react";

// CSS
import CSS from "../css/results.module.css"


export default function Results(props) {

    // Props passed in
    const {arrContacts, searchName, handle_ContactSelected} = props

    // Include mark tags for highlighting
    function addMarkTags(myValue) {

        let result = myValue;

        if(myValue.toLowerCase().includes(searchName) && searchName.trim().length > 0){
            result = myValue.replaceAll(new RegExp(searchName,'gi'),`<mark>${searchName}</mark>`);
        }

        return { __html: result};
    }

    /* IMPORTANT: 
        There isn't a unique ID associated to each person to use as a key
        I am assuming the names will be unique. Ideally we need a unique ID passed back for each contact
    */

    // Note: if contact has a city this will show with country. If there is not city specified it will show the region (locality) and country instead
    //       if full location details cannot be found then it will just say "Unknown Location"
    return (
        <ul id="results" className={CSS}>
            {
            arrContacts.map((item) => (
    
            <li key={item.name} id={item.name} onClick={handle_ContactSelected}>
                <span className={CSS[`list-name`]} dangerouslySetInnerHTML={addMarkTags(item.name)}></span>
                <span className={CSS[`list-location`]}>
                    {item.location.city 
                        ? <>{item.location.city}<br/>{item.location?.countryName}</>
                        : item.location.locality 
                        ? <>{item.location.locality}<br/>{item.location?.countryName}</>
                        :`Unknown Location` }
                </span>
                <span className={CSS[`list-notes`]}>{item.notes}</span>
            </li>
            ))
            }
        </ul>
    )

}
