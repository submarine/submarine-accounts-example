import { MakeDefault } from "./actions/makeDefault.jsx";

import { getPaymentMethodDescription } from "../../lib/helpers.js";

export function PaymentMethod({ paymentMethod }) {
  return (
    <div>
      <h2>{getPaymentMethodDescription(paymentMethod.attributes)}</h2>
      <h3>Attributes</h3>
      <ul>
        <li>
          <strong>Status:</strong> {paymentMethod.attributes.status}
        </li>
        <li>
          <strong>Default:</strong> {paymentMethod.attributes.default ? 'Yes' : 'No'}
        </li>
      </ul>
      <h3>Actions</h3>
      <ul>
        <li>
          <MakeDefault paymentMethod={paymentMethod} />
        </li>
      </ul>
    </div>
  );
}
