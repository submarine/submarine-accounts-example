import { PaymentMethod } from "./paymentMethod.jsx";

export function PaymentMethods({ paymentMethods }) {
  return (
    <section>
      {paymentMethods.map(paymentMethod => {
        return (
          <PaymentMethod
            key={paymentMethod.id}
            paymentMethod={paymentMethod}
          />
        )
      })}
    </section>
  )
}
