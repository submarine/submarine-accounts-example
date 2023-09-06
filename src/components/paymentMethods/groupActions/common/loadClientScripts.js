import { useQuery } from "@tanstack/react-query";
import loadScripts from "@lemuria/load-scripts";

export function loadClientScripts(paymentProcessor) {
  const clientScripts = {
    'braintree': [
      'https://js.braintreegateway.com/web/dropin/1.38.1/js/dropin.min.js'
    ],
    'stripe': [
      'https://js.stripe.com/v3/'
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
