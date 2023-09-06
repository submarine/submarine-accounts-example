import { useQuery } from "@tanstack/react-query";

export function generateClientToken(paymentProcessor, api) {
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
