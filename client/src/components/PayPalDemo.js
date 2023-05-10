import { useState } from 'react';

let REACT_APP_PAYPAL_CLIENT_ID = 'AQXEeh9iwSF6v9q2yPqP6A10_-5L0zNaP3RTF-HoynaPgAmGuwtLrxGRsxiaO8KtGPyWKVfH2sVDQac0'


function PayPalDemo() {
  const [orderId, setOrderId] = useState(null);

  const FUNDING_SOURCES = [
    window.paypal.FUNDING.PAYPAL,
    window.paypal.FUNDING.CARD
  ];

  async function createOrder(data, actions) {
    const response = await fetch('/orders', {
      method: 'POST',
    });
    const details = await response.json();
    setOrderId(details.id);
    return details.id;
  }

  async function onApprove(data, actions) {
    const response = await fetch(`/orders/${data.orderID}/capture`, {
      method: 'POST',
    });
    const details = await response.json();
    // Three cases to handle:
    //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
    //   (2) Other non-recoverable errors -> Show a failure message
    //   (3) Successful transaction -> Show confirmation or thank you

    // This example reads a v2/checkout/orders capture response, propagated from the server
    // You could use a different API or structure for your 'orderData'

    const errorDetail = Array.isArray(details.details) && details.details[0];
    if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
      return actions.restart(); // Recoverable state, per:
      // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
    }

    if (errorDetail) {
      let msg = 'Sorry, your transaction could not be processed.';
      if (errorDetail.description) msg += '\n\n' + errorDetail.description;
      if (details.debug_id) msg += ' (' + details.debug_id + ')';
      return alert(msg); // Show a failure message (try to avoid alerts in production environments)
    }

    // Successful capture! For demo purposes:
    console.log('Capture result', details, JSON.stringify(details, null, 2));
    const transaction = details.purchase_units[0].payments.captures[0];
    alert('Transaction ' + transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');
  }

  return (
    <>
      <script data-sdk-integration-source="integrationbuilder_ac" />
      <div id="paypal-button-container" />
      <script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`}
        onLoad={() => {
          FUNDING_SOURCES.forEach((fundingSource) => {
            window.paypal.Buttons({
              fundingSource,
              style: {
                layout: 'vertical',
                shape: 'rect',
                color: fundingSource === window.paypal.FUNDING.PAYLATER ? 'gold' : '',
              },
              createOrder,
              onApprove,
            })
              .render('#paypal-button-container');
          });
        }}
      />
    </>
  );
}

export default PayPalDemo;
