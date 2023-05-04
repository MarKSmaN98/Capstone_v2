import { useContext, useState, useEffect } from "react"
import { UserContext } from "../context/user"

function Products () {
    const {user, setUser} = useContext(UserContext)
    const [carts, setCarts] = useState([{'name': 'default'}])
    const [currentCart, setCurrentCart] = useState({'name': 'default'})
    const [searchState, setSearchState] = useState('')
    const [productList, setProductList] = useState([])
    useEffect(() => {
        fetch('/items').then(r => r.json()).then(body => {setProductList(body)})
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
        }

    },[])

    if (!user) {
        return (<div>...loading</div>)
    }

    let handleAddClick = (e) => {
        let id = e.target.id
        let itemincart = currentCart.items.filter(item => {
            return (item.id == id)
        })
        if (itemincart.length > 0) {
            let ciInternal = currentCart.cart_items.filter(ci => {return (ci.item_id == id)})

            fetch(`/getCIID/${currentCart.id}/${id}`).then(r => r.json()).then(ciid => { //get id for cart_item
                fetch(`http://localhost:5555/cart_items/${ciid}`, { //update that cart_item >> quantity + 1
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'quantity': (ciInternal[0].quantity + 1)})
                }).then(r => {
                    if (r.ok) {
                        return r.json()
                    }
                    else {

                    }
                }).then(body => {
                    ciInternal[0].quantity += 1
                })
            })
        }

        else {
            fetch('/cart_items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'cart_id': currentCart.id,
                    'item_id': id,
                    'quantity': 1,
                    'paid': false
                })
            }).then(r => {
                if (r.ok) {
                    return r.json()
                }
            }).then(body => {
                body.item_id = id
                currentCart.cart_items.push(body)
                currentCart.items.push(body.item)
            })
        }
    }


    let renderProducts = productList.map((product) => {
        return (
            <div className="productCard" key={`productCard-${product.key}`}>
                <img src={product.img} alt={product.img} />
                <h2>{product.title}</h2>
                <p>{product.price}</p>
                <button id={product.id} onClick={handleAddClick}>Add to Cart</button>
            </div>
        )
    })
    return (
        <div className="productPage">
            <div className="search">
                <form id='searchform'>
                    <input name='searchfield' placeholder="Search..."></input>
                    <button type='submit'>🔍</button>
                </form>
            </div>
            <div className="options">
    
            </div>
            <div className="Container">
                {renderProducts}
            </div>
        </div>
    )

}

export default Products