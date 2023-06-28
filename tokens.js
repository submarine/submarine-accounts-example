import express from 'express';
import nJwt from 'njwt';

const app = express();

const SUBMARINE_ENVIRONMENT = process.env.SUBMARINE_ENVIRONMENT || 'staging';
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || 'example.myshopify.com';
const CUSTOMER_ID = process.env.CUSTOMER_ID;
const CUSTOMER_API_SECRET = process.env.CUSTOMER_API_SECRET;

const SUBMARINE_DOMAINS = {
  staging: 'https://submarine-staging.discolabs.com',
  production: 'https://submarine.discolabs.com',
  uat: 'https://submarine-uat.discolabs.com',
};

const generateJwt = () => {
  const now = Math.floor(Date.now() / 1000);
  const expires = now + 300;

  const claims = {
    exp: expires,
    iss: SUBMARINE_DOMAINS[SUBMARINE_ENVIRONMENT],
    aud: SHOPIFY_DOMAIN,
    sub: CUSTOMER_ID,
    iat: now,
    nbf: now
  }

  return nJwt.create(claims, CUSTOMER_API_SECRET).compact();
};

app.get("/apps/submarine/auth/tokens", (req, res) => {
  res.send(generateJwt());
});

export const handler = app;
