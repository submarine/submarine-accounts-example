import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";

export function Remove({ paymentMethod }) {
  const submarineContext = useContext(SubmarineContext);
  const queryClient = useQueryClient();
  const { api } = submarineContext.submarine;

  const canRemove = (paymentMethod.attributes.status === 'active') && (!paymentMethod.attributes.active_subscription);

  // create a mutation object
  const remove = removeMutation(paymentMethod, api, queryClient);

  // handle a click on the remove affordance
  const handleRemove = () => {
    // reset the mutation to remove
    remove.reset();
    remove.mutate();
  };

  return (
    <button
      disabled={!canRemove || remove.isLoading}
      onClick={handleRemove}
    >
      {remove.isLoading ? 'Removing...' : 'Remove'}
    </button>
  );
}

function removeMutation(paymentMethod, api, queryClient) {
  return useMutation({
    mutationFn: () => {
      return new Promise((resolve, reject) => {
        api.removePaymentMethod(paymentMethod.id, (paymentMethod, errors) => {
          if(errors) {
            reject(errors);
          } else {
            resolve(paymentMethod);
          }
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    }
  });
}
