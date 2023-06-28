import { EditNickname } from "./actions/editNickname.jsx";
import { Pause } from "./actions/pause.jsx";
import { Resume } from "./actions/resume.jsx";
import { Cancel } from "./actions/cancel.jsx";

import { getPaymentMethodDescription, getShippingMethodDescription } from "../../lib/helpers.js";

export function Subscription({ subscription }) {
  const nextScheduledOrder = subscription.attributes.next_scheduled_order;
  const paymentMethod = subscription.attributes.payment_method;
  const shippingMethod = subscription.attributes.shipping_method;

  return (
    <div>
      <h2>Subscription #{subscription.id}</h2>
      <h3>Attributes</h3>
      <ul>
        <li>
          <strong>Nickname:</strong> {subscription.attributes.nickname}
        </li>
        <li>
          <strong>Status:</strong> {subscription.attributes.status}
        </li>
        <li>
          <strong>Frequency:</strong> {subscription.attributes.frequency_human}
        </li>
        <li>
          <strong>Next scheduled order:</strong> {nextScheduledOrder ? nextScheduledOrder.attributes.scheduled_at : '(None)'}
        </li>
        <li>
          <strong>Payment method:</strong> {paymentMethod ? getPaymentMethodDescription(paymentMethod.attributes) : '(None)'}
        </li>
        <li>
          <strong>Shipping method:</strong> {shippingMethod ? getShippingMethodDescription(shippingMethod.attributes) : '(None)'}
        </li>
      </ul>
      <h3>Line items</h3>
      <ul>
        {subscription.line_items.map(lineItem => {
          return (
            <li key={lineItem.id}>
              {lineItem.attributes.quantity} &times; {lineItem.attributes.title} ({lineItem.attributes.price})
            </li>
          );
        })}
      </ul>
      <h3>Actions</h3>
      <ul>
        <li>
          <EditNickname subscription={subscription} />
        </li>
        <li>
          <Pause subscription={subscription} />
        </li>
        <li>
          <Resume subscription={subscription} />
        </li>
        <li>
          <Cancel subscription={subscription} />
        </li>
      </ul>
    </div>
  );
}
