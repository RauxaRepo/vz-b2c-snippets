# VZ-B2C-SNIPPETS

## Testing

### Installation
Use the [npm](https://www.npmjs.com/) package manager to install the dependencies:
```bash
  npm install
```

### Dependencies
- **cypress**: Fast, easy and reliable testing for anything that runs in a browser.

  _URL_: https://www.cypress.io/

  _Documentation_: https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes
- **http-server**: http-server is a simple, zero-configuration command-line http server. 
  _URL_: https://www.npmjs.com/package/http-server
- **concurrently**: Run multiple commands concurrently
  _URL_: https://www.npmjs.com/package/concurrently

### Use

The following command will concurrently run the server (so the pages are accesible via localhost:1234) and open the Cypress app so you can run your testing suites:
```bash
  npm start
```

#### ADA tests

If you need to add an ADA test you can modify this file [vz-ada.spec.js](./cypress/integration/vz-ada.spec.js)

If you need your new HTML page to be tested by the existing ADA tests, you can go to this file [pages.js](./cypress/support/pages.js) and add thepath to your .html file to the "pages Array"

#### Email Sender

If you need to test your html files and send them via email, you can open the *email-utils* folder in the terminal and follow the instructions in this file [README.md](./email-utils/README.md)
