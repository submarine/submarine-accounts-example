import { PaymentMethod } from "./paymentMethod.jsx";
import { AddBraintreePaymentMethod } from "./groupActions/addBraintreePaymentMethod.jsx";

export function PaymentMethods({ paymentMethods }) {
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
      <AddBraintreePaymentMethod />
    </section>
  )
}
