import { useContext, useEffect, useState, createRef } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";
import { useQueryClient } from "@tanstack/react-query";

import { loadClientScripts } from "./common/loadClientScripts.js";
import { generateClientToken } from "./common/generateClientToken.js";
import { createPaymentMethodMutation } from "./common/createPaymentMethodMutation.js";

export function AddStripePaymentMethod() {
  const submarineContext = useContext(SubmarineContext);
  const { api } = submarineContext.submarine;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)}>
        Add new payment method
      </button>
      {open && (<>
        <AddStripePaymentMethodForm
          api={api}
          setOpen={setOpen}
        />
      </>)}
    </>
  );
}

function AddStripePaymentMethodForm({ api, setOpen }) {
  const queryClient = useQueryClient();

  const cardNumberRef = createRef(null);
  const cardExpiryRef = createRef(null);
  const cardCvcRef = createRef(null);

  const [cardName, setCardName] = useState('');
  const [stripeInstance, setStripeInstance] = useState(null);
  const [stripeCardElement, setStripeCardElement] = useState(null);

  // fetch a payment processor client token
  const {
    isLoading: isGeneratingClientToken,
    error: clientTokenError,
    data: clientToken
  } = generateClientToken('stripe', api);

  // load the stripe js library
  const {
    isLoading: isLoadingScripts,
    error: scriptsError,
    data: scripts
  } = loadClientScripts('stripe');

  // define a mutation to create a new payment method
  const createPaymentMethod = createPaymentMethodMutation(api, queryClient, setOpen);

  // initialise Stripe when ready
  useEffect(() => {
    if(isGeneratingClientToken || isLoadingScripts) {
      return;
    }

    const stripe = window.Stripe(clientToken.attributes.token);
    const elements = stripe.elements();

    const cardElement = elements.create('cardNumber');
    cardElement.mount(cardNumberRef.current);

    const cardExpiry = elements.create('cardExpiry');
    cardExpiry.mount(cardExpiryRef.current);

    const cardCvc = elements.create('cardCvc');
    cardCvc.mount(cardCvcRef.current);

    setStripeInstance(stripe);
    setStripeCardElement(cardElement);
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

    stripeInstance.createToken(stripeCardElement, {
      name: cardName
    }).then(result => {
      if(result.error) {
        createPaymentMethod.reset();
      } else {
        createPaymentMethod.mutate({
          paymentToken: result.token.id,
          paymentMethodType: 'credit-card',
          paymentProcessor: 'stripe'
        });
      }
    });
  };

  return (
    <section>
      <input
        onChange={e => setCardName(e.target.value)}
        placeholder="Name"
        value={cardName}
      />
      <div ref={cardNumberRef} />
      <div ref={cardExpiryRef} />
      <div ref={cardCvcRef} />
      <button
        disabled={!stripeInstance || !stripeCardElement}
        onClick={handleAddPaymentMethod}
      >
        Save payment method
      </button>
    </section>
  );
}
