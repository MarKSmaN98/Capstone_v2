import { useContext, useState, useEffect,  Suspense } from "react"
import { Await } from "react-router-dom"
import { UserContext } from "../context/user"

function Cart () {
    document.title='Cart'
    const {user} = useContext(UserContext)
    const [userData, setUserData] = useState(null)
    const [carts, setCarts] = useState([])
    const [currentCart, setCurrentCart] = useState({})
    const [iswaiting, setiswaiting] = useState(true)
    const [stateItems, setStateItems] = useState([])
    useEffect(() => {
        fetch('/check')
            .then(r=>r.json())
            .then(body => {
                setUserData(body)
                let userCarts = []
                fetch(`http://localhost:5555/cartbyowner/${body.id}`)
                    .then(r => r.json())
                    .then(body => {
                        setCarts(body)
                        console.log('carts fetch',body)
                        setCurrentCart(body[0])
                        setiswaiting(false)
                    })
                    //Want to rant... I stg I was getting a 500 server error with this fetch, _AssociationList is not JSON serializable
                    //So I spent an hour trying to figure out how to get around the problem, from making my own JSON serializer to using a custom to_dict method
                    // part of my issue was thinking I had debug set to true on my flask server, but the most infuriating part is I realized I messed up and deleted
                    //my association proxy while editing the model, so I just CTRL+Z'd until I got back to the original code.... AND IT WORKED FINE
                    //OH MY GOD IT WORKED JUST FINE WHAT WAS WRONG IM SO MAD AAAAAAAAAAAAA
                    //like literally I just used CTRL+Z so I know the code is exactly how it was.... but it works just fine now. Coding WILL give me anger issues eventually

                    })
    }, [])
    if(iswaiting) {
        return (<></>)
    }

    let renderCartList = carts.map(
        (cart) => {
            return (<option key={`cart${cart.id}`} value={cart.id}>{cart.name}</option>)
        }
    )
    
    let handleDelete = (e) => {
        let ciid = fetch(`/getCIID/${currentCart.id}/${e.target.id}`)
            .then(r => r.json())
            .then(body => {
                console.log(body)
                fetch(`/cart_items/${body}`, {
                    method:'DELETE'
                })
                
            })
        
    }

    let updateQuantity = (e) => {

    }
        
    let renderItemList = currentCart.items.map((item) => {
        return (
            <div key={`itemlist${item.id}`}>
                {item.title}
                {item.price}
                {item.img}
                <button id={item.id} onClick={handleDelete}>Delete</button>
                <button onClick={updateQuantity}></button>
            </div>
        )
    })

    let handleSelectChange = (e) => {
        setCurrentCart(carts[e.target.value -1])
        console.log(e.target.value-1, '= cartiD')
    }

    return (
        <>
            <div className="CartListContainer">
                <select onChange={handleSelectChange} defaultValue={'1'}>
                    {renderCartList}
                </select>
            </div>
            <div className="CartDetails">
                <h2>{currentCart.name}</h2>
                <div className="ItemListContainer">
                    {iswaiting? <>listPlaceholder</> : renderItemList}
                </div>

            </div>
            <div className="Options">

            </div>
        </>
    )
}

export default Cart