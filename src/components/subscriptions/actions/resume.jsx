import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";

export function Resume({ subscription }) {
  const submarineContext = useContext(SubmarineContext);
  const queryClient = useQueryClient();
  const { api } = submarineContext.submarine;

  const canResume = subscription.attributes.status === 'paused';

  // create a mutation object
  const resume = resumeMutation(subscription, api, queryClient);

  // handle a click on the resume button
  const handleResume = () => {
    // reset the mutation to edit the nickname
    resume.reset();
    resume.mutate();
  };

  return (
    <button
      disabled={!canResume || resume.isLoading}
      onClick={handleResume}
    >
      {resume.isLoading ? 'Resuming...' : 'Resume'}
    </button>
  );
}

function resumeMutation(subscription, api, queryClient) {
  return useMutation({
    mutationFn: () => {
      return new Promise((resolve, reject) => {
        api.updateSubscription(subscription.id, {
          status: 'active'
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
