import { useMutation } from "@tanstack/react-query";

export function createPaymentMethodMutation(api, queryClient, setOpen) {
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
