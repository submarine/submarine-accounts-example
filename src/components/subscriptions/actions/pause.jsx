import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";

export function Pause({ subscription }) {
  const submarineContext = useContext(SubmarineContext);
  const queryClient = useQueryClient();
  const { api } = submarineContext.submarine;

  const canPause = subscription.attributes.status === 'active';

  // create a mutation object
  const pause = pauseMutation(subscription, api, queryClient);

  // handle a click on the pause button
  const handlePause = () => {
    // reset the mutation to edit the nickname
    pause.reset();
    pause.mutate();
  };

  return (
    <button
      disabled={!canPause || pause.isLoading}
      onClick={handlePause}
    >
      {pause.isLoading ? 'Pausing...' : 'Pause'}
    </button>
  );
}

function pauseMutation(subscription, api, queryClient) {
  return useMutation({
    mutationFn: () => {
      return new Promise((resolve, reject) => {
        api.updateSubscription(subscription.id, {
          status: 'paused'
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
