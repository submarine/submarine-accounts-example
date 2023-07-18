import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { SubmarineContext } from "../../../lib/contexts.js";

import { getPaymentMethodDescription } from "../../../lib/helpers.js";

export function EditPaymentMethod({ subscription, paymentMethods }) {
  const submarineContext = useContext(SubmarineContext);
  const queryClient = useQueryClient();
  const { api } = submarineContext.submarine;

  const initialPaymentMethodId = subscription.attributes.payment_method.id;
  const [open, setOpen] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(initialPaymentMethodId);

  // create a mutation object
  const updatePaymentMethod = updatePaymentMethodMutation(subscription, api, queryClient, setOpen);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
      >
        Edit payment method
      </button>
      {open && (<>
        <EditPaymentMethodSelect
          paymentMethods={paymentMethods}
          selectedPaymentMethodId={selectedPaymentMethodId}
          setSelectedPaymentMethodId={setSelectedPaymentMethodId}
        />
        <EditPaymentMethodSave
          initialPaymentMethodId={initialPaymentMethodId}
          selectedPaymentMethodId={selectedPaymentMethodId}
          updatePaymentMethod={updatePaymentMethod}
        />
      </>)}
    </>
  );
}

function EditPaymentMethodSelect({ selectedPaymentMethodId, setSelectedPaymentMethodId, paymentMethods }) {
  const handleChange = (e) => {
    setSelectedPaymentMethodId(e.target.value);
  };

  return (
    <select onChange={handleChange} value={selectedPaymentMethodId}>
      {paymentMethods.map(paymentMethod => {
        return (
          <option
            key={paymentMethod.id}
            value={paymentMethod.id}
          >
            {getPaymentMethodDescription(paymentMethod)}
          </option>
        );
      })}
    </select>
  );
}

function EditPaymentMethodSave({ initialPaymentMethodId, selectedPaymentMethodId, updatePaymentMethod }) {
  const handleClick = () => {
    updatePaymentMethod.reset();
    updatePaymentMethod.mutate(selectedPaymentMethodId);
  };

  const isClean = (initialPaymentMethodId === selectedPaymentMethodId);

  return (
    <button
      disabled={isClean || updatePaymentMethod.isLoading}
      onClick={handleClick}
    >
      Save
    </button>
  );
}

function updatePaymentMethodMutation(subscription, api, queryClient, setOpen) {
  return useMutation({
    mutationFn: (newPaymentMethodId) => {
      return new Promise((resolve, reject) => {
        api.updateSubscription(subscription.id, {
          subscription: {
            payment_method_id: newPaymentMethodId
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
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setOpen(false);
    }
  });
}
