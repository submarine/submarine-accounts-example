import { Subscription } from "./subscription.jsx";
export function Subscriptions({ subscriptions, paymentMethods }) {
  return (
    <section>
      <h1>Subscriptions</h1>
      {subscriptions.map(subscription => {
        return (
          <Subscription
            key={subscription.id}
            subscription={subscription}
            paymentMethods={paymentMethods}
          />
        )
      })}
    </section>
  );
}
