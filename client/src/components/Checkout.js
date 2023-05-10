
function Checkout ({current}) {

    if (!current) {
        return (<>..loading</>)
    }
    if (!current.cart_items) {
        return <>...loading</>
    }

    let calcSubTotal = () => {
        let total = 0;
        for (let index in current.cart_items) {
            let target = current.cart_items[index]
            let itemTotal = target.item.price * target.quantity
            console.log('itemTotal', itemTotal)
            total += itemTotal
            console.log('total', total)
        }
        return total
    }

    let renderSubTotal = calcSubTotal()

    let renderTax = (renderSubTotal * 0.0814).toFixed(2)

    let renderTotal = (renderSubTotal + parseFloat(renderTax)).toFixed(2)

    return (


        <div className="Checkout">
            <div className="checkoutInfo">
            <h2>Checkout</h2>
            <h4>Subtotal: ${renderSubTotal}</h4>
            <h4>Tax: ${renderTax}</h4>
            <h4>Total: ${renderTotal}</h4>
            </div>
            <div className="checkoutOptions">
                <button id="pp" onClick={console.log('pp')}>PayPal</button>
            </div>
        </div>
    )
}

export default Checkout