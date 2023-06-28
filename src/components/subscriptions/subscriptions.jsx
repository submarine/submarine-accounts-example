import { Subscription } from "./subscription.jsx";
export function Subscriptions({ subscriptions }) {
  return (
    <section>
      <h1>Subscriptions</h1>
      {subscriptions.map(subscription => {
        return (
          <Subscription
            key={subscription.id}
            subscription={subscription}
          />
        )
      })}
    </section>
  );
}
