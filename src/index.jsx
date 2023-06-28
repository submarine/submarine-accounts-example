import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app.jsx';
import { parseJSONScript } from "./lib/helpers.js";
import { SubmarineContext } from "./lib/contexts.js";
import { Submarine } from "submarine-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// parse context
const submarineContext = parseJSONScript(document, 'submarine-context');

// initialise a Submarine object and add to context
submarineContext.submarine = new Submarine(submarineContext);

// create a QueryClient for use by React Query
const queryClient = new QueryClient();

// render application into root component
ReactDOM.createRoot(document.getElementById('submarine-root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SubmarineContext.Provider value={submarineContext}>
        <App />
      </SubmarineContext.Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
