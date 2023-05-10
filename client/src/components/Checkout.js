import { CLIENT_ID } from "../Config/Config";
import React, { useState, useEffect } from "react" ;
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Checkout ({current}) {
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);

    useEffect(() => {
        if (success) {
            alert("Payment successful!!");
            console.log('Order successful . Your order id is--', orderID);
        }
    },[success]);

    if (!current) {
        return (<>..loading</>)
    }
    if (!current.cart_items) {
        return <>...loading</>
    }

    let calcSubTotal = () => {
        let total = 0;
        for (let index in current.cart_items) {
            let target = current.cart_items[index];
            let itemTotal = target.item.price * target.quantity;
            total += itemTotal;
        }
        return total.toFixed(2)
    }

    let PPItems = [];
    current.cart_items.forEach(item => {
        let temp = {
            name: item.item.title,
            description: item.item.title,
            sku: 'null',
            unit_amount: {
                value: item.item.price,
                currenct_code: 'USD',
            },
            quantity: item.quantity
        }
        PPItems.push(temp)
    })
    console.log(PPItems)

    let renderSubTotal = calcSubTotal();

    let renderTax = (renderSubTotal * 0.0814).toFixed(2);

    let renderTotal = (parseFloat(renderSubTotal) + parseFloat(renderTax)).toFixed(2);

    //PayPal integrations_______________________________________

    // creates a paypal order
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: `Cart ${current.name} Checkout`,
                    amount: {
                        'currency_code': "USD",
                        'value': renderSubTotal,
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: renderSubTotal
                            }
                        },
                        items: PPItems
                    },
                },
            ],
        }).then((orderID) => {
                setOrderID(orderID);
                return orderID;
            });
    };

    // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            const { payer } = details;
            setSuccess(true);
        });
    };

    //capture likely error
    const onError = (data, actions) => {
        setErrorMessage("An Error occured with your payment ");
    };


    //end PayPal

    return (


        <div className="Checkout">
            <div className="checkoutInfo">
            <h2>Checkout</h2>
            <h4>Subtotal: ${renderSubTotal}</h4>
            <h4>Tax: ${renderTax}</h4>
            <h4>Total: ${renderTotal}</h4>
            </div>
            <div className="checkoutOptions">
                <PayPalScriptProvider options={{"client-id": CLIENT_ID, intent: 'capture'}} >
                    <PayPalButtons
                        style={{layout: "vertical"}}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        />
                </PayPalScriptProvider>
            </div>
        </div>
    )
}

export default Checkout