import { useContext, useEffect, useState, createRef } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import loadScripts from "@lemuria/load-scripts";

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

function generateClientToken(paymentProcessor, api) {
  return useQuery({
    queryKey: ['clientToken'],
    queryFn: () => {
      return new Promise((resolve, reject) => {
        api.generatePaymentProcessorClientToken(paymentProcessor, (token, errors) => {
          if(errors) {
            reject(errors);
          } else {
            resolve(token);
          }
        });
      });
    }
  });
}

function loadClientScripts(paymentProcessor) {
  const clientScripts = {
    'braintree': [
      'https://js.braintreegateway.com/web/dropin/1.38.1/js/dropin.min.js'
    ]
  }

  return useQuery({
    queryKey: ['clientScripts', paymentProcessor],
    queryFn: () => {
      return new Promise((resolve, reject) => {
        loadScripts(clientScripts[paymentProcessor], (error, data) => {
          if(error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    }
  });
}

function createPaymentMethodMutation(api, queryClient, setOpen) {
  return useMutation({
    mutationFn: ({ paymentToken, paymentMethodType, paymentProcessor }) => {
      return new Promise((resolve, reject) => {
        api.createPaymentMethod({
          payment_method: {
            payment_token: paymentToken,
            payment_method_type: paymentMethodType,
            payment_processor: paymentProcessor,
            status: 'active'
          }
        }, (subscription, errors) => {
          if(errors) {
            reject(errors);
          } else {
            resolve(subscription);
          }
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
      setOpen(false);
    }
  });
}
