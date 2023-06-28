import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";

export function EditNickname({ subscription }) {
  const submarineContext = useContext(SubmarineContext);
  const queryClient = useQueryClient();
  const { api } = submarineContext.submarine;

  // create a mutation object
  const updateNickname = updateNicknameMutation(subscription, api, queryClient);

  // handle a click on the edit nickname affordance
  const handleEditNickname = () => {
    // reset the mutation to edit the nickname
    updateNickname.reset();

    // prompt the user for the new nickname
    const nickname = prompt('Please enter a nickname for this subscription', subscription.attributes.nickname);

    // if a new nickname was provided, update it
    if(nickname) {
      updateNickname.mutate(nickname);
    }
  };

  return (
    <button
      disabled={updateNickname.isLoading}
      onClick={handleEditNickname}
    >
      {updateNickname.isLoading ? 'Saving...' : 'Edit nickname'}
    </button>
  );
}

function updateNicknameMutation(subscription, api, queryClient) {
  return useMutation({
    mutationFn: (newNickname) => {
      return new Promise((resolve, reject) => {
        api.updateSubscription(subscription.id, {
          nickname: newNickname
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
