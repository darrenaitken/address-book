// Node Modules
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

// Services (Obtain Data etc)
import {getAPIAllContacts} from "../services/contactsService";
import {getAPILocationData} from "../services/locationService";

// Components
import Header from "./header";
import Footer from "./footer";
import OptionsBar from "./optionsbar";
import Content from "./content";
import Details from "./common/details";
import {toastError, toastWarning} from "../js/toast/toast";

function App() {

  // STATE
  // arrContacts      = An array of contacts (all of them returned from API)
  // searchName       = A search that is being used to filter the names
  // showDetails      = Modal pop up that allows you to edit / add details
  // selectedContact  = The contact we just clicked on for editing (will be an empty object if new contact)

  const [state, setState] = useState({
    arrContacts: [],
    searchName: "",
    showDetails: false,
    selectedContact: {},
  });

  // COMPONENT LOADS
  useEffect(() => {
    async function getAPIData() {
      // Make a GET request to return the data we need
      let arrContacts = await getAPIAllContacts();

      arrContacts = sortContacts(arrContacts)

      // Obtain full location details for each of the contacts (using the latitude and longitude coordinates)
      for(let i = 0; i <= arrContacts.length-1; i++) {
        arrContacts[i] = await addLocationData(arrContacts[i],true, arrContacts[i].location.latitude, arrContacts[i].location.longitude);
      }     

      // Update the state so the page renders
      setState({ ...state, arrContacts });
    }

    getAPIData();
  },[]);

  // EVENTS
  // This will run when some presses a key when search (if esc then clear search field)
  function handle_SearchKeyUp(e) {
    let searchName = e.currentTarget.value.toLowerCase();

    // If someone presses the escape button (keycode 27) then clear the search
    if (e.keyCode === 27) {
      searchName = "";
      e.currentTarget.value = searchName;
    }

    setState({ ...state, searchName });
  }

  // Event triggers when a new contact needs to be made (Add New Contact button)
  function handle_AddNewContact(e) {
    // Do not allow form button to reload the browser
    e.preventDefault();

    setState({...state,selectedContact: {}, showDetails: true})
  }

  function handle_ContactSelected(e) {
    
    // Find the contact details 
    const selectedContact = state.arrContacts.find(o => o.name === e.currentTarget.id)

    setState({...state,selectedContact, showDetails: true});
  }

  // Event triggers when the pop up details is closed
  function handle_CloseDetails(e) {
     // Do not allow form button to reload the browser
     e.preventDefault();

    setState({...state,selectedContact: {}, showDetails: false})
  }

  // Function saves details (either new contact or updates existing one)
  // Returns true if successful, false if something went wrong
  async function handle_UpdateContact(arrFields) {

    try{
      // make a copy of our array of contacts
      let arrContacts = [...state.arrContacts];

      // Obtain the new details entered by the user
      const newName = arrFields.find(o => o.id === "txtName").value;
      const newNotes = arrFields.find(o => o.id === "txtNotes").value;
      const newLongitude = arrFields.find(o => o.id === "txtLongitude").value;
      const newLatitude = arrFields.find(o => o.id === "txtLatitude").value;

      // Determine if we are we adding a new contact 
      // (selectedContact will be an empty object if new)
      const addingNewRecord = Object.keys(state.selectedContact).length === 0

      // I'll have to fall back on checking names already in our state instead of API calls
      // (please read comment section below about API data limitations)...
      const existingRecord = arrContacts.find(contact => contact.name.trim().toLowerCase() === newName.trim().toLowerCase())

      /*  IMPORTANT (API data limitations)
          ==========
          I've had to comment out an API call - the names are case sensitive, so if I used 
          ?name=John Doe a result would be returned. However if I did ?name=john doe 
          no result would come back. 
          
          We really need unique IDs in our dataset for this to be accurate. This would allow us to
          have duplicate names (since IDs are unique and two people can have the same name).

      // Make sure we are not creating a duplicate name
      const apiResult = await getName(newName);

      if(apiResult?.length > 0) {
        return toastWarning(`${newName} already exists. Please add a different name`)
      )
      */

      // ERROR CHECKING
      // If a name already exists and we are creating a new record stop
      if(existingRecord && addingNewRecord) {
        return toastWarning(`${newName} already exists.
                            Please add a different name`)
      }
 
      // There is a matching name but it is for another record then stop
      if(existingRecord && state.selectedContact?.name.trim().toLowerCase() !== existingRecord.name.trim().toLowerCase()) {
        return toastWarning(`${newName} already exists.
                            Please add a different name`)
      }

      // UPDATE RECORD
      // Add location details object
      let location = {};

      if(addingNewRecord) {
        // we have a new record so we can only include these
        location = {longitude: newLongitude, latitude: newLatitude};
      } else {
        // we have an existing record so include what we already have
        location = existingRecord.location
      }

      // This is a new object record being created (either add it or replace it)
      let newRecord = {
              name: newName,
              notes: newNotes,
              location
            }

      // Update the location data (if applicable)
      newRecord = await addLocationData(newRecord,false,newLatitude,newLongitude);

    
      // Add a new contact
      // ------------------
      // We would make a POST request to save this to the database
      // for demo purposes, we will just add the record to our state so it appears in the front end


      // Update an existing contact
      // ------------------
      // We would need to make a PUT request to save this back to the database
      // for demo purposes we will just remove the existing record and replace it with the new one in our state

      // Remove existing contact from array if we are not adding a new record
      if(!addingNewRecord){
        arrContacts = arrContacts.filter(contact => contact.name.trim().toLowerCase() !== newName.trim().toLowerCase())
      };

      // Put the updated / new record into our array of contacts, sort the array and update the view
      arrContacts.push(newRecord);
      arrContacts = sortContacts(arrContacts);
      setState({ ...state, arrContacts, selectedContact: {}, showDetails: false });


    } catch(err) {
      toastError("Oops! Something went wrong updating a contact",
                err.number,
                err.message)
    }

  }

  // GENERIC FUNCTIONS
  // Function sorts the array of contacts by their name (returns the sorted array A-Z)
  function sortContacts(arrContacts) {
      if (Array.isArray(arrContacts) && arrContacts.length > 0) {
        return arrContacts.sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0
              );
      }
  }

  // Function handles adding location data to the contact object
  // contact      = contact record (object) we want to update
  // forceUpdate  = if true then it ignores if any changes have been made to latitude and longitude
  // latitude     = the new latitude value
  // longitude    = the new longitude value
  async function addLocationData(contact, forceUpdate = false, latitude = '', longitude = '') {
    try{

      // There are missing coordinates details
      if(String(latitude).trim().length === 0 || 
        String(longitude).trim().length === 0) {
        return contact;
      }

      // Nothing has been altered
      if(!forceUpdate &&
        +contact.location.latitude === +latitude &&
        +contact.location.longitude === +longitude) {
          return contact;
      }

      // get the location data from the API call
      const apiData = await getAPILocationData(+latitude, +longitude)

      // replace original location data with more info
      if(apiData) {
        contact.location = apiData;      
      }

    }
    catch(err) {
      toastError("Oops! Something went wrong obtaining a contacts location data",
                err.number,
                err.message)
    }

    return contact
  }

  return (
    <div className="App">
      <ToastContainer />

      {state.showDetails ?
          <Details 
          showDetails={state.showDetails}
          selectedContact={state.selectedContact}
          handle_UpdateContact={handle_UpdateContact}
          handle_CloseDetails={handle_CloseDetails}
        />
      : null}

      <Header />
      <OptionsBar
        handle_SearchKeyUp={handle_SearchKeyUp}
        handle_AddNewContact={handle_AddNewContact}
      />
      <Content 
        arrContacts={state.arrContacts} 
        searchName={state.searchName} 
        handle_ContactSelected={handle_ContactSelected}/>
      <Footer />
    </div>
  );
}

export default App;
