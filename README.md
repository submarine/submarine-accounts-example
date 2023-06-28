# Submarine accounts example
This repository provides a sample implementation of a customer account section using Submarine.

It's a React app approach that leverages the [Submarine.js](https://github.com/submarine/submarine-js) library to make
a few interaction points quicker.

## Getting started
We recommend using [asdf](https://github.com/asdf-vm/asdf) for the management of tooling versions. For developing with
this repository, we recommend Node.js 16.13.

Once you have `asdf` configured and ready to go, you should:

```bash
# install the version of Node.js in use by this repository
asdf install nodejs 16.13.0

# install the dependencies - run this from the project root directory
yarn install
```

To start local development of the React app, you can run the following from the root directory after the above:

```
SUBMARINE_ENVIRONMENT=staging SHOPIFY_DOMAIN=store.myshopify.com CUSTOMER_ID=3041789640759 CUSTOMER_API_SECRET=VHy3spF52Y5eMYdecZrKNvMPr yarn dev
```

The environment variables you provide in this command are used to set up a mock JWT token generator in the development
environment, allowing the same application code to work seamlessly in development and production.
