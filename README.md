## <u>ADDRESS BOOK</u>

#### <u>ABOUT</u>

This is a prototype address book application built using JavaScript / React. This app is not production ready; it's simply available to showcase a small prototype demonstrating the underlying code with it.

You need to install nodeJS in order to use this: https://nodejs.org.
It is recommended to use VSCode to run these steps successfully: https://code.visualstudio.com

#### <u>INSTALLATION</u>

You must install everything locally first before you can run anything. The following installation steps only need to be completed once (unless a new app update has been uploaded to GitHub)

1. Clone this repo so the files are on your local computer.
2. Open a new terminal in VSCode (Terminal > New Terminal)
3. Run `npm install`. This will install all the dependencies required by this app.

You can now continue on the 'Getting started' section...

#### <u>GETTING STARTED</u>

##### <strong>Step A</strong> Back end API (simulation)

First we need to simulate that a back-end server is running so we can interact with data.

The json-server library (installed using `npm install`) will allow us to use data in the src/api/db.json file. This mocks a typical api endpoint.

1. Open a new terminal in VSCode (Terminal > New Terminal)
2. Run `npm run api` so that you can interact with a local API endpoint.
3. Go to http://localhost:3030/data - you should see JSON data being returned (this is just to check that back end api is working).

##### <strong>Step B</strong> Front end react app

Now you have the api running we can start the front end (this interacts with our back end api data).

4. Open another new terminal window (Terminal > New Terminal)
5. Run `npm start` (this starts the front end application)
6. Go to http://localhost:3000 - you should see the app

#### <u>TESTING</u>

Testing is completed using cypress.io. This simulates a user using the front end (clicking on things, inputting values, etc)

Prior to running the tests, make sure you have both the api running (complete Step A points 1-3, shown above) and also the front end app (Step B points 4-6, also explained above).

1. Open another new terminal window (Terminal > New Terminal)
2. Run `npm test` (this will start cypress - a new window should pop up showing you a list of integration tests)
3. Click on the test (standard test link) to run the tests - you will see on the left what the tests do and if they passed or failed

#### <u>DESIGN ARCHITECTURE</u>

The entry point to the application is index.js, which will render the content calculated by App.jsx.

The main state of the app is stored within App.jsx with other child components having their own states if required. The states are stored as objects - they work the same way as individual state values, except the object properties are altered.

The component hierarchy of the application is as follows:

Public/index.html <br />
??? src/index.js <br />
??? App <br />
??? ToastContainer <br />
??? Details <br />
??? Field <br />
??? Header <br />
??? OptionsBar <br />
??? Content <br />
??? Results <br />
??? Footer <br />

#### <u>FOLDER STRUCTURE AND NOTEABLE FILES</u>

cypress (testing files)

public (anything that can be accessed by third parties is placed here) <br />
??? index.html (our landing page which is opened by the server, which in turn runs src/index.js)

src <br />
??? api (folder contains our fake JSON data for our contact api) <br />
??? components (where all our parent components of our app are located as well as various subfolders listed below) <br />
??? common (components that could be used by other main elements) <br />
??? css (css modules that are used by all components to render certain styles. css file names match component files) <br />
??? images (static images used by our application) <br />
??? js (javascript only files. A location for generic or shared code) <br />

index.js (Our entry point JavaScript file, which in turn calls src/components/App.jsx)
