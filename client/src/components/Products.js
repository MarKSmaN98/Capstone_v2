import { useContext, useState, useEffect } from "react"
import { UserContext } from "../context/user"

function Products () {
    const {user, setUser} = useContext(UserContext)
    const [carts, setCarts] = useState([{'name': 'default'}])
    const [currentCart, setCurrentCart] = useState({'name': 'default'})
    const [searchArr, setSearchArr] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
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

    let cartList = carts.map((cart) => {
        console.log(cart.name)
        let index = user.user_carts.findIndex(cart2 => {
            return cart.id == cart2.id
        })
        console.log(index)
        return (<option value={index}>{cart.name}</option>)
    })

    let handleAddClick = (e) => {
        let id = e.target.id
        console.log(currentCart.items)
        console.log(currentCart)
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

    let handleSearch = (query) => {
        query = query.toLowerCase()
        setSearchQuery(query)
        let tmpArr = productList.filter(item => {
            return (item.title.toLowerCase().includes(query))
        })
        setSearchArr(tmpArr)

    }


    let renderProducts = productList.map((product) => {
        return (
            <div className="productCard" key={`productCard-${product.key}`}>
                <img src={product.img} alt={product.img} />
                <h2>{product.title}</h2>
                <p>{'$'+product.price.toFixed(2)}</p>
                <button id={product.id} onClick={handleAddClick}>Add to Cart</button>
            </div>
        )
    })
    let renderSearchProducts = searchArr.map((product) => {
        return (
            <div className="productCard" key={`productCard-${product.key}`}>
                <img src={product.img} alt={product.img} />
                <h2>{product.title}</h2>
                <p>{'$'+product.price.toFixed(2)}</p>
                <button id={product.id} onClick={handleAddClick}>Add to Cart</button>
            </div>
        )
    })
    return (
        <div className="productPage">
            <div className="search">
                <form id='searchform'>
                    <input onChange={e => handleSearch(e.target.value)} name='searchfield' placeholder="Search..."></input>
                    <button type='submit'>🔍</button>
                </form>
                <select onChange={e => setCurrentCart(carts[e.target.value])}>
                    {cartList}
                </select>
            </div>
            <div className="options">
    
            </div>
            <div className="Container">
                {searchQuery ==''?  renderProducts: renderSearchProducts}
            </div>
        </div>
    )

}

export default Products