import { PaymentMethod } from "./paymentMethod.jsx";
import { AddBraintreePaymentMethod } from "./groupActions/addBraintreePaymentMethod.jsx";
import { AddStripePaymentMethod } from "./groupActions/addStripePaymentMethod.jsx";
import { useContext } from "react";
import { SubmarineContext } from "../../lib/contexts.js";

export function PaymentMethods({ paymentMethods }) {
  const submarineContext = useContext(SubmarineContext);
  const { paymentMethods: contextPaymentMethods } = submarineContext;

  return (
    <section>
      <h1>Payment methods</h1>
      {paymentMethods.map(paymentMethod => {
        return (
          <PaymentMethod
            key={paymentMethod.id}
            paymentMethod={paymentMethod}
          />
        )
      })}
      <hr />
      {contextPaymentMethods.map(contextPaymentMethod => {
        switch(contextPaymentMethod.payment_processor) {
          case 'braintree':
            return <AddBraintreePaymentMethod />;
          case 'stripe':
            return <AddStripePaymentMethod />;
        }
      })}
    </section>
  )
}
