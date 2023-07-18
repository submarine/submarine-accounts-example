# Submarine accounts example
This repository provides a sample implementation of a customer account section using Submarine.

It's a React app approach that leverages the [Submarine.js](https://github.com/submarine/submarine-js) library to make
a few interaction points quicker.

While the client-side code is self-contained in this repository and can be developed locally, requests to the Submarine
Customer API are not stubbed and are made against an external Submarine environment. As a result, before working with
this repository you'll have to have access to:

* A Shopify store environment with either the staging or production version of Submarine installed;
* A known Shopify customer in that store;
* The customer API secret assigned by Submarine to that store.

## Getting started

### Installation
We recommend using [asdf](https://github.com/asdf-vm/asdf) for the management of tooling versions. For developing with
this repository, we recommend Node.js 16.13.

Once you have `asdf` configured and ready to go, you should:

```bash
# install the version of Node.js in use by this repository
asdf install nodejs 16.13.0

# install the dependencies - run this from the project root directory
yarn install
```

### Environment variables
In a deployed Shopify theme, environment variables like the Submarine environment, current Shopify domain, and logged
in customer ID will be retrieved from shop metafields or the Shopify request context via Liquid templates.

For the purposes of development and testing with this example repository, we need to define these values in a local
environment file.

The `.env` file lists the variables required to be set -- when starting development, you should copy this file to a new
`.env.local` file in the root directory and fill it our with values specific to your environment.

* `VITE_CUSTOMER_API_SECRET`: The Submarine Customer API secret defined for your Shopify store. This should be provided
  to you by Submarine support, and is used to generate valid JWT tokens in your local development environment for use
  against the live Submarine API. For example, `Qqs99Rc29K23fe7kQvfR1LRG`.
* `VITE_CUSTOMER_ID`: The numerical ID for the Shopify customer you would like to use for development purposes. For
  example, `7225251091539`.
* `VITE_SHOPIFY_DOMAIN`: The full `*.myshopify.com` domain for the Shopify store you would like to use for development
  purposes. For example, `store.myshopify.com`.
* `VITE_SUBMARINE_ENVIRONMENT`: The environment of the Submarine instance installed on the store. This will typically
  be `staging` in a development scenario, and `production` otherwise.

### Starting the development server
With the above configured, starting the development server and being able to hot reload code should be as simple as:

```
yarn dev
```
