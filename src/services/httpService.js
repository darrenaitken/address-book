// You need to install axios and react-toastify separately:
// npm i axios
import axios from "axios";

// Custom Modules
import { toastError } from "../js/toast/toast";

// This will use the REACT_APP_API_URL value specified in either:
// .env
// .env.production
// .env.development
// ...
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// This needs to be set so secure HTTP only cookies can be sent and received
// (NodeJS CORS middleware also needs to allow access)
// axios.defaults.withCredentials = true;

// This is an array of errors if any occur
let arrErrors = [];

// The function handles the array of errors and returns true if the same error has occurred in the last minute
// This is to stop the user being bombarded with toasts popping up with the same error message
function sameError(error) {
  // Remove any old errors (older than a minute)
  if (arrErrors.length > 0) {
    const timeLimit = new Date(Date.now() - 60000);

    // return all errors that are still within the timeLimit
    arrErrors = arrErrors.filter(
      (o) => o.timestamp.valueOf() >= timeLimit.valueOf()
    );
  }

  // Return if we already have some of these errors within the last minute
  return arrErrors.some((o) => o.message === error.message);
}

// This will handle generic errors
// The interceptor is called first before going to the catch block
axios.interceptors.response.use(null, (error) => {
  // Expected error:
  // status starts with a 4 (400, 404, etc): Client sent a bad request - just ignore and continue with custom catch block
  const expectedError =
    error.response && String(error.response.status).substr(0, 1) === "4";

  if (!expectedError) {
    // Remember we came across this error so we don't have the same one appearing in multiple toast notifications popping up
    if (!sameError(error)) {
      arrErrors.push({
        message: error.message,
        timestamp: new Date(Date.now()),
      });

      // Unexpected error:
      // It did not start with a 4 (it's usually going to report a server code 500 error)
      // Network is down, database is unavailable, bug, etc
      // Display generic friendly error message, do some logging, etc
      toastError(`Oops! We have a HTTP problem`, 500, error.message);
    }
  }

  // The promise is rejected with the error we passed in
  // This will allow us to return to the catch block and continue
  return Promise.reject(error);
});

// This module will export an object with these methods.
// get refers to axios.get and so on
const exportedFunctions = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

export default exportedFunctions;
