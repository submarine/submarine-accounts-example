import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";

export function Cancel({ subscription }) {
  const submarineContext = useContext(SubmarineContext);
  const queryClient = useQueryClient();
  const { api } = submarineContext.submarine;

  const canCancel = (subscription.attributes.status === 'active') || (subscription.attributes.status === 'paused');

  // create a mutation object
  const cancel = cancelMutation(subscription, api, queryClient);

  // handle a click on the edit nickname affordance
  const handleCancel = () => {
    // reset the mutation to cancel
    cancel.reset();

    // prompt the user for the cancellation reason
    const reason = prompt('Please let us know why you are cancelling (required)', '');

    // if a reason was provided, cancel the subscription
    if(reason) {
      cancel.mutate(reason);
    }
  };

  return (
    <button
      disabled={!canCancel || cancel.isLoading}
      onClick={handleCancel}
    >
      {cancel.isLoading ? 'Cancelling...' : 'Cancel'}
    </button>
  );
}

function cancelMutation(subscription, api, queryClient) {
  return useMutation({
    mutationFn: (reason) => {
      return new Promise((resolve, reject) => {
        api.updateSubscription(subscription.id, {
          status: 'cancelled',
          status_reason_detail: reason
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
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    }
  });
}
