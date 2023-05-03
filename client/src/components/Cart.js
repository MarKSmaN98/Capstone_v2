import { useContext, useState, useEffect} from "react"
import { UserContext } from "../context/user"

function Cart () {
    document.title='Cart'
    const {user, setUser} = useContext(UserContext)
    const [carts, setCarts] = useState([{'name': 'GuestCart'}])
    const [currentCart, setCurrentCart] = useState({
        'name': 'defaultCart', 
        'items':[{'name':'deflt item'}]
    })
    const [stateItems, setStateItems] = useState([{'name':''},{}])
    useEffect(() => {
        if (!user) {
            fetch('/check').then(r => {
                if (r.ok) {
                    return r.json();
                }
                else {
                    setUser({
                        'name': 'Guest',
                        'user_carts': [
                            {
                                'name': 'GuestCart',
                                'items': []
                            }
                        ]
                    });
                    console.log('welcome, guest');
                }
            })
            .then(body => {
                setUser(body);
                setCarts(body.user_carts)
                setCurrentCart(body.user_carts[0])
                
            })
        }
        else{
            setCarts(user.user_carts)
            setCurrentCart(user.user_carts[0])
            setStateItems(user.user_carts[0].items)
        }

    },[user])


    if (!user) {
        return (<>noUser</>)
    }

    let cartList = carts.map((cart) => {
        return (<option value={cart.id-1}>{cart.name}</option>)
    })

    let patchQuant = (item, dir) => {
        console.log('pq called')
        try {
            for (let ci in currentCart.cart_items) {
                if (currentCart.cart_items[ci].item.id == item) {
                    let target = currentCart.cart_items[ci];
                    let quantity = target.quantity
                    fetch(`/cart_items/${target.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'quantity': (quantity + dir)
                        })
                    })
                        .then(r => r.json())
                        .then(body => {
                            console.log(body)
                            let temp = {...currentCart}
                            temp.cart_items[ci].quantity = quantity + dir
                            setCurrentCart(temp)
                        })
                }
            }
        }
        catch {
            return 0
        }
        
    }

    let getQuant = (item) => {
        try {
            for (let ci in currentCart.cart_items) {
                if (currentCart.cart_items[ci].item.id == item) {
                    return currentCart.cart_items[ci].quantity
                }
            }
        }
        catch {
            return ''
        }
        
    }

    
    let handleDel = (e) => {
        try {
            for (let ci in currentCart.cart_items) {
                if (currentCart.cart_items[ci].item.id == e.target.id) {
                    let target = currentCart.cart_items[ci];
                    fetch(`/cart_items/${target.id}`, {
                        method: 'DELETE'
                    }).then(r => {
                        if (r.ok) {
                            let temp = [...stateItems]
                            temp.pop(e.target.id)
                            setStateItems(temp)
                        }
                    })
                }
            }
        }
        catch {
            return 0
        }
    }

    let handleUp = (e) => {
        console.log(e.target.id)
        patchQuant(e.target.id, 1)
    }

    let handleDown = (e) => {
        let q = getQuant(e.target.id) - 1
        console.log('q',q)
        if (q < 1) {
            handleDel(e)
        }
        else {
            patchQuant(e.target.id, -1)
        }
    }

    let handleDelCart = () => {
        let target = currentCart.id
        console.log('target', target)
        fetch(`/cart/${target}`, {
            method: 'DELETE'
        }).then(r => {
            if (r.ok) {
                let temp = [...carts]
                temp.pop(target-1)
                setCarts(temp)
                setCurrentCart(carts[0])
                setStateItems(carts[0].items)
            }
        })

    }

    let handleAddCart = () => {
        let num = carts.length
        console.log(num)
        fetch('/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': `Cart${num+1}`,
                'user_id': user.id
            })
        })
                .then(r => {
                    if (r.ok) {
                        return r.json()
                    }
                })
                .then(body => {
                    if (body) {
                        let temp = [...carts]
                        temp.push(body)
                        setCarts(temp)
                    }
                    else {
                        console.warn('cart not added')
                    }
                })
    }

    let handleDropChange = (e) => {
        setCurrentCart(carts[e.target.value])
        setStateItems(carts[e.target.value].items)
    }

    let renderCart = stateItems.map((item) => {
        return (
            <div className="itemContainer" id={item.id} key={`itemcont${item.id}`}>
                <h3>{item.title}</h3>
                <p>{item.price}</p>
                <p>{getQuant(item.id)}</p>
                <button id={item.id} onClick={handleDel}>Delete</button>
                <button id={item.id} onClick={handleUp}>/\</button>
                <button id={item.id} onClick={handleDown}>\/</button>
            </div>
        )
    })

    return (
        <div className="CartPage" >
            <div className="dropDown">
                <select onChange={handleDropChange} defaultValue={0}>
                    {cartList}
                </select>
            </div>
            <br></br>
            <div className='cartDetails'>
                {renderCart}
            </div>
            <div>
                <br></br>
                <br></br>
                <button onClick={handleDelCart}>Delete Cart</button>
                <button onClick={handleAddCart}>Add Cart</button>
            </div>
        </div>
    )
}

export default Cart