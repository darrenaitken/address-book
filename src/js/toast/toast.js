// Note: To make toast work you need to have the <ToastContainer /> listed in the app (see app.js)
//       You also need to add the css file "react-toastify/dist/ReactToastify.min.css" (see index.js)

// Node Modules
import React from "react";
import { toast } from "react-toastify"; // npm i react-toastify

// Custom Modules
import { standardOptions } from "./config.json";

function msgHTML(FriendlyMessage, EmojiHex, ErrorNumber, Error) {
  let hex;

  // Make sure we have 0x at the start of our hex value
  // https://www.w3schools.com/charsets/ref_emoji.asp
  if (EmojiHex) {
    if (String(EmojiHex).startsWith("0x")) {
      hex = String.fromCodePoint(EmojiHex);
    } else {
      hex = `0x${String.fromCodePoint(EmojiHex)}`;
    }
  }

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        {hex ? (
          <span role="img" aria-label="emoji">
            {hex}&nbsp;
          </span>
        ) : null}
        <p>{FriendlyMessage}</p>
      </div>
      <div>
        {ErrorNumber ? <span>Error {ErrorNumber}: </span> : null}
        {Error ? Error : null}
      </div>
    </div>
  );
}

export function toastError(
  FriendlyMessage,
  ErrorNumber,
  Error,
  EmojiHex = "0x1F6A7"
) {
  toast.error(
    msgHTML(
      FriendlyMessage,
      (EmojiHex = "0x1F6A7"),
      ErrorNumber,
      Error && Error.message ? Error.message : Error
    ),
    standardOptions
  );
}

export function toastInfo(FriendlyMessage, EmojiHex = "0x1F4AC") {
  toast.info(msgHTML(FriendlyMessage, EmojiHex), standardOptions);
}

export function toastWarning(FriendlyMessage, EmojiHex = "0x1F6A9") {
  toast.warning(msgHTML(FriendlyMessage, EmojiHex), standardOptions);
}
