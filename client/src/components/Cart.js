import { useContext, useState, useEffect} from "react"
import { UserContext } from "../context/user"
import Checkout from "./Checkout"

function Cart () {
    document.title='Cart'
    const {user, setUser} = useContext(UserContext)
    const [carts, setCarts] = useState([])
    const [currentCart, setCurrentCart] = useState({
        
    })
    const [stateItems, setStateItems] = useState([{'name':''},{}])
    const [showEdit, setShowEdit] = useState(false)
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
                                'items': [],
                                'cart_items': []
                            }
                        ]
                    });
                    console.log('welcome, guest');
                }
            })
            .then(body => {
                if (body.user_carts.length == 0) {
                    console.log('no user carts')
                    fetch('/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            'name':'Default',
                            'user_id': body.id
                        })
                    }).then(r => {
                        if (r.ok) {
                            return r.json()
                        }
                        else {return null}
                    }).then(cart => {
                        body.user_carts = [cart,]
                        setCarts(cart)
                        setCurrentCart(cart)
                        setStateItems(cart.items)
                    })
                }
                setUser(body);
                setCarts(body.user_carts)
                setCurrentCart(body.user_carts[0])
            })
        }
        else{
            if (user.user_carts.length == 0) {
                console.log('no user carts')
                fetch('/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        'name':'Default',
                        'user_id': user.id
                    })
                }).then(r => {
                    if (r.ok) {
                        return r.json()
                    }
                    else {return null}
                }).then(cart => {
                    user.user_carts = [cart,]
                    setCarts(cart)
                    setCurrentCart(cart)
                    setStateItems(cart.items)
                })
            }
            setCarts(user.user_carts)
            setCurrentCart(user.user_carts[0])
            setStateItems(user.user_carts[0].items)
        }

    },[user])


    if (!user) {
        console.log('no user')
        return (<>noUser</>)
    }
    console.log('user carts',user.user_carts)


    let cartList = carts.map((cart) => {
        let index = user.user_carts.findIndex(cart2 => {
            return cart.id == cart2.id
        })
        return (<option value={index}>{cart.name}</option>)
    })

    let patchQuant = (item, dir) => {
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
            let itemIndex = stateItems.findIndex((item) => {
                return item.id == e.target.id
            })
            let ci = currentCart.cart_items.find(cart_item => {
                return cart_item.item.id == e.target.id
            })
            console.log(ci)
            fetch(`/cart_items/${ci.id}`,{
                method: 'DELETE'
            }).then(r => {
                if (r.ok) {
                    let tmpList = [...stateItems]
                    console.log('tempList', tmpList)
                    console.log('index', itemIndex)
                    console.log('tempList item', tmpList[itemIndex])
                    tmpList.pop(itemIndex)
                    setStateItems(tmpList)
                }
            })
        }
        catch {
            return 0
        }
    }

    let handleUp = (e) => {
        patchQuant(e.target.id, 1)
    }

    let handleDown = (e) => {
        let q = getQuant(e.target.id) - 1
        if (q < 1) {
            handleDel(e)
        }
        else {
            patchQuant(e.target.id, -1)
        }
    }

    let handleDelCart = () => {
        let index = carts.findIndex((cart) => {
            return cart.id == currentCart.id
        })
        //if last cart need to create a 'Default' cart so cart page doesn't error out
        fetch(`/cart/${currentCart.id}`, {
            method: 'DELETE'
        }).then(r => {
            if (r.ok) {
                user.user_carts.pop(index)
                let tempList = Array([...user.user_carts])
                let temp = [...tempList[index]]
                temp.pop(index)
                setCarts(temp)
                setCurrentCart(temp[0])
                setStateItems(temp[0].items)
            }
        })

    }

    let handleAddCart = () => {
        let num = carts.length
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
                        user.user_carts.push(body)
                        let temp = [...user.user_carts]
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

    let handleChangeName = (e) => {
        e.preventDefault()
        if (e.target.name.value == '') {e.target.name.value = currentCart.name}
        fetch(`/cart/${currentCart.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'name': e.target.name.value})
        }).then ( r => {
            if (r.ok) {
                return r.json()
            }
            else {
                return null
            }
        }).then(body => {
            if (body) {
                let cartIndex = carts.findIndex((cart) => {
                    return (cart.id == currentCart.id)
                })
                let temp = [...carts]
                temp[cartIndex] = body
                setCarts(temp)
                setCurrentCart(body)
            }
        })
        setShowEdit(false)
    }

    let editCart = () => {
        return (
            <form onSubmit={handleChangeName}>
                <input name='name' placeholder={currentCart.name}></input>
                <button type='submit'>Done</button>
            </form>
        )
    }

    let renderCart = stateItems.map((item) => {
        return (
            <div className="itemContainer" id={item.id} key={`itemcont${item.id}`}>
                <img src={item.img} alt={'Oops! Something went wrong!'}/>
                <h3 id='name'>{item.title}</h3>
                <p id='price'>{'$' + item.price}</p>
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
            <div className='cartContainer'>
                {showEdit? editCart() : <h2 id={currentCart.id} onClick={() => setShowEdit(true)}>{currentCart.name}</h2>}
                {currentCart.items? renderCart : 'no items'}
            </div>
            <div className="checkoutContainer">
                <Checkout user={user} current={currentCart}/>
            </div>
            <div>
                <button onClick={handleDelCart}>Delete Cart</button>
                <button onClick={handleAddCart}>Add Cart</button>
            </div>
        </div>
    )
}

export default Cart