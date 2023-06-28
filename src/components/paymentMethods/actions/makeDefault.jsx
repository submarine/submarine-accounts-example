import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";

export function MakeDefault({ paymentMethod }) {
  const submarineContext = useContext(SubmarineContext);
  const queryClient = useQueryClient();
  const { api } = submarineContext.submarine;

  const canMakeDefault = !paymentMethod.attributes.default;

  // create a mutation object
  const makeDefault = makeDefaultMutation(paymentMethod, api, queryClient);

  // handle a click on the pause button
  const handleMakeDefault = () => {
    // reset the mutation to make default
    makeDefault.reset();
    makeDefault.mutate();
  };

  return (
    <button
      disabled={!canMakeDefault || makeDefault.isLoading}
      onClick={handleMakeDefault}
    >
      {makeDefault.isLoading ? 'Saving...' : 'Make default'}
    </button>
  );
}

function makeDefaultMutation(paymentMethod, api, queryClient) {
  return useMutation({
    mutationFn: () => {
      return new Promise((resolve, reject) => {
        api.updatePaymentMethod(paymentMethod.id, {
          payment_method: {
            default: true,
            status: paymentMethod.attributes.status
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
    }
  });
}
