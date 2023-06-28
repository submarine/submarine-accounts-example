// parse a JSON configuration object from the DOM
export const parseJSONScript = (document, id) => {
  const script = document.getElementById(id);
  try {
    return JSON.parse(script.innerHTML);
  } catch {
    return null;
  }
};

// get a textual description of a payment method
export const getPaymentMethodDescription = (paymentMethodAttributes) => {
  switch(paymentMethodAttributes.payment_method_type) {
    case 'credit-card':
      const { brand, last4, exp_month, exp_year } = paymentMethodAttributes.payment_data;
      return `${brand} ending in ${last4} (expires ${exp_month}/${exp_year})`;
    default:
      return 'Unknown';
  }
}

// get a textual description of a shipping method
export const getShippingMethodDescription = (shippingMethodAttributes) => {
  const shippingRate = shippingMethodAttributes.shipping_rates[0];
  return `${shippingRate.title} (${shippingRate.discounted_price})`;
}
