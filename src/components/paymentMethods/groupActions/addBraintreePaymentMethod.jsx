import { useContext, useEffect, useState, createRef } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";
import { useQueryClient } from "@tanstack/react-query";

import { loadClientScripts } from "./common/loadClientScripts.js";
import { generateClientToken } from "./common/generateClientToken.js";
import { createPaymentMethodMutation } from "./common/createPaymentMethodMutation.js";

export function AddBraintreePaymentMethod() {
  const submarineContext = useContext(SubmarineContext);
  const { api } = submarineContext.submarine;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)}>
        Add new payment method
      </button>
      {open && (<>
        <AddBraintreePaymentMethodForm
          api={api}
          setOpen={setOpen}
        />
      </>)}
    </>
  );
}

function AddBraintreePaymentMethodForm({ api, setOpen }) {
  const queryClient = useQueryClient();

  const dropinContainerRef = createRef(null);
  const [dropinInstance, setDropinInstance] = useState(null);

  // fetch a payment processor client token
  const {
    isLoading: isGeneratingClientToken,
    error: clientTokenError,
    data: clientToken
  } = generateClientToken('braintree', api);

  // load the braintree dropin library
  const {
    isLoading: isLoadingScripts,
    error: scriptsError,
    data: scripts
  } = loadClientScripts('braintree');

  // define a mutation to create a new payment method
  const createPaymentMethod = createPaymentMethodMutation(api, queryClient, setOpen);

  // initialise the Braintree dropin component when ready
  useEffect(() => {
    if(isGeneratingClientToken || isLoadingScripts) {
      return;
    }

    window.braintree.dropin.create({
      authorization: clientToken.attributes.token,
      container: dropinContainerRef.current,
      card: {
        cardholderName: {
          required: true,
        },
      },
      paypal: {
        flow: 'vault'
      },
      translations: {
        chooseAWayToPay: 'Choose type of payment method to add',
        chooseAnotherWayToPay: 'Choose a different type of payment method to add',
        payWithCard: 'Add card payment method'
      }
    }, (error, instance) => {
      setDropinInstance(instance);
    });
  }, [isGeneratingClientToken, isLoadingScripts]);

  if(isGeneratingClientToken || isLoadingScripts) {
    return (
      <section>
        Loading...
      </section>
    );
  }

  const handleAddPaymentMethod = () => {
    createPaymentMethod.reset();

    dropinInstance.requestPaymentMethod((error, payload) => {
      if(error) {
        createPaymentMethod.reset();
      } else {
        createPaymentMethod.mutate({
          paymentToken: payload.nonce,
          paymentMethodType: (payload.type === 'CreditCard') ? 'credit-card' : (payload.type === 'PayPal' ? 'paypal' : 'unknown'),
          paymentProcessor: 'braintree'
        });
      }
    });
  };

  return (
    <section>
      <div ref={dropinContainerRef} />
      <button
        disabled={!dropinInstance}
        onClick={handleAddPaymentMethod}
      >
        Save payment method
      </button>
    </section>
  );
}
