// Node Modules
import React from "react";

// CSS
import CSS from "../css/field.module.css"

// Images
import imgTick from "../images/tick.png"


export default function Field (props) {

    // PROPS
    const {attributes: attr, handle_FieldChange, handle_FieldKeyUp} = props

    // Destructure our attributes (all fields [input and textarea] use these)
    const {id, type, labelText, required, complete, value} = attr;

    // VARIABLES
    let myField;    // This is my field element (either input or textarea)

    // CUSTOM FUNCTIONS
    // Some additional element attributes may need to be used which are passed in as attributes
    function getOptionalAttributes() {
        let result = {};

        if(attr.minLength) {
            result['minLength']=attr.minLength;
        }
    
        if(attr.maxLength) {
            result['maxLength']=attr.maxLength;
        }

        if(attr.rows) {
            result['rows']= attr.rows;
        }

        return result;
    }

    // Function returns an input field
    function getInputField() {
        // Optional input field attributes passed in (some input fields use these)
        const opts = getOptionalAttributes();

        return (
            <input id={id} 
                className={CSS.inputField} 
                type="text" 
                required={required} 
                onChange={handle_FieldChange} 
                onKeyUp={handle_FieldKeyUp}
                placeholder={required ? `Enter ${labelText}...` : `(optional)`}
                value={value}
                {...opts}
            ></input>
        )
    }

    // Function returns an text area field
    function getTextAreaField() {
        // Optional input field attributes passed in (some input fields use these)
        const opts = getOptionalAttributes();

        return (
            <textarea id={id} 
                className={CSS.textAreafield} 
                required={required} 
                onChange={handle_FieldChange} 
                placeholder={required ? `Enter ${labelText}...` : `(optional)`}
                value={value}
                {...opts}
            ></textarea>
        )
    }


    // Obtain the correct field we want to use
    if(type.toLowerCase() === "input") {
        myField = getInputField()
    } else if (type.toLowerCase() === "textarea") {
        myField = getTextAreaField();
    }

    return (
        <div className={type.toLowerCase() === "input" ? CSS.inputContainer : CSS.textAreaContainer}>
            <label htmlFor={id}>{required ? <strong>{labelText}</strong> : labelText}</label>
            {myField}
            {complete ? <img className={CSS.imgTick} src={imgTick} alt="tick (complete)" /> : null}
        </div>        
    )

}

