// Node Modules
import React, {useState, useEffect} from "react";

// CSS
import CSS from "../css/details.module.css";

// Components
import Field from "../common/field";
import {toastWarning} from "../../js/toast/toast"


export default function Details(props) {

    // PROPS
    const {showDetails, selectedContact, handle_CloseDetails, handle_UpdateContact} = props;

    // STATE
    // enableSaveButton = toggles whether or not the save button is enabled
    // arrFields        = an array of fields and their attributes we want to use on the form
    
    const [state, setState] = useState({
        enableSaveButton: false,
        arrFields: [
            {
                id: "txtName",
                type: "Input",
                labelText: "Full Name",
                required: true,
                minLength: 3,
                maxLength: 255,
                value: "",
                complete: false
            },
            {
                id: "txtNotes",
                type: "TextArea",
                labelText: "Notes",
                required: false,
                maxLength: 255,
                rows: 10,
                value: "",
                complete: false
            },
            {
                id: "txtLatitude",
                type: "Input",
                labelText: "Latitude",
                required: false,
                maxLength: 255,
                value: "",
                complete: false
            },
            {
                id: "txtLongitude",
                type: "Input",
                labelText: "Longitude",
                required: false,
                maxLength: 255,
                value: "",
                complete: false
            }
        ]
    })

    // EVENTS
    // Load: Simulates componentDidMount() method.
    // This will only run once - when the component has mounted
    useEffect(() => {
    
        // If we have selected an existing contact it's object would be passed in
        // (If adding a new contact this object would have no keys as it's an empty object)
        if(Object.keys(selectedContact).length > 0) {

            // This is an array of updates we need to make to our state values
            const arrUpdates = [
                        {id: "txtName", value: selectedContact.name},
                        {id: "txtNotes", value: selectedContact.notes},
                        {id: "txtLongitude", value: selectedContact.location.longitude},
                        {id: "txtLatitude", value: selectedContact.location.latitude}
                    ]

            const arrCopy = updateFieldValues(arrUpdates);

            // Figure out if we need the enable / disable the save button
            const enableSaveButton = allFieldsCompleted(arrCopy);

            setState({...state, 
                enableSaveButton,
                arrFields: arrCopy
                });
        }



    },[])

    
    // This will run when some presses a key in the field (if esc then clear field)
    function handle_FieldKeyUp(e) {

        // If someone presses the escape button (keycode 27) then clear the field
        if (e.keyCode === 27) {

            const target = e.currentTarget

            // To be on the safe side, make a copy of the array of fields
            let arrCopy = [...state.arrFields]

            // Clear the field
            target.value = "";

            // Update the field value property
            arrCopy = updateFieldValues([{id: target.id, value: ''}]);

            // Figure out if we need the enable / disable the save button
            const enableSaveButton = allFieldsCompleted(arrCopy);

            // Update the state so it can re-render
            setState({...state, 
                        enableSaveButton,
                        arrFields: arrCopy
                        });
        }
    }

    // Triggers every time a field change is made (onChange event)
    function handle_FieldChange(e) {

        const target = e.currentTarget

        // This is an array of updates we want to make (only one field)
        const arrCopy = updateFieldValues([{id: target.id, value: target.value}])

        const enableSaveButton = allFieldsCompleted(arrCopy);

        // Update the state so it can re-render
        setState({...state, 
                    enableSaveButton,
                    arrFields: arrCopy
                    });
    }


    // Saves the data when the button is clicked
    function handle_saveButtonClick(e) {
        // Do not allow form button to reload the browser
        e.preventDefault();

        // Make a copy of our latest state (field array with latest values)
        const arrCopy = [...state.arrFields]

        // Only commit the save if all fields have been completed properly...
        if(allFieldsCompleted(arrCopy) && allFieldValuesCorrect(arrCopy)){
            handle_UpdateContact(arrCopy);
        }
    }

    // GENERIC FUNCTIONS

    // Function takes in an array of objects (updates we want to make; the field ID and new value)
    // and returns an updated field array with the new values so we can update the state
    function updateFieldValues(arrUpdates) {
 
        // make a copy of our array of objects held by the state
        let arrCopy = [...state.arrFields];

        // Update each field id listed in our updates array (the value property)
        arrUpdates.forEach(item => {

            // Obtain our field object from our array
            let myField = arrCopy.find(o => o.id === item.id)

            // Update the value property
            myField.value = item.value;
    
            // Figure out if we have completed the field criteria (the complete property on the field)
            myField.complete = isFieldComplete(myField);

            })

        return arrCopy
    }

    // Function is logic to determine if we enable / disable the save button
    function allFieldsCompleted(arrFields) {
        // Do we enable the save button (every required field must be completed correctly)
        return arrFields.filter(o => o.required === true && o.complete === false).length === 0;
    }

    // Function makes sure that certain fields have correct values
    function allFieldValuesCorrect(arrFields){

        // We can add to an array of results for each criteria. 
        // It does not matter what is entered (boolean / string / whatever. If anything is added then we cannot proceed)
        const arrResults = [];

        // These are the fields we are checking
        const latitude = arrFields.find(field => field.id === "txtLatitude");
        const longitude = arrFields.find(field => field.id === "txtLongitude");
        
        // Latitude must be numeric and between -90 and 90
        // Adding + at the front converts to a number 
        if(isNaN(latitude.value) || !(+latitude.value >= -90 && +latitude.value <= 90)) {
            arrResults.push(false);
            toastWarning(`Latitude must be a number between -90 and 90`);
        }

        // Longitude must be numeric and between -180 and 80
        if(isNaN(longitude.value) || !(+longitude.value >= -180 && +longitude.value <= 180)) {
            arrResults.push(false);
            toastWarning(`Longitude must be a number between -180 and 180`);
        }

        // If you have completed longitude you must also complete latitude (and vice versa) 
        if((String(latitude.value).trim().length > 0 && String(longitude.value).trim().length === 0) ||
            (String(latitude.value).trim().length === 0 && String(longitude.value).trim().length > 0)) {
            arrResults.push(false);
            toastWarning(`Longitude and latitude must both be completed`);
            }

        return arrResults.length === 0;
    }

    // Determines whether we show the tick for completed field 
    // (this disregards if the value itself is valid. It's only interested that a field must be completed)
    function isFieldComplete(myField) {
        // By default the field is incomplete (false)
        let result = false;

        if(myField.minLength && myField.value.length >= myField.minLength) {
            result = true;
        }
        if(!myField.required && String(myField.value).length > 0) {
            result = true;
        }

        return result;
    }

    return (
        <div id="PopUpDetailsForm" className={`${CSS.modalBackground} ${showDetails ? `` : CSS.hide}`}>
            <div className={CSS.modalBox}>
                <div className={CSS.modalTopBar}>
                    <div id="btnClose" className={CSS.modalButtonClose} onClick={handle_CloseDetails}>
                        &times;
                    </div>
                </div>
                <div className={CSS.modalBody}>
                    <form className={CSS.details}>
                        {state.arrFields.map(item => (
                            <Field 
                                key={item.id}
                                attributes={item}
                                handle_FieldChange={handle_FieldChange}
                                handle_FieldKeyUp={handle_FieldKeyUp}
                            />
                        ))}
                    
                        <button 
                            id="btnSaveDetails"
                            className={`${CSS.details} ${state.enableSaveButton ? `` : CSS.disabled}`}
                            disabled={!state.enableSaveButton}
                            onClick={handle_saveButtonClick}>Save
                        </button>
                    
                    </form>
                </div>
            </div>
        </div>
    )

}