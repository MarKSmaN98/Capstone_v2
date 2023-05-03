import { UserContext } from "../context/user";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function SellerPage () {
    const {user, setUser} = useContext(UserContext)
    const [sellerProducts, setSellerProducts] = useState([])
    useEffect(() => {
        if (!user) {
            fetch('/check').then(r => {
                if (r.ok) {
                    return r.json();
                }
                else {
                    <Navigate replace to='/account' />
                }
            })
            .then(body => {
                if (body.account_type == 1) {
                    setUser(body)
                    setSellerProducts(body.sellerItems)
                }
                else {
                    <Navigate replace to='/account' />
                }
            })
        }

    },[])

    if (!user) {
        return (<div>loading...</div>)
    }

    let sellerProductCart = user.sellerItems.map((product) => {
        return (
            <div className="productCard" key={`product${product.id}`}>
                <img src={product.img} alt={product.name}></img>
                <h2>{product.title}</h2>
                <p>{product.price}</p>
            </div>
        )
    })

    return (
        <div className="SellerPage" >
            <div className="CardContainer" >
                {sellerProductCart}
            </div>
        </div>
    )
}

export default SellerPage